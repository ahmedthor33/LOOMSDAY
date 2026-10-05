export interface ProductVariant {
  id: string;
  productId: string;
  size: 'Twin' | 'Full' | 'Queen' | 'King' | 'Cal King' | 'Full / Queen' | 'King / Cal King' | 'Standard' | 'Standard Pair' | 'One Size' | string;
  colorName: string;
  colorHex: string;
  price: number;
  retailPrice?: number;
  stock: number;
  sku: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string;
  sortOrder: number;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: 'bedsheets' | 'pillows' | 'duvets';
  categoryLabel: string;
  basePrice: number; // Actual Selling Price (PKR)
  retailPrice?: number; // Retail / Struck-through Price (PKR)
  rating: number;
  reviewCount: number;
  material: string;
  threadCountOrGsm?: string;
  origin?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  availableColors: { name: string; hex: string }[];
  availableSizes: string[];
  features?: string[];
  dimensions?: {
    fitted?: string;
    flat?: string;
    cases?: string;
  };
}

export interface CartItem {
  id: string; // unique item key: `${productId}-${variantId}`
  productId: string;
  variantId: string;
  productName: string;
  productSlug: string;
  imageUrl: string;
  price: number;
  quantity: number;
  size: string;
  colorName: string;
  colorHex: string;
  inStock?: boolean;
}

export interface WishlistItem {
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string;
  price: number;
  material: string;
  category: string;
  colorName?: string;
  size?: string;
  inStock?: boolean;
  reservedUntil?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string;
  price: number;
  quantity: number;
  size: string;
  colorName: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName?: string;
  customerEmail?: string;
  createdAt: string;
  status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  carrier?: string;
  trackingNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoCode?: string;
  paymentMethod?: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  expiresAt?: string;
  isActive: boolean;
  usageCount: number;
  maxUsage?: number;
}

export interface ShippingSettings {
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  monogramThreshold: number;
  estimatedDeliveryDays: string;
}

export interface StorefrontCms {
  announcement: {
    text: string;
    enabled: boolean;
    link: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    imageUrl: string;
  };
  provenance: {
    badge: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    foundedYear: string;
  };
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  accountTitle: string;
  accountNumber: string;
  bankName?: string;
  iban?: string;
  raastId?: string;
  badge: string;
  icon: string;
  instructions: string;
  isEnabled: boolean;
  requiresProofReference?: boolean;
  isCustom?: boolean;
}

export type PaymentMethodType = 'Cash on Delivery' | 'Bank Transfer' | 'JazzCash' | 'Easypaisa' | string;

export interface AdminTransaction {
  id: string;
  orderId: string;
  customerEmail: string;
  amount: number;
  gateway: string;
  status: 'Captured' | 'Pending' | 'Refunded';
  date: string;
  last4?: string;
  accountReference?: string;
}

export interface CrossSellItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  slug: string;
  size?: string;
  colorName?: string;
  colorHex?: string;
}
