import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCustomers } from "@/features/customers/data/customers";
import { getJobsWithSource } from "@/features/jobs/data/jobs";
import { getPoolsWithSource } from "@/features/pools/data/pools";
import { getSites } from "@/features/properties/data/sites";
import { getWaterTestsWithSource } from "@/features/water-testing/data/water-tests";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function PoolsPage() {
  const [customers, jobsResult, poolsResult, sites, testsResult] =
    await Promise.all([
      getCustomers(),
      getJobsWithSource(),
      getPoolsWithSource(),
      getSites(),
      getWaterTestsWithSource(),
    ]);
  const { pools } = poolsResult;

  return (
    <SectionPage
      title="Pools"
      description="Pool profiles with volume, surface, sanitation type, site notes, service cadence, and water testing history."
    >
      <SearchFilterBar
        actionHref="/pools/new"
        actionLabel="Add Pool"
        filterLabel="All alert statuses"
        filterOptions={["Balanced", "Phosphate alert", "Monitor alkalinity", "pH high"]}
        searchPlaceholder="Search pools by name, location, surface, or sanitiser"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pools.map((pool) => (
          <Link
            key={pool.id}
            className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:shadow-sm"
            href={`/pools/${pool.id}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  {pool.name || "Unnamed pool"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {pool.location || "Location not recorded"}
                </p>
              </div>
              <StatusBadge
                tone={pool.alertStatus === "Balanced" ? "success" : "warning"}
              >
                {pool.alertStatus}
              </StatusBadge>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Customer</dt>
                <dd className="text-right font-medium text-slate-900">
                  {customers.find(
                    (customer) =>
                      customer.id ===
                      sites.find((site) => site.id === pool.siteId)?.customerId,
                  )?.name ?? "Not linked"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Property/Site</dt>
                <dd className="text-right font-medium text-slate-900">
                  {sites.find((site) => site.id === pool.siteId)?.address ??
                    pool.location ??
                    "Not recorded"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Volume</dt>
                <dd className="font-medium text-slate-900">
                  {pool.volumeLitres.toLocaleString("en-AU")} L
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Surface</dt>
                <dd className="font-medium text-slate-900">
                  {pool.surfaceType || "Not recorded"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Sanitiser</dt>
                <dd className="font-medium text-slate-900">
                  {pool.sanitiserType || "Not recorded"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Last test</dt>
                <dd className="font-medium text-slate-900">
                  {testsResult.waterTests.find((test) => test.poolId === pool.id)
                    ?.date ??
                    pool.lastTestDate ??
                    "No tests yet"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Next job</dt>
                <dd className="text-right font-medium text-slate-900">
                  {jobsResult.jobs.find(
                    (job) => job.poolId === pool.id && job.status !== "Completed",
                  )?.scheduledDate ?? "Not scheduled"}
                </dd>
              </div>
            </dl>
          </Link>
        ))}
      </section>
    </SectionPage>
  );
}
