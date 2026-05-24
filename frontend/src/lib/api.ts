const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  message?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function getApiUrl(): string {
  if (!API_URL) {
    throw new ApiError('Frontend API URL is not configured.', 500);
  }

  return API_URL.replace(/\/+$/, '');
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const rawBody = await response.text();
  const parsedBody = rawBody
    ? (JSON.parse(rawBody) as ApiSuccessResponse<T> | ApiErrorResponse)
    : null;

  if (!response.ok) {
    const message =
      parsedBody && 'message' in parsedBody && parsedBody.message
        ? parsedBody.message
        : 'Request failed.';

    throw new ApiError(message, response.status, parsedBody);
  }

  if (!parsedBody || !('success' in parsedBody) || !parsedBody.success) {
    throw new ApiError('Invalid API response.', response.status, parsedBody);
  }

  return parsedBody.data;
}
