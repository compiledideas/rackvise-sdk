import { useState, useCallback } from 'react';
import { useStorefrontCart } from './cart';
import { useCreateStorefrontOrder, useValidateCoupon } from './hooks';
import type { CouponValidationResult, OrderResponse } from './types';

export interface CheckoutFormInput {
  clientName: string;
  clientPhone: string;
  shippingAddress: string;
  clientEmail?: string;
}

export function useStorefrontCheckout() {
  const { items: cartItems, subtotal, clearCart } = useStorefrontCart();
  const createOrderMutation = useCreateStorefrontOrder();
  const validateCouponMutation = useValidateCoupon();

  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<CouponValidationResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const applyCoupon = useCallback(async (code: string) => {
    if (!code.trim()) return;
    setCouponError(null);
    try {
      const result = await validateCouponMutation.mutateAsync({
        code: code.toUpperCase(),
        totalAmount: subtotal,
      });
      setActiveCoupon(result);
      setCouponCode(code.toUpperCase());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid coupon code';
      setCouponError(message);
      setActiveCoupon(null);
    }
  }, [subtotal, validateCouponMutation]);

  const removeCoupon = useCallback(() => {
    setActiveCoupon(null);
    setCouponCode('');
    setCouponError(null);
  }, []);

  const total = activeCoupon ? activeCoupon.newTotal : subtotal;

  const submitCheckout = useCallback(async (customerDetails: CheckoutFormInput): Promise<OrderResponse> => {
    if (cartItems.length === 0) {
      throw new Error('Cannot checkout with an empty cart.');
    }

    const payload = {
      orderItems: cartItems.map((item) => ({
        productId: item.product.id,
        variantId: item.variant?.id,
        subVariantId: item.subVariant?.id,
        quantity: item.quantity,
      })),
      clientName: customerDetails.clientName,
      clientPhone: customerDetails.clientPhone,
      shippingAddress: customerDetails.shippingAddress,
      clientEmail: customerDetails.clientEmail || undefined,
      couponCode: activeCoupon ? activeCoupon.code : undefined,
    };

    const response = await createOrderMutation.mutateAsync(payload);

    clearCart();
    removeCoupon();

    return response;
  }, [cartItems, activeCoupon, createOrderMutation, clearCart, removeCoupon]);

  return {
    couponCode,
    activeCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    isApplyingCoupon: validateCouponMutation.isPending,
    isSubmittingOrder: createOrderMutation.isPending,
    subtotal,
    total,
    submitCheckout,
  };
}
