import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { getCustomers } from "@/features/customers/data/customers";
import { getJobs } from "@/features/jobs/data/jobs";
import { getPools } from "@/features/pools/data/pools";
import { getSites } from "@/features/properties/data/sites";
import { QuoteForm } from "@/features/quotes/quote-form";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function NewQuotePage() {
  const [customers, sites, pools, jobs] = await Promise.all([
    getCustomers(),
    getSites(),
    getPools(),
    getJobs(),
  ]);

  return (
    <SectionPage
      title="Create Quote"
      description="Create a draft customer quote with the first line item. Quote approval and conversion actions remain placeholders."
    >
      <Link
        className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
        href="/quotes"
      >
        Back to quotes
      </Link>
      <QuoteForm
        customers={customers.map((customer) => ({
          id: customer.id,
          label: customer.name,
        }))}
        jobs={jobs.map((job) => ({
          id: job.id,
          label: `${job.jobNumber} - ${job.title}`,
        }))}
        pools={pools.map((pool) => ({ id: pool.id, label: pool.name }))}
        sites={sites.map((site) => ({
          id: site.id,
          label: `${site.name} - ${site.suburb}`,
        }))}
      />
    </SectionPage>
  );
}
