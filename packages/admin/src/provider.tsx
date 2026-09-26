import React, { createContext, useContext, useMemo } from 'react';
import { AdminApiClient } from './client';
import type { AdminConfig } from './client';

declare const process: { env: Record<string, string | undefined> };

const AdminContext = createContext<AdminApiClient | null>(null);

export interface AdminProviderProps extends Partial<AdminConfig> {
  children: React.ReactNode;
}

export function AdminProvider({ baseUrl, apiKey, authToken, children }: AdminProviderProps) {
  const resolvedBaseUrl = baseUrl ?? process.env.NEXT_PUBLIC_ADMIN_API_URL;
  if (!resolvedBaseUrl) {
    throw new Error(
      'AdminProvider requires a baseUrl prop or NEXT_PUBLIC_ADMIN_API_URL environment variable.',
    );
  }

  const client = useMemo(
    () => new AdminApiClient({ baseUrl: resolvedBaseUrl, apiKey, authToken }),
    [resolvedBaseUrl, apiKey, authToken],
  );

  return <AdminContext.Provider value={client}>{children}</AdminContext.Provider>;
}

export function useAdminClient(): AdminApiClient {
  const client = useContext(AdminContext);
  if (!client) {
    throw new Error('useAdminClient must be used within an AdminProvider');
  }
  return client;
}
