import type {
  Product,
  Category,
  Promo,
  CouponValidationResult,
  CreateOrderInput,
  OrderResponse,
  FAQ,
  PointOfSell,
  StorefrontStats,
  StorefrontConfigData,
  SiteContent,
  TopSellingProduct,
  LandingPageInfo,
  GetProductsParams,
  GetCategoriesParams,
  GetCategoryProductsParams,
  GetStatsParams,
  PaginatedResponse,
  FinancialsQueryParams,
  FinancialsResponse,
} from './types';

export interface StorefrontConfig {
  baseUrl: string;
  apiKey: string;
  authToken?: string;
}

export class StorefrontApiClient {
  private baseUrl: string;
  private apiKey: string;
  private authToken?: string;

  constructor(config: StorefrontConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.apiKey = config.apiKey;
    this.authToken = config.authToken;
  }

  setAuthToken(token: string | undefined) {
    this.authToken = token;
  }

  getApiKey(): string {
    return this.apiKey;
  }

  private getAuthHeaders(): Record<string, string> {
    return this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {};
  }

  private async executeFetch(path: string, options?: RequestInit): Promise<Response> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || `HTTP error! Status: ${response.status}`);
    }

    return response;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await this.executeFetch(path, options);
    const payload = await response.json();
    return payload.data as T;
  }

  private async requestAuthenticated<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await this.executeFetch(path, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
    });
    const payload = await response.json();
    return payload.data as T;
  }

  private async requestRaw<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await this.executeFetch(path, options);
    return response.json() as Promise<T>;
  }

  private async requestPaginated<T>(
    path: string,
    options?: RequestInit,
  ): Promise<PaginatedResponse<T>> {
    const response = await this.executeFetch(path, options);
    const payload = await response.json();
    return {
      data: payload.data as T[],
      pagination: payload.pagination as PaginatedResponse<T>['pagination'],
    };
  }

  async getStoreConfig(): Promise<StorefrontConfigData> {
    return this.request<StorefrontConfigData>('/api/public/store-config');
  }

  async getProducts(
    params?: GetProductsParams,
  ): Promise<PaginatedResponse<Product>> {
    const query = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          query.set(key, String(value));
        }
      }
    }
    const qs = query.toString();
    return this.requestPaginated<Product>(`/api/public/products${qs ? `?${qs}` : ''}`);
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/api/public/products/${id}`);
  }

  async getCategories(params?: GetCategoriesParams): Promise<Category[]> {
    const query = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          query.set(key, String(value));
        }
      }
    }
    const qs = query.toString();
    return this.request<Category[]>(`/api/public/categories${qs ? `?${qs}` : ''}`);
  }

  async getCategoryProducts(
    categoryId: number,
    params?: GetCategoryProductsParams,
  ): Promise<PaginatedResponse<Product>> {
    const query = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          query.set(key, String(value));
        }
      }
    }
    const qs = query.toString();
    return this.requestPaginated<Product>(
      `/api/public/categories/${categoryId}/products${qs ? `?${qs}` : ''}`,
    );
  }

  async getActivePromos(): Promise<Promo[]> {
    return this.request<Promo[]>('/api/public/promos/active');
  }

  async validateCoupon(code: string, totalAmount: number): Promise<CouponValidationResult> {
    const response = await this.executeFetch('/api/public/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, totalAmount }),
    });
    const payload = await response.json();
    return payload.data as CouponValidationResult;
  }

  async createOrder(input: CreateOrderInput): Promise<OrderResponse> {
    const response = await this.executeFetch('/api/public/orders', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    const payload = await response.json();
    return payload.data as OrderResponse;
  }

  async getFaqs(): Promise<FAQ[]> {
    return this.request<FAQ[]>('/api/public/faqs');
  }

  async getPointOfSells(): Promise<PointOfSell[]> {
    return this.request<PointOfSell[]>('/api/public/pos');
  }

  async getHero(): Promise<LandingPageInfo> {
    return this.requestRaw<LandingPageInfo>('/api/public/hero');
  }

  async getStats(params?: GetStatsParams): Promise<StorefrontStats> {
    const query = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          query.set(key, String(value));
        }
      }
    }
    const qs = query.toString();
    return this.request<StorefrontStats>(`/api/public/stats${qs ? `?${qs}` : ''}`);
  }

  async getDashboard(params?: GetStatsParams): Promise<StorefrontStats> {
    const query = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          query.set(key, String(value));
        }
      }
    }
    const qs = query.toString();
    return this.requestAuthenticated<StorefrontStats>(`/api/mobile/dashboard${qs ? `?${qs}` : ''}`);
  }

  async getAboutContent(): Promise<SiteContent | null> {
    return this.request<SiteContent | null>('/api/public/about');
  }

  async getTopSellingProducts(): Promise<TopSellingProduct[]> {
    return this.request<TopSellingProduct[]>('/api/public/products/top-selling');
  }

  async getFinancials(params: FinancialsQueryParams): Promise<FinancialsResponse> {
    const query = new URLSearchParams();
    query.set('type', params.type);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.year !== undefined) query.set('year', String(params.year));
    if (params.month !== undefined) query.set('month', String(params.month));
    if (params.pointOfSellId !== undefined) query.set('pointOfSellId', String(params.pointOfSellId));
    const qs = query.toString();
    return this.request<FinancialsResponse>(`/api/mobile/financials?${qs}`);
  }
}
