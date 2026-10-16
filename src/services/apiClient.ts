import type { ApiErrorResponse } from '../types/api';

// Use empty BASE_URL in development so requests route through Vite proxy (/api) avoiding CORS errors
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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

// In-memory token storage (Do NOT store tokens or user secrets in localStorage)
let inMemoryToken: string | null = null;

// Purge any legacy localStorage keys from prior versions
try {
  localStorage.removeItem('electro_auth_token');
  localStorage.removeItem('electro_cart_items');
  localStorage.removeItem('electro_favorites');
  localStorage.removeItem('electro_wishlist');
} catch {
  // Ignore storage access errors in restricted browser contexts
}

export const tokenStorage = {
  get: (): string | null => inMemoryToken,
  set: (token: string): void => {
    inMemoryToken = token;
  },
  remove: (): void => {
    inMemoryToken = null;
    try {
      localStorage.removeItem('electro_auth_token');
    } catch {
      // Ignore storage errors
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

  // Attach Authorization header if in-memory token is available
  const token = tokenStorage.get();
  if (token) {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...customConfig,
      headers: reqHeaders,
      // Credentials 'include' ensures HttpOnly session cookies are transmitted on all requests
      credentials: 'include',
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
      // If 401 Unauthorized, remove in-memory token
      if (response.status === 401) {
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
