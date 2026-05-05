import { SectionPage } from "@/components/app-shell/section-page";
import { getChemicalProducts } from "@/features/chemicals/data/chemicals";
import { getStockWithSource } from "@/features/stock/data/stock";
import { StockWorkspace } from "@/features/stock/stock-workspace";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function StockPage() {
  const [{ count, source, stock, usage }, products] = await Promise.all([
    getStockWithSource(),
    getChemicalProducts(),
  ]);

  return (
    <SectionPage
      title="Stock"
      description="Van inventory, low-stock warnings, mock stock movement, supplier placeholders, and job consumption tracking."
    >
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">Data source:</span>{" "}
        {source} <span className="mx-2 text-slate-300">|</span>
        <span className="font-semibold text-slate-900">
          Stock records loaded:
        </span>{" "}
        {count}
      </div>
      <StockWorkspace
        products={products}
        stockRecords={stock}
        usageRecords={usage}
      />
    </SectionPage>
  );
}
