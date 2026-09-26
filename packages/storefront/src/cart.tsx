import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Product, ProductVariant, ProductSubVariant } from './types';

export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  subVariant?: ProductSubVariant;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, subVariant?: ProductSubVariant, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

function getAvailableStock(product: Product, variant?: ProductVariant, subVariant?: ProductSubVariant): number {
  if (subVariant && typeof subVariant.stock === 'number') return subVariant.stock;
  if (variant && typeof variant.stock === 'number') return variant.stock;
  return product.stock ?? 0;
}

function resolveItemPrice(product: Product, variant?: ProductVariant, subVariant?: ProductSubVariant): number {
  if (subVariant?.price) return Number(subVariant.price);
  if (variant?.price) return Number(variant.price);
  return Number(product.price) || 0;
}

export function StorefrontCartProvider({ children, tenantSlug }: { children: React.ReactNode; tenantSlug: string }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = `rackvise_cart_${tenantSlug}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart state from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart state to localStorage:', e);
    }
  }, [items, isLoaded, storageKey]);

  const addToCart = useCallback((
    product: Product,
    variant?: ProductVariant,
    subVariant?: ProductSubVariant,
    quantity = 1,
  ) => {
    setItems((prevItems) => {
      const availableStock = getAvailableStock(product, variant, subVariant);
      if (availableStock <= 0) return prevItems;

      const existingIndex = prevItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          (variant ? item.variant?.id === variant.id : !item.variant) &&
          (subVariant ? item.subVariant?.id === subVariant.id : !item.subVariant),
      );

      if (existingIndex >= 0) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = Math.min(currentQty + quantity, availableStock);
        const updated = [...prevItems];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }

      const newItem: CartItem = {
        id: `${product.id}-${variant?.id || 'none'}-${subVariant?.id || 'none'}-${Date.now()}`,
        product,
        variant,
        subVariant,
        quantity: Math.min(quantity, availableStock),
      };
      return [...prevItems, newItem];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const maxStock = getAvailableStock(item.product, item.variant, item.subVariant);
        return { ...item, quantity: Math.min(quantity, maxStock) };
      }),
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = resolveItemPrice(item.product, item.variant, item.subVariant);
      return sum + price * item.quantity;
    }, 0);
  }, [items]);

  const contextValue = useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  }), [items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useStorefrontCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useStorefrontCart must be used within a StorefrontCartProvider');
  }
  return context;
}
