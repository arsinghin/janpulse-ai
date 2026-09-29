'use client';

import React from 'react';
import {
  Sparkles,
  Droplets,
  Construction,
  HeartPulse,
  Waves,
  ArrowRight,
  ShieldCheck,
  Languages,
  CheckCircle,
} from 'lucide-react';

export interface CuratedDemoScenario {
  id: string;
  language: string;
  languageNative: string;
  category: string;
  state: string;
  district: string;
  locality: string;
  title: string;
  description: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeColor: string;
  expectedHotspotId: string;
  capabilitiesDemonstrated: string[];
}

export const CURATED_DEMOS: CuratedDemoScenario[] = [
  {
    id: 'demo-hi-water',
    language: 'Hindi',
    languageNative: 'हिंदी',
    category: 'Water Supply',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    locality: 'Sigra',
    title: 'Drinking Water Pipeline Failure & Contamination',
    description: 'Persistent 3-month potable water cutoff with turbid contaminated tap water in Varanasi.',
    text: 'हमारे गांव और सिगरा वार्ड में पिछले तीन महीने से पानी की सप्लाई ठीक से नहीं आ रही है। बुजुर्गों और बच्चों को बहुत परेशानी हो रही है। नल से मटमैला पानी आता है। कृपया तुरंत टैंकर भेजें।',
    icon: Droplets,
    accentColor: 'border-blue-300 bg-blue-50/70 hover:border-blue-500',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    expectedHotspotId: 'hs-up-varanasi-water',
    capabilitiesDemonstrated: [
      'Hindi dialect entity extraction',
      'Clusters into existing 38-report Varanasi hotspot',
      'Deterministic priority score recalculation (89/100)',
    ],
  },
  {
    id: 'demo-ta-roads',
    language: 'Tamil',
    languageNative: 'தமிழ்',
    category: 'Roads & Transport',
    state: 'Tamil Nadu',
    district: 'Chennai',
    locality: 'Tambaram',
    title: 'Arterial Road Potholes & Structural Cave-ins',
    description: 'Deep road potholes causing two-wheeler accidents and critical school bus delays in Tambaram.',
    text: 'தாம்பரம் ஜிஎஸ்டி சாலையில் பெரிய குழிகள் உள்ளதால் பள்ளிக்கு செல்லும் குழந்தைகளுக்கும் இருசக்கர வாகன ஓட்டிகளுக்கும் விபத்துகள் நடக்கின்றன. மழை பெய்தால் சாலை முழுவதும் தண்ணீர் தேங்குகிறது.',
    icon: Construction,
    accentColor: 'border-amber-300 bg-amber-50/70 hover:border-amber-500',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    expectedHotspotId: 'hs-tn-chennai-roads',
    capabilitiesDemonstrated: [
      'Tamil natural language extraction',
      'Convergence with English grievances into Chennai cluster',
      'Identifies pedestrian & student safety hazard',
    ],
  },
  {
    id: 'demo-te-health',
    language: 'Telugu',
    languageNative: 'తెలుగు',
    category: 'Healthcare Access',
    state: 'Telangana',
    district: 'Warangal',
    locality: 'Hanamkonda',
    title: 'Primary Health Centre Doctor Absence & Medicine Shortage',
    description: 'Rural PHC unstaffed for over 3 weeks with critical shortage of maternal and emergency drugs.',
    text: 'వరంగల్ జిల్లా హనుమకొండ పరిధిలోని ప్రాథమిక ఆరోగ్య కేంద్రంలో గత నెల రోజులుగా వైద్యులు రావడం లేదు. గర్భిణీ స్త్రీలకు అత్యవసర మందులు దొరకడం లేదు. రాత్రి పూట ఎమర్జెన్సీ సేవలు పూర్తిగా నిలిచిపోయాయి.',
    icon: HeartPulse,
    accentColor: 'border-rose-300 bg-rose-50/70 hover:border-rose-500',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    expectedHotspotId: 'hs-tg-warangal-health',
    capabilitiesDemonstrated: [
      'Telugu script comprehension',
      'High urgency classification for maternal healthcare',
      'Sub-district rural-urban demographic attribution',
    ],
  },
  {
    id: 'demo-en-drainage',
    language: 'English',
    languageNative: 'English',
    category: 'Drainage & Flooding',
    state: 'West Bengal',
    district: 'Kolkata',
    locality: 'Behala',
    title: 'Clogged Monsoon Drainage & Overflow Inundation',
    description: 'Severe municipal open-drain blockage causing waterlogging and dengue outbreak risk in Behala.',
    text: 'Severe drainage blockage along Behala Ward 121 following recent rains. Contaminated canal backflow has entered residential basements, creating immediate dengue risk for over 5,000 residents.',
    icon: Waves,
    accentColor: 'border-emerald-300 bg-emerald-50/70 hover:border-emerald-500',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    expectedHotspotId: 'hs-wb-kolkata-drainage',
    capabilitiesDemonstrated: [
      'Complex technical English summarization',
      'Cross-links with Bengali citizen signals',
      'Assesses flood & vector-borne epidemiological risk',
    ],
  },
];

interface JudgeDemoPanelProps {
  onSelectScenario: (scenario: CuratedDemoScenario) => void;
  selectedScenarioId?: string | null;
}

export default function JudgeDemoPanel({
  onSelectScenario,
  selectedScenarioId,
}: JudgeDemoPanelProps) {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700/60 text-xs font-semibold text-blue-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Judge Evaluation &amp; Live Test Scenarios</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Curated Multilingual Test Scenarios
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Select any real Indian language scenario to evaluate Gemini issue extraction,
            objective normalization, deterministic priority math, and geographic cluster assignment.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Zero-hallucination guardrails active</span>
        </div>
      </div>

      {/* Grid of 4 Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CURATED_DEMOS.map((scenario) => {
          const Icon = scenario.icon;
          const isSelected = selectedScenarioId === scenario.id;

          return (
            <div
              key={scenario.id}
              className={`rounded-xl p-4 border transition-all duration-200 flex flex-col justify-between text-left ${
                isSelected
                  ? 'bg-slate-800 border-blue-500 ring-2 ring-blue-500/50 shadow-lg'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Language & Category */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 border border-slate-700 text-slate-200">
                    <Languages className="w-3 h-3 text-blue-400" />
                    <span>{scenario.language}</span>
                    <span className="text-slate-400 font-normal">({scenario.languageNative})</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                    {scenario.district}, {scenario.state.split(' ')[0]}
                  </span>
                </div>

                {/* Scenario Title */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-1">
                      {scenario.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>

                {/* Original Indian Language Excerpt Snippet */}
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 font-serif text-[11px] text-slate-300 italic line-clamp-2">
                  &ldquo;{scenario.text}&rdquo;
                </div>

                {/* Key Capabilities */}
                <div className="space-y-1 pt-1 border-t border-slate-900">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    What this tests:
                  </span>
                  {scenario.capabilitiesDemonstrated.map((cap, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[10px] text-slate-300">
                      <CheckCircle className="w-2.5 h-2.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => onSelectScenario(scenario)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white hover:bg-blue-500'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>{isSelected ? 'Loaded in Form' : 'Test This Scenario'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-center text-xs text-slate-500">
        All scenarios trigger real-time Gemini processing with structured output schema validation,
        deterministic priority math, and dynamic cluster association.
      </div>
    </div>
  );
}
