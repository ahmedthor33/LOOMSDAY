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
      items: [],

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
      name: "loomsday-wishlist-storage-v2",
    }
  )
);
