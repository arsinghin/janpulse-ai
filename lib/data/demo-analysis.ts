import {
  AIReportAnalysis,
  CitizenReport,
  InfrastructureHotspot,
  PriorityBreakdown,
  ActionBrief,
  ActionBriefSignal,
} from '../types';
import { INITIAL_HOTSPOTS, INITIAL_REPORTS } from './demo-data';

/**
 * Cached baseline fixtures for demonstration and offline resiliency.
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

// 2. Tamil Nadu Chennai Roads Scenario Fixture
export const DEMO_CHENNAI_ROAD_ANALYSIS: AIReportAnalysis = {
  detectedLanguage: 'Tamil',
  normalizedText:
    'Major potholes and structural asphalt depressions on GST Road near Tambaram causing frequent two-wheeler accidents and critical school transit delays.',
  englishSummary:
    'Severe road potholes and monsoon waterlogging on Tambaram arterial corridor causing traffic hazards and vehicle damage in Chennai.',
  category: 'Roads & Transport',
  subcategory: 'Potholes & Structural Road Cavities',
  problemType: 'Safety hazard',
  urgency: 'Critical',
  urgencyReason:
    'Deep craters submerged under rainwater creating life-safety hazards for two-wheeler commuters and daily school vans.',
  locationMentioned: 'Tambaram, GST Road, Chennai',
  affectedGroup: 'Two-wheeler riders, school van drivers, and daily office commuters',
  estimatedAffectedPopulation: 18500,
  requestedAction:
    'Immediate cold-mix bitumen patching and structural resurfacing by Highways & Minor Ports Department.',
  keywords: ['சாலை', 'குழிகள்', 'தாம்பரம்', 'விபத்து', 'GST Road', 'potholes'],
  confidence: 0.94,
};

export const DEMO_CHENNAI_ROAD_HOTSPOT: InfrastructureHotspot = INITIAL_HOTSPOTS[1]; // hs-tn-chennai-roads
export const DEMO_CHENNAI_ROAD_RELATED = INITIAL_REPORTS.filter((r) => r.clusterId === 'hs-tn-chennai-roads').slice(0, 4);

export const DEMO_CHENNAI_ROAD_FIXTURE = {
  analysis: DEMO_CHENNAI_ROAD_ANALYSIS,
  hotspot: DEMO_CHENNAI_ROAD_HOTSPOT,
  relatedReports: DEMO_CHENNAI_ROAD_RELATED,
  priority: DEMO_CHENNAI_ROAD_HOTSPOT.priorityBreakdown,
  source: 'cached-demo' as const,
  warning: 'Gemini is temporarily unavailable. Showing cached prototype analysis.',
};

// 3. Telangana Warangal Healthcare Scenario Fixture
export const DEMO_WARANGAL_HEALTH_ANALYSIS: AIReportAnalysis = {
  detectedLanguage: 'Telugu',
  normalizedText:
    'Primary Health Centre (PHC) in Hanamkonda unstaffed by medical officers for over three weeks with stockout of essential maternal medicines and iron supplements.',
  englishSummary:
    'Severe medicine stockout and medical officer absence at rural PHC in Warangal affecting pregnant women and emergency care.',
  category: 'Healthcare Access',
  subcategory: 'Essential Drug Stockout & Staff Absence',
  problemType: 'Service absence',
  urgency: 'Critical',
  urgencyReason:
    'Total absence of emergency duty doctors and critical shortage of maternal iron tablets risking pregnant women health.',
  locationMentioned: 'Hanamkonda, Warangal',
  affectedGroup: 'Pregnant mothers, rural patients, and elderly chronic-disease patients',
  estimatedAffectedPopulation: 9800,
  requestedAction:
    'Immediate deputation of medical officer and emergency supply of Schedule-H medicines by District Medical & Health Officer (DMHO).',
  keywords: ['వైద్యులు', 'మందులు', 'వరంగల్', 'హనుమకొండ', 'PHC', 'healthcare'],
  confidence: 0.93,
};

export const DEMO_WARANGAL_HEALTH_HOTSPOT: InfrastructureHotspot = INITIAL_HOTSPOTS[2]; // hs-tg-warangal-health
export const DEMO_WARANGAL_HEALTH_RELATED = INITIAL_REPORTS.filter((r) => r.clusterId === 'hs-tg-warangal-health').slice(0, 4);

export const DEMO_WARANGAL_HEALTH_FIXTURE = {
  analysis: DEMO_WARANGAL_HEALTH_ANALYSIS,
  hotspot: DEMO_WARANGAL_HEALTH_HOTSPOT,
  relatedReports: DEMO_WARANGAL_HEALTH_RELATED,
  priority: DEMO_WARANGAL_HEALTH_HOTSPOT.priorityBreakdown,
  source: 'cached-demo' as const,
  warning: 'Gemini is temporarily unavailable. Showing cached prototype analysis.',
};

// 4. West Bengal Kolkata Drainage Scenario Fixture
export const DEMO_KOLKATA_DRAINAGE_ANALYSIS: AIReportAnalysis = {
  detectedLanguage: 'English',
  normalizedText:
    'Severe stormwater drainage canal blockage in Behala Ward 121 causing contaminated sewage backflow into residential basements and elevated dengue epidemic risk.',
  englishSummary:
    'Clogged open stormwater drain overflowing onto residential streets and basements in Behala, Kolkata.',
  category: 'Drainage & Flooding',
  subcategory: 'Stormwater Drain Clogging & Sewage Overflow',
  problemType: 'Infrastructure failure',
  urgency: 'High',
  urgencyReason:
    'Stagnant sewage water accumulated in residential colonies creating acute risk of vector-borne disease outbreak.',
  locationMentioned: 'Behala Ward 121, Kolkata',
  affectedGroup: 'Local residents, shopkeepers, and school students in Behala',
  estimatedAffectedPopulation: 11500,
  requestedAction:
    'Deployment of mechanical super-sucker desilting units and anti-larval spray by Kolkata Municipal Corporation (KMC).',
  keywords: ['drainage', 'flooding', 'Behala', 'sewage', 'Kolkata', 'waterlogging'],
  confidence: 0.96,
};

export const DEMO_KOLKATA_DRAINAGE_HOTSPOT: InfrastructureHotspot = INITIAL_HOTSPOTS[4]; // hs-wb-kolkata-drainage
export const DEMO_KOLKATA_DRAINAGE_RELATED = INITIAL_REPORTS.filter((r) => r.clusterId === 'hs-wb-kolkata-drainage').slice(0, 4);

export const DEMO_KOLKATA_DRAINAGE_FIXTURE = {
  analysis: DEMO_KOLKATA_DRAINAGE_ANALYSIS,
  hotspot: DEMO_KOLKATA_DRAINAGE_HOTSPOT,
  relatedReports: DEMO_KOLKATA_DRAINAGE_RELATED,
  priority: DEMO_KOLKATA_DRAINAGE_HOTSPOT.priorityBreakdown,
  source: 'cached-demo' as const,
  warning: 'Gemini is temporarily unavailable. Showing cached prototype analysis.',
};

/**
 * Intelligent fixture selector matching input text, category, or state
 */
export function getDemoFixtureForInput(params: {
  text: string;
  categoryHint?: string;
  state?: string;
}) {
  const t = params.text.toLowerCase();
  const c = params.categoryHint?.toLowerCase() || '';
  const s = params.state?.toLowerCase() || '';

  if (t.includes('தாம்பரம்') || t.includes('குழிகள்') || c.includes('road') || s.includes('tamil')) {
    return DEMO_CHENNAI_ROAD_FIXTURE;
  }
  if (t.includes('వరంగల్') || t.includes('వైద్యులు') || c.includes('health') || s.includes('telangana')) {
    return DEMO_WARANGAL_HEALTH_FIXTURE;
  }
  if (t.includes('behala') || t.includes('drainage') || c.includes('drainage') || s.includes('bengal')) {
    return DEMO_KOLKATA_DRAINAGE_FIXTURE;
  }
  return DEMO_VARANASI_FIXTURE;
}

export const DEMO_VARANASI_ACTION_BRIEF: ActionBrief = {
  id: 'brief-hs-up-varanasi-water-demo',
  hotspotId: 'hs-up-varanasi-water',
  title: 'Executive Action Brief: Severe Drinking Water Pipeline Failure in Varanasi',
  generatedAt: new Date().toISOString(),
  modelUsed: 'gemini-3.8-flash (cached prototype brief)',
  executiveSummary:
    'Citizen signals across Varanasi municipal wards indicate persistent drinking water contamination and supply failures affecting an estimated 14,200 residents across Sigra, Godowlia, and Assi Ghat. Thirty-eight verified citizen reports point to deep corrosion along the secondary feeder line and sewage ingress.',
  problemStatement:
    'Severe drop in mains water pressure combined with yellowish, foul-smelling potable tap water occurring continuously for over 90 days. Key vulnerable groups include pediatric wards, elder-care homes, and high-density residential blocks in Sigra ward.',
  evidenceSummary:
    '38 independent citizen grievances submitted across Hindi, English, and Bhojpuri, highlighting identical symptoms: turbid water, zero morning pipeline pressure, and gastrointestinal illness risk.',
  affectedPopulationAnalysis:
    'Approximately 14,200 citizens across 5 municipal sub-wards, with 58% of reports flagged at Critical urgency.',
  geographicScope:
    'Varanasi District, Uttar Pradesh — Concentrated primarily along Sigra Main Road, Godowlia Crossing, and adjoining residential colonies.',
  observedTrend:
    'Complaints surged by +42% over the preceding 30 days as summer temperatures increased municipal groundwater draw.',
  citizenSignalSummary: [
    {
      id: 'rep-001',
      language: 'Hindi',
      originalSnippet: 'हमारे सिगरा वार्ड में पिछले तीन महीने से पानी की सप्लाई बहुत खराब है...',
      interpretation: 'Severe three-month pipeline disruption and turbid tap water in Sigra ward.',
      locality: 'Sigra Ward',
    },
    {
      id: 'rep-002',
      language: 'English',
      originalSnippet: 'No municipal water pressure in Godowlia sector since April...',
      interpretation: 'Zero pipeline water pressure; reliance on costly private water tankers.',
      locality: 'Godowlia',
    },
    {
      id: 'rep-003',
      language: 'Hindi',
      originalSnippet: 'नल से मटमैला बदबूदार पानी निकल रहा है। बच्चों की तबीयत खराब हो रही है...',
      interpretation: 'Contaminated tap water causing health concerns for children and elderly.',
      locality: 'Assi Ghat Ward',
    },
  ],
  potentialInterventionAreas: [
    'Immediate Jal Sansthan mobile water tanker distribution along Sigra and Godowlia corridors.',
    'Acoustic leak-detection and chlorine tracer analysis along the 450mm secondary feeder main.',
    'Temporary booster pump deployment at Sigra municipal distribution substation.',
    'Water quality testing across 12 designated municipal sampling nodes.',
  ],
  suggestedNextSteps: [
    'Direct Varanasi Municipal Corporation (VMC) Executive Engineer to initiate pipeline pressure mapping within 24 hours.',
    'Issue public health advisory regarding boiling domestic tap water until microbiological clearance is verified.',
    'Allocate emergency Jal Jeevan Mission urban contingency funds for rapid trenchless pipe relining.',
  ],
  dataLimitations: [
    'Derived from crowdsourced citizen signals and social grievance logs; requires physical sensor validation.',
    'Population counts are modeled spatial estimates based on ward density figures.',
  ],
  confidenceAndUncertainty:
    'High confidence (94%) on spatial clustering and issue classification. Physical inspection required for subsurface valve assessment.',
};

/**
 * Generates a structured fallback Action Brief when Gemini API is rate-limited or temporarily unavailable.
 */
export function generateFallbackActionBrief(
  hotspot: InfrastructureHotspot,
  linkedReports: CitizenReport[]
): ActionBrief {
  if (hotspot.id === 'hs-up-varanasi-water') {
    return DEMO_VARANASI_ACTION_BRIEF;
  }

  const signalSummary: ActionBriefSignal[] = linkedReports.slice(0, 5).map((r) => ({
    id: r.id,
    language: r.language,
    originalSnippet: r.text.length > 180 ? `${r.text.slice(0, 180)}...` : r.text,
    interpretation: r.normalizedText || r.englishSummary || 'Citizen infrastructure grievance recorded.',
    locality: r.locality || hotspot.district,
  }));

  return {
    id: `brief-${hotspot.id}-cached`,
    hotspotId: hotspot.id,
    title: `Administrative Action Brief: ${hotspot.title}`,
    generatedAt: new Date().toISOString(),
    modelUsed: 'gemini-3.8-flash (cached fallback synthesis)',
    executiveSummary: `Spatial clustering of ${hotspot.reportCount} citizen reports in ${hotspot.district}, ${hotspot.state} reveals urgent ${hotspot.category.toLowerCase()} infrastructure failure affecting an estimated ~${hotspot.estimatedAffectedPopulation.toLocaleString()} citizens. Computed priority score: ${hotspot.priorityScore}/100.`,
    problemStatement: `Critical operational disruption in ${hotspot.category} across ${hotspot.localities.join(', ')}. Multi-signal consensus indicates sustained service failure demanding municipal engineering intervention.`,
    evidenceSummary: `${hotspot.reportCount} authenticated citizen signals received across ${hotspot.languagesRepresented.join(', ')} languages with a ${hotspot.trendPercentage > 0 ? `+${hotspot.trendPercentage}% surge` : 'stable trend'} over recent reporting intervals.`,
    affectedPopulationAnalysis: `Estimated ~${hotspot.estimatedAffectedPopulation.toLocaleString()} residents impacted across ${hotspot.district}. Critical urgency proportion: ${Math.round((hotspot.urgencyDistribution.critical / hotspot.reportCount) * 100)}%.`,
    geographicScope: `${hotspot.district} District, ${hotspot.state}. Primary impact zones: ${hotspot.localities.join(', ')}.`,
    observedTrend: `${hotspot.trendPercentage > 0 ? `Accelerating volume (+${hotspot.trendPercentage}%)` : 'Consistent reporting volume'} requiring prompt administrative action.`,
    citizenSignalSummary: signalSummary,
    potentialInterventionAreas: [
      `Deploy district engineering assessment team to inspect primary ${hotspot.category.toLowerCase()} assets in ${hotspot.localities[0] || hotspot.district}.`,
      `Implement emergency containment or temporary utility provisioning for vulnerable residents.`,
      `Establish weekly field progress monitoring with municipal ward councilors.`,
    ],
    suggestedNextSteps: [
      `Dispatch District Technical Officer for onsite audit within 48 hours.`,
      `Liaise with state urban development department for rapid repair budget release.`,
      `Publish interim citizen status bulletin via municipal grievance portal.`,
    ],
    dataLimitations: [
      'Hotspot synthesized from crowdsourced citizen reports; ground sensor calibration recommended.',
      'Population impact is an algorithmic proxy based on district census spatial weights.',
    ],
    confidenceAndUncertainty:
      'High confidence on geographic clustering; mechanical failure root-cause requires on-site technical inspection.',
  };
}
