'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Send,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  MapPin,
  Clock,
  ShieldAlert,
  Users,
  Compass,
  FileSpreadsheet,
} from 'lucide-react';
import { INDIAN_LOCATIONS, DEFAULT_FALLBACK_LOCATION } from '@/lib/data/indian-locations';
import { AIReportAnalysis, CitizenReport, InfrastructureHotspot, IssueCategory, PriorityBreakdown } from '@/lib/types';
import { safeFetchJson } from '@/lib/utils/api-client';

const CATEGORIES: IssueCategory[] = [
  'Water Supply',
  'Roads & Transport',
  'Electricity',
  'Sanitation & Waste',
  'Healthcare Access',
  'Public Safety',
  'Education',
  'Drainage & Flooding',
  'Digital Connectivity',
  'Public Transport',
];

interface SamplePrompt {
  label: string;
  lang: string;
  state: string;
  district: string;
  locality: string;
  text: string;
}

const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    label: 'Hindi (Water Shortage)',
    lang: 'Hindi',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    locality: 'Sigra',
    text: 'हमारे गांव और सिगरा वार्ड में पिछले तीन महीने से पानी की सप्लाई ठीक से नहीं आ रही है। बुजुर्गों और बच्चों को बहुत परेशानी हो रही है। नल से मटमैला पानी आता है।',
  },
  {
    label: 'Tamil (Potholed Roads)',
    lang: 'Tamil',
    state: 'Tamil Nadu',
    district: 'Chennai',
    locality: 'Tambaram',
    text: 'எங்கள் பகுதியில் சாலையில் பெரிய குழிகள் உள்ளதால் பள்ளிக்கு செல்லும் குழந்தைகளுக்கு மிகவும் சிரமமாக உள்ளது. மழை பெய்தால் விபத்துகள் நடக்கின்றன.',
  },
  {
    label: 'Telugu (PHC Medicines)',
    lang: 'Telugu',
    state: 'Telangana',
    district: 'Warangal',
    locality: 'Hanamkonda',
    text: 'మా ప్రాంతంలోని ప్రభుత్వ ఆరోగ్య కేంద్రంలో తరచుగా మందులు అందుబాటులో ఉండటం లేదు. గర్భిణీ స్త్రీలకు ఐరన్ మాత్రలు కూడా దొరకడం లేదు.',
  },
  {
    label: 'English (Highway Crater)',
    lang: 'English',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    locality: 'Assi Ghat Ward',
    text: 'The main road connecting our locality to the district hospital has several large potholes and structural sinkholes, causing critical ambulance delays during rain.',
  },
  {
    label: 'Marathi (Garbage Hazard)',
    lang: 'Marathi',
    state: 'Maharashtra',
    district: 'Pune',
    locality: 'Hadapsar',
    text: 'आमच्या परिसरातील कचरा वेळेवर उचलला जात नाही, त्यामुळे आरोग्याचा गंभीर प्रश्न निर्माण झाला आहे. रात्री उघड्या कचऱ्याला आग लावल्याने विषारी धूर पसरतो.',
  },
  {
    label: 'Bengali (Power Outage)',
    lang: 'Bengali',
    state: 'West Bengal',
    district: 'Kolkata',
    locality: 'Behala',
    text: 'আমাদের এলাকায় গত দুই সপ্তাহ ধরে বিদ্যুতের তীব্র বিভ্রাট চলছে, যার ফলে পানীয় জলের পাম্প কাজ করছে না এবং ছাত্রছাত্রীদের পড়াশোনায় ক্ষতি হচ্ছে।',
  },
];

export interface CitizenReportFormProps {
  initialPrompt?: {
    text: string;
    state: string;
    district: string;
    locality: string;
    categoryHint?: string;
  } | null;
}

export default function CitizenReportForm({ initialPrompt }: CitizenReportFormProps = {}) {
  const [activeTab, setActiveTab] = useState<'text' | 'voice'>('text');
  const [complaintText, setComplaintText] = useState(initialPrompt?.text || '');
  const [selectedState, setSelectedState] = useState(initialPrompt?.state || 'Uttar Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState(initialPrompt?.district || 'Varanasi');
  const [locality, setLocality] = useState(initialPrompt?.locality || '');
  const [locationNotKnown, setLocationNotKnown] = useState(false);
  const [categoryHint, setCategoryHint] = useState<string>(initialPrompt?.categoryHint || '');

  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const speechSupported = React.useSyncExternalStore(
    () => () => {},
    () => typeof window !== 'undefined' && Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition),
    () => true
  );
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    analysis: AIReportAnalysis;
    report: CitizenReport;
    relatedReports: CitizenReport[];
    hotspot: InfrastructureHotspot;
    priority: PriorityBreakdown;
    source?: 'gemini' | 'gemini-fallback' | 'cached-demo';
    warning?: string;
  } | null>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'hi-IN'; // Default to Hindi (browser also handles others or auto)

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setComplaintText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition notice:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setSpeechError('Microphone access was denied. Please allow microphone permissions or switch to text input.');
          } else {
            setSpeechError(`Voice capture notice: ${event.error}. You can also type directly in the text tab.`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsListening(false);
      }
    }
  };

  // State & District selection sync
  const currentDistricts =
    INDIAN_LOCATIONS.find((s) => s.state === selectedState)?.districts || [];

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const newDistrictList =
      INDIAN_LOCATIONS.find((s) => s.state === newState)?.districts || [];
    if (newDistrictList.length > 0) {
      setSelectedDistrict(newDistrictList[0].name);
    }
  };

  const handleLoadSample = (sample: SamplePrompt) => {
    setComplaintText(sample.text);
    setSelectedState(sample.state);
    setSelectedDistrict(sample.district);
    setLocality(sample.locality);
    setLocationNotKnown(false);
    setCategoryHint('');
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) {
      setSubmitError('Please enter or record your grievance before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await safeFetchJson<any>('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: complaintText.trim(),
          state: locationNotKnown ? DEFAULT_FALLBACK_LOCATION.state : selectedState,
          district: locationNotKnown ? DEFAULT_FALLBACK_LOCATION.district : selectedDistrict,
          locality: locationNotKnown ? DEFAULT_FALLBACK_LOCATION.locality : locality.trim(),
          categoryHint: categoryHint || undefined,
          isDemo: Boolean(initialPrompt),
        }),
      });

      if (!result.ok || !result.data?.success) {
        throw new Error(result.data?.message || result.error || 'Gemini is temporarily unavailable. Please try again in a moment.');
      }

      const data = result.data;

      setAnalysisResult({
        analysis: data.analysis,
        report: data.report,
        relatedReports: data.relatedReports || [],
        hotspot: data.hotspot,
        priority: data.priority,
        source: data.source || 'gemini',
        warning: data.warning,
      });

      // Smooth scroll to analysis result
      setTimeout(() => {
        const el = document.getElementById('ai-analysis-feedback');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: unknown) {
      console.error('Submission error:', err);
      let errorMsg = 'Gemini analysis could not be completed. Please try again in a moment.';
      if (err instanceof Error) {
        if (err.message.includes('"message":')) {
          try {
            const parsed = JSON.parse(err.message);
            errorMsg = parsed?.error?.message || parsed?.message || errorMsg;
          } catch {
            errorMsg = err.message;
          }
        } else {
          errorMsg = err.message;
        }
      }
      setSubmitError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="report-section" className="w-full max-w-4xl mx-auto space-y-8">
      {/* Reporting Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Card Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block mb-1">
                Citizen Input Interface
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Log a Community Infrastructure Signal
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Report public utilities, roads, drainage, water, health, or school failures in any Indian language.
              </p>
            </div>

            {/* Input Mode Selector */}
            <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('text');
                  if (isListening && recognitionRef.current) {
                    recognitionRef.current.stop();
                    setIsListening(false);
                  }
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'text'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Text Input
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('voice')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'voice'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-blue-600" />
                <span>Voice (Browser)</span>
              </button>
            </div>
          </div>

          {/* Quick Sample Prompts Bar */}
          <div className="mt-4 pt-4 border-t border-slate-200/60">
            <span className="text-xs font-medium text-slate-500 block mb-2">
              Try a quick sample in native Indian languages:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadSample(sample)}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded border border-slate-200/80 transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Voice Mode Banner */}
          {activeTab === 'voice' && (
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-blue-950 flex items-center gap-2">
                    <Mic className="w-4 h-4 text-blue-600" />
                    Browser Web Speech Recognition
                  </h4>
                  <p className="text-xs text-blue-800">
                    Click the microphone to speak your problem in Hindi, English, or your regional language.
                    Transcription happens locally in your browser before Gemini structured analysis.
                  </p>
                </div>

                {speechSupported ? (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                      isListening
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        <span>Stop Recording</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>Start Speaking</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded">
                    Web Speech API not supported in this browser
                  </span>
                )}
              </div>

              {speechError && (
                <div className="mt-3 text-xs text-amber-800 bg-amber-50 p-2.5 rounded border border-amber-200">
                  {speechError}
                </div>
              )}
            </div>
          )}

          {/* Main Textarea */}
          <div>
            <label htmlFor="complaint-text" className="block text-sm font-semibold text-slate-900 mb-1.5">
              Describe the Infrastructure Issue
            </label>
            <textarea
              id="complaint-text"
              rows={4}
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              placeholder="Describe the problem in your own language (Hindi, Tamil, Telugu, Marathi, Bengali, English, etc.)... e.g. हमारे गांव में पिछले तीन महीने से पानी की सप्लाई ठीक से नहीं आ रही है..."
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400"
              required
            />
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>Gemini will automatically detect language, translate, and extract entities.</span>
              <span>{complaintText.length} / 2500 chars</span>
            </div>
          </div>

          {/* Location Grid */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-500" />
                Administrative Location
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={locationNotKnown}
                  onChange={(e) => setLocationNotKnown(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Location not known</span>
              </label>
            </div>

            {!locationNotKnown ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* State */}
                <div>
                  <label htmlFor="select-state" className="block text-xs font-medium text-slate-700 mb-1">
                    State
                  </label>
                  <select
                    id="select-state"
                    value={selectedState}
                    onChange={handleStateChange}
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {INDIAN_LOCATIONS.map((loc) => (
                      <option key={loc.state} value={loc.state}>
                        {loc.state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label htmlFor="select-district" className="block text-xs font-medium text-slate-700 mb-1">
                    District
                  </label>
                  <select
                    id="select-district"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {currentDistricts.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Locality / Ward */}
                <div>
                  <label htmlFor="input-locality" className="block text-xs font-medium text-slate-700 mb-1">
                    Locality / Ward (Optional)
                  </label>
                  <input
                    id="input-locality"
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Ward 14, Main Bazar"
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 text-xs text-slate-600 rounded-md border border-slate-200">
                Location set as unassigned. Gemini will attempt to extract any landmark mentioned in the text.
              </div>
            )}
          </div>

          {/* Optional Category Selection */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="select-category" className="text-sm font-semibold text-slate-900">
                Infrastructure Category (Optional)
              </label>
              <span className="text-xs text-slate-500">
                Leave blank for autonomous Gemini classification
              </span>
            </div>
            <select
              id="select-category"
              value={categoryHint}
              onChange={(e) => setCategoryHint(e.target.value)}
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Let Gemini Classify Automatically --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="p-3 bg-red-50 text-xs text-red-800 rounded-md border border-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Multilingual Gemini 3.8 Intelligence</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !complaintText.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Processing with Gemini...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Citizen Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* AI Analysis Result Card (Rendered upon submission) */}
      {analysisResult && (
        <div
          id="ai-analysis-feedback"
          className="bg-white rounded-xl shadow-md border-2 border-blue-500/80 overflow-hidden transition-all"
        >
          {/* Result Card Header */}
          <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white tracking-tight">
                  {analysisResult.source === 'cached-demo'
                    ? 'Signal Ingested · Prototype Demo Baseline'
                    : 'Signal Ingested & Structured by Gemini'}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className={`px-2.5 py-0.5 rounded font-medium ${
                  analysisResult.source === 'cached-demo'
                    ? 'bg-amber-900/60 text-amber-200 border border-amber-700/60'
                    : analysisResult.source === 'gemini-fallback'
                    ? 'bg-indigo-900/60 text-indigo-200 border border-indigo-700/60'
                    : 'bg-blue-900/80 text-blue-200 border border-blue-700/60'
                }`}>
                  {analysisResult.source === 'cached-demo'
                    ? 'Prototype demo analysis · Gemini temporarily unavailable'
                    : analysisResult.source === 'gemini-fallback'
                    ? 'AI analysis · Gemini fallback model'
                    : 'AI analysis · Gemini'}
                </span>
                <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded border border-slate-700 font-mono">
                  Confidence: {Math.round(analysisResult.analysis.confidence * 100)}%
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Complaint has been normalized and linked to active municipal hotspot clusters.
            </p>
          </div>

          {/* Warning Banner when cached demo was used */}
          {(analysisResult.warning || analysisResult.source === 'cached-demo') && (
            <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="font-medium">
                {analysisResult.warning || 'Gemini is temporarily unavailable. Showing cached prototype analysis.'}
              </span>
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Top Analysis Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Detected Language</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {analysisResult.analysis.detectedLanguage}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Classified Category</span>
                <span className="font-semibold text-blue-700 text-sm">
                  {analysisResult.analysis.category}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Assessed Urgency</span>
                <span
                  className={`font-bold text-sm ${
                    analysisResult.analysis.urgency === 'Critical'
                      ? 'text-red-600'
                      : analysisResult.analysis.urgency === 'High'
                      ? 'text-amber-600'
                      : 'text-blue-600'
                  }`}
                >
                  {analysisResult.analysis.urgency}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Deterministic Priority</span>
                <span className="font-bold text-slate-900 text-sm">
                  {analysisResult.priority.overallScore} / 100
                </span>
              </div>
            </div>

            {/* Side-by-side: Original Signal vs AI Normalization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-semibold uppercase tracking-wider">Original Citizen Text</span>
                  <span>{analysisResult.analysis.detectedLanguage}</span>
                </div>
                <p className="text-sm text-slate-800 italic leading-relaxed">
                  &ldquo;{analysisResult.report.text}&rdquo;
                </p>
              </div>

              <div className="p-4 bg-blue-50/60 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between text-xs text-blue-900 mb-1.5">
                  <span className="font-semibold uppercase tracking-wider">English Normalization</span>
                  <span className="text-blue-600">AI Standardized</span>
                </div>
                <p className="text-sm text-slate-900 font-medium leading-relaxed">
                  {analysisResult.analysis.normalizedText}
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  <strong className="text-slate-700">Urgency Rationale:</strong>{' '}
                  {analysisResult.analysis.urgencyReason}
                </p>
              </div>
            </div>

            {/* Extracted Entities */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">Affected Group</span>
                <span className="font-medium text-slate-900">{analysisResult.analysis.affectedGroup}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Estimated Population</span>
                <span className="font-medium text-slate-900">
                  ~{analysisResult.analysis.estimatedAffectedPopulation?.toLocaleString() || '1,200'} citizens
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Requested Action</span>
                <span className="font-medium text-slate-900">{analysisResult.analysis.requestedAction}</span>
              </div>
            </div>

            {/* Clustered Hotspot Connection */}
            <div className="p-4 bg-slate-900 text-white rounded-lg flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider block">
                  Geospatial Hotspot Assignment
                </span>
                <h4 className="font-bold text-slate-100 text-base mt-0.5">
                  {analysisResult.hotspot.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>{analysisResult.hotspot.district}, {analysisResult.hotspot.state}</span>
                  <span aria-hidden="true">·</span>
                  <span>{analysisResult.hotspot.reportCount} total reports aggregated</span>
                  <span aria-hidden="true">·</span>
                  <span>Cluster Priority: {analysisResult.hotspot.priorityScore}/100</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/hotspots/${analysisResult.hotspot.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors"
                >
                  <span>Inspect Hotspot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/action-brief/${analysisResult.hotspot.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-md border border-slate-700 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
                  <span>Action Brief</span>
                </Link>
              </div>
            </div>

            {/* Related Reports in Same Cluster */}
            {analysisResult.relatedReports.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Related Citizen Signals in this Infrastructure Cluster
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {analysisResult.relatedReports.map((rel) => (
                    <div
                      key={rel.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1"
                    >
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>{rel.language}</span>
                        <span>{rel.locality || rel.district}</span>
                      </div>
                      <p className="text-slate-800 line-clamp-2 italic">
                        &ldquo;{rel.text}&rdquo;
                      </p>
                      <p className="text-[11px] text-blue-700 font-medium">
                        AI: {rel.englishSummary || rel.normalizedText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
