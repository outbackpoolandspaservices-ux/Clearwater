import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPoolsWithSource } from "@/features/pools/data/pools";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function PoolsPage() {
  const { count, pools, source } = await getPoolsWithSource();

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

      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
        <span className="font-semibold text-slate-950">Data source:</span>{" "}
        {source}
        <span className="mx-2 text-slate-300">|</span>
        <span className="font-semibold text-slate-950">
          Pool records loaded:
        </span>{" "}
        {count}
      </div>

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
                  {pool.lastTestDate || "No tests yet"}
                </dd>
              </div>
            </dl>
          </Link>
        ))}
      </section>
    </SectionPage>
  );
}
