---
name: query-hooks
description: >
  TanStack Query hooks for fetching storefront data: products, categories,
  promos, FAQs, point-of-sells, stats, site content, and top-selling products.
  All hooks derive the client from the nearest StorefrontProvider.
type: sub-skill
---

# Query Hooks

All hooks auto-resolve the `StorefrontApiClient` from context and key queries
by the tenant's API key, so data is cached separately per tenant.

## useStorefrontProducts

```tsx
function useStorefrontProducts(
  params?: GetProductsParams,
  options?: UseQueryOptions<PaginatedResponse<Product>, Error>,
);
```

Filters: `categoryId`, `ageGroup`, `gender`, `minPrice`, `maxPrice`, `search`,
`limit`, `offset`, `sort` (`name-asc`, `price-asc`, `price-desc`, `createdAt-desc`).

```tsx
const { data, isLoading } = useStorefrontProducts({ categoryId: 5, sort: 'price-asc' });
```

## useStorefrontProduct

```tsx
function useStorefrontProduct(
  id: number,
  options?: UseQueryOptions<Product, Error>,
);
```

## useStorefrontCategories

```tsx
function useStorefrontCategories(
  options?: UseQueryOptions<Category[], Error>,
);
```

Params include `search`, `limit`, `offset`.

## useStorefrontCategoryProducts

```tsx
function useStorefrontCategoryProducts(
  categoryId: number,
  params?: GetCategoryProductsParams,
  options?: UseQueryOptions<PaginatedResponse<Product>, Error>,
);
```

Same filters as products (except `categoryId` — already scoped).

## useStorefrontPromos

```tsx
function useStorefrontPromos(
  options?: UseQueryOptions<Promo[], Error>,
);
```

Returns active promos with their promo-priced products.

## Static Queries

- `useStorefrontFaqs` — FAQ list (`FAQ[]`)
- `useStorefrontPointOfSells` — store locations (`PointOfSell[]`)
- `useStorefrontStats` — totals (`StorefrontStats`: totalProducts, totalStock, etc.)
- `useStorefrontAboutContent` — site "about" content (`SiteContent | null`)
- `useStorefrontTopSellingProducts` — top sellers (`TopSellingProduct[]`)

## Mutations

### useValidateCoupon

```tsx
const { mutateAsync, isPending } = useValidateCoupon();
const result = await mutateAsync({ code: 'SAVE20', totalAmount: 100 });
```

Returns `CouponValidationResult` with `discountType`, `discountValue`, `newTotal`.

### useCreateStorefrontOrder

```tsx
const { mutateAsync, isPending } = useCreateStorefrontOrder();
const order = await mutateAsync({
  orderItems: [{ productId: 1, variantId: 2, quantity: 1 }],
  clientName: 'John',
  clientPhone: '+212...',
  shippingAddress: '...',
  couponCode: 'SAVE20',
});
```

Returns `OrderResponse` with order details.

## Passing Query Options

Every query hook accepts standard TanStack Query options (e.g., `enabled`,
`staleTime`, `gcTime`). Pass them as the last argument:

```tsx
useStorefrontProducts({ categoryId: 5 }, { staleTime: 60_000, enabled: !!selectedCategory });
```
