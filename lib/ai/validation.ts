import { AIReportAnalysis, IssueCategory, UrgencyLevel } from '../types';

export const VALID_CATEGORIES: IssueCategory[] = [
  'Water Supply',
  'Roads & Transport',
  'Electricity',
  'Sanitation & Waste',
  'Healthcare Access',
  'Public Safety',
  'Education',
  'Drainage & Flooding',
  'Digital Connectivity',
  'Public Transport',
  'Other',
];

export const VALID_URGENCIES: UrgencyLevel[] = ['Low', 'Medium', 'High', 'Critical'];

/**
 * Validates and sanitizes raw JSON returned by Gemini against semantic domain rules.
 * Protects against hallucinated out-of-bounds metrics, invalid enums, and prompt injection leaks.
 */
export function validateAndSanitizeAIAnalysis(raw: any): AIReportAnalysis {
  if (!raw || typeof raw !== 'object') {
    throw new Error('AI analysis output is not a valid object');
  }

  // 1. Language Sanitization
  const detectedLanguage =
    typeof raw.detectedLanguage === 'string' && raw.detectedLanguage.trim().length > 0
      ? raw.detectedLanguage.trim().slice(0, 40)
      : 'Hindi';

  // 2. Text Normalization
  const normalizedText =
    typeof raw.normalizedText === 'string' && raw.normalizedText.trim().length > 0
      ? raw.normalizedText.trim().slice(0, 1200)
      : 'Infrastructure issue reported by citizen.';

  const englishSummary =
    typeof raw.englishSummary === 'string' && raw.englishSummary.trim().length > 0
      ? raw.englishSummary.trim().slice(0, 400)
      : normalizedText.slice(0, 200);

  // 3. Category Validation (Strict Whitelist)
  let category: IssueCategory = 'Other';
  if (typeof raw.category === 'string') {
    const matchedCategory = VALID_CATEGORIES.find(
      (c) => c.toLowerCase() === raw.category.trim().toLowerCase()
    );
    if (matchedCategory) {
      category = matchedCategory;
    }
  }

  // 4. Subcategory & Problem Type
  const subcategory =
    typeof raw.subcategory === 'string' && raw.subcategory.trim().length > 0
      ? raw.subcategory.trim().slice(0, 100)
      : 'General Infrastructure Maintenance';

  const problemType =
    typeof raw.problemType === 'string' && raw.problemType.trim().length > 0
      ? raw.problemType.trim().slice(0, 80)
      : 'Infrastructure failure';

  // 5. Urgency Validation (Strict Whitelist)
  let urgency: UrgencyLevel = 'Medium';
  if (typeof raw.urgency === 'string') {
    const matchedUrgency = VALID_URGENCIES.find(
      (u) => u.toLowerCase() === raw.urgency.trim().toLowerCase()
    );
    if (matchedUrgency) {
      urgency = matchedUrgency;
    }
  }

  const urgencyReason =
    typeof raw.urgencyReason === 'string' && raw.urgencyReason.trim().length > 0
      ? raw.urgencyReason.trim().slice(0, 300)
      : 'Assessed based on reported citizen disruption severity.';

  // 6. Location Mentioned
  const locationMentioned =
    typeof raw.locationMentioned === 'string' && raw.locationMentioned.trim().length > 0
      ? raw.locationMentioned.trim().slice(0, 120)
      : null;

  // 7. Affected Group
  const affectedGroup =
    typeof raw.affectedGroup === 'string' && raw.affectedGroup.trim().length > 0
      ? raw.affectedGroup.trim().slice(0, 150)
      : 'Local residents and commuters';

  // 8. Population Estimate (Bounded Range Validation)
  // Rejects negative populations or impossible astronomical numbers
  let estimatedAffectedPopulation: number | null = null;
  if (typeof raw.estimatedAffectedPopulation === 'number' && !isNaN(raw.estimatedAffectedPopulation)) {
    const parsed = Math.round(raw.estimatedAffectedPopulation);
    if (parsed > 0 && parsed <= 5000000) {
      estimatedAffectedPopulation = parsed;
    } else if (parsed > 5000000) {
      estimatedAffectedPopulation = 50000; // Cap to realistic sub-district ward proxy
    }
  }

  // 9. Requested Action
  const requestedAction =
    typeof raw.requestedAction === 'string' && raw.requestedAction.trim().length > 0
      ? raw.requestedAction.trim().slice(0, 350)
      : 'Departmental inspection and priority repair.';

  // 10. Keywords Array
  let keywords: string[] = [];
  if (Array.isArray(raw.keywords)) {
    keywords = raw.keywords
      .filter((k: any) => typeof k === 'string' && k.trim().length > 0)
      .map((k: string) => k.trim().slice(0, 40))
      .slice(0, 8);
  }
  if (keywords.length === 0) {
    keywords = [category, subcategory];
  }

  // 11. Confidence Validation (Strict [0.0, 1.0] Range)
  let confidence = 0.88;
  if (typeof raw.confidence === 'number' && !isNaN(raw.confidence)) {
    if (raw.confidence > 1.0 && raw.confidence <= 100.0) {
      confidence = Number((raw.confidence / 100).toFixed(2));
    } else {
      confidence = Math.min(1.0, Math.max(0.1, Number(raw.confidence.toFixed(2))));
    }
  }

  return {
    detectedLanguage,
    normalizedText,
    englishSummary,
    category,
    subcategory,
    problemType,
    urgency,
    urgencyReason,
    locationMentioned,
    affectedGroup,
    estimatedAffectedPopulation,
    requestedAction,
    keywords,
    confidence,
  };
}
