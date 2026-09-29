/**
 * Safe API client utility for resilient client-side requests
 *
 * Protects against unexpected HTML error responses (502/504 gateway timeouts, 500 errors)
 * that cause "SyntaxError: Unexpected token '<', '<!doctype '... is not valid JSON".
 */

export interface SafeFetchResponse<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
  isJson: boolean;
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<SafeFetchResponse<T>> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        const json = await res.json();
        return {
          ok: res.ok,
          status: res.status,
          data: json,
          error: res.ok
            ? undefined
            : (json?.message || json?.error || `Server returned error (${res.status})`),
          isJson: true,
        };
      } catch {
        return {
          ok: false,
          status: res.status,
          data: null,
          error: 'Received invalid JSON response from server.',
          isJson: false,
        };
      }
    }

    // Response is not JSON (e.g. <!doctype html> from a reverse proxy 504 / 502 / 500)
    let errorMessage = `Server returned status ${res.status}.`;
    if (res.status === 504 || res.status === 502) {
      errorMessage = 'The request timed out or the AI service took longer than expected. Please try again.';
    } else if (res.status === 429) {
      errorMessage = 'AI service rate limit reached. Please wait a few moments before trying again.';
    } else if (res.status === 503) {
      errorMessage = 'AI service is temporarily experiencing high demand. Please try again.';
    }

    return {
      ok: false,
      status: res.status,
      data: null,
      error: errorMessage,
      isJson: false,
    };
  } catch (netErr: any) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: netErr?.message || 'Network connection failed. Please verify your connection.',
      isJson: false,
    };
  }
}
