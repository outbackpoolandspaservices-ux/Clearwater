import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { getInvoicesWithSource } from "@/features/invoices/data/invoices";
import { getQuotesWithSource } from "@/features/quotes/data/quotes";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

function amount(value: string) {
  const parsed = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value: number) {
  return new Intl.NumberFormat("en-AU", {
    currency: "AUD",
    style: "currency",
  }).format(value);
}

export default async function DashboardFinancePage() {
  const [quotesResult, invoicesResult] = await Promise.all([
    getQuotesWithSource(),
    getInvoicesWithSource(),
  ]);

  const unpaidInvoices = invoicesResult.invoices.filter(
    (invoice) => invoice.paymentStatus !== "Paid",
  );
  const invoiceTotal = invoicesResult.invoices.reduce(
    (sum, invoice) => sum + amount(invoice.totalAmount),
    0,
  );
  const unpaidTotal = unpaidInvoices.reduce(
    (sum, invoice) => sum + amount(invoice.totalAmount),
    0,
  );
  const averageInvoice =
    invoicesResult.invoices.length > 0
      ? invoiceTotal / invoicesResult.invoices.length
      : 0;
  const pendingQuotes = quotesResult.quotes.filter((quote) =>
    ["Draft", "Sent", "Pending", "Awaiting approval"].includes(quote.status),
  );
  const acceptedQuotes = quotesResult.quotes.filter((quote) =>
    ["Accepted", "Approved"].includes(quote.status),
  );

  return (
    <SectionPage
      title="Dashboard Finance"
      description="Commercial foundation for invoices, quotes, unpaid value, and future Xero/payment reporting."
    >
      <div className="flex flex-wrap gap-3">
        <Link
          className="rounded-md border border-cyan-200 px-3 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
          href="/dashboard"
        >
          Back to Dashboard
        </Link>
        <Link
          className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          href="/dashboard/analytics"
        >
          Analytics View
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            href: "/invoices",
            label: "Revenue placeholder",
            value: money(invoiceTotal),
          },
          {
            href: "/invoices",
            label: "Invoices count",
            value: invoicesResult.invoices.length,
          },
          {
            href: "/invoices?status=unpaid",
            label: "Unpaid invoice amount",
            value: money(unpaidTotal),
          },
          {
            href: "/invoices",
            label: "Average invoice value",
            value: money(averageInvoice),
          },
        ].map((metric) => (
          <Link
            className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:bg-cyan-50"
            href={metric.href}
            key={metric.label}
          >
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">
              {metric.value}
            </p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Link
          className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:bg-cyan-50"
          href="/quotes?status=pending"
        >
          <p className="text-sm font-medium text-slate-500">Quotes pending</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {pendingQuotes.length}
          </p>
        </Link>
        <Link
          className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:bg-cyan-50"
          href="/quotes?status=accepted"
        >
          <p className="text-sm font-medium text-slate-500">Quotes accepted</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {acceptedQuotes.length}
          </p>
        </Link>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">
            Chemical/labour line items
          </p>
          <p className="mt-3 text-xl font-semibold text-slate-950">
            Planned reporting
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Line item margin, labour recovery, and BioGuard product sales will
            be reported after invoice and stock usage data matures.
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
        <h2 className="text-base font-semibold text-amber-950">
          Xero and payment integration planned
        </h2>
        <p className="mt-2 text-sm leading-6 text-amber-900">
          This page uses ClearWater invoice and quote records only. Xero sync,
          payment gateway settlement, CSV exports, and accounting reconciliation
          are deliberately placeholders until the core service workflow is stable.
        </p>
      </section>
    </SectionPage>
  );
}
