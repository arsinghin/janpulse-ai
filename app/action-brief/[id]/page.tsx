'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { ActionBrief, InfrastructureHotspot } from '@/lib/types';
import { safeFetchJson } from '@/lib/utils/api-client';
import {
  FileText,
  Printer,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  MapPin,
  Users,
  TrendingUp,
  ShieldAlert,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface ActionBriefPageProps {
  params: Promise<{ id: string }>;
}

export default function ActionBriefPage({ params }: ActionBriefPageProps) {
  const unwrappedParams = use(params);
  const hotspotId = unwrappedParams.id;

  const [hotspot, setHotspot] = useState<InfrastructureHotspot | null>(null);
  const [brief, setBrief] = useState<ActionBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch hotspot details
        const hsResult = await safeFetchJson<any>(`/api/hotspots/${hotspotId}`);
        if (!hsResult.ok || !hsResult.data?.success) {
          throw new Error(hsResult.data?.error || hsResult.error || 'Failed to fetch hotspot details.');
        }
        setHotspot(hsResult.data.hotspot);

        // 2. Generate or fetch Action Brief from Gemini
        const briefResult = await safeFetchJson<any>('/api/generate-action-brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hotspotId }),
        });
        if (!briefResult.ok || !briefResult.data?.success) {
          throw new Error(
            briefResult.data?.message || briefResult.data?.error || briefResult.error || 'Failed to generate Action Brief.'
          );
        }

        setBrief(briefResult.data.brief);
      } catch (err: unknown) {
        console.error('Action Brief load error:', err);
        let cleanMsg = 'Gemini Action Brief could not be generated. Please try again in a moment.';
        if (err instanceof Error) {
          if (err.message.includes('"message":')) {
            try {
              const parsed = JSON.parse(err.message);
              cleanMsg = parsed?.error?.message || parsed?.message || cleanMsg;
            } catch {
              cleanMsg = err.message;
            }
          } else {
            cleanMsg = err.message;
          }
        }
        setError(cleanMsg);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [hotspotId]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans print:bg-white">
      {/* Hide on print */}
      <div className="print:hidden">
        <DisclaimerBanner />
        <Navbar />
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation & Print Action Bar (Hidden during print) */}
        <div className="print:hidden flex items-center justify-between gap-4">
          <Link
            href={`/hotspots/${hotspotId}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Hotspot Dossier</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={loading || !!error}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl p-12 border border-slate-200 text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Synthesizing Evidence with Gemini 3.8 Flash
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Grounding citizen signals, calculating population scope, and drafting an administrative action brief...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-xl p-8 border border-red-200 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Action Brief Generation Paused</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">{error}</p>
            <Link
              href={`/hotspots/${hotspotId}`}
              className="inline-block mt-2 text-xs font-semibold text-blue-600 hover:underline"
            >
              Return to Hotspot View
            </Link>
          </div>
        )}

        {/* Printable Official Action Brief Document */}
        {brief && hotspot && (
          <article className="bg-white rounded-xl p-8 sm:p-12 border border-slate-300/80 shadow-md space-y-8 print:shadow-none print:border-none print:p-0">
            {/* Document Header */}
            <div className="border-b-2 border-slate-900 pb-6 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                <span>Government Action Protocol</span>
                <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Track 1 Digital Public Infrastructure
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-red-700 uppercase tracking-widest block mb-1">
                  AI-GENERATED INFRASTRUCTURE ACTION BRIEF · PROTOTYPE DEMONSTRATION
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                  {brief.title}
                </h1>
              </div>

              {/* Document Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs text-slate-600 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">District / State</span>
                  <span className="font-semibold text-slate-900">{hotspot.district}, {hotspot.state}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Aggregated Signals</span>
                  <span className="font-semibold text-slate-900">{hotspot.reportCount} reports</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Impacted Citizens</span>
                  <span className="font-semibold text-slate-900">~{hotspot.estimatedAffectedPopulation.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Priority Score</span>
                  <span className="font-bold text-red-700">{hotspot.priorityScore} / 100</span>
                </div>
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  1. Executive Summary
                </h2>
                <span className="text-[10px] text-slate-400">Generated by Gemini</span>
              </div>
              <div className="text-sm text-slate-800 leading-relaxed space-y-2 font-normal">
                <p>{brief.executiveSummary}</p>
              </div>
            </section>

            {/* Section 2: Problem Statement */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Root Infrastructure Problem
                </h2>
                <span className="text-[10px] text-slate-400">Generated by Gemini</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-800 leading-relaxed">
                {brief.problemStatement}
              </div>
            </section>

            {/* Section 3: Empirical Evidence & Multilingual Signals */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  3. Citizen Signal Evidence &amp; Synthesis
                </h2>
                <span className="text-[10px] text-slate-400">Generated by Gemini</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {brief.evidenceSummary}
              </p>

              {/* Signals Evidence Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[10px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Signal ID</th>
                      <th className="py-2.5 px-3">Language</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Original Native Excerpt</th>
                      <th className="py-2.5 px-3">AI Standardized Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {brief.citizenSignalSummary.map((sig) => (
                      <tr key={sig.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-500">
                          {sig.id}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-blue-700">
                          {sig.language}
                        </td>
                        <td className="py-2.5 px-3 text-slate-900">
                          {sig.locality}
                        </td>
                        <td className="py-2.5 px-3 italic text-slate-600 max-w-xs truncate">
                          &ldquo;{sig.originalSnippet}&rdquo;
                        </td>
                        <td className="py-2.5 px-3 text-slate-900 font-medium max-w-xs">
                          {sig.interpretation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4: Affected Population & Geographic Scope */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Affected Population Analysis</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {brief.affectedPopulationAnalysis}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Geographic Scope</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {brief.geographicScope}
                </p>
              </div>
            </section>

            {/* Section 5: Observed Trend */}
            <section className="space-y-1.5">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                5. Observed Escalation Trend
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                {brief.observedTrend}
              </p>
            </section>

            {/* Section 6: Potential Intervention Areas */}
            <section className="space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                6. Targeted Engineering &amp; Administrative Interventions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {brief.potentialInterventionAreas.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 bg-blue-50/50 rounded-lg border border-blue-200/80 text-xs text-slate-900 flex items-start gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="font-medium pt-0.5">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 7: Suggested Immediate Next Steps */}
            <section className="space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                7. Suggested Next Steps for District Administration
              </h2>
              <ul className="space-y-2 text-xs text-slate-800">
                {brief.suggestedNextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 8: Methodological Disclosures & Data Limitations */}
            <section className="p-4 bg-amber-50/60 rounded-lg border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>8. Data Limitations &amp; Uncertainty Disclosures</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-amber-900">
                {brief.dataLimitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
              <p className="text-[11px] text-amber-800 pt-1 border-t border-amber-200/60 font-medium">
                <strong>Methodology Note:</strong> {brief.confidenceAndUncertainty}
              </p>
            </section>

            {/* Document Signature Block */}
            <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-slate-700">JanPulse AI Intelligence Layer</span>
                <span className="mx-2">·</span>
                <span>Model: {brief.modelUsed}</span>
              </div>
              <div>
                Generated at: {new Date(brief.generatedAt).toLocaleString()}
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
