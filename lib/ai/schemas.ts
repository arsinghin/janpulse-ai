import { Type } from '@google/genai';

export const AI_REPORT_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    detectedLanguage: {
      type: Type.STRING,
      description: 'The natural language of the citizen complaint (e.g. Hindi, Tamil, Telugu, Marathi, Bengali, English, Gujarati, Assamese).',
    },
    normalizedText: {
      type: Type.STRING,
      description: 'Clean, objective English normalization of the grievance removing emotional repetition while preserving all facts.',
    },
    englishSummary: {
      type: Type.STRING,
      description: 'A crisp 1-2 sentence English summary of the infrastructure problem.',
    },
    category: {
      type: Type.STRING,
      description: 'One of the exact 10 categories: Water Supply, Roads & Transport, Electricity, Sanitation & Waste, Healthcare Access, Public Safety, Education, Drainage & Flooding, Digital Connectivity, Public Transport, or Other.',
    },
    subcategory: {
      type: Type.STRING,
      description: 'Specific technical subcategory (e.g., Pipeline Leakage, Potholes & Sinkholes, Transformer Outage, Uncollected Waste).',
    },
    problemType: {
      type: Type.STRING,
      description: 'Type of failure: Infrastructure failure, Service absence, Maintenance delay, Safety hazard, or Capacity shortage.',
    },
    urgency: {
      type: Type.STRING,
      description: 'Urgency level: Low, Medium, High, or Critical.',
    },
    urgencyReason: {
      type: Type.STRING,
      description: 'Clear factual justification for why this urgency level was assigned.',
    },
    locationMentioned: {
      type: Type.STRING,
      description: 'Specific landmarks, colonies, wards, or streets explicitly mentioned in the text (or null if none).',
    },
    affectedGroup: {
      type: Type.STRING,
      description: 'Demographic or community group impacted (e.g. School students, elderly residents, daily bus commuters, patients).',
    },
    estimatedAffectedPopulation: {
      type: Type.INTEGER,
      description: 'Order-of-magnitude estimate of impacted citizens if inferable from context, else null or conservative estimate (e.g. 500 to 5000).',
    },
    requestedAction: {
      type: Type.STRING,
      description: 'Concrete administrative or technical intervention implied or asked by citizen.',
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 to 6 technical and topical keywords for clustering.',
    },
    confidence: {
      type: Type.NUMBER,
      description: 'Model self-assessment confidence between 0.0 and 1.0.',
    },
  },
  required: [
    'detectedLanguage',
    'normalizedText',
    'englishSummary',
    'category',
    'subcategory',
    'problemType',
    'urgency',
    'urgencyReason',
    'affectedGroup',
    'requestedAction',
    'keywords',
    'confidence',
  ],
};

export const ACTION_BRIEF_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'Executive title of the infrastructure action brief.',
    },
    executiveSummary: {
      type: Type.STRING,
      description: 'Comprehensive 2-3 paragraph executive summary of the aggregated problem, its geographical footprint, and strategic urgency for district administration.',
    },
    problemStatement: {
      type: Type.STRING,
      description: 'Detailed analysis of the root infrastructure failure based strictly on citizen evidence.',
    },
    evidenceSummary: {
      type: Type.STRING,
      description: 'Synthesis of evidence: report volume, recurrence pattern, language distribution, and severity indicators.',
    },
    affectedPopulationAnalysis: {
      type: Type.STRING,
      description: 'Breakdown of vulnerable groups (infants, elderly, school children, transit workers) and estimated population impact.',
    },
    geographicScope: {
      type: Type.STRING,
      description: 'Spatial description of affected wards, localities, or transit corridors identified in the signals.',
    },
    observedTrend: {
      type: Type.STRING,
      description: 'Trend analysis: velocity of reports, seasonal factors (e.g. monsoon drainage, summer water demand), and escalation pace.',
    },
    potentialInterventionAreas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 to 5 targeted technical or departmental intervention areas (e.g. Jal Sansthan booster valve overhaul, PWD cold-mix patch laying).',
    },
    suggestedNextSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 to 5 immediate operational steps for the district magistrate or municipal commissioner.',
    },
    dataLimitations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Transparent disclosures of prototype limitations (e.g. self-reported citizen bias, synthetic demonstration baseline, need for on-ground engineering audit).',
    },
    confidenceAndUncertainty: {
      type: Type.STRING,
      description: 'Methodological notes on confidence score and data gaps.',
    },
  },
  required: [
    'title',
    'executiveSummary',
    'problemStatement',
    'evidenceSummary',
    'affectedPopulationAnalysis',
    'geographicScope',
    'observedTrend',
    'potentialInterventionAreas',
    'suggestedNextSteps',
    'dataLimitations',
    'confidenceAndUncertainty',
  ],
};
