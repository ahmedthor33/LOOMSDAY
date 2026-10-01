import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  promoCode: string;
  discountPercentage: number;
  
  // Actions
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  clearPromo: () => void;
  clearCart: () => void;
  
  // Selectors / Computations
  subtotal: () => number;
  shippingFee: () => number;
  discountAmount: () => number;
  total: () => number;
  totalItemsCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      promoCode: "",
      discountPercentage: 0,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === item.id);
          let newItems: CartItem[];

          if (existingIndex > -1) {
            newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            };
          } else {
            newItems = [...state.items, { ...item, quantity }];
          }

          return { items: newItems, isDrawerOpen: true };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      applyPromo: (code: string) => {
        const cleanCode = code.trim().toUpperCase();
        if (cleanCode === "SANCTUARY15" || cleanCode === "LOOMSDAY15") {
          set({ promoCode: cleanCode, discountPercentage: 15 });
          return { success: true, message: "15% Privileged Sanctuary discount applied" };
        } else if (cleanCode === "WELCOME10" || cleanCode === "FIRSTREST") {
          set({ promoCode: cleanCode, discountPercentage: 10 });
          return { success: true, message: "10% Welcome gift applied" };
        } else {
          return { success: false, message: "Invalid promotional cipher" };
        }
      },

      clearPromo: () => set({ promoCode: "", discountPercentage: 0 }),

      clearCart: () => set({ items: [], promoCode: "", discountPercentage: 0 }),

      subtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      shippingFee: () => {
        const sub = get().subtotal();
        if (sub === 0) return 0;
        return sub >= FREE_SHIPPING_THRESHOLD ? 0 : 350;
      },

      discountAmount: () => {
        const sub = get().subtotal();
        const pct = get().discountPercentage;
        return (sub * pct) / 100;
      },

      total: () => {
        const sub = get().subtotal();
        const disc = get().discountAmount();
        const ship = get().shippingFee();
        return Math.max(0, sub - disc + ship);
      },

      totalItemsCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "loomsday-cart-storage",
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
        discountPercentage: state.discountPercentage,
      }),
    }
  )
);
