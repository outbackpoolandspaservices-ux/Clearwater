import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { getCustomers } from "@/features/customers/data/customers";
import { InvoiceForm } from "@/features/invoices/invoice-form";
import { getJobs } from "@/features/jobs/data/jobs";
import { getPools } from "@/features/pools/data/pools";
import { getSites } from "@/features/properties/data/sites";
import { getQuotes } from "@/features/quotes/data/quotes";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function NewInvoicePage() {
  const [customers, sites, pools, jobs, quotes] = await Promise.all([
    getCustomers(),
    getSites(),
    getPools(),
    getJobs(),
    getQuotes(),
  ]);

  return (
    <SectionPage
      title="Create Invoice"
      description="Create a draft customer invoice with the first line item. Xero and payment collection stay as placeholders."
    >
      <Link
        className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
        href="/invoices"
      >
        Back to invoices
      </Link>
      <InvoiceForm
        customers={customers.map((customer) => ({
          id: customer.id,
          label: customer.name,
        }))}
        jobs={jobs.map((job) => ({
          id: job.id,
          label: `${job.jobNumber} - ${job.title}`,
        }))}
        pools={pools.map((pool) => ({ id: pool.id, label: pool.name }))}
        quotes={quotes.map((quote) => ({
          id: quote.id,
          label: `${quote.number} - ${quote.title}`,
        }))}
        sites={sites.map((site) => ({
          id: site.id,
          label: `${site.name} - ${site.suburb}`,
        }))}
      />
    </SectionPage>
  );
}
