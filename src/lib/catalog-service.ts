import { Product } from "@/types";
import { PRODUCTS } from "@/lib/products-data";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Fetches products from Supabase database and supplements any partial rows
 * with baseline master catalog metadata.
 */
export async function fetchSupabaseProducts(): Promise<Product[] | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  try {
    const { data: rows, error } = await supabase
      .from("products")
      .select("*, categories(*), product_variants(*), product_images(*)")
      .order("created_at", { ascending: true });

    if (error || !Array.isArray(rows) || rows.length === 0) {
      if (error) console.warn("[LOOMSDAY Catalog] Supabase query error:", error);
      return null;
    }

    const masterMap = new Map<string, Product>();
    PRODUCTS.forEach((p) => {
      masterMap.set(p.slug, p);
      masterMap.set(p.id, p);
    });

    const mapped: Product[] = rows.map((r: any) => {
      const fallback = masterMap.get(r.slug) || masterMap.get(r.id);

      // Map images
      let images = (r.product_images || []).map((img: any) => ({
        id: img.id,
        productId: r.id,
        url: img.url,
        altText: img.alt_text || r.name,
        sortOrder: img.sort_order ?? 0,
        isPrimary: Boolean(img.is_primary),
      }));
      if (images.length === 0 && fallback?.images?.length) {
        images = fallback.images;
      }
      if (images.length === 0) {
        images = [
          {
            id: `img-${r.id}`,
            productId: r.id,
            url: "/images/hero-bedding.jpg",
            altText: r.name,
            sortOrder: 0,
            isPrimary: true,
          },
        ];
      }

      // Map variants
      let variants = (r.product_variants || []).map((v: any) => ({
        id: v.id,
        productId: r.id,
        size: v.size || "Queen",
        colorName: v.color_name || "Warm Ivory",
        colorHex: v.color_hex || "#FAF7F2",
        price: Number(v.price) || Number(r.base_price) || 285,
        retailPrice: Math.round((Number(v.price) || Number(r.base_price) || 285) * 1.25),
        stock: typeof v.stock === "number" ? v.stock : 25,
        sku: v.sku || `SKU-${r.slug || r.id}-${v.size}`,
      }));
      if (variants.length === 0 && fallback?.variants?.length) {
        variants = fallback.variants;
      }
      if (variants.length === 0) {
        variants = [
          {
            id: `v-${r.id}-1`,
            productId: r.id,
            size: "Queen",
            colorName: "Warm Ivory",
            colorHex: "#FAF7F2",
            price: Number(r.base_price) || 285,
            retailPrice: Math.round((Number(r.base_price) || 285) * 1.25),
            stock: 25,
            sku: `SKU-${r.slug || r.id}-QEN`,
          },
        ];
      }

      const availableSizes: string[] = Array.from(new Set(variants.map((v: any) => String(v.size))));
      const colorMap = new Map<string, string>();
      variants.forEach((v: any) => {
        if (v.colorName && v.colorHex) colorMap.set(String(v.colorName), String(v.colorHex));
      });
      const availableColors = Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));

      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        tagline: r.tagline || fallback?.tagline || "",
        description: r.description || fallback?.description || "",
        category: (r.categories?.slug as any) || fallback?.category || "bedsheets",
        categoryLabel: r.categories?.name || fallback?.categoryLabel || "Bedsheets",
        basePrice: Number(r.base_price) || fallback?.basePrice || 285,
        retailPrice: Math.round((Number(r.base_price) || fallback?.basePrice || 285) * 1.25),
        rating: Number(r.rating) || fallback?.rating || 4.9,
        reviewCount: Number(r.review_count) || fallback?.reviewCount || 100,
        material: r.material || fallback?.material || "100% French Flax Linen",
        threadCountOrGsm: r.thread_count_or_gsm || fallback?.threadCountOrGsm || "175 GSM",
        origin: r.origin || fallback?.origin || "Normandy, France",
        isBestSeller: Boolean(r.is_bestseller),
        isNewArrival: Boolean(r.is_new_arrival),
        availableSizes: availableSizes.length > 0 ? availableSizes : fallback?.availableSizes || ["Queen", "King"],
        availableColors: availableColors.length > 0 ? availableColors : fallback?.availableColors || [{ name: "Warm Ivory", hex: "#FAF7F2" }],
        features: fallback?.features || ["100% certified organic craftsmanship", "Tailored double-needle seams"],
        dimensions: fallback?.dimensions || { fitted: "Queen size", flat: "Standard flat" },
        images,
        variants,
      };
    });

    return mapped;
  } catch (err) {
    console.warn("[LOOMSDAY Catalog] Unexpected error fetching Supabase catalog:", err);
    return null;
  }
}

/**
 * Validates and normalizes raw JSON products for catalog import
 */
export function sanitizeCatalogProducts(rawProducts: any[]): Product[] {
  if (!Array.isArray(rawProducts)) return [];

  return rawProducts
    .filter((p) => p && typeof p === "object" && (p.name || p.id))
    .map((p, index) => {
      const id = String(p.id || `prod-import-${Date.now()}-${index}`);
      const name = String(p.name || `Luxury Bedding Piece ${index + 1}`);
      const slug = String(
        p.slug ||
          name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
      );
      const basePrice = Number(p.basePrice || p.price || 285);
      const category = p.category || "bedsheets";

      const rawVariants = Array.isArray(p.variants) ? p.variants : [];
      const variants =
        rawVariants.length > 0
          ? rawVariants.map((v: any, vIdx: number) => ({
              id: String(v.id || `v-${id}-${vIdx}`),
              productId: id,
              size: String(v.size || "Queen"),
              colorName: String(v.colorName || "Warm Ivory"),
              colorHex: String(v.colorHex || "#FAF7F2"),
              price: Number(v.price || basePrice),
              retailPrice: Number(v.retailPrice || Math.round(Number(v.price || basePrice) * 1.25)),
              stock: typeof v.stock === "number" ? Math.max(0, v.stock) : 20,
              sku: String(v.sku || `${slug.toUpperCase().slice(0, 3)}-${vIdx}`),
            }))
          : [
              {
                id: `v-${id}-1`,
                productId: id,
                size: "Queen",
                colorName: "Warm Ivory",
                colorHex: "#FAF7F2",
                price: basePrice,
                retailPrice: Math.round(basePrice * 1.25),
                stock: 20,
                sku: `${slug.toUpperCase().slice(0, 3)}-QEN`,
              },
            ];

      const rawImages = Array.isArray(p.images) ? p.images : [];
      const images =
        rawImages.length > 0
          ? rawImages.map((img: any, imgIdx: number) => ({
              id: String(img.id || `img-${id}-${imgIdx}`),
              productId: id,
              url: String(img.url || "/images/hero-bedding.jpg"),
              altText: String(img.altText || name),
              sortOrder: imgIdx,
              isPrimary: imgIdx === 0,
            }))
          : [
              {
                id: `img-${id}-1`,
                productId: id,
                url: "/images/hero-bedding.jpg",
                altText: name,
                sortOrder: 0,
                isPrimary: true,
              },
            ];

      return {
        id,
        name,
        slug,
        tagline: String(p.tagline || ""),
        description: String(p.description || "Mastercrafted quiet luxury linen."),
        category,
        categoryLabel: String(p.categoryLabel || category.charAt(0).toUpperCase() + category.slice(1)),
        basePrice,
        retailPrice: Number(p.retailPrice || Math.round(basePrice * 1.25)),
        rating: Number(p.rating || 4.9),
        reviewCount: Number(p.reviewCount || 100),
        material: String(p.material || "100% French Flax Linen"),
        threadCountOrGsm: String(p.threadCountOrGsm || "175 GSM"),
        origin: String(p.origin || "Normandy, France"),
        isBestSeller: Boolean(p.isBestSeller),
        isNewArrival: Boolean(p.isNewArrival),
        availableSizes: (Array.isArray(p.availableSizes) && p.availableSizes.length > 0
          ? p.availableSizes
          : Array.from(new Set(variants.map((v: any) => String(v.size))))) as string[],
        availableColors: Array.isArray(p.availableColors) && p.availableColors.length > 0
          ? p.availableColors
          : [{ name: "Warm Ivory", hex: "#FAF7F2" }],
        features: Array.isArray(p.features) ? p.features : ["100% certified organic craftsmanship"],
        dimensions: p.dimensions || { fitted: "Queen", flat: "Standard flat" },
        images,
        variants,
      };
    });
}

/**
 * Downloads active catalog as a formatted JSON backup
 */
export function exportCatalogToJson(products: Product[]): void {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify(products, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `loomsday-catalog-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
