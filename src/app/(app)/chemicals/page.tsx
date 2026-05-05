import { SectionPage } from "@/components/app-shell/section-page";
import { getChemicalProductsWithSource } from "@/features/chemicals/data/chemicals";
import { ChemicalsWorkspace } from "@/features/chemicals/chemicals-workspace";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function ChemicalsPage() {
  const { count, products, source } = await getChemicalProductsWithSource();

  return (
    <SectionPage
      title="Chemicals"
      description="Chemical catalogue, unit handling, safety notes, dosing references, and links to stock usage."
    >
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">Data source:</span>{" "}
        {source} <span className="mx-2 text-slate-300">|</span>
        <span className="font-semibold text-slate-900">
          Product records loaded:
        </span>{" "}
        {count}
      </div>
      <ChemicalsWorkspace products={products} />
    </SectionPage>
  );
}
