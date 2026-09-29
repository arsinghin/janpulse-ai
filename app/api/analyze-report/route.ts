import { NextRequest, NextResponse } from 'next/server';
import {
  getGeminiClient,
  getGeminiModelName,
  withTimeout,
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
import { DEMO_VARANASI_FIXTURE, getDemoFixtureForInput } from '@/lib/data/demo-analysis';
import { validateAndSanitizeAIAnalysis } from '@/lib/ai/validation';

export async function POST(req: NextRequest) {
  let isDemoRequest = false;
  let trimmedText = '';
  let state = 'Uttar Pradesh';
  let district = 'Varanasi';
  let locality = '';
  let categoryHint: string | undefined = undefined;

  try {
    const body = await req.json();
    const {
      text,
      state: bodyState,
      district: bodyDistrict,
      locality: bodyLocality,
      categoryHint: bodyCategoryHint,
      isDemo = false,
    } = body;

    if (bodyState) state = bodyState;
    if (bodyDistrict) district = bodyDistrict;
    if (bodyLocality) locality = bodyLocality;
    if (bodyCategoryHint) categoryHint = bodyCategoryHint;

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

    // 2. State & Cache lookup
    const cacheKey = simpleHash(`${trimmedText}_${state}_${district}_${categoryHint || ''}`);
    let analysis: AIReportAnalysis | null = memoryCache.getReportAnalysis(cacheKey);
    let executionSource: 'gemini' | 'gemini-fallback' = 'gemini';

    // 3. Demo Mode Fast Path:
    // If running in demo mode, prioritize speed. Try a quick 5-second Gemini call;
    // if that fails, times out, or hits rate limits, immediately return the pre-seeded Varanasi demonstration fixture.
    if (isDemoRequest) {
      let demoLiveSucceeded = false;
      try {
        const prompt = buildCitizenAnalysisPrompt({
          text: trimmedText,
          state,
          district,
          locality,
          categoryHint,
        });

        const ai = getGeminiClient();
        const fastResponse = await withTimeout(
          ai.models.generateContent({
            model: getGeminiModelName(),
            contents: prompt,
            config: {
              systemInstruction: CITIZEN_ANALYSIS_SYSTEM_PROMPT,
              responseMimeType: 'application/json',
              responseSchema: AI_REPORT_ANALYSIS_SCHEMA,
              temperature: 0.2,
            },
          }),
          5000,
          'Demo fast analysis'
        );

        const rawJson = fastResponse.text?.trim();
        if (rawJson) {
          const rawParsed = JSON.parse(rawJson);
          analysis = validateAndSanitizeAIAnalysis(rawParsed);
          executionSource = 'gemini';
          demoLiveSucceeded = true;
        }
      } catch (fastErr) {
        console.warn('Live Gemini demo attempt bypassed, serving pre-seeded Varanasi fixture:', fastErr);
      }

      if (!demoLiveSucceeded) {
        const fixture = getDemoFixtureForInput({
          text: trimmedText,
          categoryHint,
          state,
        });

        return NextResponse.json({
          success: true,
          analysis: fixture.analysis,
          report: {
            id: `rep-demo-${Date.now().toString().slice(-4)}`,
            text: trimmedText,
            language: fixture.analysis.detectedLanguage,
            state: fixture.hotspot.state,
            district: fixture.hotspot.district,
            locality: fixture.hotspot.localities[0] || locality || 'District Ward',
            coordinates: fixture.hotspot.coordinates,
            timestamp: new Date().toISOString(),
            category: fixture.analysis.category,
            urgency: fixture.analysis.urgency,
            affectedGroup: fixture.analysis.affectedGroup,
            estimatedPopulation:
              fixture.analysis.estimatedAffectedPopulation || fixture.hotspot.estimatedAffectedPopulation,
            status: 'Clustered',
            clusterId: fixture.hotspot.id,
            normalizedText: fixture.analysis.normalizedText,
            englishSummary: fixture.analysis.englishSummary,
            requestedAction: fixture.analysis.requestedAction,
            aiConfidence: fixture.analysis.confidence,
            keywords: fixture.analysis.keywords,
            isSynthetic: true,
          },
          relatedReports: fixture.relatedReports,
          hotspot: fixture.hotspot,
          priority: fixture.priority,
          source: 'cached-demo',
          warning: 'Gemini is temporarily unavailable. Showing cached prototype analysis.',
        });
      }
    }

    if (!analysis) {
      // 4. Resilient Call to Gemini with retries and model fallback
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

      const rawParsed = JSON.parse(rawJson);
      analysis = validateAndSanitizeAIAnalysis(rawParsed);

      // Cache the result
      memoryCache.setReportAnalysis(cacheKey, analysis);
    }

    // 4. Coordinates lookup
    const coords = findDistrictCoordinates(state, district);

    // 5. Build CitizenReport with deterministic coordinates offset
    const reportId = `rep-live-${Date.now().toString().slice(-6)}`;
    const hashStr = simpleHash(trimmedText + (locality || ''));
    const numVal = hashStr.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const deterministicOffset = ((numVal % 100) - 50) * 0.0002;

    const newReport: CitizenReport = {
      id: reportId,
      text: trimmedText,
      language: analysis.detectedLanguage || 'Hindi',
      state,
      district,
      locality: locality || analysis.locationMentioned || 'District Ward',
      coordinates: {
        lat: Number((coords.lat + deterministicOffset).toFixed(4)),
        lng: Number((coords.lng + deterministicOffset).toFixed(4)),
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

    // Fetch refreshed hotspot reflecting newly aggregated report count & score
    const updatedHotspot = (await demoDataProvider.getHotspotById(hotspot.id)) || hotspot;

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
      hotspot: updatedHotspot,
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
        'Demo mode resilience active: Gemini unavailable after retries, serving pre-seeded curated demonstration analysis.'
      );

      const fixture = getDemoFixtureForInput({
        text: trimmedText,
        categoryHint,
        state,
      });

      const demoReport: CitizenReport = {
        id: `rep-demo-${Date.now().toString().slice(-4)}`,
        text: trimmedText || 'Sample citizen infrastructure grievance',
        language: fixture.analysis.detectedLanguage,
        state: fixture.hotspot.state,
        district: fixture.hotspot.district,
        locality: fixture.hotspot.localities[0] || locality || 'District Ward',
        coordinates: fixture.hotspot.coordinates,
        timestamp: new Date().toISOString(),
        category: fixture.analysis.category,
        urgency: fixture.analysis.urgency,
        affectedGroup: fixture.analysis.affectedGroup,
        estimatedPopulation:
          fixture.analysis.estimatedAffectedPopulation || fixture.hotspot.estimatedAffectedPopulation,
        status: 'Clustered',
        clusterId: fixture.hotspot.id,
        normalizedText: fixture.analysis.normalizedText,
        englishSummary: fixture.analysis.englishSummary,
        requestedAction: fixture.analysis.requestedAction,
        aiConfidence: fixture.analysis.confidence,
        keywords: fixture.analysis.keywords,
        isSynthetic: true,
      };

      return NextResponse.json({
        success: true,
        analysis: fixture.analysis,
        report: demoReport,
        relatedReports: fixture.relatedReports,
        hotspot: fixture.hotspot,
        priority: fixture.priority,
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
