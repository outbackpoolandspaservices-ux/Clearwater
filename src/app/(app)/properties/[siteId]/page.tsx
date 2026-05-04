import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionPage } from "@/components/app-shell/section-page";
import { DetailCard, DetailList } from "@/components/ui/detail-card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCustomerById } from "@/features/customers/data/customers";
import { getPoolsForSite } from "@/features/pools/data/pools";
import { getSiteById } from "@/features/properties/data/sites";
import { getJobsForSite } from "@/lib/mock-data";

type SiteDetailPageProps = {
  params: Promise<{
    siteId: string;
  }>;
};

export default async function SiteDetailPage({ params }: SiteDetailPageProps) {
  const { siteId } = await params;
  const site = await getSiteById(siteId);

  if (!site) {
    notFound();
  }

  const [customer, pools] = await Promise.all([
    getCustomerById(site.customerId),
    getPoolsForSite(site.id),
  ]);
  const recentJobs = getJobsForSite(site.id);

  return (
    <SectionPage
      title={site.name}
      description="Site profile with access instructions, owner or agent context, linked pools, and recent job history."
    >
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge tone={site.status === "Active" ? "success" : "warning"}>
          {site.status}
        </StatusBadge>
        <p className="text-sm text-slate-600">
          {site.address}, {site.suburb}
        </p>
      </div>

      <section className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Address">
          <DetailList
            items={[
              { label: "Street address", value: site.address },
              { label: "Suburb", value: site.suburb },
              {
                label: "Customer / owner / agent",
                value: customer ? (
                  <Link
                    className="font-medium text-cyan-700 hover:text-cyan-900"
                    href={`/customers/${customer.id}`}
                  >
                    {customer.name}
                  </Link>
                ) : (
                  site.ownerOrAgent
                ),
              },
            ]}
          />
        </DetailCard>

        <DetailCard title="Access instructions">
          <DetailList
            items={[
              { label: "Access notes", value: site.accessNotes },
              { label: "Gate code", value: site.gateCode },
              { label: "Pets / dog warnings", value: site.petWarning },
              { label: "Access warning", value: site.accessWarning },
            ]}
          />
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Tenant details">
          <p className="text-sm leading-6 text-slate-700">{site.tenantDetails}</p>
        </DetailCard>

        <DetailCard title="Owner / agent details">
          <p className="text-sm leading-6 text-slate-700">
            {site.ownerAgentDetails}
          </p>
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <DetailCard title="Linked pools">
          {pools.length > 0 ? (
            <div className="space-y-3">
              {pools.map((pool) => (
                <Link
                  key={pool.id}
                  className="block rounded-md border border-slate-200 p-4 transition hover:border-cyan-300"
                  href={`/pools/${pool.id}`}
                >
                  <p className="font-semibold text-slate-950">{pool.name}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {pool.volumeLitres.toLocaleString("en-AU")} L,{" "}
                    {pool.sanitiserType}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              description="Add a pool profile once this site's water body details are known."
              title="No pools linked"
            />
          )}
        </DetailCard>

        <DetailCard title="Recent jobs">
          {recentJobs.length > 0 ? (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="rounded-md border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-950">
                    {job.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{job.date}</p>
                  <p className="mt-2 text-sm font-medium text-cyan-700">
                    {job.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              description="Jobs completed at this site will appear here."
              title="No recent jobs"
            />
          )}
        </DetailCard>
      </section>
    </SectionPage>
  );
}
