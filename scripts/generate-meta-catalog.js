const fs = require('fs');
const path = require('path');

// Read products-data.ts or import products
const rootDir = process.cwd();
const productsDataPath = path.join(rootDir, 'src', 'lib', 'products-data.ts');

function escapeXml(unsafe) {
  return (unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeCsv(val) {
  const str = (val || "").toString().replace(/"/g, '""');
  return `"${str}"`;
}

// Extract products JSON from products-data.ts
const content = fs.readFileSync(productsDataPath, 'utf8');
const match = content.match(/export const PRODUCTS: Product\[\] = (\[[\s\S]*?\]);\s*$/m);

let products = [];
if (match) {
  try {
    products = JSON.parse(match[1]);
  } catch (e) {
    console.error('Failed to JSON parse products:', e.message);
  }
}

if (!products.length) {
  console.error('No products found to export!');
  process.exit(1);
}

const baseUrl = 'https://loomsday.store';

// 1. Generate XML (Google Shopping / Meta RSS 2.0 format)
const itemsXml = products.map((p) => {
  const rawImg = p.images?.[0]?.url || '/images/hero-bedding.jpg';
  const imageUrl = rawImg.startsWith('http') ? rawImg : `${baseUrl}${rawImg}`;
  const productLink = `${baseUrl}/product/${p.slug}`;
  const cleanDesc = (p.description || p.tagline || p.name)
    .replace(/[\r\n\t]+/g, ' ')
    .slice(0, 5000);

  return `    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <g:title>${escapeXml(p.name)}</g:title>
      <g:description>${escapeXml(cleanDesc)}</g:description>
      <g:link>${escapeXml(productLink)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:brand>LOOMSDAY</g:brand>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${Number(p.basePrice).toFixed(2)} PKR</g:price>
      <g:item_group_id>${escapeXml(p.id)}</g:item_group_id>
      <g:google_product_category>Home &amp; Garden &gt; Linens &amp; Bedding &gt; Bedding</g:google_product_category>
      <g:product_type>${escapeXml(p.categoryLabel || p.category || "Bedding")}</g:product_type>
    </item>`;
}).join('\n');

const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>LOOMSDAY Official Atelier Product Catalog</title>
    <link>${baseUrl}</link>
    <description>LOOMSDAY quiet luxury bedding products synchronized for Meta Ads &amp; Commerce Catalog</description>
${itemsXml}
  </channel>
</rss>`;

// 2. Generate CSV
const csvHeaders = [
  "id",
  "title",
  "description",
  "availability",
  "condition",
  "price",
  "link",
  "image_link",
  "brand",
  "google_product_category",
  "fb_product_category",
  "item_group_id"
];

const csvRows = products.map((p) => {
  const rawImg = p.images?.[0]?.url || '/images/hero-bedding.jpg';
  const imageUrl = rawImg.startsWith('http') ? rawImg : `${baseUrl}${rawImg}`;
  const productLink = `${baseUrl}/product/${p.slug}`;
  const cleanDesc = (p.description || p.tagline || p.name)
    .replace(/[\r\n\t]+/g, ' ')
    .slice(0, 5000);

  return [
    escapeCsv(p.id),
    escapeCsv(p.name),
    escapeCsv(cleanDesc),
    escapeCsv("in stock"),
    escapeCsv("new"),
    escapeCsv(`${Number(p.basePrice).toFixed(2)} PKR`),
    escapeCsv(productLink),
    escapeCsv(imageUrl),
    escapeCsv("LOOMSDAY"),
    escapeCsv("Home & Garden > Linens & Bedding > Bedding"),
    escapeCsv("bedding"),
    escapeCsv(p.id)
  ].join(",");
});

const csvContent = [csvHeaders.join(","), ...csvRows].join("\n");

// Write files to public/
const publicDir = path.join(rootDir, 'public');
fs.writeFileSync(path.join(publicDir, 'meta-catalog.xml'), xmlContent, 'utf8');
fs.writeFileSync(path.join(publicDir, 'meta-catalog.csv'), csvContent, 'utf8');

// Also write to dist/ if it exists
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'meta-catalog.xml'), xmlContent, 'utf8');
  fs.writeFileSync(path.join(distDir, 'meta-catalog.csv'), csvContent, 'utf8');
}

console.log(`✓ Generated static Meta Catalog files:`);
console.log(`  - public/meta-catalog.xml (${products.length} products)`);
console.log(`  - public/meta-catalog.csv (${products.length} products)`);
