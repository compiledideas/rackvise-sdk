import React, { createContext, useContext, useMemo } from 'react';
import { StorefrontApiClient } from './client';
import type { StorefrontConfig } from './client';
import { StorefrontCartProvider } from './cart';

const StorefrontContext = createContext<StorefrontApiClient | null>(null);

export interface StorefrontProviderProps extends StorefrontConfig {
  children: React.ReactNode;
}

export function StorefrontProvider({ baseUrl, apiKey, children }: StorefrontProviderProps) {
  const client = useMemo(
    () => new StorefrontApiClient({ baseUrl, apiKey }),
    [baseUrl, apiKey],
  );

  return (
    <StorefrontContext.Provider value={client}>
      <StorefrontCartProvider tenantSlug={apiKey}>
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
