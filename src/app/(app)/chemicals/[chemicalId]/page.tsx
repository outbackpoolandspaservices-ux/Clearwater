import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionPage } from "@/components/app-shell/section-page";
import { DetailCard, DetailList } from "@/components/ui/detail-card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getBioGuardProductById,
  getCustomerById,
  getJobById,
  getStockEntriesForProduct,
  getStockUsageForProduct,
  getTechnicianById,
} from "@/lib/mock-data";

type ChemicalDetailPageProps = {
  params: Promise<{
    chemicalId: string;
  }>;
};

function stockTone(status: string) {
  if (status === "Low stock") return "danger" as const;
  if (status === "Watch") return "warning" as const;
  return "success" as const;
}

export default async function ChemicalDetailPage({
  params,
}: ChemicalDetailPageProps) {
  const { chemicalId } = await params;
  const product = getBioGuardProductById(chemicalId);

  if (!product) {
    notFound();
  }

  const stockEntries = getStockEntriesForProduct(product.id);
  const usageEntries = getStockUsageForProduct(product.id);

  return (
    <SectionPage
      title={product.name}
      description="Mock BioGuard Australia product detail for dosing context, safety handling, van stock, and recent job usage."
    >
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge tone="success">{product.status}</StatusBadge>
        <StatusBadge>{product.brand}</StatusBadge>
        <StatusBadge>{product.category}</StatusBadge>
      </div>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <DetailCard title="Product summary">
          <DetailList
            items={[
              { label: "Brand", value: product.brand },
              { label: "Category", value: product.category },
              { label: "Purpose", value: product.purpose },
              { label: "Unit type", value: product.unitType },
              { label: "Product strength", value: product.productStrength },
              { label: "Status", value: product.status },
            ]}
          />
        </DetailCard>

        <DetailCard title="Dosing notes">
          <p className="text-sm leading-6 text-slate-700">
            {product.dosingNotes}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Dosing is mock/planned only and will later use pool volume, target
            ranges, measured readings, and reviewed product rules.
          </p>
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Application instructions">
          <p className="text-sm leading-6 text-slate-700">
            {product.applicationMethod}
          </p>
        </DetailCard>

        <DetailCard title="Safety and handling">
          <p className="text-sm leading-6 text-slate-700">
            {product.handlingNote}
          </p>
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Related water issues">
          <div className="flex flex-wrap gap-2">
            {product.relatedWaterIssues.map((issue) => (
              <StatusBadge key={issue}>{issue}</StatusBadge>
            ))}
          </div>
        </DetailCard>

        <DetailCard title="Alternative products placeholder">
          <EmptyState
            description="Alternative products and substitution rules will be added when the chemical intelligence model is expanded."
            title="No alternatives configured yet"
          />
        </DetailCard>
      </section>

      <DetailCard title="Linked van stock">
        {stockEntries.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {stockEntries.map((stock) => {
              const technician = getTechnicianById(stock.technicianId);

              return (
                <div
                  className="rounded-md border border-slate-200 p-4 text-sm"
                  key={stock.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">
                        {stock.vanName}
                      </p>
                      <p className="mt-1 text-slate-500">{technician?.role}</p>
                    </div>
                    <StatusBadge tone={stockTone(stock.stockStatus)}>
                      {stock.stockStatus}
                    </StatusBadge>
                  </div>
                  <DetailList
                    items={[
                      {
                        label: "On hand",
                        value: `${stock.quantityOnHand} ${stock.unit}`,
                      },
                      {
                        label: "Low threshold",
                        value: `${stock.lowStockThreshold} ${stock.unit}`,
                      },
                      { label: "Unit cost", value: stock.unitCost },
                      { label: "Selling price", value: stock.sellingPrice },
                    ]}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            description="Van stock entries linked to this product will appear here."
            title="No van stock linked"
          />
        )}
      </DetailCard>

      <DetailCard title="Linked recent job usage">
        {usageEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Job</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Quantity</th>
                  <th className="px-4 py-3 font-semibold">Cost</th>
                  <th className="px-4 py-3 font-semibold">Charge</th>
                  <th className="px-4 py-3 font-semibold">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usageEntries.map((usage) => {
                  const job = getJobById(usage.jobId);
                  const customer = job
                    ? getCustomerById(job.customerId)
                    : undefined;

                  return (
                    <tr key={usage.id}>
                      <td className="px-4 py-3">
                        <Link
                          className="font-semibold text-slate-950 hover:text-cyan-700"
                          href={`/jobs/${usage.jobId}`}
                        >
                          {job?.jobNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {customer?.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {usage.quantityUsed}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {usage.cost}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-950">
                        {usage.chargeAmount}
                      </td>
                      <td className="px-4 py-3 text-cyan-700">
                        {usage.margin}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            description="Chemical usage from completed jobs will appear here."
            title="No job usage linked"
          />
        )}
      </DetailCard>
    </SectionPage>
  );
}
