export type IssueCategory =
  | 'Water Supply'
  | 'Roads & Transport'
  | 'Electricity'
  | 'Sanitation & Waste'
  | 'Healthcare Access'
  | 'Public Safety'
  | 'Education'
  | 'Drainage & Flooding'
  | 'Digital Connectivity'
  | 'Public Transport'
  | 'Other';

export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type HotspotStatus = 'Investigating' | 'Action Pending' | 'Escalated' | 'Under Review';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface IndianLocationInfo {
  state: string;
  district: string;
  locality?: string;
  coordinates: LocationCoordinates;
}

export interface CitizenReport {
  id: string;
  text: string;
  language: string;
  state: string;
  district: string;
  locality: string;
  coordinates: LocationCoordinates;
  timestamp: string;
  category: IssueCategory;
  urgency: UrgencyLevel;
  affectedGroup?: string;
  estimatedPopulation?: number;
  status: 'Received' | 'Processed' | 'Clustered' | 'Resolved';
  clusterId?: string;
  normalizedText?: string;
  englishSummary?: string;
  requestedAction?: string;
  aiConfidence?: number;
  keywords?: string[];
  isSynthetic?: boolean;
}

export interface AIReportAnalysis {
  detectedLanguage: string;
  normalizedText: string;
  englishSummary: string;
  category: IssueCategory;
  subcategory: string;
  problemType: string;
  urgency: UrgencyLevel;
  urgencyReason: string;
  locationMentioned: string | null;
  affectedGroup: string;
  estimatedAffectedPopulation: number | null;
  requestedAction: string;
  keywords: string[];
  confidence: number;
}

export interface PriorityBreakdown {
  complaintVolume: number; // 0 - 100 (30% weight)
  populationAffected: number; // 0 - 100 (25% weight)
  urgency: number; // 0 - 100 (20% weight)
  recurrenceTrend: number; // 0 - 100 (15% weight)
  infrastructureGap: number; // 0 - 100 (10% weight)
  overallScore: number; // 0 - 100
  formulaExplanation: string;
}

export interface InfrastructureHotspot {
  id: string;
  title: string;
  category: IssueCategory;
  state: string;
  district: string;
  localities: string[];
  coordinates: LocationCoordinates;
  reportCount: number;
  estimatedAffectedPopulation: number;
  urgencyDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  trendPercentage: number;
  languagesRepresented: string[];
  priorityScore: number;
  priorityBreakdown: PriorityBreakdown;
  status: HotspotStatus;
  reportIds: string[];
  lastUpdated: string;
}

export interface ActionBriefSignal {
  id: string;
  language: string;
  originalSnippet: string;
  interpretation: string;
  locality: string;
}

export interface ActionBrief {
  id: string;
  hotspotId: string;
  title: string;
  generatedAt: string;
  modelUsed: string;
  executiveSummary: string;
  problemStatement: string;
  evidenceSummary: string;
  affectedPopulationAnalysis: string;
  geographicScope: string;
  observedTrend: string;
  citizenSignalSummary: ActionBriefSignal[];
  potentialInterventionAreas: string[];
  suggestedNextSteps: string[];
  dataLimitations: string[];
  confidenceAndUncertainty: string;
}

export interface DashboardMetrics {
  totalSignals: number;
  activeHotspots: number;
  districtsCovered: number;
  estimatedAffectedCitizens: number;
  highUrgencyCount: number;
  languageCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  stateCounts: Record<string, number>;
}
