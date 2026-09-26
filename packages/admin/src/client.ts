import type {
  AdminStats,
  GetStatsParams,
  FinancialsQueryParams,
  FinancialsResponse,
} from './types';

export interface AdminConfig {
  baseUrl: string;
  apiKey?: string;
  authToken?: string;
}

export class AdminApiClient {
  private baseUrl: string;
  private apiKey?: string;
  private authToken?: string;

  constructor(config: AdminConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.apiKey = config.apiKey;
    this.authToken = config.authToken;
  }

  setAuthToken(token: string | undefined) {
    this.authToken = token;
  }

  getAuthToken(): string | undefined {
    return this.authToken;
  }

  private async executeFetch(path: string, options?: RequestInit): Promise<Response> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.apiKey ? { 'x-api-key': this.apiKey } : {}),
      ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}),
      ...((options?.headers as Record<string, string> | undefined) ?? {}),
    };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || `HTTP error! Status: ${response.status}`);
    }
    return response;
  }

  private async requestAuthenticated<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await this.executeFetch(path, options);
    const payload = await response.json();
    return payload.data as T;
  }

  async getDashboard(params?: GetStatsParams): Promise<AdminStats> {
    const query = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) query.set(key, String(value));
      }
    }
    const qs = query.toString();
    return this.requestAuthenticated<AdminStats>(`/api/mobile/dashboard${qs ? `?${qs}` : ''}`);
  }

  async getFinancials(params: FinancialsQueryParams): Promise<FinancialsResponse> {
    const query = new URLSearchParams();
    query.set('type', params.type);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.year !== undefined) query.set('year', String(params.year));
    if (params.month !== undefined) query.set('month', String(params.month));
    if (params.pointOfSellId !== undefined) query.set('pointOfSellId', String(params.pointOfSellId));
    return this.requestAuthenticated<FinancialsResponse>(`/api/mobile/financials?${query.toString()}`);
  }
}
