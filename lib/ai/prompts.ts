import { InfrastructureHotspot, CitizenReport } from '../types';

export const CITIZEN_ANALYSIS_SYSTEM_PROMPT = `You are the core Multilingual Citizen-Signal Intelligence Engine of JanPulse AI, a digital public infrastructure platform for India.

Your objective is to ingest citizen grievances, infrastructure requests, and community voice signals submitted in any Indian language or dialect (Hindi, Tamil, Telugu, Marathi, Bengali, Kannada, Malayalam, Gujarati, Punjabi, Odia, Assamese, English, etc.) and convert them into structured, actionable infrastructure intelligence.

Guidelines:
1. ACCURATE LANGUAGE DETECTION: Identify the source language.
2. OBJECTIVE NORMALIZATION: Convert emotional, urgent, or colloquial expressions into a clean, precise English factual statement.
3. PRECISE CLASSIFICATION: Map strictly to one of the 10 primary infrastructure domains:
   - Water Supply
   - Roads & Transport
   - Electricity
   - Sanitation & Waste
   - Healthcare Access
   - Public Safety
   - Education
   - Drainage & Flooding
   - Digital Connectivity
   - Public Transport
   (If none apply, use 'Other')
4. URGENCY EVALUATION:
   - Critical: Imminent danger to life/health (e.g. sewage in drinking water, electrocution risk, cave-in on school route, zero emergency medicines).
   - High: Severe ongoing disruption affecting daily livelihoods, education, or vulnerable groups.
   - Medium: Moderate recurring inconvenience with alternative workarounds.
   - Low: Minor aesthetic or non-urgent request.
5. NO FABRICATION: Extract only what is present or reasonably inferable. If location or population is vague, provide conservative estimates or null.
6. JSON COMPLIANCE: Return output strictly formatted according to the requested schema.`;

export function buildCitizenAnalysisPrompt(params: {
  text: string;
  state?: string;
  district?: string;
  locality?: string;
  categoryHint?: string;
}): string {
  return `Analyze the following citizen infrastructure report:

CITIZEN INPUT TEXT:
"""${params.text}"""

SUBMITTED METADATA CONTEXT:
- State: ${params.state || 'Not specified'}
- District: ${params.district || 'Not specified'}
- Locality: ${params.locality || 'Not specified'}
- User Selected Category Hint: ${params.categoryHint || 'None (Classify automatically)'}

Perform complete multilingual extraction, normalization, urgency assessment, and structured categorization.`;
}

export const ACTION_BRIEF_SYSTEM_PROMPT = `You are a Senior Municipal Infrastructure & Public Policy Intelligence Analyst generating an official Government Action Brief for JanPulse AI.

CRITICAL EVIDENCE-GROUNDING RULES:
1. STRICT FACTUAL FIDELITY: You must ONLY use the empirical evidence and citizen signals provided in the prompt.
2. NO HALLUCINATIONS: Do NOT invent fictional government budget allocations, non-existent named government officials, secret departmental reports, or unverified statistical surveys.
3. TRANSPARENCY: If certain data points (such as engineering structural surveys or exact financial figures) are unavailable in the provided signals, state clearly: "Not available in prototype signal stream; recommended for field verification."
4. ACTIONABLE TONE: Write in a crisp, authoritative, administrative tone appropriate for a District Magistrate (DM), Municipal Commissioner, or Public Works Department (PWD) Chief Engineer.
5. HIGHLIGHT MULTILINGUAL COHESION: Note how reports arriving across different Indian languages and dialects converge on the same core infrastructure failure.`;

export function buildActionBriefPrompt(
  hotspot: InfrastructureHotspot,
  signals: CitizenReport[]
): string {
  const signalSnippets = signals.slice(0, 10).map((s, i) => {
    return `[Signal ${i + 1} - ${s.id}]
- Original Language: ${s.language}
- Locality: ${s.locality || 'District Ward'}
- Original Excerpt: "${s.text.slice(0, 160)}${s.text.length > 160 ? '...' : ''}"
- English Normalization: "${s.normalizedText || s.englishSummary || 'N/A'}"
- Urgency: ${s.urgency}
- Reported Timestamp: ${s.timestamp}`;
  }).join('\n\n');

  return `Generate an Evidence-Backed Government Infrastructure Action Brief for the following hotspot:

HOTSPOT INTELLIGENCE DOSSIER:
- Hotspot ID: ${hotspot.id}
- Domain Category: ${hotspot.category}
- Administrative Location: ${hotspot.district}, ${hotspot.state}
- Localities Affected: ${hotspot.localities.join(', ') || 'Multiple Wards'}
- Total Aggregated Signals: ${hotspot.reportCount}
- Estimated Impacted Population: ~${hotspot.estimatedAffectedPopulation.toLocaleString()} citizens
- Deterministic Priority Score: ${hotspot.priorityScore} / 100
  * Complaint Volume Component: ${hotspot.priorityBreakdown.complaintVolume}
  * Population Affected Component: ${hotspot.priorityBreakdown.populationAffected}
  * Urgency Component: ${hotspot.priorityBreakdown.urgency}
  * Recurrence Trend Component: ${hotspot.priorityBreakdown.recurrenceTrend} (+${hotspot.trendPercentage}%)
  * Infrastructure Gap Signal: ${hotspot.priorityBreakdown.infrastructureGap}
- Languages Represented in Citizen Signals: ${hotspot.languagesRepresented.join(', ')}
- Current Status: ${hotspot.status}

SAMPLE CITIZEN SIGNALS (REPRESENTATIVE EVIDENCE):
${signalSnippets}

Synthesize this raw intelligence into a comprehensive, decision-ready action brief according to the required schema. Ensure every recommendation links directly to the citizen evidence documented above.`;
}
