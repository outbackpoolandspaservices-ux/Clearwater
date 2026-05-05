import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCustomers } from "@/features/customers/data/customers";
import { getSitesWithSource } from "@/features/properties/data/sites";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function PropertiesPage() {
  const [customers, sitesResult] = await Promise.all([
    getCustomers(),
    getSitesWithSource(),
  ]);
  const { sites } = sitesResult;

  return (
    <SectionPage
      title="Properties"
      description="Service addresses, access notes, gate codes, geocoding, route metadata, and property-level service preferences."
    >
      <SearchFilterBar
        actionHref="/properties/new"
        actionLabel="Add Property"
        filterLabel="All suburbs"
        filterOptions={["Alice Springs", "Gillen", "Larapinta", "East Side"]}
        searchPlaceholder="Search sites by address, suburb, customer, or access note"
      />

      <section className="grid gap-4 xl:grid-cols-2">
        {sites.map((site) => {
          const customer = customers.find((item) => item.id === site.customerId);

          return (
            <Link
              key={site.id}
              className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:shadow-sm"
              href={`/properties/${site.id}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    {site.address}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">{site.suburb}</p>
                </div>
                <StatusBadge
                  tone={site.status === "Active" ? "success" : "warning"}
                >
                  {site.status}
                </StatusBadge>
              </div>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-slate-500">
                    Customer / owner / agent
                  </dt>
                  <dd className="mt-1 text-slate-950">
                    {customer?.name ?? site.ownerOrAgent}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Pool count</dt>
                  <dd className="mt-1 text-slate-950">{site.poolIds.length}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-medium text-slate-500">Access warning</dt>
                  <dd className="mt-1 text-amber-700">{site.accessWarning}</dd>
                </div>
              </dl>
            </Link>
          );
        })}
      </section>
    </SectionPage>
  );
}
