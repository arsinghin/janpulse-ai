import { GoogleGenAI } from '@google/genai';

/**
 * Server-side centralized Gemini Client & Resilient Execution Layer
 *
 * CRITICAL SECURITY:
 * Never import or use this module in client components or browser bundles.
 * process.env.GEMINI_API_KEY is accessed exclusively on the server.
 */

export function getGeminiModelName(): string {
  return process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';
}

export function getGeminiFallbackModelName(): string {
  return process.env.GEMINI_FALLBACK_MODEL?.trim() || 'gemini-3.6-flash';
}

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new GeminiApiFailure(
      'GEMINI_CONFIG_ERROR',
      'Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable on the server.',
      401,
      false
    );
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export type GeminiErrorCategory =
  | 'BAD_REQUEST'       // 400
  | 'AUTH'              // 401
  | 'PERMISSION'        // 403
  | 'MODEL_NOT_FOUND'   // 404
  | 'RATE_LIMIT'        // 429
  | 'INTERNAL'          // 500
  | 'UNAVAILABLE'       // 503
  | 'TIMEOUT'           // 504
  | 'UNKNOWN';

export interface ClassifiedGeminiError {
  statusCode: number;
  category: GeminiErrorCategory;
  isTransient: boolean;
  message: string;
  userFacingMessage: string;
}

export class GeminiApiFailure extends Error {
  code: string;
  statusCode: number;
  retryable: boolean;
  isTransient: boolean;

  constructor(
    code: string,
    message: string,
    statusCode: number = 500,
    retryable: boolean = true
  ) {
    super(message);
    this.name = 'GeminiApiFailure';
    this.code = code;
    this.statusCode = statusCode;
    this.retryable = retryable;
    this.isTransient = [500, 503, 504].includes(statusCode);
  }
}

/**
 * Classifies any error thrown by Gemini SDK or network
 */
export function classifyGeminiError(error: unknown): ClassifiedGeminiError {
  if (error instanceof GeminiApiFailure) {
    return {
      statusCode: error.statusCode,
      category: error.statusCode === 503 ? 'UNAVAILABLE' : error.statusCode === 429 ? 'RATE_LIMIT' : 'UNKNOWN',
      isTransient: error.isTransient,
      message: error.message,
      userFacingMessage: error.message,
    };
  }

  let statusCode = 500;
  let rawMsg = '';

  if (typeof error === 'object' && error !== null) {
    const errObj = error as Record<string, any>;
    if (typeof errObj.status === 'number') statusCode = errObj.status;
    else if (typeof errObj.code === 'number') statusCode = errObj.code;
    else if (typeof errObj.statusCode === 'number') statusCode = errObj.statusCode;

    rawMsg = errObj.message || (typeof errObj.toString === 'function' ? errObj.toString() : '');

    // Check if error message itself is a JSON string containing code
    if (typeof rawMsg === 'string' && rawMsg.includes('"code":')) {
      try {
        const parsed = JSON.parse(rawMsg);
        if (parsed?.error?.code) statusCode = Number(parsed.error.code);
        if (parsed?.error?.message) rawMsg = parsed.error.message;
      } catch {
        // Fallback regex extraction
        const match = rawMsg.match(/"code"\s*:\s*(\d+)/);
        if (match) statusCode = parseInt(match[1], 10);
      }
    }
  } else if (typeof error === 'string') {
    rawMsg = error;
  }

  const lowerMsg = rawMsg.toLowerCase();

  // Pattern detection for status code & categories
  if (statusCode === 503 || lowerMsg.includes('503') || lowerMsg.includes('unavailable') || lowerMsg.includes('high demand') || lowerMsg.includes('overloaded')) {
    return {
      statusCode: 503,
      category: 'UNAVAILABLE',
      isTransient: true,
      message: rawMsg || 'Model currently experiencing high demand',
      userFacingMessage: 'Gemini is temporarily unavailable due to high model demand. Please try again.',
    };
  }

  if (statusCode === 504 || lowerMsg.includes('504') || lowerMsg.includes('deadline exceeded') || lowerMsg.includes('timed out')) {
    return {
      statusCode: 504,
      category: 'TIMEOUT',
      isTransient: true,
      message: rawMsg || 'Gateway timeout contacting Gemini service',
      userFacingMessage: 'Gemini request timed out. Please try again.',
    };
  }

  if (statusCode === 429 || lowerMsg.includes('429') || lowerMsg.includes('quota') || lowerMsg.includes('rate limit') || lowerMsg.includes('resource_exhausted')) {
    return {
      statusCode: 429,
      category: 'RATE_LIMIT',
      isTransient: false,
      message: rawMsg || 'Quota or rate limit reached',
      userFacingMessage: 'Gemini request rate limit reached. Please wait a moment before trying again.',
    };
  }

  if (statusCode === 401 || lowerMsg.includes('401') || lowerMsg.includes('unauthenticated') || lowerMsg.includes('api_key_invalid') || lowerMsg.includes('api key not valid')) {
    return {
      statusCode: 401,
      category: 'AUTH',
      isTransient: false,
      message: rawMsg || 'Invalid Gemini API key',
      userFacingMessage: 'Gemini API key is invalid or missing. Please configure GEMINI_API_KEY in server secrets.',
    };
  }

  if (statusCode === 403 || lowerMsg.includes('403') || lowerMsg.includes('permission_denied')) {
    return {
      statusCode: 403,
      category: 'PERMISSION',
      isTransient: false,
      message: rawMsg || 'Permission denied for Gemini model',
      userFacingMessage: 'Permission denied to access this Gemini model with the supplied API key.',
    };
  }

  if (statusCode === 404 || lowerMsg.includes('404') || lowerMsg.includes('not found')) {
    return {
      statusCode: 404,
      category: 'MODEL_NOT_FOUND',
      isTransient: true, // Can attempt fallback model!
      message: rawMsg || 'Model not found',
      userFacingMessage: 'The selected Gemini model is unavailable.',
    };
  }

  if (statusCode === 400 || lowerMsg.includes('400') || lowerMsg.includes('invalid argument')) {
    return {
      statusCode: 400,
      category: 'BAD_REQUEST',
      isTransient: false,
      message: rawMsg || 'Invalid request payload',
      userFacingMessage: 'Invalid complaint analysis request payload.',
    };
  }

  if (statusCode >= 500) {
    return {
      statusCode: 500,
      category: 'INTERNAL',
      isTransient: true,
      message: rawMsg || 'Gemini internal server error',
      userFacingMessage: 'Gemini experienced an internal error. Please try again.',
    };
  }

  return {
    statusCode: 500,
    category: 'UNKNOWN',
    isTransient: true,
    message: rawMsg || 'Unknown error occurred contacting Gemini',
    userFacingMessage: 'Gemini analysis could not be completed. Please try again.',
  };
}

/**
 * Promise timeout helper
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 18000,
  operationName: string = 'Gemini API call'
): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(
        new GeminiApiFailure(
          'GEMINI_TIMEOUT',
          `${operationName} timed out after ${timeoutMs}ms`,
          504,
          true
        )
      );
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ResilientExecutionResult<T> {
  result: T;
  source: 'gemini' | 'gemini-fallback';
}

/**
 * Resilient execution wrapper:
 * 1. Tries primary model up to 3 attempts with exponential backoff + jitter for transient failures (503, 500, 504).
 * 2. If primary model fails after 3 attempts, switches to GEMINI_FALLBACK_MODEL and attempts once.
 * 3. Throws GeminiApiFailure if all resilient attempts fail.
 */
export async function executeGeminiWithRetryAndFallback<T>(
  operation: (model: string) => Promise<T>,
  operationDescription: string = 'Gemini analysis'
): Promise<ResilientExecutionResult<T>> {
  const primaryModel = getGeminiModelName();
  const fallbackModel = getGeminiFallbackModelName();

  const MAX_PRIMARY_ATTEMPTS = 3;
  let lastClassified: ClassifiedGeminiError | null = null;

  // 1. Attempt Primary Model with Exponential Backoff
  for (let attempt = 1; attempt <= MAX_PRIMARY_ATTEMPTS; attempt++) {
    try {
      const result = await withTimeout(
        operation(primaryModel),
        18000,
        `${operationDescription} (${primaryModel} attempt ${attempt})`
      );
      return { result, source: 'gemini' };
    } catch (err: unknown) {
      lastClassified = classifyGeminiError(err);

      // Do NOT retry permanent errors (e.g. invalid auth, bad request)
      if (!lastClassified.isTransient) {
        console.error(
          `Gemini permanent error [${lastClassified.statusCode} - ${lastClassified.category}]: ${lastClassified.message}`
        );
        throw new GeminiApiFailure(
          lastClassified.category === 'RATE_LIMIT' ? 'GEMINI_RATE_LIMIT' : 'GEMINI_CONFIG_ERROR',
          lastClassified.userFacingMessage,
          lastClassified.statusCode,
          false
        );
      }

      // If transient and we have attempts remaining on primary model:
      if (attempt < MAX_PRIMARY_ATTEMPTS) {
        // Exponential backoff target: ~1-2s (attempt 1), ~2-4s (attempt 2)
        const baseDelayMs = attempt === 1 ? 1200 : 2500;
        const jitterMs = Math.floor(Math.random() * (attempt === 1 ? 600 : 1200));
        const delayMs = baseDelayMs + jitterMs;

        console.warn(
          `Gemini primary model [${primaryModel}] returned ${lastClassified.statusCode}; retrying attempt ${attempt + 1}/${MAX_PRIMARY_ATTEMPTS} after ${delayMs}ms`
        );
        await sleep(delayMs);
      } else {
        console.warn(
          `Gemini primary model [${primaryModel}] returned ${lastClassified.statusCode}; exhausted ${MAX_PRIMARY_ATTEMPTS} attempts. Attempting fallback model [${fallbackModel}]...`
        );
      }
    }
  }

  // 2. Attempt Fallback Model (once)
  if (fallbackModel && fallbackModel !== primaryModel) {
    try {
      const result = await withTimeout(
        operation(fallbackModel),
        18000,
        `${operationDescription} (fallback ${fallbackModel})`
      );
      console.info(`Gemini fallback model [${fallbackModel}] succeeded.`);
      return { result, source: 'gemini-fallback' };
    } catch (err: unknown) {
      lastClassified = classifyGeminiError(err);
      console.warn(
        `Gemini fallback model [${fallbackModel}] also failed with status ${lastClassified.statusCode} (${lastClassified.category}).`
      );
    }
  }

  // 3. Both models failed
  const finalStatus = lastClassified?.statusCode || 503;
  const finalCode =
    finalStatus === 429
      ? 'GEMINI_RATE_LIMIT'
      : finalStatus === 401
      ? 'GEMINI_CONFIG_ERROR'
      : 'GEMINI_TEMPORARILY_UNAVAILABLE';

  const finalMsg =
    lastClassified?.userFacingMessage ||
    'Gemini is temporarily unavailable. Please try again.';

  throw new GeminiApiFailure(finalCode, finalMsg, finalStatus, true);
}
