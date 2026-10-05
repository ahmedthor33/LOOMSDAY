import { CategoryClientView } from "./CategoryClientView";

export function generateStaticParams() {
  return [
    { category: "bedsheets" },
    { category: "pillows" },
    { category: "duvets" },
  ];
}

export const dynamicParams = true;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  return <CategoryClientView category={resolvedParams.category} />;
}
