// src/lib/meta-pixel.ts

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

/**
 * Checks if Meta Pixel is available on window and ready to receive events
 */
export function isPixelReady(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

/**
 * Tracks standard PageView
 */
export function trackPageView(): void {
  if (isPixelReady()) {
    try {
      window.fbq("track", "PageView");
    } catch (e) {
      console.debug("[Meta Pixel] PageView error:", e);
    }
  }
}

/**
 * Tracks product ViewContent (when viewing a product page)
 */
export function trackViewContent(product: {
  id: string;
  name: string;
  basePrice: number;
  category?: string;
  slug?: string;
}): void {
  if (isPixelReady()) {
    try {
      const ids = Array.from(new Set([product.id, product.slug].filter(Boolean) as string[]));
      window.fbq("track", "ViewContent", {
        content_name: product.name,
        content_category: product.category || "bedsheets",
        content_ids: ids,
        content_type: "product",
        value: Number(product.basePrice) || 0,
        currency: "PKR",
      });
    } catch (e) {
      console.debug("[Meta Pixel] ViewContent error:", e);
    }
  }
}

/**
 * Tracks AddToCart (when customer adds an item to cart)
 */
export function trackAddToCart(item: {
  id?: string;
  productId: string;
  name: string;
  price: number;
  quantity?: number;
  category?: string;
  slug?: string;
}): void {
  if (isPixelReady()) {
    try {
      const value = (Number(item.price) || 0) * (item.quantity || 1);
      const ids = Array.from(new Set([item.productId, item.slug].filter(Boolean) as string[]));
      window.fbq("track", "AddToCart", {
        content_name: item.name,
        content_category: item.category || "bedsheets",
        content_ids: ids,
        content_type: "product",
        value,
        currency: "PKR",
      });
    } catch (e) {
      console.debug("[Meta Pixel] AddToCart error:", e);
    }
  }
}

/**
 * Tracks InitiateCheckout (when customer navigates to checkout)
 */
export function trackInitiateCheckout(cartItems: any[], totalValue: number): void {
  if (isPixelReady()) {
    try {
      const ids = Array.from(
        new Set(
          cartItems
            .flatMap((i) => [i.productId, i.productSlug, i.id])
            .filter(Boolean)
        )
      );
      window.fbq("track", "InitiateCheckout", {
        content_ids: ids,
        content_type: "product",
        num_items: cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0),
        value: Number(totalValue) || 0,
        currency: "PKR",
      });
    } catch (e) {
      console.debug("[Meta Pixel] InitiateCheckout error:", e);
    }
  }
}

/**
 * Tracks Purchase (when an order is placed and confirmed)
 */
export function trackPurchase(order: {
  id: string;
  total: number;
  items?: any[];
}): void {
  if (isPixelReady()) {
    try {
      const ids = Array.from(
        new Set(
          (order.items || [])
            .flatMap((i: any) => [i.productId, i.productSlug, i.id])
            .filter(Boolean)
        )
      );
      window.fbq("track", "Purchase", {
        content_ids: ids,
        content_type: "product",
        value: Number(order.total) || 0,
        currency: "PKR",
        order_id: order.id,
      });
    } catch (e) {
      console.debug("[Meta Pixel] Purchase error:", e);
    }
  }
}

/**
 * Custom / Test Event for live diagnostics inside the admin panel
 */
export function trackCustomEvent(eventName: string, params?: Record<string, any>): void {
  if (isPixelReady()) {
    try {
      window.fbq("trackCustom", eventName, params || {});
    } catch (e) {
      console.debug("[Meta Pixel] Custom event error:", e);
    }
  }
}
