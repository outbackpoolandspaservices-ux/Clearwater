import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { getChemicalProducts } from "@/features/chemicals/data/chemicals";
import { StockForm } from "@/features/stock/stock-form";
import { technicians } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function NewStockPage() {
  const products = await getChemicalProducts();

  return (
    <SectionPage
      title="Add Stock"
      description="Add a chemical or product stock record to a technician van or service location."
    >
      <div className="flex">
        <Link
          className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
          href="/stock"
        >
          Back to stock
        </Link>
      </div>
      <StockForm products={products} technicians={technicians} />
    </SectionPage>
  );
}
