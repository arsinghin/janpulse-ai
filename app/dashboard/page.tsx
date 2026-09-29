import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import KPICards from '@/components/dashboard/KPICards';
import IndiaMap from '@/components/map/IndiaMap';
import HotspotTable from '@/components/dashboard/HotspotTable';
import CategoryDistribution from '@/components/dashboard/CategoryDistribution';
import { demoDataProvider } from '@/lib/data/data-provider';
import {
  Download,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default async function DashboardPage() {
  // Server-side data fetching directly from demo data provider
  const metrics = await demoDataProvider.getMetrics();
  const hotspots = await demoDataProvider.getHotspots();

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <DisclaimerBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                JanPulse Intelligence Dashboard
              </h1>
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                Live Signal Grid
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              National infrastructure hotspot monitoring, multilingual signal aggregation, and deterministic priority triage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/#report-section"
              className="px-3.5 py-2 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
            >
              + Ingest New Signal
            </Link>
            <Link
              href="/methodology"
              className="px-3.5 py-2 text-xs font-medium rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Scoring Methodology
            </Link>
          </div>
        </div>

        {/* Top KPI Metrics Cards */}
        <KPICards metrics={metrics} />

        {/* Central Map & Quick Hotspots Visual Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* India Vector Map (7 Columns on large) */}
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>National Geospatial Concentration Map</span>
                <span className="text-xs font-normal text-slate-500">(Zero API Key Vector View)</span>
              </h3>
              <span className="text-xs text-slate-400">Pulsing = Critical Hotspot</span>
            </div>

            <IndiaMap hotspots={hotspots} />
          </div>

          {/* Top Priority Action Sidebar (5 Columns on large) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Top Priority Interventions Needed
              </h3>
              <span className="text-xs text-slate-500 font-medium">Ranked by Priority Math</span>
            </div>

            <div className="space-y-3">
              {hotspots.slice(0, 4).map((hotspot, idx) => (
                <div
                  key={hotspot.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                      {hotspot.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        hotspot.priorityScore >= 80
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      Score {hotspot.priorityScore} / 100
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {hotspot.title}
                  </h4>

                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>{hotspot.district}, {hotspot.state}</span>
                    <span className="font-semibold text-slate-700">{hotspot.reportCount} signals</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+{hotspot.trendPercentage}% this week</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/action-brief/${hotspot.id}`}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded transition-colors inline-flex items-center gap-1"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Action Brief</span>
                      </Link>
                      <Link
                        href={`/hotspots/${hotspot.id}`}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                      >
                        Details &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category & Multilingual Distribution Bars */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Signal Intelligence Breakdown
          </h3>
          <CategoryDistribution metrics={metrics} />
        </div>

        {/* Hotspot Ranking Table */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                All Identified Infrastructure Hotspots
              </h3>
              <p className="text-xs text-slate-500">
                Sorted by transparent multi-criteria priority algorithm.
              </p>
            </div>
          </div>

          <HotspotTable hotspots={hotspots} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white text-sm">JanPulse AI</span>
            <span className="mx-2 text-slate-600">·</span>
            <span>Digital Public Infrastructure Prototype for India</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Track 1: AI for Digital Public Infrastructure &amp; Governance
          </div>
        </div>
      </footer>
    </div>
  );
}
