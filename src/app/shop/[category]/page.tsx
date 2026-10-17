import type { Metadata } from "next";
import { CategoryClientView } from "./CategoryClientView";

export function generateStaticParams() {
  return [
    { category: "bedsheets" },
    { category: "pillows" },
    { category: "duvets" },
  ];
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const resolved = await params;
  const cat = resolved.category?.toLowerCase() || "";
  const title =
    cat === "pillows"
      ? "Pillows & cushions Covers | LOOMSDAY"
      : cat === "bedsheets"
      ? "Bedsheets | LOOMSDAY"
      : cat === "duvets"
      ? "Duvets & Inserts | LOOMSDAY"
      : `${resolved.category} | LOOMSDAY`;
  return {
    title,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  return <CategoryClientView category={resolvedParams.category} />;
}
