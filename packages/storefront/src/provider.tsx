import React, { createContext, useContext, useMemo } from 'react';
import { StorefrontApiClient } from './client';
import type { StorefrontConfig } from './client';
import { StorefrontCartProvider } from './cart';

declare const process: { env: Record<string, string | undefined> };

const StorefrontContext = createContext<StorefrontApiClient | null>(null);

export interface StorefrontProviderProps extends Partial<StorefrontConfig> {
  children: React.ReactNode;
}

export function StorefrontProvider({ baseUrl, apiKey, children }: StorefrontProviderProps) {
  const resolvedBaseUrl = baseUrl ?? process.env.NEXT_PUBLIC_STOREFRONT_URL;
  if (!resolvedBaseUrl) {
    throw new Error(
      'StorefrontProvider requires a baseUrl prop or NEXT_PUBLIC_STOREFRONT_URL environment variable.',
    );
  }
  const resolvedApiKey = apiKey ?? process.env.NEXT_PUBLIC_STOREFRONT_API_KEY ?? '';

  const client = useMemo(
    () => new StorefrontApiClient({ baseUrl: resolvedBaseUrl, apiKey: resolvedApiKey }),
    [resolvedBaseUrl, resolvedApiKey],
  );

  return (
    <StorefrontContext.Provider value={client}>
      <StorefrontCartProvider tenantSlug={resolvedApiKey}>
        {children}
      </StorefrontCartProvider>
    </StorefrontContext.Provider>
  );
}

export function useStorefrontClient(): StorefrontApiClient {
  const client = useContext(StorefrontContext);
  if (!client) {
    throw new Error('useStorefrontClient must be used within a StorefrontProvider');
  }
  return client;
}
