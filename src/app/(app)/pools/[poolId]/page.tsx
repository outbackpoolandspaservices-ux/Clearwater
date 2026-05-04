import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionPage } from "@/components/app-shell/section-page";
import { DetailCard, DetailList } from "@/components/ui/detail-card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPoolById } from "@/features/pools/data/pools";
import { getSiteById } from "@/features/properties/data/sites";
import {
  getEquipmentForPool,
  getWaterTestsForPool,
} from "@/lib/mock-data";

type PoolDetailPageProps = {
  params: Promise<{
    poolId: string;
  }>;
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function PoolDetailPage({ params }: PoolDetailPageProps) {
  const { poolId } = await params;
  const pool = await getPoolById(poolId);

  if (!pool) {
    notFound();
  }

  const site = await getSiteById(pool.siteId);
  const linkedEquipment = getEquipmentForPool(pool.id);
  const recentTests = getWaterTestsForPool(pool.id);

  return (
    <SectionPage
      title={pool.name || "Unnamed pool"}
      description="Pool profile with chemistry targets, equipment, recent water tests, and service notes."
    >
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge tone={pool.alertStatus === "Balanced" ? "success" : "warning"}>
          {pool.alertStatus}
        </StatusBadge>
        {site ? (
          <Link
            className="text-sm font-medium text-cyan-700 hover:text-cyan-900"
            href={`/properties/${site.id}`}
          >
            {site.name}
          </Link>
        ) : null}
      </div>

      <section className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Pool details">
          <DetailList
            items={[
              {
                label: "Volume",
                value: `${pool.volumeLitres.toLocaleString("en-AU")} L`,
              },
              { label: "Pool type", value: pool.poolType || "Not recorded" },
              {
                label: "Surface type",
                value: pool.surfaceType || "Not recorded",
              },
              {
                label: "Sanitiser system",
                value: pool.sanitiserType || "Not recorded",
              },
              { label: "Last test date", value: pool.lastTestDate || "No tests yet" },
            ]}
          />
        </DetailCard>

        <DetailCard title="Target chemistry ranges">
          <p className="text-sm leading-6 text-slate-700">
            {pool.targetRanges || "Targets not recorded"}
          </p>
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <DetailCard title="Linked equipment">
          {linkedEquipment.length > 0 ? (
            <div className="space-y-3">
              {linkedEquipment.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border border-slate-200 p-4 text-sm"
                >
                  <p className="font-semibold text-slate-950">{item.type}</p>
                  <p className="mt-1 text-slate-600">
                    {item.brand} {item.model}
                  </p>
                  <p className="mt-2 text-cyan-700">{item.condition}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              description="Equipment records linked to this pool will appear here."
              title="No equipment linked"
            />
          )}
        </DetailCard>

        <DetailCard title="Recent water tests">
          {recentTests.length > 0 ? (
            <div className="space-y-3">
              {recentTests.map((test) => (
                <div
                  key={test.id}
                  className="grid gap-3 rounded-md border border-slate-200 p-4 text-sm md:grid-cols-[120px_repeat(4,1fr)]"
                >
                  <p className="font-medium text-slate-500">{test.date}</p>
                  <p>
                    <span className="text-slate-500">FC </span>
                    <span className="font-medium text-slate-950">
                      {test.freeChlorine}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-500">pH </span>
                    <span className="font-medium text-slate-950">{test.ph}</span>
                  </p>
                  <p>
                    <span className="text-slate-500">TA </span>
                    <span className="font-medium text-slate-950">
                      {test.alkalinity}
                    </span>
                  </p>
                  <p className="font-medium text-cyan-700">{test.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              description="Water test history will appear here after service visits."
              title="No water tests"
            />
          )}
        </DetailCard>
      </section>

      <DetailCard title="Service notes">
        <p className="text-sm leading-6 text-slate-700">
          {pool.serviceNotes || "No service notes recorded"}
        </p>
      </DetailCard>
    </SectionPage>
  );
}
