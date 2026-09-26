---
name: admin-core
description: >
  Entry point for @rackvise/admin-sdk skills. Covers setup (AdminProvider,
  AdminApiClient), authentication tokens, dashboard queries, and merchant financials.
library: rackvise-admin-sdk
library_version: '0.1.0'
type: core
---

# @rackvise/admin-sdk — Core Concepts

`@rackvise/admin-sdk` is an authenticated React SDK for building back-office
portals, seller dashboards, and mobile management apps on the Rackvise platform.

## Setup

```tsx
import { AdminProvider } from '@rackvise/admin-sdk';

function App({ token }: { token: string }) {
  return (
    <AdminProvider baseUrl="https://api.rackvise.com" authToken={token}>
      <MerchantDashboard />
    </AdminProvider>
  );
}
```

- `baseUrl`: The Rackvise backend API URL. Falls back to `NEXT_PUBLIC_ADMIN_API_URL` env var.
- `authToken`: Bearer JWT token of the authenticated merchant or admin.
- `apiKey`: Optional tenant identification header if operating across sub-tenants.

`AdminProvider` creates a single `AdminApiClient` in context. To rotate
credentials (e.g. after login/refresh), pass a new `authToken` prop or call
`client.setAuthToken(token)` via `useAdminClient()`.

## Query Hooks

### `useAdminDashboard`

Fetches analytics for high-level operations:

```tsx
import { useAdminDashboard } from '@rackvise/admin-sdk';

function DashboardStats() {
  const { data, isLoading } = useAdminDashboard({
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  });

  return <div>Total Revenue: {data?.totalRevenue}</div>;
}
```

Returns `AdminStats`: revenue totals, order counts, delivery rate, order status
breakdown, payment method and source breakdowns, monthly/daily sales curves,
recent orders, and top products. Optional filters: `pointOfSellId`, `sellerId`,
`startDate`, `endDate`.

### `useFinancials`

Fetches structured reports, invoices, balance sheets (Bilan), and journal entries:

```tsx
import { useFinancials } from '@rackvise/admin-sdk';

function FinancialReport() {
  const { data } = useFinancials({
    type: 'monthly-report',
    year: 2026,
    month: 9,
  });
}
```

Financial types supported:

- `invoices`: Order-by-order breakdown with VAT/TVA, client, and line items.
- `monthly-report`: Monthly revenue, payment method breakdowns, and daily curves.
- `yearly-report`: Multi-month comparative revenue and order trends.
- `bilan`: Complete fiscal balance summary (TTC, HT, discounts, cancellations).
- `journal`: Accounting log of chronological sales transactions.

## Critical Rules

1. **Always wrap your app** in `<AdminProvider>` before using hooks.
2. **Do NOT use the client directly** unless you need server-side or non-React usage. Prefer hooks.
3. **Never expose the auth token** in public client-side bundles beyond the authenticated portal.
4. **Import from `@rackvise/admin-sdk` only** — internal modules are private.
5. **Do NOT use `@tanstack/react-query` hooks directly** for admin data. Use the exported hooks.

## Version

Targets @rackvise/admin-sdk v0.1.0.
