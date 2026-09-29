import { NextRequest, NextResponse } from 'next/server';
import {
  getGeminiClient,
  executeGeminiWithRetryAndFallback,
  classifyGeminiError,
  GeminiApiFailure,
} from '@/lib/ai/gemini';
import { CITIZEN_ANALYSIS_SYSTEM_PROMPT, buildCitizenAnalysisPrompt } from '@/lib/ai/prompts';
import { AI_REPORT_ANALYSIS_SCHEMA } from '@/lib/ai/schemas';
import { memoryCache, simpleHash } from '@/lib/ai/cache';
import { demoDataProvider } from '@/lib/data/data-provider';
import { assignOrCreateHotspot } from '@/lib/clustering/hotspot';
import { findDistrictCoordinates } from '@/lib/data/indian-locations';
import { calculateSingleReportScore } from '@/lib/scoring/priority';
import { AIReportAnalysis, CitizenReport, IssueCategory, UrgencyLevel } from '@/lib/types';
import { DEMO_VARANASI_FIXTURE } from '@/lib/data/demo-analysis';

export async function POST(req: NextRequest) {
  let isDemoRequest = false;
  let trimmedText = '';

  try {
    const body = await req.json();
    const {
      text,
      state = 'Uttar Pradesh',
      district = 'Varanasi',
      locality = '',
      categoryHint,
      isDemo = false,
    } = body;

    isDemoRequest = Boolean(isDemo);

    // 1. Validation & Rate/Abuse Protection
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_REQUEST',
          message: 'Complaint text is required.',
          retryable: false,
        },
        { status: 400 }
      );
    }

    trimmedText = text.trim();
    if (trimmedText.length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_REQUEST',
          message: 'Please provide more details about the infrastructure issue (at least 5 characters).',
          retryable: false,
        },
        { status: 400 }
      );
    }

    if (trimmedText.length > 2500) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_REQUEST',
          message: 'Complaint text is too long (maximum 2,500 characters).',
          retryable: false,
        },
        { status: 400 }
      );
    }

    // 2. Check Cache
    const cacheKey = simpleHash(`${trimmedText}_${state}_${district}_${categoryHint || ''}`);
    let analysis: AIReportAnalysis | null = memoryCache.getReportAnalysis(cacheKey);
    let executionSource: 'gemini' | 'gemini-fallback' = 'gemini';

    if (!analysis) {
      // 3. Resilient Call to Gemini with retries and model fallback
      const prompt = buildCitizenAnalysisPrompt({
        text: trimmedText,
        state,
        district,
        locality,
        categoryHint,
      });

      const { result: response, source } = await executeGeminiWithRetryAndFallback(async (model) => {
        const ai = getGeminiClient();
        return await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: CITIZEN_ANALYSIS_SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            responseSchema: AI_REPORT_ANALYSIS_SCHEMA,
            temperature: 0.2,
          },
        });
      }, 'Citizen complaint structuring');

      executionSource = source;

      const rawJson = response.text?.trim();
      if (!rawJson) {
        throw new GeminiApiFailure(
          'GEMINI_EMPTY_RESPONSE',
          'Gemini returned an empty response. Please try again.',
          500,
          true
        );
      }

      analysis = JSON.parse(rawJson) as AIReportAnalysis;

      // Cache the result
      memoryCache.setReportAnalysis(cacheKey, analysis);
    }

    // 4. Coordinates lookup
    const coords = findDistrictCoordinates(state, district);

    // 5. Build CitizenReport
    const reportId = `rep-live-${Date.now().toString().slice(-6)}`;
    const newReport: CitizenReport = {
      id: reportId,
      text: trimmedText,
      language: analysis.detectedLanguage || 'Hindi',
      state,
      district,
      locality: locality || analysis.locationMentioned || 'District Ward',
      coordinates: {
        lat: Number((coords.lat + (Math.random() - 0.5) * 0.02).toFixed(4)),
        lng: Number((coords.lng + (Math.random() - 0.5) * 0.02).toFixed(4)),
      },
      timestamp: new Date().toISOString(),
      category: (analysis.category as IssueCategory) || 'Water Supply',
      urgency: (analysis.urgency as UrgencyLevel) || 'Medium',
      affectedGroup: analysis.affectedGroup,
      estimatedPopulation: analysis.estimatedAffectedPopulation || 1200,
      status: 'Received',
      normalizedText: analysis.normalizedText,
      englishSummary: analysis.englishSummary,
      requestedAction: analysis.requestedAction,
      aiConfidence: analysis.confidence || 0.92,
      keywords: analysis.keywords || [],
      isSynthetic: false,
    };

    // 6. Cluster & Hotspot Assignment
    const allHotspots = await demoDataProvider.getHotspots();
    const { hotspot, isNew } = assignOrCreateHotspot(newReport, allHotspots);

    newReport.clusterId = hotspot.id;
    newReport.status = 'Clustered';

    // Persist into prototype data provider
    if (isNew) {
      await demoDataProvider.updateHotspot(hotspot);
    }
    await demoDataProvider.addReport(newReport);

    // 7. Find Similar Reports
    const relatedReports = await demoDataProvider.findSimilarReports(
      analysis.normalizedText || trimmedText,
      newReport.category,
      district
    );

    // 8. Deterministic Priority Breakdown
    const priority = calculateSingleReportScore(
      newReport.category,
      newReport.urgency,
      newReport.estimatedPopulation || 1000
    );

    return NextResponse.json({
      success: true,
      analysis,
      report: newReport,
      relatedReports: relatedReports.filter((r) => r.id !== newReport.id).slice(0, 4),
      hotspot,
      priority,
      source: executionSource, // "gemini" | "gemini-fallback"
      isNewHotspot: isNew,
    });
  } catch (error: unknown) {
    const classified = classifyGeminiError(error);
    console.error(
      `Gemini final failure [${classified.statusCode} - ${classified.category}]: ${classified.message}`
    );

    // DEMO-MODE RESILIENCE (Section 6 & 9):
    // If the failure occurred during an explicit "Run Live Demo" action, do NOT crash the demo.
    // Return pre-seeded deterministic demo fixture clearly labeled as cached prototype analysis.
    if (isDemoRequest) {
      console.warn(
        'Demo mode resilience active: Gemini unavailable after retries, serving pre-seeded Varanasi demonstration analysis.'
      );

      const demoReport: CitizenReport = {
        id: `rep-demo-${Date.now().toString().slice(-4)}`,
        text: trimmedText || 'हमारे गांव और सिगरा वार्ड में पिछले तीन महीने से पानी की सप्लाई ठीक से नहीं आ रही है...',
        language: DEMO_VARANASI_FIXTURE.analysis.detectedLanguage,
        state: 'Uttar Pradesh',
        district: 'Varanasi',
        locality: 'Sigra',
        coordinates: { lat: 25.3176, lng: 82.9739 },
        timestamp: new Date().toISOString(),
        category: DEMO_VARANASI_FIXTURE.analysis.category,
        urgency: DEMO_VARANASI_FIXTURE.analysis.urgency,
        affectedGroup: DEMO_VARANASI_FIXTURE.analysis.affectedGroup,
        estimatedPopulation: DEMO_VARANASI_FIXTURE.analysis.estimatedAffectedPopulation || 14200,
        status: 'Clustered',
        clusterId: DEMO_VARANASI_FIXTURE.hotspot.id,
        normalizedText: DEMO_VARANASI_FIXTURE.analysis.normalizedText,
        englishSummary: DEMO_VARANASI_FIXTURE.analysis.englishSummary,
        requestedAction: DEMO_VARANASI_FIXTURE.analysis.requestedAction,
        aiConfidence: DEMO_VARANASI_FIXTURE.analysis.confidence,
        keywords: DEMO_VARANASI_FIXTURE.analysis.keywords,
        isSynthetic: true,
      };

      return NextResponse.json({
        success: true,
        analysis: DEMO_VARANASI_FIXTURE.analysis,
        report: demoReport,
        relatedReports: DEMO_VARANASI_FIXTURE.relatedReports,
        hotspot: DEMO_VARANASI_FIXTURE.hotspot,
        priority: DEMO_VARANASI_FIXTURE.priority,
        source: 'cached-demo',
        warning: 'Gemini is temporarily unavailable. Showing cached prototype analysis.',
      });
    }

    // NORMAL CITIZEN SUBMISSIONS (Section 5 & 10):
    // Do NOT fake analysis for normal citizen submissions. Return structured failure JSON.
    const errorCode =
      classified.category === 'RATE_LIMIT'
        ? 'GEMINI_RATE_LIMIT'
        : classified.category === 'AUTH'
        ? 'GEMINI_CONFIG_ERROR'
        : classified.isTransient
        ? 'GEMINI_TEMPORARILY_UNAVAILABLE'
        : 'GEMINI_ERROR';

    return NextResponse.json(
      {
        success: false,
        error: errorCode,
        message: classified.userFacingMessage,
        retryable: classified.isTransient,
      },
      { status: classified.statusCode }
    );
  }
}
