import { Product } from "@/types";

export const DEMO_PRODUCTS: Product[] = [
  // 1. The French Flax Linen Sheet Set (Hero / Bestseller)
  {
    id: "prod-1",
    name: "The French Flax Linen Sheet Set",
    slug: "french-flax-linen-sheet-set",
    tagline: "Stone-Washed Normandy Flax • Impossibly Soft from Night One",
    description: "Crafted from 100% long-staple French flax harvested in Normandy. Pre-washed with volcanic stones for signature lived-in drape, breathability, and exceptional temperature regulation. OEKO-TEX Standard 100 certified free from harmful synthetics.",
    category: "bedsheets",
    categoryLabel: "Bedsheets",
    basePrice: 28500,
    retailPrice: 34500,
    rating: 4.9,
    reviewCount: 438,
    material: "100% French Flax Linen",
    threadCountOrGsm: "175 GSM",
    origin: "Normandy, France",
    isBestSeller: true,
    availableSizes: ["Full", "Queen", "King", "Cal King"],
    availableColors: [
      { name: "Warm Ivory", hex: "#FAF7F2" },
      { name: "Soft Sand", hex: "#E8DFD0" },
      { name: "Muted Sage", hex: "#C2C9BC" },
      { name: "Dune Mist", hex: "#D6CEBF" },
      { name: "French Charcoal", hex: "#3B3A36" },
    ],
    features: [
      "Woven from slow-harvested 100% Normandy flax",
      "Pumice stone-washed for instant lived-in handfeel",
      "Deep 16\" fitted sheet pocket with 360° high-tensile elastic",
      "Includes 1 fitted sheet, 1 flat sheet, and 2 tailored envelope pillowcases",
      "OEKO-TEX® Standard 100 Certified (Zero formaldehyde & toxic dyes)",
    ],
    dimensions: {
      fitted: "60\" W × 80\" L + 16\" deep pocket (Queen)",
      flat: "96\" W × 108\" L with 4\" double-turned cuff",
      cases: "20\" W × 30\" L with deep 8\" interior envelope closure",
    },
    images: [
      {
        id: "img-1-1",
        productId: "prod-1",
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4-I1K4vbNsICIYjZwoz76sC8eark0SaLCinQ02L5WbuHtIK9LKjZHfbdct-MVjWJSFfhuGfB7cdqZigy00l7f5qJANIQ7KWF5_og5iivfRMvVDcdTsEP7fPkt5RehCVzYUPKR7JagrOTXZlR3QyYU4L2H5WQSLA0MRUHM4ZB0sniWUsXZGquPIyFldicPjdfkWIyhoGllR5wOP4SOGxscuAPOLf7YSSpnJNZp3kRWAy-JthZi_vhtBQ",
        altText: "French flax linen bedsheet set draped over a low-profile platform bed in morning sunlight",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: "v-1-1", productId: "prod-1", size: "Full", colorName: "Warm Ivory", colorHex: "#FAF7F2", price: 26500, retailPrice: 32000, stock: 12, sku: "FLX-SHT-FUL-IVR" },
      { id: "v-1-2", productId: "prod-1", size: "Queen", colorName: "Warm Ivory", colorHex: "#FAF7F2", price: 28500, retailPrice: 34500, stock: 24, sku: "FLX-SHT-QEN-IVR" },
      { id: "v-1-3", productId: "prod-1", size: "King", colorName: "Warm Ivory", colorHex: "#FAF7F2", price: 31000, retailPrice: 37500, stock: 18, sku: "FLX-SHT-KNG-IVR" },
      { id: "v-1-4", productId: "prod-1", size: "Cal King", colorName: "Warm Ivory", colorHex: "#FAF7F2", price: 31500, retailPrice: 38000, stock: 9, sku: "FLX-SHT-CLK-IVR" },
    ],
  },
];
