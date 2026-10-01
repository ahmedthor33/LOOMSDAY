import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, WishlistItem } from "@/types";

interface WishlistState {
  items: WishlistItem[];
  toggleWishlist: (product: Product, selectedColor?: string, selectedSize?: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  count: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [
        // Pre-seeded with 2 items matching Stitch designs:
        {
          productId: "prod-1",
          productName: "The French Flax Linen Sheet Set",
          productSlug: "french-flax-linen-sheet-set",
          imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4-I1K4vbNsICIYjZwoz76sC8eark0SaLCinQ02L5WbuHtIK9LKjZHfbdct-MVjWJSFfhuGfB7cdqZigy00l7f5qJANIQ7KWF5_og5iivfRMvVDcdTsEP7fPkt5RehCVzYUPKR7JagrOTXZlR3QyYU4L2H5WQSLA0MRUHM4ZB0sniWUsXZGquPIyFldicPjdfkWIyhoGllR5wOP4SOGxscuAPOLf7YSSpnJNZp3kRWAy-JthZi_vhtBQ",
          price: 285,
          material: "100% French Flax Linen",
          category: "bedsheets",
          colorName: "Warm Ivory",
          size: "Queen",
          inStock: true,
          reservedUntil: "14 Days",
        },
        {
          productId: "prod-6",
          productName: "Cloud Goose Down Duvet Insert",
          productSlug: "cloud-goose-down-duvet-insert",
          imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiLMU9kFaUz1KJVZYxlqcdVVgrYrcr0LTQtSVR2DGIgnRmWMfYpQrzHABD9WkR_lHMnkQ1W8jrO0PBurY1hDPcmBeFsCo-WEGFg6L19JTAlpqrQNsBgXBSF_UopJpM2FTYSOfLGaY2tq0kvRXgN_Lb7mtF-6QQ3XgWMJIp1pwcaEInGoCAVYHprnIJm3vDVSjipgnetecfX-UErZi9HxOCZubt-PWeghCP4qtPN9SlLSqvkVQNXq_I3w",
          price: 340,
          material: "750 FP Goose Down",
          category: "duvets",
          colorName: "Pristine White",
          size: "Full / Queen",
          inStock: true,
          reservedUntil: "14 Days",
        },
      ],

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.productId === productId);
      },

      toggleWishlist: (product, selectedColor, selectedSize) => {
        const isPresent = get().isInWishlist(product.id);
        if (isPresent) {
          get().removeItem(product.id);
          return false;
        } else {
          const newItem: WishlistItem = {
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            imageUrl: product.images[0]?.url || "",
            price: product.basePrice,
            material: product.material,
            category: product.category,
            colorName: selectedColor || product.availableColors[0]?.name || "Natural",
            size: selectedSize || product.availableSizes[0] || "Queen",
            inStock: true,
            reservedUntil: "14 Days",
          };
          set((state) => ({ items: [...state.items, newItem] }));
          return true;
        }
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      clearWishlist: () => set({ items: [] }),

      count: () => get().items.length,
    }),
    {
      name: "loomsday-wishlist-storage",
    }
  )
);
