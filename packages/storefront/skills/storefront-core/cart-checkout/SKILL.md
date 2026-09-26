---
name: cart-checkout
description: >
  Cart management (StorefrontCartProvider, useStorefrontCart) and checkout
  flow (useStorefrontCheckout) for the Rackvise storefront SDK. Cart is
  persisted to localStorage per tenant. Checkout handles coupon validation
  and order submission in one workflow.
type: sub-skill
---

# Cart & Checkout

The cart is automatically available inside `<StorefrontProvider>` — no extra
provider needed. Cart state is persisted to `localStorage` under the key
`rackvise_cart_{apiKey}`.

## Cart API

```tsx
import { useStorefrontCart } from '@rackvise/storefront-sdk';

function Cart() {
  const {
    items,           // CartItem[]
    addToCart,       // (product, variant?, subVariant?, quantity?) => void
    removeFromCart,  // (itemId: string) => void
    updateQuantity,  // (itemId: string, quantity: number) => void
    clearCart,       // () => void
    totalItems,      // number
    subtotal,        // number
  } = useStorefrontCart();
}
```

### CartItem

```ts
interface CartItem {
  id: string;                          // `${productId}-${variantId || 'none'}-${subVariantId || 'none'}-${timestamp}`
  product: Product;
  variant?: ProductVariant;
  subVariant?: ProductSubVariant;
  quantity: number;
}
```

- `addToCart` auto-resolves stock and clamps quantity to available stock.
- If the same product+variant+subVariant combo exists, quantity is incremented.
- `updateQuantity` clamps to stock; passing <= 0 removes the item.
- Stock is checked client-side only — no server sync. For real-time stock, re-fetch product data.

## Checkout Flow

```tsx
import { useStorefrontCheckout } from '@rackvise/storefront-sdk';

function Checkout() {
  const {
    subtotal,
    total,                    // subtotal - discount (if coupon applied)
    couponCode,
    activeCoupon,             // CouponValidationResult | null
    couponError,              // string | null
    applyCoupon,              // (code: string) => Promise<void>
    removeCoupon,             // () => void
    isApplyingCoupon,         // boolean
    isSubmittingOrder,        // boolean
    submitCheckout,           // (customerDetails: CheckoutFormInput) => Promise<OrderResponse>
  } = useStorefrontCheckout();
}
```

### Complete checkout example

```tsx
const { submitCheckout, isSubmittingOrder } = useStorefrontCheckout();

const handleSubmit = async (form: CheckoutFormInput) => {
  try {
    const order = await submitCheckout(form);
    // order.orderNumber, order.totalAmount, order.status
    toast.success(`Order ${order.orderNumber} placed!`);
  } catch (err) {
    toast.error(err.message);
  }
};
```

`submitCheckout` calls `useCreateStorefrontOrder`, then clears the cart and
removes the coupon on success.

### Coupon flow

1. User enters coupon code → `applyCoupon(code)` POSTs to `/coupons/validate`.
2. On success, `activeCoupon` is set and `total` updates to `activeCoupon.newTotal`.
3. `removeCoupon()` resets the coupon state.
4. The validated coupon's code is included in the order payload.

## Critical Rules

1. **Cart is client-only.** Stock is not synchronized with the server after add-to-cart. Always re-fetch product data for real-time stock.
2. **Do NOT manually write to localStorage.** Use `useStorefrontCart` methods only.
3. **`submitCheckout` clears the cart** on success. This is intentional.
4. **Coupon validation is per-call.** Always validate before submitting; the SDK does it inline.
