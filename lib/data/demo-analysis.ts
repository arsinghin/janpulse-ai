import { AIReportAnalysis, CitizenReport, InfrastructureHotspot, PriorityBreakdown } from '../types';
import { INITIAL_HOTSPOTS, INITIAL_REPORTS } from './demo-data';

/**
 * PROTOTYPE DEMONSTRATION DATA
 *
 * Dedicated deterministic demo fixture for the Varanasi water-supply demonstration.
 * This is used exclusively as a demo fallback when Gemini experiences temporary
 * service unavailability (e.g. HTTP 503 model overload).
 *
 * It is clearly labeled as cached prototype analysis and never represented as live AI.
 */

export const DEMO_VARANASI_ANALYSIS: AIReportAnalysis = {
  detectedLanguage: 'Hindi',
  normalizedText:
    'Continuous potable water supply disruption for over three months across Sigra ward with severely low pressure and turbid contaminated water arriving at domestic taps.',
  englishSummary:
    'Three-month municipal drinking water disruption with low pressure and muddy water in Sigra ward, Varanasi.',
  category: 'Water Supply',
  subcategory: 'Drinking water disruption & pipeline contamination',
  problemType: 'Infrastructure failure',
  urgency: 'Critical',
  urgencyReason:
    'Prolonged drinking water contamination and low pressure depriving households and vulnerable elderly residents of clean water.',
  locationMentioned: 'Sigra Ward, Varanasi',
  affectedGroup: 'Elderly residents, children, and families in Sigra ward',
  estimatedAffectedPopulation: 14200,
  requestedAction:
    'Emergency deployment of Jal Sansthan water tankers and structural inspection of feeder pipeline valves.',
  keywords: ['पानी', 'जल आपूर्ति', 'दबाव', 'सिगरा', 'वाराणसी', 'pipeline'],
  confidence: 0.95,
};

export const DEMO_VARANASI_HOTSPOT: InfrastructureHotspot = INITIAL_HOTSPOTS[0]; // hs-up-varanasi-water

export const DEMO_VARANASI_RELATED_REPORTS: CitizenReport[] = INITIAL_REPORTS.filter(
  (r) => r.clusterId === 'hs-up-varanasi-water'
).slice(0, 4);

export const DEMO_VARANASI_PRIORITY: PriorityBreakdown = DEMO_VARANASI_HOTSPOT.priorityBreakdown;

export const DEMO_VARANASI_FIXTURE = {
  analysis: DEMO_VARANASI_ANALYSIS,
  hotspot: DEMO_VARANASI_HOTSPOT,
  relatedReports: DEMO_VARANASI_RELATED_REPORTS,
  priority: DEMO_VARANASI_PRIORITY,
  source: 'cached-demo' as const,
  warning: 'Gemini is temporarily unavailable. Showing cached prototype analysis.',
};
