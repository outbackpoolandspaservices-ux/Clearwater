import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionPage } from "@/components/app-shell/section-page";
import { DetailCard, DetailList } from "@/components/ui/detail-card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getCustomerById,
  getBioGuardProductById,
  getInvoiceById,
  getJobProfitabilityByJobId,
  getJobById,
  getPaymentsForInvoice,
  getPoolById,
  getReportById,
  getSiteById,
  getStockUsageForInvoice,
} from "@/lib/mock-data";

type InvoiceDetailPageProps = {
  params: Promise<{
    invoiceId: string;
  }>;
};

function paymentTone(status: string) {
  if (status === "Paid") return "success" as const;
  if (status === "Overdue") return "danger" as const;
  if (status === "Partially paid") return "warning" as const;
  return "neutral" as const;
}

function xeroTone(status: string) {
  if (status === "Synced") return "success" as const;
  if (status === "Sync failed") return "danger" as const;
  if (status === "Ready to sync") return "warning" as const;
  return "neutral" as const;
}

export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { invoiceId } = await params;
  const invoice = getInvoiceById(invoiceId);

  if (!invoice) {
    notFound();
  }

  const customer = getCustomerById(invoice.customerId);
  const site = getSiteById(invoice.siteId);
  const pool = getPoolById(invoice.poolId);
  const job = getJobById(invoice.jobId);
  const report = invoice.reportId ? getReportById(invoice.reportId) : undefined;
  const paymentHistory = getPaymentsForInvoice(invoice.id);
  const stockUsage = getStockUsageForInvoice(invoice.id);
  const profitability = getJobProfitabilityByJobId(invoice.jobId);

  return (
    <SectionPage
      title={`${invoice.number}: Invoice`}
      description="Mock invoice preview with payment history and Xero planning placeholders."
    >
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge tone={paymentTone(invoice.paymentStatus)}>
          {invoice.paymentStatus}
        </StatusBadge>
        <StatusBadge tone={xeroTone(invoice.xeroSyncStatus)}>
          {invoice.xeroSyncStatus}
        </StatusBadge>
        <p className="text-sm text-slate-600">
          Due {invoice.dueDate} · {invoice.totalAmount}
        </p>
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DetailCard title="Invoice summary">
          <DetailList
            items={[
              { label: "Invoice number", value: invoice.number },
              { label: "Invoice date", value: invoice.invoiceDate },
              { label: "Due date", value: invoice.dueDate },
              { label: "Subtotal", value: invoice.subtotal },
              { label: "GST", value: invoice.gst },
              { label: "Total", value: invoice.totalAmount },
            ]}
          />
        </DetailCard>
        <DetailCard title="Invoice actions">
          <div className="grid gap-2 sm:grid-cols-2">
            {["Send Invoice", "Add Payment", "Payment Link", "Sync with Xero"].map(
              (action) => (
                <button
                  className="rounded-md border border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
                  key={action}
                  type="button"
                >
                  {action} Placeholder
                </button>
              ),
            )}
          </div>
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <DetailCard title="Customer details">
          <DetailList
            items={[
              { label: "Customer", value: customer?.name ?? "Not linked" },
              { label: "Phone", value: customer?.phone ?? "Not linked" },
              { label: "Email", value: customer?.email ?? "Not linked" },
            ]}
          />
        </DetailCard>
        <DetailCard title="Site details">
          <DetailList
            items={[
              { label: "Site", value: site?.name ?? "Not linked" },
              {
                label: "Address",
                value: site ? `${site.address}, ${site.suburb}` : "Not linked",
              },
              { label: "Pool", value: pool?.name ?? "Not linked" },
            ]}
          />
        </DetailCard>
        <DetailCard title="Linked records">
          <DetailList
            items={[
              {
                label: "Linked job",
                value: job ? (
                  <Link
                    className="font-medium text-cyan-700 hover:text-cyan-900"
                    href={`/jobs/${job.id}`}
                  >
                    {job.jobNumber}
                  </Link>
                ) : (
                  "No job linked"
                ),
              },
              {
                label: "Linked report",
                value: report ? (
                  <Link
                    className="font-medium text-cyan-700 hover:text-cyan-900"
                    href={`/reports/${report.id}`}
                  >
                    {report.reportNumber}
                  </Link>
                ) : (
                  "No report linked"
                ),
              },
            ]}
          />
        </DetailCard>
      </section>

      <DetailCard title="Invoice line items">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Quantity</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.lineItems.map((item) => (
                <tr key={`${item.type}-${item.description}`}>
                  <td className="px-4 py-3 font-medium text-slate-950">
                    {item.type}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                  <td className="px-4 py-3 font-medium text-slate-950">
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailCard>

      <section className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Payment history">
          {paymentHistory.length > 0 ? (
            <div className="space-y-3">
              {paymentHistory.map((payment) => (
                <div
                  className="grid gap-2 rounded-md border border-slate-200 p-4 text-sm sm:grid-cols-[1fr_1fr_1fr_1fr]"
                  key={payment.id}
                >
                  <p className="font-medium text-slate-950">{payment.date}</p>
                  <p className="text-slate-600">{payment.amount}</p>
                  <p className="text-slate-600">{payment.method}</p>
                  <p className="font-medium text-cyan-700">{payment.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              description="Payments recorded against this invoice will appear here."
              title="No payments recorded"
            />
          )}
        </DetailCard>

        <DetailCard title="Payment link placeholder">
          <p className="text-sm leading-6 text-slate-700">
            A hosted payment link will be generated here once a payment provider
            is connected. This is a planning placeholder only.
          </p>
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <DetailCard title="Profitability placeholder">
          {profitability ? (
            <DetailList
              items={[
                { label: "Labour time", value: profitability.labourTime },
                { label: "Travel time", value: profitability.travelTime },
                { label: "Chemical cost", value: profitability.chemicalCost },
                { label: "Parts cost", value: profitability.partsCost },
                { label: "Invoice value", value: profitability.invoiceValue },
                {
                  label: "Estimated margin",
                  value: profitability.estimatedMargin,
                },
              ]}
            />
          ) : (
            <EmptyState
              description="Invoice profitability planning values will appear here once job costing is connected."
              title="No profitability data"
            />
          )}
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Mock/planned only. This is not real accounting logic yet.
          </p>
        </DetailCard>

        <DetailCard title="Linked stock usage">
          {stockUsage.length > 0 ? (
            <div className="space-y-3">
              {stockUsage.map((usage) => {
                const product = getBioGuardProductById(usage.productId);

                return (
                  <div
                    className="grid gap-3 rounded-md border border-slate-200 p-4 text-sm sm:grid-cols-[1fr_120px_120px_120px]"
                    key={usage.id}
                  >
                    <Link
                      className="font-semibold text-slate-950 hover:text-cyan-700"
                      href={`/chemicals/${usage.productId}`}
                    >
                      {product?.name}
                    </Link>
                    <p className="text-slate-600">{usage.quantityUsed}</p>
                    <p className="text-slate-600">{usage.cost}</p>
                    <p className="font-medium text-cyan-700">
                      {usage.chargeAmount}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              description="Chemical or product usage linked to this invoice will appear here."
              title="No stock usage linked"
            />
          )}
        </DetailCard>
      </section>

      <DetailCard title="Xero sync planning">
        <div className="grid gap-4 xl:grid-cols-[240px_1fr]">
          <div>
            <p className="text-sm font-medium text-slate-500">Current status</p>
            <div className="mt-2">
              <StatusBadge tone={xeroTone(invoice.xeroSyncStatus)}>
                {invoice.xeroSyncStatus}
              </StatusBadge>
            </div>
          </div>
          <div className="space-y-2 text-sm leading-6 text-slate-700">
            <p>Xero connection will be added later.</p>
            <p>Invoices should eventually sync to Xero.</p>
            <p>Payment status should eventually sync back from Xero.</p>
          </div>
        </div>
      </DetailCard>
    </SectionPage>
  );
}
