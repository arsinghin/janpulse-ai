import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { demoDataProvider } from '@/lib/data/data-provider';
import {
  ArrowLeft,
  FileSpreadsheet,
  MapPin,
  TrendingUp,
  Users,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface HotspotDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function HotspotDetailPage({ params }: HotspotDetailPageProps) {
  const { id } = await params;
  const hotspot = await demoDataProvider.getHotspotById(id);

  if (!hotspot) {
    notFound();
  }

  const allReports = await demoDataProvider.getReports();
  const linkedReports = allReports.filter(
    (r) => r.clusterId === hotspot.id || hotspot.reportIds.includes(r.id)
  );

  const breakdown = hotspot.priorityBreakdown;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-700 font-medium">Hotspot Dossier</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">{hotspot.id}</span>
        </div>

        {/* Hotspot Header Banner */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {hotspot.category}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${
                    hotspot.status === 'Escalated'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {hotspot.status}
                </span>
                <span className="text-xs text-slate-400">
                  ID: <span className="font-mono text-slate-600">{hotspot.id}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {hotspot.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-600 pt-1 flex-wrap">
                <span className="flex items-center gap-1.5 font-medium text-slate-900">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  {hotspot.district}, {hotspot.state}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Wards / Localities: {hotspot.localities.join(', ') || 'District Sector'}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Coordinates: {hotspot.coordinates.lat}° N, {hotspot.coordinates.lng}° E</span>
              </div>
            </div>

            {/* AI Action Brief CTA */}
            <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
              <Link
                href={`/action-brief/${hotspot.id}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Generate AI Action Brief</span>
              </Link>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>Evidence-grounded briefing</span>
              </span>
            </div>
          </div>
        </div>

        {/* Priority Score Mathematical Breakdown Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Deterministic Decision Support
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Transparent Priority Score Breakdown: {hotspot.priorityScore} / 100
              </h3>
            </div>
            <div className="text-xs font-mono bg-slate-100 px-3 py-1 rounded text-slate-700">
              Auditable Formula Math
            </div>
          </div>

          {/* 5 Components Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {/* 1. Complaint Volume */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Complaint Volume</span>
                <span className="font-mono text-[10px] text-slate-400">30%</span>
              </div>
              <div className="text-xl font-bold text-slate-900">
                {breakdown.complaintVolume} <span className="text-xs font-normal text-slate-500">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {hotspot.reportCount} citizen reports
              </p>
            </div>

            {/* 2. Population Affected */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Population Impact</span>
                <span className="font-mono text-[10px] text-slate-400">25%</span>
              </div>
              <div className="text-xl font-bold text-slate-900">
                {breakdown.populationAffected} <span className="text-xs font-normal text-slate-500">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-500">
                ~{hotspot.estimatedAffectedPopulation.toLocaleString()} citizens
              </p>
            </div>

            {/* 3. Urgency */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Urgency Severity</span>
                <span className="font-mono text-[10px] text-slate-400">20%</span>
              </div>
              <div className="text-xl font-bold text-red-600">
                {breakdown.urgency} <span className="text-xs font-normal text-slate-500">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {hotspot.urgencyDistribution.critical} Critical / {hotspot.urgencyDistribution.high} High
              </p>
            </div>

            {/* 4. Recurrence Trend */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">7D Recurrence Trend</span>
                <span className="font-mono text-[10px] text-slate-400">15%</span>
              </div>
              <div className="text-xl font-bold text-emerald-600">
                {breakdown.recurrenceTrend} <span className="text-xs font-normal text-slate-500">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-500">
                +{hotspot.trendPercentage}% weekly acceleration
              </p>
            </div>

            {/* 5. Infrastructure Gap Signal */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Service Gap Factor</span>
                <span className="font-mono text-[10px] text-slate-400">10%</span>
              </div>
              <div className="text-xl font-bold text-indigo-600">
                {breakdown.infrastructureGap} <span className="text-xs font-normal text-slate-500">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Essential baseline service weight
              </p>
            </div>
          </div>

          {/* Formula Disclaimer Note */}
          <div className="p-3 bg-amber-50/60 rounded-md border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>Governance Transparency Principle:</strong> Priority score is a prototype decision-support metric,
              calculated strictly with deterministic arithmetic, not an official government prioritization or executive decree.
            </p>
          </div>
        </div>

        {/* CITIZEN EVIDENCE FEED */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Original Multilingual Citizen Evidence ({linkedReports.length} Signals)
              </h3>
              <p className="text-xs text-slate-500">
                Preserving original Indian language voice alongside Gemini standardized English interpretation.
              </p>
            </div>
            <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded border border-slate-200">
              Languages: {hotspot.languagesRepresented.join(', ')}
            </span>
          </div>

          <div className="space-y-3">
            {linkedReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {report.locality || hotspot.district}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500 font-mono">{report.id}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {report.language}
                    </span>
                    <span
                      className={`font-semibold ${
                        report.urgency === 'Critical'
                          ? 'text-red-600'
                          : report.urgency === 'High'
                          ? 'text-amber-600'
                          : 'text-blue-600'
                      }`}
                    >
                      {report.urgency}
                    </span>
                    <span className="text-slate-400 font-mono text-xs" suppressHydrationWarning>
                      {report.timestamp.slice(0, 10)}
                    </span>
                  </div>
                </div>

                {/* Native Text vs AI Standardized Interpretation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Native Script */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider block">
                      Original Citizen Voice ({report.language})
                    </span>
                    <p className="text-sm text-slate-800 italic leading-relaxed">
                      &ldquo;{report.text}&rdquo;
                    </p>
                  </div>

                  {/* AI Interpretation */}
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 space-y-1">
                    <span className="font-semibold text-blue-900 text-[11px] uppercase tracking-wider block">
                      AI Normalization &amp; Action
                    </span>
                    <p className="text-sm text-slate-900 font-medium leading-relaxed">
                      {report.normalizedText || report.englishSummary}
                    </p>
                    {report.requestedAction && (
                      <p className="text-[11px] text-blue-800 pt-1">
                        <strong>Requested Action:</strong> {report.requestedAction}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white text-sm">JanPulse AI</span>
            <span className="mx-2 text-slate-600">·</span>
            <span>Hotspot Dossier Intelligence</span>
          </div>
          <Link href="/dashboard" className="text-blue-400 hover:text-white transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </footer>
    </div>
  );
}
