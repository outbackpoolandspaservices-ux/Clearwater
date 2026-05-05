import { SectionPage } from "@/components/app-shell/section-page";
import { getChemicalProducts } from "@/features/chemicals/data/chemicals";
import { getStockWithSource } from "@/features/stock/data/stock";
import { StockWorkspace } from "@/features/stock/stock-workspace";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

type StockPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function StockPage({ searchParams }: StockPageProps) {
  const params = searchParams ? await searchParams : {};
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
        initialFilter={firstParam(params.filter)}
        initialSearch={firstParam(params.search)}
        products={products}
        stockRecords={stock}
        usageRecords={usage}
      />
    </SectionPage>
  );
}
