import { NextRequest, NextResponse } from 'next/server';
import {
  getGeminiClient,
  executeGeminiWithRetryAndFallback,
  classifyGeminiError,
  GeminiApiFailure,
} from '@/lib/ai/gemini';
import { ACTION_BRIEF_SYSTEM_PROMPT, buildActionBriefPrompt } from '@/lib/ai/prompts';
import { ACTION_BRIEF_SCHEMA } from '@/lib/ai/schemas';
import { memoryCache } from '@/lib/ai/cache';
import { demoDataProvider } from '@/lib/data/data-provider';
import { ActionBrief, ActionBriefSignal, InfrastructureHotspot, CitizenReport } from '@/lib/types';
import { generateFallbackActionBrief } from '@/lib/data/demo-analysis';

export async function POST(req: NextRequest) {
  let hotspot: InfrastructureHotspot | null = null;
  let linkedReports: CitizenReport[] = [];

  try {
    const body = await req.json();
    const { hotspotId } = body;

    if (!hotspotId || typeof hotspotId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'INVALID_REQUEST', message: 'Hotspot ID is required.', retryable: false },
        { status: 400 }
      );
    }

    // 1. Fetch Hotspot and Linked Reports
    hotspot = await demoDataProvider.getHotspotById(hotspotId);
    if (!hotspot) {
      return NextResponse.json(
        { success: false, error: 'NOT_FOUND', message: `Hotspot with ID '${hotspotId}' not found.`, retryable: false },
        { status: 404 }
      );
    }

    // Check Cache
    const cachedBrief = memoryCache.getActionBrief(hotspotId);
    if (cachedBrief) {
      return NextResponse.json({
        success: true,
        brief: cachedBrief,
        cached: true,
        source: 'cache',
      });
    }

    const allReports = await demoDataProvider.getReports();
    linkedReports = allReports.filter(
      (r) => r.clusterId === hotspot!.id || hotspot!.reportIds.includes(r.id)
    );

    // 2. Call Gemini for Action Brief with resilient retry and fallback
    const prompt = buildActionBriefPrompt(hotspot, linkedReports);

    const { result: response, source } = await executeGeminiWithRetryAndFallback(async (model) => {
      const ai = getGeminiClient();
      return await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: ACTION_BRIEF_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: ACTION_BRIEF_SCHEMA,
          temperature: 0.2,
        },
      });
    }, 'Action Brief synthesis');

    const rawJson = response.text?.trim();
    if (!rawJson) {
      throw new GeminiApiFailure(
        'GEMINI_EMPTY_RESPONSE',
        'Gemini returned an empty Action Brief. Please try again.',
        500,
        true
      );
    }

    const parsedData = JSON.parse(rawJson);

    // Prepare representative signal summaries
    const citizenSignalSummary: ActionBriefSignal[] = linkedReports.slice(0, 6).map((r) => ({
      id: r.id,
      language: r.language,
      originalSnippet: r.text.length > 180 ? `${r.text.slice(0, 180)}...` : r.text,
      interpretation: r.normalizedText || r.englishSummary || 'Infrastructure report logged.',
      locality: r.locality || hotspot!.district,
    }));

    const brief: ActionBrief = {
      id: `brief-${hotspot!.id}-${Date.now().toString().slice(-4)}`,
      hotspotId: hotspot!.id,
      title: parsedData.title || `Action Brief: ${hotspot!.title}`,
      generatedAt: new Date().toISOString(),
      modelUsed: source === 'gemini-fallback' ? 'gemini-fallback' : 'gemini-3.8-flash',
      executiveSummary: parsedData.executiveSummary,
      problemStatement: parsedData.problemStatement,
      evidenceSummary: parsedData.evidenceSummary,
      affectedPopulationAnalysis: parsedData.affectedPopulationAnalysis,
      geographicScope: parsedData.geographicScope,
      observedTrend: parsedData.observedTrend,
      citizenSignalSummary,
      potentialInterventionAreas: parsedData.potentialInterventionAreas || [],
      suggestedNextSteps: parsedData.suggestedNextSteps || [],
      dataLimitations: parsedData.dataLimitations || [
        'Analysis based on prototype crowdsourced citizen signals without in-person PWD engineer measurements.',
        'Population estimates are statistical proxies, not official census counts.',
      ],
      confidenceAndUncertainty:
        parsedData.confidenceAndUncertainty ||
        'Moderate-to-high confidence in spatial clustering. Field sensor/physical audit advised prior to capital expenditure.',
    };

    // Cache the brief
    memoryCache.setActionBrief(hotspot.id, brief);

    return NextResponse.json({
      success: true,
      brief,
      cached: false,
      source,
    });
  } catch (error: unknown) {
    const classified = classifyGeminiError(error);
    console.error(
      `Gemini Action Brief failure [${classified.statusCode} - ${classified.category}]: ${classified.message}`
    );

    // If hotspot was resolved, return a structured fallback Action Brief
    // so municipal review and prototype demonstration remain fully functional.
    if (hotspot) {
      console.warn(
        `Serving structured fallback Action Brief for hotspot '${hotspot.id}' due to Gemini API status ${classified.statusCode}.`
      );
      const fallbackBrief = generateFallbackActionBrief(hotspot, linkedReports);
      memoryCache.setActionBrief(hotspot.id, fallbackBrief);

      return NextResponse.json({
        success: true,
        brief: fallbackBrief,
        cached: false,
        source: 'cached-fallback',
        warning: classified.userFacingMessage,
      });
    }

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
