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
            url: `/images/products/${r.slug}.jpg`,
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
        size: v.size || "King",
        colorName: v.color_name || "Warm Ivory",
        colorHex: v.color_hex || "#FAF7F2",
        price: Number(v.price) || Number(r.base_price) || 1900,
        retailPrice: fallback?.retailPrice || Math.round((Number(v.price) || Number(r.base_price) || 1900) * 1.35),
        stock: typeof v.stock === "number" ? v.stock : 30,
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
            size: "King",
            colorName: "Warm Ivory",
            colorHex: "#FAF7F2",
            price: Number(r.base_price) || 1900,
            retailPrice: fallback?.retailPrice || Math.round((Number(r.base_price) || 1900) * 1.35),
            stock: 30,
            sku: `SKU-${r.slug || r.id}-KNG`,
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
        tagline: r.tagline || fallback?.tagline || r.name,
        description: r.description || fallback?.description || "",
        category: (r.categories?.slug as any) || fallback?.category || "bedsheets",
        categoryLabel: r.categories?.name || fallback?.categoryLabel || "Bedsheets",
        basePrice: Number(r.base_price) || fallback?.basePrice || 1900,
        retailPrice: fallback?.retailPrice || Math.round((Number(r.base_price) || fallback?.basePrice || 1900) * 1.35),
        rating: Number(r.rating) || fallback?.rating || 5.0,
        reviewCount: Number(r.review_count) || fallback?.reviewCount || 1,
        material: r.material || fallback?.material || "100% Pure Cotton",
        thread_count_or_gsm: r.thread_count_or_gsm || fallback?.threadCountOrGsm || "300 TC",
        origin: r.origin || fallback?.origin || "Pakistan",
        isBestSeller: Boolean(r.is_bestseller),
        isNewArrival: Boolean(r.is_new_arrival),
        availableSizes: availableSizes.length > 0 ? availableSizes : fallback?.availableSizes || ["King"],
        availableColors: availableColors.length > 0 ? availableColors : fallback?.availableColors || [{ name: "Warm Ivory", hex: "#FAF7F2" }],
        features: fallback?.features || ["100% Pure Cotton Luxury Craftsmanship", "Generously Tailored King Sizing", "Long Staple Breathable Weave"],
        dimensions: fallback?.dimensions || { fitted: "King size", flat: "87*95 in" },
        images,
        variants,
      };
    });

    // Ensure all master catalog products from PRODUCTS are included even if Supabase has fewer items
    const existingSlugs = new Set(mapped.map((m) => m.slug));
    const existingIds = new Set(mapped.map((m) => m.id));
    for (const bp of PRODUCTS) {
      if (!existingSlugs.has(bp.slug) && !existingIds.has(bp.id)) {
        mapped.push(bp);
      }
    }

    return mapped;
  } catch (err) {
    console.warn("[LOOMSDAY Catalog] Unexpected error fetching Supabase catalog:", err);
    return null;
  }
}

function isValidUUID(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

function stringToUUID(str: string): string {
  let hash1 = 0x811c9dc5;
  let hash2 = 0x5bf4b33b;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash1 = (hash1 ^ ch) * 0x01000193;
    hash2 = (hash2 ^ (ch << 1)) * 0x01000193;
  }
  const hex1 = Math.abs(hash1).toString(16).padStart(8, "0");
  const hex2 = Math.abs(hash2).toString(16).padStart(8, "0");
  const hex3 = Math.abs(hash1 ^ hash2).toString(16).padStart(8, "0");
  const hex4 = Math.abs((hash1 + hash2) * 31).toString(16).padStart(8, "0");
  const full = (hex1 + hex2 + hex3 + hex4).padEnd(32, "0").slice(0, 32);
  return `${full.slice(0, 8)}-${full.slice(8, 12)}-4${full.slice(13, 16)}-a${full.slice(17, 20)}-${full.slice(20, 32)}`;
}

/**
 * Pushes and synchronizes local products to Supabase cloud database
 */
export async function pushProductsToSupabase(products: Product[]): Promise<{ success: boolean; count: number }> {
  if (!isSupabaseConfigured) return { success: false, count: 0 };
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { success: false, count: 0 };

  try {
    const categoryId = "c0000000-0000-0000-0000-000000000001"; // Bedsheets default
    let upsertedCount = 0;

    for (const p of products) {
      const pUUID = isValidUUID(p.id) ? p.id : stringToUUID("loomsday-prod-" + p.slug);

      const { error: pErr } = await supabase.from("products").upsert(
        {
          id: pUUID,
          category_id: categoryId,
          name: p.name,
          slug: p.slug,
          tagline: p.tagline || p.name,
          description: p.description || "",
          base_price: Number(p.basePrice) || 1900,
          rating: Number(p.rating) || 5.0,
          review_count: Number(p.reviewCount) || 1,
          material: p.material || "100% Pure Cotton",
          thread_count_or_gsm: p.threadCountOrGsm || "300 TC",
          origin: p.origin || "Pakistan",
          is_bestseller: Boolean(p.isBestSeller),
          is_new_arrival: Boolean(p.isNewArrival),
        },
        { onConflict: "slug" }
      );

      if (pErr) {
        console.warn("[LOOMSDAY Cloud Sync] Product upsert error:", pErr);
        continue;
      }

      // Upsert variants
      const variants = p.variants && p.variants.length > 0 ? p.variants : [
        { id: "", productId: p.id, size: "King", colorName: "Warm Ivory", colorHex: "#FAF7F2", price: p.basePrice, stock: 30, sku: `SKU-${p.slug.toUpperCase()}-1` }
      ];

      for (let vIdx = 0; vIdx < variants.length; vIdx++) {
        const v = variants[vIdx] as any;
        const vUUID = isValidUUID(v.id) ? v.id : stringToUUID("loomsday-var-" + p.slug + "-" + vIdx);
        await supabase.from("product_variants").upsert(
          {
            id: vUUID,
            product_id: pUUID,
            size: v.size || "King",
            color_name: v.colorName || "Warm Ivory",
            color_hex: v.colorHex || "#FAF7F2",
            price: Number(v.price) || Number(p.basePrice) || 1900,
            stock: typeof v.stock === "number" ? v.stock : 30,
            sku: v.sku || `SKU-${p.slug.toUpperCase()}-${vIdx + 1}`,
          },
          { onConflict: "id" }
        );
      }

      // Upsert images
      const images = p.images && p.images.length > 0 ? p.images : [
        { id: "", productId: p.id, url: `/images/products/${p.slug}.jpg`, altText: p.name, sortOrder: 0, isPrimary: true }
      ];

      for (let imgIdx = 0; imgIdx < images.length; imgIdx++) {
        const img = images[imgIdx] as any;
        const imgUUID = isValidUUID(img.id) ? img.id : stringToUUID("loomsday-img-" + p.slug + "-" + imgIdx);
        await supabase.from("product_images").upsert(
          {
            id: imgUUID,
            product_id: pUUID,
            url: img.url || `/images/products/${p.slug}.jpg`,
            alt_text: img.altText || p.name,
            sort_order: img.sortOrder ?? imgIdx,
            is_primary: Boolean(img.isPrimary ?? (imgIdx === 0)),
          },
          { onConflict: "id" }
        );
      }

      upsertedCount++;
    }

    return { success: true, count: upsertedCount };
  } catch (e) {
    console.warn("[LOOMSDAY Cloud Sync] Push error:", e);
    return { success: false, count: 0 };
  }
}

/**
 * Deletes a product and its associated variants/images from Supabase
 */
export async function deleteProductFromSupabase(idOrSlug: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return false;

  try {
    const isUUID = isValidUUID(idOrSlug);
    if (isUUID) {
      await supabase.from("products").delete().eq("id", idOrSlug);
    } else {
      await supabase.from("products").delete().eq("slug", idOrSlug);
    }
    return true;
  } catch (e) {
    console.warn("[LOOMSDAY Catalog] Supabase delete error:", e);
    return false;
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
