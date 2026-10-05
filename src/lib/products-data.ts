import { Product } from "@/types";

/**
 * Baseline catalog products.
 * Empty by default so custom-added products are exclusively featured.
 * Demo templates can be loaded on-demand via the Admin Atelier if desired.
 */
export const PRODUCTS: Product[] = [];

export interface CrossSellItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  tagline: string;
  size: string;
  colorName: string;
  colorHex: string;
}

// Bespoke Cross-Sell Items for Mini Cart and Drawer
export const CROSS_SELL_ITEMS: CrossSellItem[] = [
  {
    id: "cs-1",
    name: "Natural Lavender Linen Mist",
    slug: "natural-lavender-linen-mist",
    price: 28,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaRnZ1PQF0OEyclGJ_WHgJWj8cg3MUBgmS4Diq9w0pa0HF570lEkiyhnH0n0Nz73gGLDsxqQsgFKgIQQNHn4wzxk1k0hcKLKROLBr001AFYkzAam6bFlkCYavKTjwABr_ThAAHxF38Cp-8WM97GayFtGdlh6FWzyF2raquroccsF9Ce5diGGuhwWpDhUcH8ExrgsZzMzIGhRHXbmL-FxBsUKFIBTohjeaYEHo6Cy15pVCpV1kbK_PKyw",
    tagline: "Organic French Provence Elixir",
    size: "100ml",
    colorName: "Amber Glass",
    colorHex: "#C59B27",
  },
  {
    id: "cs-2",
    name: "Pure Silk Sleep Eye Mask",
    slug: "pure-silk-sleep-eye-mask",
    price: 35,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_q35MAgcDrpiVaZ-YkI2s70wMrVlcBKzmKS0N4rmTjpF9OS2j9ggL0cxz3CgeagnDKPOPoXtfYlkt2ce6ZT2Emq0kMt9iQm5uxT9_HQar4aZOu4mJb0PxCad0mIdFl0mNuhB7P8XYTujbG8d3Hw6EBHZE6uzR_ewrwbm_HzZyRTPmUud0VWlZNIZLa0XBSqh4Kf-qN74DyeuLjlEkTSOyLg_E1-S_UWIszzG4eCBJoq6L0aOerqclJA",
    tagline: "22-Momme Mulberry Silk",
    size: "One Size",
    colorName: "Champagne",
    colorHex: "#DFCFB2",
  },
];
