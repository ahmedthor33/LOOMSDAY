import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/products-data";

function escapeXml(unsafe: string): string {
  return (unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeCsv(val: string): string {
  const str = (val || "").replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format")?.toLowerCase();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://loomsday.store";

  // CSV Output
  if (format === "csv") {
    const headers = [
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
      "item_group_id",
    ];

    const rows = PRODUCTS.map((p) => {
      const rawImg = p.images?.[0]?.url || "/images/hero-bedding.jpg";
      const imageUrl = rawImg.startsWith("http")
        ? rawImg
        : `${baseUrl}${rawImg}`;
      const productLink = `${baseUrl}/product/${p.slug}`;
      const cleanDesc = (p.description || p.tagline || p.name)
        .replace(/[\r\n\t]+/g, " ")
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
        escapeCsv(p.id),
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Content-Disposition": 'inline; filename="loomsday-meta-catalog.csv"',
      },
    });
  }

  // Default: XML / RSS 2.0 (Google Shopping / Meta Product Feed specification)
  const itemsXml = PRODUCTS.map((p) => {
    const rawImg = p.images?.[0]?.url || "/images/hero-bedding.jpg";
    const imageUrl = rawImg.startsWith("http")
      ? rawImg
      : `${baseUrl}${rawImg}`;
    const productLink = `${baseUrl}/product/${p.slug}`;
    const cleanDesc = (p.description || p.tagline || p.name)
      .replace(/[\r\n\t]+/g, " ")
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
  }).join("\n");

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>LOOMSDAY Official Atelier Product Catalog</title>
    <link>${baseUrl}</link>
    <description>LOOMSDAY quiet luxury bedding products synchronized for Meta Ads &amp; Commerce Catalog</description>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xmlContent, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
