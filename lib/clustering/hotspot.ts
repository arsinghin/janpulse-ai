import { CitizenReport, InfrastructureHotspot, IssueCategory } from '../types';
import { calculatePriorityScore } from '../scoring/priority';

/**
 * PROTOTYPE HOTSPOT DETECTION ENGINE
 *
 * Deterministic spatial and categorical clustering:
 * Groups reports sharing matching infrastructure category, geographic district/coordinates
 * proximity (within ~30-40km), and computes aggregated hotspot metrics and deterministic priority scores.
 */

// Haversine distance in km
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function assignOrCreateHotspot(
  newReport: CitizenReport,
  existingHotspots: InfrastructureHotspot[]
): {
  hotspot: InfrastructureHotspot;
  isNew: boolean;
} {
  // 1. Check if there's an existing hotspot in same district and same category
  const matchingHotspot = existingHotspots.find((h) => {
    const isSameCategory = h.category === newReport.category;
    const isSameDistrict = h.district.toLowerCase() === newReport.district.toLowerCase();
    const distanceKm = haversineDistanceKm(
      h.coordinates.lat,
      h.coordinates.lng,
      newReport.coordinates.lat,
      newReport.coordinates.lng
    );

    return isSameCategory && (isSameDistrict || distanceKm < 45);
  });

  if (matchingHotspot) {
    // Return existing hotspot
    return {
      hotspot: matchingHotspot,
      isNew: false,
    };
  }

  // 2. Create a new prototype hotspot if no existing match
  const newHotspotId = `hs-${newReport.state.slice(0, 2).toLowerCase()}-${newReport.district.toLowerCase().replace(/\s+/g, '-')}-${newReport.category.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;

  const urgencyDist = {
    critical: newReport.urgency === 'Critical' ? 1 : 0,
    high: newReport.urgency === 'High' ? 1 : 0,
    medium: newReport.urgency === 'Medium' ? 1 : 0,
    low: newReport.urgency === 'Low' ? 1 : 0,
  };

  const initialEstimatedPop = newReport.estimatedPopulation || 1500;

  const priorityBreakdown = calculatePriorityScore({
    reportCount: 1,
    estimatedPopulation: initialEstimatedPop,
    urgencyDistribution: urgencyDist,
    trendPercentage: 15,
    category: newReport.category,
  });

  const newHotspot: InfrastructureHotspot = {
    id: newHotspotId,
    title: `Emerging ${newReport.category} Issue in ${newReport.locality || newReport.district}`,
    category: newReport.category,
    state: newReport.state,
    district: newReport.district,
    localities: [newReport.locality].filter(Boolean),
    coordinates: newReport.coordinates,
    reportCount: 1,
    estimatedAffectedPopulation: initialEstimatedPop,
    urgencyDistribution: urgencyDist,
    trendPercentage: 15,
    languagesRepresented: [newReport.language],
    priorityScore: priorityBreakdown.overallScore,
    priorityBreakdown,
    status: 'Investigating',
    reportIds: [newReport.id],
    lastUpdated: new Date().toISOString(),
  };

  return {
    hotspot: newHotspot,
    isNew: true,
  };
}
