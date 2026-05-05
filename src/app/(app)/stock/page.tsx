import { SectionPage } from "@/components/app-shell/section-page";
import { getChemicalProducts } from "@/features/chemicals/data/chemicals";
import { getStockWithSource } from "@/features/stock/data/stock";
import { StockWorkspace } from "@/features/stock/stock-workspace";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function StockPage() {
  const [{ stock, usage }, products] = await Promise.all([
    getStockWithSource(),
    getChemicalProducts(),
  ]);

  return (
    <SectionPage
      title="Stock"
      description="Van inventory, low-stock warnings, mock stock movement, supplier placeholders, and job consumption tracking."
    >
      <StockWorkspace
        products={products}
        stockRecords={stock}
        usageRecords={usage}
      />
    </SectionPage>
  );
}
