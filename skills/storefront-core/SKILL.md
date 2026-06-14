---
name: storefront-core
description: >
  Entry point for @rackvise/storefront-sdk skills. Covers setup (StorefrontProvider,
  StorefrontApiClient), query hooks, cart provider, and checkout flow. This SDK
  wraps Rackvise public storefront APIs with TanStack Query for type-safe caching.
library: rackvise-storefront-sdk
library_version: '0.1.0'
type: core
---

# @rackvise/storefront-sdk — Core Concepts

`@rackvise/storefront-sdk` is a type-safe React SDK for building storefronts
on the Rackvise multi-tenant e-commerce platform. It wraps public storefront
APIs with TanStack Query hooks, a localStorage-backed cart, and a checkout flow.

## Setup

```tsx
import { StorefrontProvider } from '@rackvise/storefront-sdk';

function App() {
  return (
    <StorefrontProvider baseUrl="https://kidoo.compiledideas.dev" apiKey="tenant-api-key">
      <YourStorefront />
    </StorefrontProvider>
  );
}
```

- `baseUrl`: Your tenant's storefront URL (no trailing slash). Falls back to `NEXT_PUBLIC_STOREFRONT_URL` env var.
- `apiKey`: The tenant's public API key. Falls back to `NEXT_PUBLIC_STOREFRONT_API_KEY` env var. Also used as the localStorage cart key.

`StorefrontProvider` internally wraps both the API client context and the
`StorefrontCartProvider`, so cart state is ready immediately.

## Sub-Skills

| Need to...                                    | Read                                            |
| --------------------------------------------- | ----------------------------------------------- |
| Fetch products, categories, promos, FAQs, etc | storefront-core/query-hooks/SKILL.md            |
| Manage cart state and checkout flow           | storefront-core/cart-checkout/SKILL.md          |

## Quick Decision Tree

- Build a product listing page? → query-hooks (useStorefrontProducts, useStorefrontCategories)
- Show product details? → query-hooks (useStorefrontProduct)
- Add to cart / manage cart? → cart-checkout (StorefrontCartProvider / useStorefrontCart)
- Handle coupon + order submission? → cart-checkout (useStorefrontCheckout)
- Fetch static content (about, FAQs, stats)? → query-hooks

## Critical Rules

1. **Always wrap your app** in `<StorefrontProvider>` before using hooks.
2. **Do NOT use the client directly** unless you need server-side or non-React usage. Prefer hooks.
3. **Cart is per-tenant** — keyed by `apiKey` in localStorage.
4. **Import from `@rackvise/storefront-sdk` only** — internal modules are private.
5. **Do NOT use `@tanstack/react-query` hooks directly** for storefront data. Use the exported hooks.

## Version

Targets @rackvise/storefront-sdk v0.1.0.
