import type { ApiErrorResponse } from '../types/api';

// Use empty BASE_URL in development so requests route through Vite proxy (/api) avoiding CORS errors
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const TOKEN_KEY = 'electro_auth_token';

export class ApiError extends Error {
  statusCode: number;
  errorName?: string;
  messages: string[];

  constructor(statusCode: number, message: string | string[], errorName?: string) {
    const formattedMsg = Array.isArray(message) ? message.join(', ') : message;
    super(formattedMsg);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorName = errorName;
    this.messages = Array.isArray(message) ? message : [message];
  }
}

export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error('Failed to save auth token to localStorage', e);
    }
  },
  remove: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error('Failed to remove auth token from localStorage', e);
    }
  },
};

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  requiresAuth?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, requiresAuth = false, headers = {}, ...customConfig } = options;

  let url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const reqHeaders: Record<string, string> = {
    'Accept': 'application/json',
    ...(headers as Record<string, string>),
  };

  // If body is JSON and not FormData, set Content-Type
  if (customConfig.body && !(customConfig.body instanceof FormData) && !reqHeaders['Content-Type']) {
    reqHeaders['Content-Type'] = 'application/json';
  }

  // Token handling
  const token = tokenStorage.get();
  if (token) {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  } else if (requiresAuth) {
    throw new ApiError(401, 'Please sign in to complete this action', 'Unauthorized');
  }

  try {
    const response = await fetch(url, {
      ...customConfig,
      headers: reqHeaders,
    });

    // 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get('content-type');
    let data: any = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      // If 401 Unauthorized, and we had a token, remove it
      if (response.status === 401 && token) {
        tokenStorage.remove();
      }

      const errData = data as ApiErrorResponse;
      const errorMsg = errData?.message || response.statusText || 'An unexpected error occurred';
      throw new ApiError(response.status, errorMsg, errData?.error);
    }

    return data as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(0, err.message || 'Network connection failed. Please verify your internet connection.');
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
