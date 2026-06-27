import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { useStorefrontClient } from './provider';
import type { StorefrontApiClient } from './client';
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
  SiteContent,
  TopSellingProduct,
  LandingPageInfo,
  GetProductsParams,
  GetCategoryProductsParams,
  PaginatedResponse,
  FinancialsQueryParams,
  FinancialsResponse,
} from './types';

function useClient(): { client: StorefrontApiClient; key: string } {
  const client = useStorefrontClient();
  return { client, key: client.getApiKey() };
}

export function useStorefrontProducts(
  params?: GetProductsParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Product>, Error>, 'queryKey' | 'queryFn'>,
) {
  const { client, key } = useClient();
  return useQuery({
    queryKey: ['storefront', key, 'products', params],
    queryFn: () => client.getProducts(params),
    ...options,
  });
}

export function useStorefrontProduct(
  id: number,
  options?: Omit<UseQueryOptions<Product, Error>, 'queryKey' | 'queryFn'>,
) {
  const { client, key } = useClient();
  return useQuery({
    queryKey: ['storefront', key, 'product', id],
    queryFn: () => client.getProduct(id),
    ...options,
  });
}

export function useStorefrontCategories(
  options?: Omit<UseQueryOptions<Category[], Error>, 'queryKey' | 'queryFn'>,
) {
  const { client, key } = useClient();
  return useQuery({
    queryKey: ['storefront', key, 'categories'],
    queryFn: () => client.getCategories(),
    ...options,
  });
}

export function useStorefrontCategoryProducts(
  categoryId: number,
  params?: GetCategoryProductsParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Product>, Error>, 'queryKey' | 'queryFn'>,
) {
  const { client, key } = useClient();
  return useQuery({
    queryKey: ['storefront', key, 'category-products', categoryId, params],
    queryFn: () => client.getCategoryProducts(categoryId, params),
    ...options,
  });
}

export function useStorefrontPromos(
  options?: Omit<UseQueryOptions<Promo[], Error>, 'queryKey' | 'queryFn'>,
) {
  const { client, key } = useClient();
  return useQuery({
    queryKey: ['storefront', key, 'promos'],
    queryFn: () => client.getActivePromos(),
    ...options,
  });
}

export function useValidateCoupon(
  options?: UseMutationOptions<
    CouponValidationResult,
    Error,
    { code: string; totalAmount: number }
  >,
) {
  const client = useStorefrontClient();
  return useMutation({
    mutationFn: ({ code, totalAmount }) => client.validateCoupon(code, totalAmount),
    ...options,
  });
}

export function useCreateStorefrontOrder(
  options?: UseMutationOptions<OrderResponse, Error, CreateOrderInput>,
) {
  const client = useStorefrontClient();
  return useMutation({
    mutationFn: (input) => client.createOrder(input),
    ...options,
  });
}

export function useStorefrontFaqs(
  options?: Omit<UseQueryOptions<FAQ[], Error>, 'queryKey' | 'queryFn'>,
) {
  const { client, key } = useClient();
  return useQuery({
    queryKey: ['storefront', key, 'faqs'],
    queryFn: () => client.getFaqs(),
    ...options,
  });
}

export function useStorefrontPointOfSells(
  options?: Omit<UseQueryOptions<PointOfSell[], Error>, 'queryKey' | 'queryFn'>,
) {
  const { client, key } = useClient();
  return useQuery({
    queryKey: ['storefront', key, 'point-of-sells'],
    queryFn: () => client.getPointOfSells(),
    ...options,
  });
}

export function useStorefrontStats(
  options?: Omit<UseQueryOptions<StorefrontStats, Error>, 'queryKey' | 'queryFn'>,
) {
  const { client, key } = useClient();
  return useQuery({
    queryKey: ['storefront', key, 'stats'],
    queryFn: () => client.getStats(),
    ...options,
  });
}

export function useStorefrontAboutContent(
  options?: Omit<UseQueryOptions<SiteContent | null, Error>, 'queryKey' | 'queryFn'>,
) {
  const { client, key } = useClient();
  return useQuery({
    queryKey: ['storefront', key, 'about'],
    queryFn: () => client.getAboutContent(),
    ...options,
  });
}

export function useStorefrontTopSellingProducts(
  options?: Omit<UseQueryOptions<TopSellingProduct[], Error>, 'queryKey' | 'queryFn'>,
) {
  const { client, key } = useClient();
  return useQuery({
    queryKey: ['storefront', key, 'top-selling'],
    queryFn: () => client.getTopSellingProducts(),
    ...options,
  });
}

export function useStorefrontHero(
  options?: Omit<UseQueryOptions<LandingPageInfo, Error>, 'queryKey' | 'queryFn'>,
) {
  const { client, key } = useClient();
  return useQuery({
    queryKey: ['storefront', key, 'hero'],
    queryFn: () => client.getHero(),
    ...options,
  });
}

export function useFinancials(
  params: FinancialsQueryParams,
  options?: Omit<UseQueryOptions<FinancialsResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  const { client, key } = useClient();
  return useQuery({
    queryKey: ['storefront', key, 'financials', params],
    queryFn: () => client.getFinancials(params),
    ...options,
  });
}
