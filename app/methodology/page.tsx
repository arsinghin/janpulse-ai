import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import {
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Database,
  Cloud,
  FileCheck,
  CheckCircle2,
  Workflow,
  BarChart3,
  Scale,
} from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <DisclaimerBanner />
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
            Platform Whitepaper &amp; System Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            JanPulse AI: Methodology &amp; Governance Architecture
          </h1>
          <p className="text-base text-slate-600">
            Detailed technical breakdown of how JanPulse AI converts unstructured, multilingual citizen signals
            into geospatial infrastructure hotspots and evidence-backed governance action briefs.
          </p>
        </div>

        {/* 1. Problem & Challenge */}
        <section className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            1. The Digital Public Infrastructure Challenge
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            Indian state and municipal governments receive hundreds of thousands of citizen development requests
            and infrastructure grievances monthly through fractured silos (portal tickets, handwritten letters,
            helpline phone calls, social media mentions, and in-person ward visits).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block text-sm">Linguistic Fragmentation</span>
              <p className="text-slate-600">
                Grievances arrive in Hindi, Tamil, Telugu, Marathi, Bengali, and diverse local dialects.
                Mono-lingual keyword search engines miss converging incidents.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block text-sm">Isolated Complaint Silos</span>
              <p className="text-slate-600">
                Reports are treated as isolated individual complaints rather than symptoms of systemic
                neighborhood pipeline bursts, transformer burnouts, or road cave-ins.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block text-sm">Subjective Triage</span>
              <p className="text-slate-600">
                Prioritization often relies on political escalation rather than objective metrics of
                affected population density, urgency, and essential service gaps.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Clear Boundary: AI vs Deterministic Logic */}
        <section className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              2. Architectural Separation: Gemini AI vs. Deterministic Code
            </h2>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            A foundational design tenet of JanPulse AI is that <strong className="text-slate-900">AI models must never
            calculate numerical priority scores or invent municipal statistics</strong>. Gemini is deployed strictly for
            natural language understanding, semantic extraction, and structured synthesis.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
            {/* Gemini Tasks */}
            <div className="p-5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>What Gemini 3.8 Flash Handles</span>
              </div>
              <ul className="space-y-2 text-slate-800">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Multilingual Ingestion:</strong> Detects and comprehends Hindi, Tamil, Telugu, Marathi, Bengali, English, etc.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Factual Normalization:</strong> Translates colloquial vernacular into clean, objective English summaries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Categorization:</strong> Maps complaints into standard infrastructure domains and subcategories.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Entity Extraction:</strong> Identifies mentioned landmarks, vulnerable demographics, and requested remedies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Action Brief Drafting:</strong> Synthesizes empirical evidence into administrative dossiers without hallucinations.</span>
                </li>
              </ul>
            </div>

            {/* Deterministic Tasks */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Cpu className="w-4 h-4 text-slate-700" />
                <span>What Deterministic Code Handles</span>
              </div>
              <ul className="space-y-2 text-slate-800">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Input Sanitization:</strong> Rate limits, payload validation, and abuse prevention.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Deterministic Caching:</strong> Hash-based query caching to avoid redundant API queries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Spatial Clustering:</strong> Haversine distance grouping and administrative boundary aggregation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Priority Math:</strong> Auditable, transparent mathematical formula weighting 5 transparent factors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Filtering &amp; Sorting:</strong> High-performance client and server database queries.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Deterministic Priority Formula */}
        <section className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              3. Deterministic Transparent Priority Formula
            </h2>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            JanPulse AI calculates a 0 to 100 Decision-Support Priority Score for every hotspot using a published,
            verifiable equation:
          </p>

          <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto space-y-1">
            <div className="text-emerald-400 font-bold">
              Priority Score (0 - 100) =
            </div>
            <div className="pl-4">
              0.30 &times; Complaint Volume [normalized (N / 50) &times; 100] +
            </div>
            <div className="pl-4">
              0.25 &times; Estimated Affected Population [normalized (Pop / 20,000) &times; 100] +
            </div>
            <div className="pl-4">
              0.20 &times; Urgency Severity [Critical=100, High=75, Med=45, Low=20] +
            </div>
            <div className="pl-4">
              0.15 &times; 7-Day Recurrence Acceleration Trend +
            </div>
            <div className="pl-4">
              0.10 &times; Essential Infrastructure Gap Baseline Factor
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-200">
            <strong>Civic Safeguard:</strong> This metric gives district administrations an objective ranking tool,
            mitigating bias and ensuring historically under-reported peripheral wards are surfaced when critical disruptions occur.
          </div>
        </section>

        {/* 4. Future Production Architecture */}
        <section className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                4. Production Architecture Roadmap — Future Phase
              </h2>
              <span className="text-xs text-slate-500">
                Path from current serverless prototype to national-scale deployment
              </span>
            </div>
          </div>

          {/* Diagram Box */}
          <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 space-y-4">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold border-b border-slate-800 pb-2">
              Production Architecture — Future Phase Blueprint
            </div>

            <pre className="text-xs font-mono leading-relaxed overflow-x-auto text-slate-300">
{`[ CITIZEN CHANNELS ]
  * WhatsApp / Telegram Bot  * IVR Voice Helpline (Bhashini / STT)  * Web Portal / Mobile PWA
                                       │
                                       ▼
[ INGESTION & GATEWAY ]
  * Google Cloud API Gateway / Cloud Armor Rate Limiting
  * Pub/Sub Event Stream for High-Throughput Buffering
                                       │
                                       ▼
[ GEMINI INTELLIGENCE LAYER ]
  * Gemini 3.8 Flash Multilingual Structuring & Entity Extraction
  * Semantic Embeddings for Cross-Lingual Vector Search
                                       │
                                       ▼
[ PERSISTENCE & ANALYTICS ]
  * Google Cloud Firestore (Real-Time Hotspot State & RBAC)
  * BigQuery (Longitudinal Geospatial Telemetry & Census Overlay)
                                       │
                                       ▼
[ HOTSPOT & PRIORITY ENGINE ]
  * Deterministic Spatial Clustering Engine (PostGIS / Cloud SQL)
  * Auditable Multi-Factor Priority Scoring
                                       │
                                       ▼
[ ACTION & GOVERNANCE WORKFLOW ]
  * Automated Gemini Action Briefs for District Magistrates (DM)
  * PWD / Jal Sansthan Field Ticket Dispatch & Compliance Tracking`}
            </pre>
          </div>

          {/* Current Prototype Status vs Future Production Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">
                Current Prototype Status (Phase 1)
              </span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>Serverless Next.js App Router deployed on Vercel</li>
                <li>Live server-side Gemini 3.8 Flash integration</li>
                <li>In-memory data provider repository abstraction</li>
                <li>Lightweight zero-API-key vector India map</li>
                <li>Synthetic demonstration dataset of 105+ reports</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-lg border border-blue-200 space-y-2">
              <span className="font-bold text-blue-900 block text-sm">
                Production Scale-Up (Phase 2)
              </span>
              <ul className="space-y-1 text-blue-950 list-disc list-inside">
                <li>Firebase Authentication with Aadhaar/Gov SSO</li>
                <li>Google Cloud Firestore for real-time district sync</li>
                <li>BigQuery for district-level census data correlation</li>
                <li>Google Maps Platform for centimeter-level geocoding</li>
                <li>Bhashini/Google Cloud Speech-to-Text integration</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white text-sm">JanPulse AI</span>
            <span className="mx-2 text-slate-600">·</span>
            <span>Digital Public Infrastructure Whitepaper</span>
          </div>
          <Link href="/dashboard" className="text-blue-400 hover:text-white transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </footer>
    </div>
  );
}
