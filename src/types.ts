export type Gender = 'MALE' | 'FEMALE' | 'UNISEX';

export type SubVariantUnit = 'MONTH' | 'YEAR' | 'POINTURE';

export interface ProductImage {
  id: number;
  url: string;
  alt?: string | null;
}

export interface ProductSubVariant {
  id: number;
  ageStart?: number | null;
  ageEnd?: number | null;
  ageUnit?: SubVariantUnit | null;
  size?: string | null;
  stock: number;
  price?: number | null;
  productVariantId: number;
}

export interface ProductVariant {
  id: number;
  name: string;
  stock: number;
  price?: number | null;
  productId: number;
  subVariants?: ProductSubVariant[];
  images?: ProductVariantImage[];
}

export interface ProductVariantImage {
  id: number;
  url: string;
  alt?: string | null;
  variantId: number;
}

export interface ProductCategory {
  id: number;
  productId: number;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  oldPrice?: number | null;
  stock: number;
  sku: string;
  ageGroup?: string | null;
  gender?: string | null;
  isActive: boolean;
  isPublic: boolean;
  images?: ProductImage[];
  variants?: ProductVariant[];
  categories?: ProductCategory[];
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  _count?: {
    products: number;
  };
}

export interface PromoProduct extends Product {
  promoPrice: number;
}

export interface Promo {
  id: number;
  title: string;
  subTitle?: string | null;
  imageUrl?: string | null;
  products: PromoProduct[];
}

export interface CouponValidationResult {
  id: number;
  code: string;
  discountType: 'FIXED_AMOUNT' | 'PERCENTAGE';
  discountValue: number;
  discountAmount: number | null;
  minAmount: number | null;
  newTotal: number;
}

export interface CreateOrderInput {
  orderItems: {
    productId: number;
    variantId?: number;
    subVariantId?: number;
    quantity: number;
  }[];
  clientName: string;
  clientPhone: string;
  shippingAddress: string;
  clientEmail?: string;
  couponCode?: string;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  totalAmount: number;
  discountAmount: number;
  status: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  shippingAddress: string;
}

export interface FAQ {
  id: number;
  questionEN: string;
  answerEN: string;
  questionFR: string;
  answerFR: string;
  questionAR?: string | null;
  answerAR?: string | null;
  isActive: boolean;
  order: number;
}

export interface PointOfSell {
  id: number;
  name: string;
  address: string;
  city: string;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  workingHours?: Record<string, string> | null;
  additionalContactInfo?: Record<string, string> | null;
}

export interface StorefrontStats {
  totalProducts: number;
  totalStock: number;
  deliveredOrders: number;
  onlineOrders: number;
}

export interface SiteContent {
  id: number;
  key: string;
  contentEN: string;
  contentFR: string;
  contentAR?: string | null;
}

export interface TopSellingProduct {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  images: ProductImage[];
  totalSold: number;
}

export interface LandingPageInfo {
  id: number;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  titleFR?: string | null;
  subtitleFR?: string | null;
  titleAR?: string | null;
  subtitleAR?: string | null;
  heroBadge?: string | null;
  heroBadgeFR?: string | null;
  heroBadgeAR?: string | null;
  featuresJson?: Record<string, unknown> | null;
  pricingJson?: Record<string, unknown> | null;
  ctaJson?: Record<string, unknown> | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

export interface PaginationMeta {
  limit: number;
  offset: number;
  total: number;
  hasMore?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  pagination?: PaginationMeta;
}

export interface GetProductsParams {
  categoryId?: number;
  ageGroup?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  limit?: number;
  offset?: number;
  sort?: 'name-asc' | 'price-asc' | 'price-desc' | 'createdAt-desc';
}

export interface GetCategoriesParams {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface GetCategoryProductsParams {
  limit?: number;
  offset?: number;
  search?: string;
  ageGroup?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'name-asc' | 'price-asc' | 'price-desc' | 'createdAt-desc';
}
