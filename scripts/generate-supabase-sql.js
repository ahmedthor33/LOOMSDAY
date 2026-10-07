const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function toUUID(str) {
  const h = crypto.createHash('md5').update(str).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

function escapeSql(str) {
  if (str === null || str === undefined) return "''";
  return "'" + String(str).replace(/'/g, "''") + "'";
}

const cleanJsonPath = path.join(__dirname, '..', 'src', 'lib', 'products-data-clean.json');
const products = JSON.parse(fs.readFileSync(cleanJsonPath, 'utf8'));

let sql = `-- ==============================================================================
-- LOOMSDAY: 81-Product Catalog Sync & Permission Unlock
-- ==============================================================================

-- 1. UNLOCK RLS PERMISSIONS FOR CATALOG MANAGEMENT
-- Allows the store owner terminal to push products, variants, and images
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images DISABLE ROW LEVEL SECURITY;

-- Ensure default category exists
INSERT INTO public.categories (id, name, slug, description, sort_order)
VALUES ('c0000000-0000-0000-0000-000000000001', 'Bedsheets', 'bedsheets', 'Pure Normandy flax and organic cotton bedsheet sets.', 1)
ON CONFLICT (slug) DO NOTHING;

-- 2. INSERT / UPSERT ALL 81 PRODUCTS
`;

const categoryId = 'c0000000-0000-0000-0000-000000000001';

for (const p of products) {
  const pUUID = toUUID('loomsday-prod-' + p.slug);
  const basePrice = Number(p.basePrice) || 1900;
  const rating = Number(p.rating) || 5.0;
  const reviewCount = Number(p.reviewCount) || 1;
  const isBest = Boolean(p.isBestSeller);
  const isNew = Boolean(p.isNewArrival);

  sql += `
INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '${pUUID}', '${categoryId}', ${escapeSql(p.name)}, ${escapeSql(p.slug)}, ${escapeSql(p.tagline || p.name)},
  ${escapeSql(p.description || '')}, ${basePrice}, ${rating}, ${reviewCount}, ${escapeSql(p.material || '100% Pure Cotton')},
  ${escapeSql(p.threadCountOrGsm || '300 TC')}, ${escapeSql(p.origin || 'Pakistan')}, ${isBest}, ${isNew}
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
`;

  const variants = p.variants && p.variants.length > 0 ? p.variants : [
    { size: 'King', colorName: 'Warm Ivory', colorHex: '#FAF7F2', price: p.basePrice, stock: 30, sku: `SKU-${p.slug.toUpperCase()}-1` }
  ];

  variants.forEach((v, vIdx) => {
    const vUUID = toUUID('loomsday-var-' + p.slug + '-' + vIdx);
    const vPrice = Number(v.price) || basePrice;
    const vStock = typeof v.stock === 'number' ? v.stock : 30;
    const vSku = v.sku || `SKU-${p.slug.toUpperCase()}-${vIdx + 1}`;

    sql += `INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('${vUUID}', '${pUUID}', ${escapeSql(v.size || 'King')}, ${escapeSql(v.colorName || 'Warm Ivory')}, ${escapeSql(v.colorHex || '#FAF7F2')}, ${vPrice}, ${vStock}, ${escapeSql(vSku)})
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
`;
  });

  const images = p.images && p.images.length > 0 ? p.images : [
    { url: `/images/products/${p.slug}.jpg`, altText: p.name, sortOrder: 0, isPrimary: true }
  ];

  images.forEach((img, imgIdx) => {
    const imgUUID = toUUID('loomsday-img-' + p.slug + '-' + imgIdx);
    const imgUrl = img.url || `/images/products/${p.slug}.jpg`;
    const isPrimary = Boolean(img.isPrimary ?? (imgIdx === 0));

    sql += `INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('${imgUUID}', '${pUUID}', ${escapeSql(imgUrl)}, ${escapeSql(img.altText || p.name)}, ${img.sortOrder ?? imgIdx}, ${isPrimary})
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;
`;
  });
}

const outSqlPath = path.join(__dirname, '..', 'supabase', 'sync_81_products.sql');
fs.writeFileSync(outSqlPath, sql, 'utf8');
console.log(`Generated SQL file with 81 products at ${outSqlPath}`);
