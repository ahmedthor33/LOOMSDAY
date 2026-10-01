export interface ProductVariant {
  id: string;
  productId: string;
  size: 'Twin' | 'Full' | 'Queen' | 'King' | 'Cal King' | 'Full / Queen' | 'King / Cal King' | 'Standard' | 'Standard Pair' | 'One Size' | string;
  colorName: string;
  colorHex: string;
  price: number;
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
  basePrice: number;
  rating: number;
  reviewCount: number;
  material: string;
  threadCountOrGsm?: string;
  origin: string;
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
  createdAt: string;
  status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  trackingNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoCode?: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}
