'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CitizenReportForm from '@/components/citizen/CitizenReportForm';
import JudgeDemoPanel, { CuratedDemoScenario } from '@/components/JudgeDemoPanel';
import { safeFetchJson } from '@/lib/utils/api-client';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe2,
  TrendingUp,
  Cpu,
  Layers,
  FileCheck2,
  CheckCircle,
  PlayCircle,
  Loader2,
} from 'lucide-react';

export default function HomePage() {
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoMessage, setDemoMessage] = useState<string | null>(null);
  const [selectedDemoScenario, setSelectedDemoScenario] = useState<CuratedDemoScenario | null>(null);

  const handleSelectDemoScenario = (scenario: CuratedDemoScenario) => {
    setSelectedDemoScenario(scenario);
    // Smooth scroll down to citizen report form
    setTimeout(() => {
      const el = document.getElementById('report-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleRunLiveDemo = async () => {
    setDemoRunning(true);
    setDemoMessage('Submitting sample Hindi grievance to Gemini...');

    try {
      const result = await safeFetchJson<any>('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'हमारे गांव और सिगरा वार्ड में पिछले तीन महीने से पानी की सप्लाई ठीक से नहीं आ रही है। बुजुर्गों और बच्चों को बहुत परेशानी हो रही है। नल से मटमैला पानी आता है।',
          state: 'Uttar Pradesh',
          district: 'Varanasi',
          locality: 'Sigra',
          categoryHint: 'Water Supply',
          isDemo: true,
        }),
      });

      if (result.ok && result.data?.success) {
        const data = result.data;
        if (data.source === 'cached-demo') {
          setDemoMessage('Showing cached Varanasi prototype demonstration...');
        } else {
          setDemoMessage('Live Gemini analysis completed. Opening hotspot dossier...');
        }
        setTimeout(() => {
          window.location.href = `/hotspots/${data.hotspot?.id || 'hs-up-varanasi-water'}`;
        }, 900);
      } else {
        // Safe fallback for demo mode if server returned an error or non-JSON response
        console.warn('Demo run notice: Using cached demonstration fallback due to response status', result.status, result.error);
        setDemoMessage('Showing cached Varanasi prototype demonstration...');
        setTimeout(() => {
          window.location.href = '/hotspots/hs-up-varanasi-water';
        }, 1000);
      }
    } catch (err: unknown) {
      console.warn('Demo run notice caught exception, falling back to cached demo:', err);
      setDemoMessage('Showing cached Varanasi prototype demonstration...');
      setTimeout(() => {
        window.location.href = '/hotspots/hs-up-varanasi-water';
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-12 pb-16 lg:pt-16 lg:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6">
              {/* Badge & Initiative Indicator */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>AI for Digital Public Infrastructure &amp; Governance</span>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                  JanPulse AI
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-blue-700 tracking-tight">
                  From Citizen Voice to Government Action
                </p>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal pt-1">
                  Transform fragmented multilingual citizen requests into structured infrastructure
                  intelligence, geospatial failure hotspots, and evidence-backed government action briefs.
                </p>
              </div>

              {/* CTA Group & Live Demo Trigger */}
              <div className="pt-2 flex items-center flex-wrap gap-3">
                <a
                  href="#report-section"
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-sm transition-all focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  Report an Issue
                </a>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 shadow-sm transition-all"
                >
                  Explore Infrastructure Signals
                </Link>

                {/* 3-Minute Judge Live Demo Button */}
                <button
                  type="button"
                  onClick={handleRunLiveDemo}
                  disabled={demoRunning}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold text-sm hover:bg-emerald-100 transition-all disabled:opacity-60"
                >
                  {demoRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                      <span>{demoMessage || 'Running Live Demo...'}</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4 text-emerald-700" />
                      <span>Run Live Demo (3 Min Flow)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Demo status feedback */}
              {demoMessage && (
                <div className="p-3 bg-emerald-50 text-xs text-emerald-900 rounded-md border border-emerald-200">
                  {demoMessage}
                </div>
              )}
            </div>

            {/* VISUAL ARCHITECTURE PIPELINE */}
            <div className="mt-14 pt-8 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-4">
                Core Digital Public Infrastructure Pipeline
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                {/* Step 1 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Citizen Signal</h4>
                  <p className="text-slate-600 leading-normal">
                    Text or voice input in Hindi, Tamil, Telugu, Marathi, Bengali, or English.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Gemini AI</h4>
                  <p className="text-slate-600 leading-normal">
                    Multilingual understanding, entity extraction, and objective normalization.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Issue Intelligence</h4>
                  <p className="text-slate-600 leading-normal">
                    Classifies 10 domains, urgency levels, and affected community estimates.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    4
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Hotspot Clustering</h4>
                  <p className="text-slate-600 leading-normal">
                    Aggregates cross-language signals into geographic failure clusters.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    5
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Action Brief</h4>
                  <p className="text-slate-600 leading-normal">
                    Generates grounded, decision-ready briefs for district magistrates &amp; PWD.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* JUDGE CURATED DEMO SCENARIOS SECTION */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-6">
          <JudgeDemoPanel
            onSelectScenario={handleSelectDemoScenario}
            selectedScenarioId={selectedDemoScenario?.id}
          />
        </section>

        {/* CITIZEN REPORT FORM SECTION */}
        <section id="report-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-6">
          <CitizenReportForm
            key={selectedDemoScenario?.id || 'default'}
            initialPrompt={
              selectedDemoScenario
                ? {
                    text: selectedDemoScenario.text,
                    state: selectedDemoScenario.state,
                    district: selectedDemoScenario.district,
                    locality: selectedDemoScenario.locality,
                    categoryHint: selectedDemoScenario.category,
                  }
                : null
            }
          />
        </section>

        {/* VALUE PROPOSITION GRID */}
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Architected for Real-World Governance Challenges
              </h2>
              <p className="text-sm text-slate-600">
                Solving the structural bottleneck of fragmented municipal grievances through deterministic
                clustering and grounded AI intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <Globe2 className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Multilingual Convergence</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complaints received in Hindi, Tamil, Telugu, and English regarding the same pipeline
                  or road are automatically recognized as one converging infrastructure failure.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Deterministic Priority Math</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gemini never invents priority scores. JanPulse uses an auditable mathematical formula
                  weighting volume (30%), population (25%), urgency (20%), trend (15%), and gap (10%).
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <FileCheck2 className="w-6 h-6 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Strict Evidence Grounding</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Government Action Briefs cite only submitted citizen evidence. No fabricated budgets,
                  unverified surveys, or hallucinated departmental orders.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white text-sm">JanPulse AI</span>
            <span className="mx-2 text-slate-600">·</span>
            <span>Digital Public Infrastructure Platform</span>
            <span className="mx-2 text-slate-600">·</span>
            <span className="text-slate-400">Project Owner: AR Singh</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/methodology" className="hover:text-white transition-colors">
              Methodology &amp; AI
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">MIT Licensed Open Source</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
