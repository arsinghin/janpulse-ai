import {
  CitizenReport,
  DashboardMetrics,
  InfrastructureHotspot,
  IssueCategory,
  UrgencyLevel,
} from '../types';
import { INITIAL_HOTSPOTS, INITIAL_REPORTS } from './demo-data';
import { calculatePriorityScore } from '../scoring/priority';

export interface ReportFilterOptions {
  state?: string;
  district?: string;
  category?: IssueCategory | 'All';
  language?: string | 'All';
  urgency?: UrgencyLevel | 'All';
  status?: string | 'All';
  searchQuery?: string;
}

export interface HotspotFilterOptions {
  state?: string;
  district?: string;
  category?: IssueCategory | 'All';
  urgency?: UrgencyLevel | 'All';
  status?: string | 'All';
  searchQuery?: string;
}

export interface IDataProvider {
  getReports(filters?: ReportFilterOptions): Promise<CitizenReport[]>;
  getReportById(id: string): Promise<CitizenReport | null>;
  addReport(report: CitizenReport): Promise<CitizenReport>;
  getHotspots(filters?: HotspotFilterOptions): Promise<InfrastructureHotspot[]>;
  getHotspotById(id: string): Promise<InfrastructureHotspot | null>;
  updateHotspot(hotspot: InfrastructureHotspot): Promise<InfrastructureHotspot>;
  findSimilarReports(
    queryText: string,
    category: IssueCategory,
    district: string
  ): Promise<CitizenReport[]>;
  getMetrics(): Promise<DashboardMetrics>;
}

class InMemoryDemoDataProvider implements IDataProvider {
  private reports: CitizenReport[];
  private hotspots: InfrastructureHotspot[];

  constructor() {
    this.reports = [...INITIAL_REPORTS];
    this.hotspots = [...INITIAL_HOTSPOTS];
  }

  async getReports(filters?: ReportFilterOptions): Promise<CitizenReport[]> {
    let result = [...this.reports];

    if (!filters) {
      return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    if (filters.state && filters.state !== 'All') {
      result = result.filter((r) => r.state.toLowerCase() === filters.state?.toLowerCase());
    }
    if (filters.district && filters.district !== 'All') {
      result = result.filter((r) => r.district.toLowerCase() === filters.district?.toLowerCase());
    }
    if (filters.category && filters.category !== 'All') {
      result = result.filter((r) => r.category === filters.category);
    }
    if (filters.language && filters.language !== 'All') {
      result = result.filter((r) => r.language.toLowerCase() === filters.language?.toLowerCase());
    }
    if (filters.urgency && filters.urgency !== 'All') {
      result = result.filter((r) => r.urgency === filters.urgency);
    }
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.text.toLowerCase().includes(q) ||
          r.locality.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q) ||
          (r.englishSummary && r.englishSummary.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getReportById(id: string): Promise<CitizenReport | null> {
    return this.reports.find((r) => r.id === id) || null;
  }

  async addReport(report: CitizenReport): Promise<CitizenReport> {
    // Add to reports array at the beginning
    this.reports.unshift(report);

    // If report has a clusterId, link to existing hotspot
    if (report.clusterId) {
      const existingHotspot = this.hotspots.find((h) => h.id === report.clusterId);
      if (existingHotspot) {
        if (!existingHotspot.reportIds.includes(report.id)) {
          existingHotspot.reportIds.unshift(report.id);
          existingHotspot.reportCount += 1;
          existingHotspot.estimatedAffectedPopulation += report.estimatedPopulation || 1200;
          if (report.locality && !existingHotspot.localities.includes(report.locality)) {
            existingHotspot.localities.push(report.locality);
          }
          if (report.language && !existingHotspot.languagesRepresented.includes(report.language)) {
            existingHotspot.languagesRepresented.push(report.language);
          }
          if (report.urgency === 'Critical') existingHotspot.urgencyDistribution.critical += 1;
          else if (report.urgency === 'High') existingHotspot.urgencyDistribution.high += 1;
          else if (report.urgency === 'Medium') existingHotspot.urgencyDistribution.medium += 1;
          else existingHotspot.urgencyDistribution.low += 1;

          // Recalculate deterministic priority score
          existingHotspot.priorityBreakdown = calculatePriorityScore({
            reportCount: existingHotspot.reportCount,
            estimatedPopulation: existingHotspot.estimatedAffectedPopulation,
            urgencyDistribution: existingHotspot.urgencyDistribution,
            trendPercentage: existingHotspot.trendPercentage + 3,
            category: existingHotspot.category,
          });
          existingHotspot.priorityScore = existingHotspot.priorityBreakdown.overallScore;
          existingHotspot.lastUpdated = new Date().toISOString();
        }
      }
    }

    return report;
  }

  async getHotspots(filters?: HotspotFilterOptions): Promise<InfrastructureHotspot[]> {
    let result = [...this.hotspots];

    if (!filters) {
      return result.sort((a, b) => b.priorityScore - a.priorityScore);
    }

    if (filters.state && filters.state !== 'All') {
      result = result.filter((h) => h.state.toLowerCase() === filters.state?.toLowerCase());
    }
    if (filters.district && filters.district !== 'All') {
      result = result.filter((h) => h.district.toLowerCase() === filters.district?.toLowerCase());
    }
    if (filters.category && filters.category !== 'All') {
      result = result.filter((h) => h.category === filters.category);
    }
    if (filters.status && filters.status !== 'All') {
      result = result.filter((h) => h.status === filters.status);
    }
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.district.toLowerCase().includes(q) ||
          h.state.toLowerCase().includes(q) ||
          h.localities.some((l) => l.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => b.priorityScore - a.priorityScore);
  }

  async getHotspotById(id: string): Promise<InfrastructureHotspot | null> {
    return this.hotspots.find((h) => h.id === id) || null;
  }

  async updateHotspot(hotspot: InfrastructureHotspot): Promise<InfrastructureHotspot> {
    const idx = this.hotspots.findIndex((h) => h.id === hotspot.id);
    if (idx >= 0) {
      this.hotspots[idx] = hotspot;
    } else {
      this.hotspots.push(hotspot);
    }
    return hotspot;
  }

  async findSimilarReports(
    queryText: string,
    category: IssueCategory,
    district: string
  ): Promise<CitizenReport[]> {
    const lowerQuery = queryText.toLowerCase();
    const queryTokens = lowerQuery
      .split(/\s+/)
      .filter((t) => t.length > 2)
      .slice(0, 10);

    // 1. Strict district + category match
    const candidateReports = this.reports.filter(
      (r) =>
        r.category === category ||
        (district && r.district.toLowerCase() === district.toLowerCase())
    );

    // Rank by token overlap and category match
    const scored = candidateReports.map((report) => {
      let score = 0;
      if (report.category === category) score += 40;
      if (district && report.district.toLowerCase() === district.toLowerCase()) score += 30;

      const targetText = `${report.text} ${report.englishSummary || ''} ${report.normalizedText || ''}`.toLowerCase();
      queryTokens.forEach((token) => {
        if (targetText.includes(token)) score += 8;
      });

      return { report, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 5).map((s) => s.report);
  }

  async getMetrics(): Promise<DashboardMetrics> {
    const activeHotspots = this.hotspots.length;
    const totalSignals = this.reports.length;

    const districtSet = new Set(this.reports.map((r) => `${r.state}-${r.district}`));
    const districtsCovered = districtSet.size;

    const estimatedAffectedCitizens = this.hotspots.reduce(
      (acc, h) => acc + h.estimatedAffectedPopulation,
      0
    );

    const highUrgencyCount = this.reports.filter(
      (r) => r.urgency === 'High' || r.urgency === 'Critical'
    ).length;

    const languageCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    const stateCounts: Record<string, number> = {};

    this.reports.forEach((r) => {
      languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
      stateCounts[r.state] = (stateCounts[r.state] || 0) + 1;
    });

    return {
      totalSignals,
      activeHotspots,
      districtsCovered,
      estimatedAffectedCitizens,
      highUrgencyCount,
      languageCounts,
      categoryCounts,
      stateCounts,
    };
  }
}

// Global in-memory singleton
// Using globalThis to survive Next.js module reloads in development server
const globalWithDemoData = globalThis as unknown as {
  __janpulseDemoDataProvider?: InMemoryDemoDataProvider;
};

export const demoDataProvider: IDataProvider =
  globalWithDemoData.__janpulseDemoDataProvider ||
  (globalWithDemoData.__janpulseDemoDataProvider = new InMemoryDemoDataProvider());
