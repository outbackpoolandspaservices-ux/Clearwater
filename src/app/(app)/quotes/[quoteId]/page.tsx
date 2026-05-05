import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionPage } from "@/components/app-shell/section-page";
import { DetailCard, DetailList } from "@/components/ui/detail-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCustomerById } from "@/features/customers/data/customers";
import { getJobById } from "@/features/jobs/data/jobs";
import { getPoolById } from "@/features/pools/data/pools";
import { getSiteById } from "@/features/properties/data/sites";
import { getQuoteById } from "@/features/quotes/data/quotes";
import { getReportById } from "@/features/reports/data/reports";

type QuoteDetailPageProps = {
  params: Promise<{
    quoteId: string;
  }>;
};

function statusTone(status: string) {
  if (status === "Approved" || status === "Accepted") return "success" as const;
  if (status === "Sent") return "warning" as const;
  return "neutral" as const;
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function QuoteDetailPage({ params }: QuoteDetailPageProps) {
  const { quoteId } = await params;
  const quote = await getQuoteById(quoteId);

  if (!quote) {
    notFound();
  }

  const [customer, site, pool, job, report] = await Promise.all([
    quote.customerId ? getCustomerById(quote.customerId) : Promise.resolve(undefined),
    quote.siteId ? getSiteById(quote.siteId) : Promise.resolve(undefined),
    quote.poolId ? getPoolById(quote.poolId) : Promise.resolve(undefined),
    quote.jobId ? getJobById(quote.jobId) : Promise.resolve(undefined),
    quote.reportId ? getReportById(quote.reportId) : Promise.resolve(undefined),
  ]);

  return (
    <SectionPage
      title={`${quote.number}: ${quote.title}`}
      description="Quote preview with line items, approval placeholders, and conversion planning."
    >
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge tone={statusTone(quote.status)}>{quote.status}</StatusBadge>
        <StatusBadge>{quote.approvalStatus}</StatusBadge>
        <p className="text-sm text-slate-600">
          {quote.quoteDate} · expires {quote.expiryDate}
        </p>
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DetailCard title="Quote summary">
          <DetailList
            items={[
              { label: "Quote number", value: quote.number },
              { label: "Quote date", value: quote.quoteDate },
              { label: "Expiry date", value: quote.expiryDate },
              { label: "Subtotal", value: quote.subtotal },
              { label: "GST", value: quote.gst },
              { label: "Total", value: quote.totalAmount },
            ]}
          />
        </DetailCard>
        <DetailCard title="Quote actions">
          <div className="grid gap-2 sm:grid-cols-2">
            {["Send Quote", "Customer Approval", "Convert to Job", "Convert to Invoice"].map(
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

      <DetailCard title="Line items">
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
              {quote.lineItems.map((item) => (
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
        <DetailCard title="Terms and conditions placeholder">
          <p className="text-sm leading-6 text-slate-700">{quote.terms}</p>
        </DetailCard>
        <DetailCard title="Customer approval placeholder">
          <p className="text-sm leading-6 text-slate-700">
            Customer approval, digital signature, acceptance timestamp, and
            portal approval history will be added later.
          </p>
        </DetailCard>
      </section>
    </SectionPage>
  );
}
