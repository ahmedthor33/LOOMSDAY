import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products-data";
import { ProductDetailClientView } from "./ProductDetailClientView";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = true;

function findProductBySlug(slug: string) {
  const clean = slug.toLowerCase().trim();
  return (
    PRODUCTS.find(
      (p) =>
        p.slug.toLowerCase().trim() === clean ||
        p.id.toLowerCase().trim() === clean
    ) || null
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = findProductBySlug(slug);

  if (!product) {
    return {
      title: "Product | LOOMSDAY",
      description: "Quiet luxury bedding crafted for elevated rest.",
    };
  }

  const rawImg = product.images?.[0]?.url || "/images/hero-bedding.jpg";
  const imageUrl = rawImg.startsWith("http")
    ? rawImg
    : `https://loomsday.store${rawImg}`;
  const productUrl = `https://loomsday.store/product/${product.slug}`;
  const desc =
    product.tagline ||
    product.description?.replace(/\s+/g, " ").slice(0, 160) ||
    "Quiet luxury bedding crafted from slow-harvested natural fibers.";

  return {
    title: `${product.name} | LOOMSDAY`,
    description: desc,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} | LOOMSDAY`,
      description: desc,
      url: productUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
    },
    // Meta / Facebook Microdata Tags for Catalog Sync via Pixel
    other: {
      "product:brand": "LOOMSDAY",
      "product:availability": "in stock",
      "product:condition": "new",
      "product:price:amount": String(product.basePrice),
      "product:price:currency": "PKR",
      "product:retailer_item_id": product.id,
      "product:item_group_id": product.id,
      "product:category": product.categoryLabel || product.category || "Bedsheets",
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = findProductBySlug(resolvedParams.slug);

  let jsonLd: Record<string, any> | null = null;
  if (product) {
    const rawImg = product.images?.[0]?.url || "/images/hero-bedding.jpg";
    const imageUrl = rawImg.startsWith("http")
      ? rawImg
      : `https://loomsday.store${rawImg}`;

    jsonLd = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.name,
      image: [imageUrl],
      description: (product.description || product.tagline || "")
        .replace(/\s+/g, " ")
        .slice(0, 300),
      sku: product.id,
      mpn: product.id,
      brand: {
        "@type": "Brand",
        name: "LOOMSDAY",
      },
      offers: {
        "@type": "Offer",
        url: `https://loomsday.store/product/${product.slug}`,
        priceCurrency: "PKR",
        price: product.basePrice,
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    };
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClientView slug={resolvedParams.slug} />
    </>
  );
}
