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
      description="BioGuard-focused product intelligence for technician review, safety notes, Alice Springs water conditions, and links to van stock. Exact dosing automation is planned later."
    >
      <ChemicalsWorkspace products={products} />
    </SectionPage>
  );
}
