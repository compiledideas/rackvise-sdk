import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { useAdminClient } from './provider';
import type { AdminApiClient } from './client';
import type {
  AdminStats,
  GetStatsParams,
  FinancialsQueryParams,
  FinancialsResponse,
} from './types';

function useClient(): { client: AdminApiClient; tokenKey: string } {
  const client = useAdminClient();
  return { client, tokenKey: client.getAuthToken() ?? 'anonymous' };
}

export function useAdminDashboard(
  params?: GetStatsParams,
  options?: Omit<UseQueryOptions<AdminStats, Error>, 'queryKey' | 'queryFn'>,
) {
  const { client, tokenKey } = useClient();
  return useQuery({
    queryKey: ['admin', tokenKey, 'dashboard', params],
    queryFn: () => client.getDashboard(params),
    ...options,
  });
}

export function useFinancials(
  params: FinancialsQueryParams,
  options?: Omit<UseQueryOptions<FinancialsResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  const { client, tokenKey } = useClient();
  return useQuery({
    queryKey: ['admin', tokenKey, 'financials', params],
    queryFn: () => client.getFinancials(params),
    ...options,
  });
}
