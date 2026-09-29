import { AIReportAnalysis, ActionBrief } from '../types';

/**
 * In-memory LRU-like cache for deterministic complaint analysis & action briefs
 * Avoids repeated Gemini API calls on identical inputs.
 */

// Simple deterministic hash
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `h_${Math.abs(hash).toString(36)}`;
}

class InMemCache {
  private reportCache: Map<string, { data: AIReportAnalysis; expiresAt: number }> = new Map();
  private briefCache: Map<string, { data: ActionBrief; expiresAt: number }> = new Map();

  getReportAnalysis(key: string): AIReportAnalysis | null {
    const entry = this.reportCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.reportCache.delete(key);
      return null;
    }
    return entry.data;
  }

  setReportAnalysis(key: string, data: AIReportAnalysis, ttlMs: number = 3600000) {
    this.reportCache.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  getActionBrief(hotspotId: string): ActionBrief | null {
    const entry = this.briefCache.get(hotspotId);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.briefCache.delete(hotspotId);
      return null;
    }
    return entry.data;
  }

  setActionBrief(hotspotId: string, data: ActionBrief, ttlMs: number = 3600000) {
    this.briefCache.set(hotspotId, { data, expiresAt: Date.now() + ttlMs });
  }
}

const globalCache = globalThis as unknown as {
  __janpulseCache?: InMemCache;
};

export const memoryCache = globalCache.__janpulseCache || (globalCache.__janpulseCache = new InMemCache());
