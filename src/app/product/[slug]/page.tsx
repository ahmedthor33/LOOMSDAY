import { DEMO_PRODUCTS } from "@/lib/demo-products-data";
import { ProductDetailClientView } from "./ProductDetailClientView";

export function generateStaticParams() {
  return DEMO_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = true;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return <ProductDetailClientView slug={resolvedParams.slug} />;
}
