import { DashboardMetrics } from '@/lib/types';
import { Layers, Globe, MapPin } from 'lucide-react';

interface CategoryDistributionProps {
  metrics: DashboardMetrics;
}

export default function CategoryDistribution({ metrics }: CategoryDistributionProps) {
  // Sort categories by count
  const sortedCategories = Object.entries(metrics.categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const sortedLanguages = Object.entries(metrics.languageCounts)
    .sort(([, a], [, b]) => b - a);

  const sortedStates = Object.entries(metrics.stateCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxCatCount = Math.max(...sortedCategories.map(([, c]) => c), 1);
  const maxLangCount = Math.max(...sortedLanguages.map(([, c]) => c), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Infrastructure Domains */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Signals by Domain
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">Top Categories</span>
        </div>

        <div className="space-y-2.5">
          {sortedCategories.map(([category, count]) => {
            const percentage = Math.round((count / maxCatCount) * 100);
            return (
              <div key={category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 line-clamp-1">{category}</span>
                  <span className="text-slate-500 font-semibold">{count}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Multilingual Signals */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Multilingual Signals
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">Gemini Ingest</span>
        </div>

        <div className="space-y-2.5">
          {sortedLanguages.map(([lang, count]) => {
            const percentage = Math.round((count / maxLangCount) * 100);
            return (
              <div key={lang} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{lang}</span>
                  <span className="text-slate-500 font-semibold">{count} signals</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. State Coverage */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Geographic Footprint
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">10 States</span>
        </div>

        <div className="space-y-2.5">
          {sortedStates.map(([stateName, count]) => {
            return (
              <div
                key={stateName}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
              >
                <span className="font-medium text-slate-800">{stateName}</span>
                <span className="px-2 py-0.5 rounded bg-white text-slate-700 font-semibold border border-slate-200">
                  {count} signals
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
