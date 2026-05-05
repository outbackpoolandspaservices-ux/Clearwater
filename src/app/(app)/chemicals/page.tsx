import { SectionPage } from "@/components/app-shell/section-page";
import { getChemicalProductsWithSource } from "@/features/chemicals/data/chemicals";
import { ChemicalsWorkspace } from "@/features/chemicals/chemicals-workspace";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function ChemicalsPage() {
  const { products } = await getChemicalProductsWithSource();

  return (
    <SectionPage
      title="Chemicals"
      description="Chemical catalogue, unit handling, safety notes, dosing references, and links to stock usage."
    >
      <ChemicalsWorkspace products={products} />
    </SectionPage>
  );
}
