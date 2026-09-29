import { IssueCategory, PriorityBreakdown, UrgencyLevel } from '../types';

/**
 * Deterministic Transparent Priority Score Calculator
 *
 * Formula components:
 * - 30% Complaint Volume (normalized 0-100 based on report count)
 * - 25% Estimated Population Affected (normalized 0-100 based on population)
 * - 20% Urgency (weighted average of urgency levels)
 * - 15% Recurrence / Trend (recent velocity / recurrence pattern)
 * - 10% Infrastructure Gap Signal (essential vs secondary service criticality)
 *
 * NOTE: Priority score is a prototype decision-support metric,
 * not an official government prioritization.
 */

// Category essential criticality baseline (0 - 100)
const CATEGORY_GAP_WEIGHTS: Record<IssueCategory, number> = {
  'Water Supply': 95,
  'Healthcare Access': 92,
  'Electricity': 88,
  'Drainage & Flooding': 86,
  'Roads & Transport': 80,
  'Sanitation & Waste': 78,
  'Public Safety': 82,
  'Education': 75,
  'Public Transport': 70,
  'Digital Connectivity': 65,
  'Other': 50,
};

const URGENCY_WEIGHTS: Record<UrgencyLevel, number> = {
  Critical: 100,
  High: 75,
  Medium: 45,
  Low: 20,
};

export function calculatePriorityScore(params: {
  reportCount: number;
  estimatedPopulation: number;
  urgencyDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  trendPercentage: number;
  category: IssueCategory;
}): PriorityBreakdown {
  const {
    reportCount,
    estimatedPopulation,
    urgencyDistribution,
    trendPercentage,
    category,
  } = params;

  // 1. Complaint Volume: 50+ reports hits 100 cap
  const complaintVolume = Math.min(100, Math.max(10, Math.round((reportCount / 50) * 100)));

  // 2. Population Affected: 20,000+ citizens hits 100 cap
  const populationAffected = Math.min(100, Math.max(10, Math.round((estimatedPopulation / 20000) * 100)));

  // 3. Urgency: Weighted average based on distribution
  const totalReports =
    urgencyDistribution.critical +
    urgencyDistribution.high +
    urgencyDistribution.medium +
    urgencyDistribution.low;

  let urgencyScore = 50;
  if (totalReports > 0) {
    const rawUrgency =
      urgencyDistribution.critical * URGENCY_WEIGHTS.Critical +
      urgencyDistribution.high * URGENCY_WEIGHTS.High +
      urgencyDistribution.medium * URGENCY_WEIGHTS.Medium +
      urgencyDistribution.low * URGENCY_WEIGHTS.Low;
    urgencyScore = Math.min(100, Math.round(rawUrgency / totalReports));
  }

  // 4. Recurrence / Trend:
  // e.g. +40% increase = ~90, +20% = ~70, 0% = ~45, negative trend = ~25
  let recurrenceTrend = 50;
  if (trendPercentage > 50) recurrenceTrend = 95;
  else if (trendPercentage > 30) recurrenceTrend = 85;
  else if (trendPercentage > 15) recurrenceTrend = 72;
  else if (trendPercentage > 0) recurrenceTrend = 58;
  else recurrenceTrend = 40;

  // 5. Infrastructure Gap Signal:
  const infrastructureGap = CATEGORY_GAP_WEIGHTS[category] || 65;

  // Weighted overall calculation:
  // 30% Vol + 25% Pop + 20% Urg + 15% Trend + 10% Gap
  const overallScore = Math.min(
    100,
    Math.max(
      1,
      Math.round(
        0.30 * complaintVolume +
        0.25 * populationAffected +
        0.20 * urgencyScore +
        0.15 * recurrenceTrend +
        0.10 * infrastructureGap
      )
    )
  );

  const formulaExplanation =
    `Priority Score (${overallScore}) = 30% Volume (${complaintVolume}) + 25% Population (${populationAffected}) + 20% Urgency (${urgencyScore}) + 15% Trend (${recurrenceTrend}) + 10% Service Gap (${infrastructureGap})`;

  return {
    complaintVolume,
    populationAffected,
    urgency: urgencyScore,
    recurrenceTrend,
    infrastructureGap,
    overallScore,
    formulaExplanation,
  };
}

export function calculateSingleReportScore(
  category: IssueCategory,
  urgency: UrgencyLevel,
  estimatedPopulation: number = 1000
): PriorityBreakdown {
  return calculatePriorityScore({
    reportCount: 1,
    estimatedPopulation,
    urgencyDistribution: {
      critical: urgency === 'Critical' ? 1 : 0,
      high: urgency === 'High' ? 1 : 0,
      medium: urgency === 'Medium' ? 1 : 0,
      low: urgency === 'Low' ? 1 : 0,
    },
    trendPercentage: 10,
    category,
  });
}
