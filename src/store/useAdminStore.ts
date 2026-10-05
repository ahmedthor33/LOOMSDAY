import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, Order, AdminCoupon, ShippingSettings, StorefrontCms, AdminTransaction, PaymentMethodConfig } from "@/types";
import { PRODUCTS } from "@/lib/products-data";
import { DEMO_PRODUCTS } from "@/lib/demo-products-data";
import { fetchSupabaseProducts, sanitizeCatalogProducts } from "@/lib/catalog-service";
import {
  idbGet,
  idbSet,
  idbDelete,
  cleanupStaleAdminStorage,
  createLightweightSnapshot,
} from "@/lib/robust-storage";

export { cleanupStaleAdminStorage };

export const SUPER_ADMIN_EMAIL = "ahmedthor33@gmail.com";

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

function notifyStoreUpdated() {
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new Event("loomsday-products-updated"));
    } catch {}
  }
}

interface AdminState {
  // Catalog & Inventory
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  clearDemoProducts: () => void;
  updateVariantStock: (productId: string, variantId: string, stock: number) => void;
  restockProduct: (productId: string, amount: number) => void;
  clearAllTestData: () => void;
  loadDemoCatalog: () => void;

  // Orders & Fulfillment
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  updateOrderTracking: (orderId: string, carrier: string, trackingNumber: string) => void;
  addOrder: (order: Order) => void;

  // Coupons
  coupons: AdminCoupon[];
  addCoupon: (coupon: AdminCoupon) => void;
  updateCoupon: (id: string, updates: Partial<AdminCoupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCoupon: (id: string) => void;

  // Shipping & Logistics
  shippingSettings: ShippingSettings;
  updateShippingSettings: (settings: Partial<ShippingSettings>) => void;

  // Storefront CMS
  cms: StorefrontCms;
  updateHero: (hero: Partial<StorefrontCms["hero"]>) => void;
  updateAnnouncement: (announcement: Partial<StorefrontCms["announcement"]>) => void;
  updateProvenance: (provenance: Partial<StorefrontCms["provenance"]>) => void;

  // Payments & Financials
  paymentMethods: PaymentMethodConfig[];
  togglePaymentMethod: (id: string) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethodConfig>) => void;
  addPaymentMethod: (method: PaymentMethodConfig) => void;
  deletePaymentMethod: (id: string) => void;
  resetPaymentMethods: () => void;
  transactions: AdminTransaction[];
  refundTransaction: (id: string) => void;

  // Catalog Cloud Sync & Data Migration
  syncWithSupabase: () => Promise<{ success: boolean; count: number }>;
  importCatalog: (products: Product[]) => { success: boolean; count: number };
  loadFactoryCatalog: () => void;

  // Reset to initial demo factory state if needed
  resetToFactoryDefaults: () => void;
}

const INITIAL_ORDERS: Order[] = [];

const INITIAL_COUPONS: AdminCoupon[] = [
  {
    id: "coup-1",
    code: "SANCTUARY15",
    discountType: "percentage",
    discountValue: 15,
    minSpend: 150,
    isActive: true,
    usageCount: 142,
    maxUsage: 500,
  },
  {
    id: "coup-2",
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minSpend: 0,
    isActive: true,
    usageCount: 389,
    maxUsage: 1000,
  },
  {
    id: "coup-3",
    code: "SUITE25",
    discountType: "percentage",
    discountValue: 25,
    minSpend: 400,
    expiresAt: "2026-12-31",
    isActive: true,
    usageCount: 28,
    maxUsage: 100,
  },
  {
    id: "coup-4",
    code: "PRIVILEGE50",
    discountType: "fixed",
    discountValue: 50,
    minSpend: 300,
    isActive: false,
    usageCount: 12,
    maxUsage: 50,
  },
];

const INITIAL_TRANSACTIONS: AdminTransaction[] = [];

const INITIAL_SHIPPING: ShippingSettings = {
  freeShippingThreshold: 5000,
  standardShippingFee: 350,
  expressShippingFee: 750,
  monogramThreshold: 35000,
  estimatedDeliveryDays: "2 - 4 Business Days (TCS / Leopard)",
};

const INITIAL_CMS: StorefrontCms = {
  announcement: {
    text: "✦ COMPLIMENTARY NATIONWIDE SHIPPING ON ORDERS OVER RS. 5,000 ✦",
    enabled: true,
    link: "/shop",
  },
  hero: {
    eyebrow: "THE SPRING LINEN COLLECTION",
    headline: "Sleep, elevated.",
    subheadline:
      "Woven in Northern France from 100% certified organic flax. Impossibly soft from night one, tailored for a lifetime of quiet rest.",
    primaryCtaText: "Shop the Collection",
    primaryCtaLink: "/shop",
    secondaryCtaText: "Discover Duvets",
    secondaryCtaLink: "/shop/duvets",
    imageUrl: "/images/hero-bedding.jpg",
  },
  provenance: {
    badge: "SLOW CRAFT & PROVENANCE",
    title: "Centuries of Normandy flax cultivation meets contemporary architectural repose.",
    paragraph1:
      "Every thread in LOOMSDAY bedding originates from multi-generational agricultural cooperatives along the cool, mist-kissed coasts of Normandy and Flanders.",
    paragraph2:
      "We weave with slow tension on heritage looms, wash with natural volcanic pumice, and tailor with double-needle French felled seams.",
    foundedYear: "1884",
  },
};

export const INITIAL_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: "cod",
    name: "Cash on Delivery",
    accountTitle: "Zero Advance Payment Required",
    accountNumber: "Pay at Doorstep",
    bankName: "Nationwide Courier (TCS / Leopard)",
    badge: "Nationwide",
    icon: "payments",
    instructions:
      "Pay in cash directly to the courier rider upon delivery to your doorstep. Includes complimentary luxury packaging inspection.",
    isEnabled: true,
    requiresProofReference: false,
    isCustom: false,
  },
  {
    id: "bank_transfer",
    name: "Direct Bank Transfer",
    accountTitle: "LOOMSDAY LUXURY BEDDING",
    accountNumber: "0102-0105893201",
    bankName: "Meezan Bank Ltd",
    iban: "PK36MEZN0001020105893201",
    raastId: "03008491928",
    badge: "Meezan / HBL",
    icon: "account_balance",
    instructions:
      "Please transfer the exact order amount to our official Meezan Bank account via online banking or Raast. Provide your transaction ID or sender name for instant reconciliation.",
    isEnabled: true,
    requiresProofReference: true,
    isCustom: false,
  },
  {
    id: "jazzcash",
    name: "JazzCash",
    accountTitle: "LOOMSDAY Atelier",
    accountNumber: "0300-8491928",
    bankName: "Mobilink Microfinance Bank",
    badge: "0300-...",
    icon: "phone_iphone",
    instructions:
      "Transfer the amount via JazzCash App or Mobile Account to 0300-8491928. Enter your mobile number or TID below.",
    isEnabled: true,
    requiresProofReference: true,
    isCustom: false,
  },
  {
    id: "easypaisa",
    name: "Easypaisa",
    accountTitle: "LOOMSDAY Atelier",
    accountNumber: "0345-8491928",
    bankName: "Telenor Microfinance Bank",
    badge: "0345-...",
    icon: "account_balance_wallet",
    instructions:
      "Transfer the amount via Easypaisa App or Mobile Wallet to 0345-8491928. Enter your sending mobile number or TID below.",
    isEnabled: true,
    requiresProofReference: true,
    isCustom: false,
  },
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      products: PRODUCTS,
      orders: [],
      coupons: INITIAL_COUPONS,
      shippingSettings: INITIAL_SHIPPING,
      cms: INITIAL_CMS,
      transactions: [],
      paymentMethods: INITIAL_PAYMENT_METHODS,

      // Product Management
      addProduct: (product) => {
        set((state) => {
          const currentList = Array.isArray(state.products) ? state.products : [];

          // 1. Ensure unique ID
          let uniqueId = product.id && !currentList.some((p) => p.id === product.id)
            ? product.id
            : `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

          // 2. Ensure unique Slug (never overwrite another product with same name or slug!)
          let baseSlug = (product.slug || product.name || `item-${Date.now()}`)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
          if (!baseSlug) baseSlug = `prod-${Date.now()}`;

          let uniqueSlug = baseSlug;
          let counter = 2;
          while (currentList.some((p) => p.slug === uniqueSlug)) {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
          }

          // 3. Normalize variants with uniqueId and safe stock/pricing
          const defaultSizes = product.availableSizes && product.availableSizes.length > 0
            ? product.availableSizes
            : ["Single", "Double", "Queen", "King"];

          const sourceVariants = product.variants && product.variants.length > 0
            ? product.variants
            : defaultSizes.map((sz, idx) => ({
                id: `var-${Date.now()}-${idx + 1}`,
                productId: uniqueId,
                size: sz,
                colorName: "Warm Ivory",
                colorHex: "#FAF7F2",
                price: Number(product.basePrice) || 0,
                retailPrice: product.retailPrice ? Number(product.retailPrice) : undefined,
                stock: 30,
                sku: `${uniqueSlug.slice(0, 4).toUpperCase()}-${sz.slice(0, 2).toUpperCase()}-IVR`,
              }));

          const normalizedVariants = sourceVariants.map((v, idx) => ({
            ...v,
            id: v.id && !currentList.some((p) => (p.variants || []).some((pv) => pv.id === v.id))
              ? v.id
              : `var-${Date.now()}-${idx + 1}-${Math.random().toString(36).slice(2, 6)}`,
            productId: uniqueId,
            price: Number(product.basePrice) || v.price || 0,
            retailPrice: product.retailPrice !== undefined ? Number(product.retailPrice) : v.retailPrice,
            stock: typeof v.stock === "number" ? Math.max(0, v.stock) : 30,
          }));

          // 4. Ensure at least one image with valid URL
          const sourceImages = product.images && product.images.length > 0
            ? product.images
            : [{
                id: `img-${Date.now()}-1`,
                productId: uniqueId,
                url: "/images/hero-bedding.jpg",
                altText: product.name,
                sortOrder: 0,
                isPrimary: true,
              }];

          const normalizedImages = sourceImages.map((img, idx) => ({
            ...img,
            id: img.id || `img-${Date.now()}-${idx + 1}`,
            productId: uniqueId,
            url: img.url || "/images/hero-bedding.jpg",
          }));

          const normalizedProduct: Product = {
            ...product,
            id: uniqueId,
            slug: uniqueSlug,
            basePrice: Number(product.basePrice) || 0,
            retailPrice: product.retailPrice !== undefined && Number(product.retailPrice) > 0 ? Number(product.retailPrice) : undefined,
            variants: normalizedVariants,
            images: normalizedImages,
            availableSizes: defaultSizes,
          };

          return {
            products: [normalizedProduct, ...currentList],
          };
        });

        notifyStoreUpdated();
      },

      updateProduct: (id, updates) => {
        set((state) => {
          const currentList = Array.isArray(state.products) ? state.products : [];
          return {
            products: currentList.map((p) => {
              if (p.id !== id) return p;
              const updated = { ...p, ...updates };
              if (updates.basePrice !== undefined) {
                updated.variants = (updated.variants || []).map((v) => ({
                  ...v,
                  price: updated.basePrice,
                  retailPrice: updated.retailPrice,
                }));
              }
              return updated;
            }),
          };
        });
        notifyStoreUpdated();
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: (Array.isArray(state.products) ? state.products : []).filter((p) => p.id !== id),
        }));
        notifyStoreUpdated();
      },

      clearDemoProducts: () => {
        set((state) => ({
          products: (Array.isArray(state.products) ? state.products : []).filter(
            (p) => p.id !== "prod-1" && p.slug !== "french-flax-linen-sheet-set"
          ),
        }));
        notifyStoreUpdated();
      },

      updateVariantStock: (productId, variantId, stock) => {
        set((state) => ({
          products: (Array.isArray(state.products) ? state.products : []).map((p) => {
            if (p.id !== productId) return p;
            return {
              ...p,
              variants: (p.variants || []).map((v) =>
                v.id === variantId ? { ...v, stock: Math.max(0, stock) } : v
              ),
            };
          }),
        }));
        notifyStoreUpdated();
      },

      restockProduct: (productId, amount) => {
        set((state) => ({
          products: (Array.isArray(state.products) ? state.products : []).map((p) => {
            if (p.id !== productId) return p;
            return {
              ...p,
              variants: (p.variants || []).map((v) => ({
                ...v,
                stock: v.stock + amount,
              })),
            };
          }),
        }));
        notifyStoreUpdated();
      },

      clearAllTestData: () => {
        set({
          products: [],
          orders: [],
          transactions: [],
        });
        notifyStoreUpdated();
      },

      loadDemoCatalog: () => {
        set({
          products: DEMO_PRODUCTS,
        });
        notifyStoreUpdated();
      },

      loadFactoryCatalog: () => {
        set({
          products: PRODUCTS,
        });
        notifyStoreUpdated();
      },

      syncWithSupabase: async () => {
        try {
          const cloudProds = await fetchSupabaseProducts();
          if (cloudProds && cloudProds.length > 0) {
            set((state) => {
              const currentList = Array.isArray(state.products) ? state.products : [];
              const mergedMap = new Map<string, Product>();
              cloudProds.forEach((p) => mergedMap.set(p.slug || p.id, p));
              currentList.forEach((p) => {
                if (!mergedMap.has(p.slug || p.id)) {
                  mergedMap.set(p.slug || p.id, p);
                }
              });
              return { products: Array.from(mergedMap.values()) };
            });
            notifyStoreUpdated();
            return { success: true, count: cloudProds.length };
          }
          return { success: false, count: 0 };
        } catch (e) {
          console.warn("[LOOMSDAY Store] Cloud sync failed:", e);
          return { success: false, count: 0 };
        }
      },

      importCatalog: (importedProducts: Product[]) => {
        const sanitized = sanitizeCatalogProducts(importedProducts);
        if (sanitized.length === 0) return { success: false, count: 0 };
        set((state) => {
          const currentList = Array.isArray(state.products) ? state.products : [];
          const mergedMap = new Map<string, Product>();
          currentList.forEach((p) => mergedMap.set(p.slug || p.id, p));
          sanitized.forEach((p) => mergedMap.set(p.slug || p.id, p));
          return { products: Array.from(mergedMap.values()) };
        });
        notifyStoreUpdated();
        return { success: true, count: sanitized.length };
      },

      // Orders
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        }));
      },

      updateOrderTracking: (orderId, carrier, trackingNumber) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, carrier, trackingNumber, status: "In Transit" } : o
          ),
        }));
      },

      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },

      // Coupons
      addCoupon: (coupon) => {
        set((state) => ({
          coupons: [coupon, ...state.coupons],
        }));
      },

      updateCoupon: (id, updates) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteCoupon: (id) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id),
        }));
      },

      toggleCoupon: (id) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        }));
      },

      // Shipping
      updateShippingSettings: (settings) => {
        set((state) => ({
          shippingSettings: { ...state.shippingSettings, ...settings },
        }));
      },

      // CMS
      updateHero: (hero) => {
        set((state) => ({
          cms: {
            ...state.cms,
            hero: { ...state.cms.hero, ...hero },
          },
        }));
      },

      updateAnnouncement: (announcement) => {
        set((state) => ({
          cms: {
            ...state.cms,
            announcement: { ...state.cms.announcement, ...announcement },
          },
        }));
      },

      updateProvenance: (provenance) => {
        set((state) => ({
          cms: {
            ...state.cms,
            provenance: { ...state.cms.provenance, ...provenance },
          },
        }));
      },

      // Payments & Gateways
      togglePaymentMethod: (id) => {
        set((state) => ({
          paymentMethods: (state.paymentMethods || INITIAL_PAYMENT_METHODS).map((m) =>
            m.id === id ? { ...m, isEnabled: !m.isEnabled } : m
          ),
        }));
      },

      updatePaymentMethod: (id, updates) => {
        set((state) => ({
          paymentMethods: (state.paymentMethods || INITIAL_PAYMENT_METHODS).map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }));
      },

      addPaymentMethod: (method) => {
        set((state) => ({
          paymentMethods: [...(state.paymentMethods || INITIAL_PAYMENT_METHODS), method],
        }));
      },

      deletePaymentMethod: (id) => {
        set((state) => ({
          paymentMethods: (state.paymentMethods || INITIAL_PAYMENT_METHODS).filter((m) => m.id !== id),
        }));
      },

      resetPaymentMethods: () => {
        set({
          paymentMethods: INITIAL_PAYMENT_METHODS,
        });
      },

      refundTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, status: "Refunded" } : t
          ),
        }));
      },

      resetToFactoryDefaults: () => {
        set({
          products: [],
          orders: [],
          coupons: INITIAL_COUPONS,
          shippingSettings: INITIAL_SHIPPING,
          cms: INITIAL_CMS,
          transactions: [],
          paymentMethods: INITIAL_PAYMENT_METHODS,
        });
        notifyStoreUpdated();
      },
    }),
    {
      name: "loomsday-admin-storage-v5",
      storage: createJSONStorage(() => ({
        getItem: async (key): Promise<string | null> => {
          if (typeof window === "undefined") return null;
          cleanupStaleAdminStorage();

          // 1. Try reading from high-capacity IndexedDB
          try {
            const idbVal = await idbGet(key);
            if (idbVal && typeof idbVal === "string" && idbVal.length > 10) {
              try {
                const parsed = JSON.parse(idbVal);
                if (!Array.isArray(parsed?.state?.products) || parsed.state.products.length === 0) {
                  parsed.state.products = PRODUCTS;
                  return JSON.stringify(parsed);
                }
              } catch {}
              return idbVal;
            }
          } catch (e) {
            console.warn("[LOOMSDAY Store] IndexedDB getItem failed:", e);
          }

          // 2. Fall back to localStorage
          try {
            const localVal = localStorage.getItem(key);
            if (localVal) {
              try {
                const parsed = JSON.parse(localVal);
                if (!Array.isArray(parsed?.state?.products) || parsed.state.products.length === 0) {
                  parsed.state.products = PRODUCTS;
                  const healed = JSON.stringify(parsed);
                  idbSet(key, healed).catch(() => {});
                  return healed;
                }
              } catch {}
              // Background sync to IndexedDB for next load
              idbSet(key, localVal).catch(() => {});
              return localVal;
            }
          } catch (e) {
            console.error("[LOOMSDAY Store] localStorage getItem failed:", e);
          }

          return null;
        },

        setItem: async (key, value): Promise<void> => {
          if (typeof window === "undefined") return;
          cleanupStaleAdminStorage();

          // 1. Always store full fidelity state in IndexedDB (no 5MB limit!)
          try {
            await idbSet(key, value);
          } catch (idbErr) {
            console.warn("[LOOMSDAY Store] IndexedDB write failed:", idbErr);
          }

          // 2. Sync to localStorage for fast synchronous bootstrap
          try {
            localStorage.setItem(key, value);
          } catch (e) {
            console.warn("[LOOMSDAY Store] LocalStorage quota reached; caching optimized snapshot in localStorage (full data safely stored in IndexedDB):", e);
            try {
              const lightweight = createLightweightSnapshot(value);
              localStorage.setItem(key, lightweight);
            } catch (err2) {
              console.warn("[LOOMSDAY Store] LocalStorage recovery failed, but data is safe in IndexedDB:", err2);
            }
          }

          // 3. Notify all open views and listeners
          notifyStoreUpdated();
        },

        removeItem: async (key): Promise<void> => {
          if (typeof window === "undefined") return;
          try {
            await idbDelete(key);
          } catch {}
          try {
            localStorage.removeItem(key);
          } catch {}
          notifyStoreUpdated();
        },
      })),
    }
  )
);

