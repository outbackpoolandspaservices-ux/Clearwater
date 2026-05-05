import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionPage } from "@/components/app-shell/section-page";
import { DetailCard, DetailList } from "@/components/ui/detail-card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCustomerById } from "@/features/customers/data/customers";
import { getChemicalProducts } from "@/features/chemicals/data/chemicals";
import { getJobById } from "@/features/jobs/data/jobs";
import { getPoolById } from "@/features/pools/data/pools";
import { getSiteById } from "@/features/properties/data/sites";
import { buildChemicalRecommendations } from "@/features/water-testing/chemical-recommendations";
import { getWaterTestById } from "@/features/water-testing/data/water-tests";
import {
  bioGuardRecommendationCategories,
  getGuideRangesForPool,
  readingStatus,
} from "@/features/water-testing/guide-ranges";
import { RecommendationReviewForm } from "@/features/water-testing/recommendation-review-form";
import {
  getBioGuardProductById,
  getChemicalRecommendationsForTest,
  getTechnicianById,
} from "@/lib/mock-data";

const alertLabels = [
  "low chlorine",
  "high chlorine",
  "low pH",
  "high pH",
  "high phosphate",
  "high calcium hardness",
  "low alkalinity",
  "high alkalinity",
  "high cyanuric acid",
  "salt issue",
];

function alertTone(active: boolean) {
  return active ? ("warning" as const) : ("neutral" as const);
}

type WaterTestDetailPageProps = {
  params: Promise<{
    testId: string;
  }>;
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function WaterTestDetailPage({
  params,
}: WaterTestDetailPageProps) {
  const { testId } = await params;
  const test = await getWaterTestById(testId);

  if (!test) {
    notFound();
  }

  const pool = await getPoolById(test.poolId);
  const site =
    (test.siteId ? await getSiteById(test.siteId) : undefined) ??
    (pool?.siteId ? await getSiteById(pool.siteId) : undefined);
  const customer =
    (test.customerId ? await getCustomerById(test.customerId) : undefined) ??
    (site?.customerId ? await getCustomerById(site.customerId) : undefined);
  const technician = getTechnicianById(test.technicianId);
  const linkedJob = test.jobId ? await getJobById(test.jobId) : undefined;
  const legacyRecommendations = getChemicalRecommendationsForTest(test.id);
  const chemicalProducts = await getChemicalProducts();
  const recommendations = buildChemicalRecommendations({
    pool,
    products: chemicalProducts,
    test,
  });
  const guideRanges = getGuideRangesForPool(pool);
  const chemistryReadings = [
    ["Free chlorine", test.freeChlorine, guideRanges.freeChlorine],
    ["Total chlorine", test.totalChlorine, guideRanges.totalChlorine],
    ["Combined chlorine", test.combinedChlorine, guideRanges.combinedChlorine],
    ["pH", test.ph, guideRanges.ph],
    ["Total alkalinity", test.alkalinity, guideRanges.totalAlkalinity],
    ["Calcium hardness", test.calciumHardness, guideRanges.calciumHardness],
    ["Cyanuric acid", test.cyanuricAcid, guideRanges.cyanuricAcid],
    ["Salt", test.salt, guideRanges.salt],
    ["Phosphate", test.phosphate, guideRanges.phosphate],
    ["TDS", test.tds ?? "Not tested", guideRanges.tds],
    ["Water temperature", test.waterTemperature, guideRanges.waterTemperature],
  ] as const;

  return (
    <SectionPage
      title={`Water Test: ${pool?.name ?? test.id}`}
      description="Water test detail with chemistry readings, guide ranges, simple interpretation, and future SpinTouch/BioGuard-ready structure."
    >
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge tone={test.alertStatus === "Balanced" ? "success" : "warning"}>
          {test.alertStatus}
        </StatusBadge>
        <p className="text-sm text-slate-600">
          {test.date} at {test.time} · {test.source}
        </p>
      </div>

      <section className="grid gap-4 xl:grid-cols-3">
        <DetailCard title="Customer details">
          <DetailList
            items={[
              {
                label: "Customer",
                value: customer ? (
                  <Link
                    className="font-medium text-cyan-700 hover:text-cyan-900"
                    href={`/customers/${customer.id}`}
                  >
                    {customer.name}
                  </Link>
                ) : (
                  "No customer"
                ),
              },
              { label: "Phone", value: customer?.phone ?? "Not linked" },
              { label: "Email", value: customer?.email ?? "Not linked" },
            ]}
          />
        </DetailCard>

        <DetailCard title="Site details">
          <DetailList
            items={[
              {
                label: "Site",
                value: site ? (
                  <Link
                    className="font-medium text-cyan-700 hover:text-cyan-900"
                    href={`/properties/${site.id}`}
                  >
                    {site.name}
                  </Link>
                ) : (
                  "No site"
                ),
              },
              {
                label: "Address",
                value: site ? `${site.address}, ${site.suburb}` : "Not linked",
              },
              { label: "Access warning", value: site?.accessWarning ?? "None" },
            ]}
          />
        </DetailCard>

        <DetailCard title="Pool details">
          <DetailList
            items={[
              {
                label: "Pool",
                value: pool ? (
                  <Link
                    className="font-medium text-cyan-700 hover:text-cyan-900"
                    href={`/pools/${pool.id}`}
                  >
                    {pool.name}
                  </Link>
                ) : (
                  "No pool"
                ),
              },
              {
                label: "Volume",
                value: pool
                  ? `${pool.volumeLitres.toLocaleString("en-AU")} L`
                  : "Not linked",
              },
              { label: "Sanitiser", value: pool?.sanitiserType ?? "Not linked" },
            ]}
          />
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <DetailCard title="Test summary">
          <DetailList
            items={[
              { label: "Technician", value: technician?.name ?? "Not assigned" },
              { label: "Test date", value: test.date },
              { label: "Test time", value: test.time },
              { label: "Source", value: test.source },
              { label: "Notes", value: test.notes },
            ]}
          />
        </DetailCard>

        <DetailCard title="Guide chemistry ranges">
          <p className="text-sm leading-6 text-slate-700">
            These are practical guide ranges shown during testing, not fixed pool
            profile targets. Future logic will adjust by pool type, sanitiser
            system, chlorinator/equipment settings, surface, water source, and
            BioGuard catalogue rules.
          </p>
          {pool?.sanitiserType?.toLowerCase().includes("salt") ? (
            <p className="mt-3 text-sm leading-6 text-amber-700">
              Salt guide should be based on chlorinator manufacturer requirement.
              TODO: connect detailed Equipment/chlorinator profiles.
            </p>
          ) : null}
        </DetailCard>
      </section>

      <DetailCard title="Full water chemistry readings">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {chemistryReadings.map(([label, value, guide]) => (
            <div
              key={label}
              className="rounded-md border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {value}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
                {readingStatus(value, guide)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Guide: {guide.low ?? 0}
                {guide.high !== undefined ? ` - ${guide.high}` : "+"}{" "}
                {guide.unit}
              </p>
            </div>
          ))}
        </div>
      </DetailCard>

      <DetailCard title="Readings outside guide range">
        <div className="flex flex-wrap gap-2">
          {alertLabels.map((label) => {
            const active = (test.alerts as readonly string[]).includes(label);

            return (
              <StatusBadge key={label} tone={alertTone(active)}>
                {active ? label : `No ${label}`}
              </StatusBadge>
            );
          })}
        </div>
      </DetailCard>

      <DetailCard title="Chemical recommendation foundation">
        {recommendations.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {recommendations.map((recommendation) => {
              return (
                <article
                  key={recommendation.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <p className="text-sm font-semibold text-amber-700">
                    {recommendation.issue}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-slate-950">
                    {recommendation.suggestedCategory}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {recommendation.reviewNote}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {recommendation.possibleProducts.length > 0 ? (
                      recommendation.possibleProducts.map((product) => (
                        <Link
                          className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
                          href={`/chemicals/${product.id}`}
                          key={product.id}
                        >
                          {product.name}
                        </Link>
                      ))
                    ) : (
                      <StatusBadge>Service recommendation</StatusBadge>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <EmptyState
              description="BioGuard product recommendations will later use catalogue data, Alice Springs water context, pool history, and technician review. No exact dosing is calculated yet."
              title="Product intelligence planned"
            />
            <div className="flex flex-wrap gap-2">
              {bioGuardRecommendationCategories.map((category) => (
                <StatusBadge key={category}>{category}</StatusBadge>
              ))}
            </div>
          </div>
        )}
        <RecommendationReviewForm
          jobId={linkedJob?.id}
          recommendations={recommendations}
          testId={test.id}
        />
        {legacyRecommendations.length > 0 ? (
          <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">
              Legacy mock treatment examples retained for reference
            </p>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              {legacyRecommendations.map((recommendation) => {
                const product = getBioGuardProductById(recommendation.productId);

                return (
                  <div
                    className="rounded-md border border-slate-200 bg-white p-3 text-sm"
                    key={recommendation.id}
                  >
                    <p className="font-semibold text-slate-950">
                      {product?.name ?? recommendation.productId}
                    </p>
                    <p className="mt-1 text-slate-600">
                      {recommendation.issue}
                    </p>
                    <p className="mt-1 text-slate-500">
                      Review-required example only. Full dosing automation comes
                      later.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </DetailCard>

      <section className="grid gap-4 xl:grid-cols-3">
        <DetailCard title="Chemicals added">
          {test.chemicalsAdded.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {test.chemicalsAdded.map((chemical) => (
                <StatusBadge key={chemical}>{chemical}</StatusBadge>
              ))}
            </div>
          ) : (
            <EmptyState
              description="Chemicals used during service will appear here."
              title="No chemicals recorded"
            />
          )}
        </DetailCard>

        <DetailCard title="Linked job">
          {linkedJob ? (
            <Link
              className="block rounded-md border border-slate-200 p-4 transition hover:border-cyan-300"
              href={`/jobs/${linkedJob.id}`}
            >
              <p className="font-semibold text-slate-950">
                {linkedJob.jobNumber}
              </p>
              <p className="mt-1 text-sm text-slate-600">{linkedJob.title}</p>
              <p className="mt-2 text-sm font-medium text-cyan-700">
                {linkedJob.status}
              </p>
            </Link>
          ) : (
            <EmptyState
              description="This standalone water test is not linked to a job."
              title="No linked job"
            />
          )}
        </DetailCard>

        <DetailCard title="Report placeholder">
          <EmptyState
            description="Customer-friendly water test and dosing report generation will be added later."
            title="Report not generated yet"
          />
        </DetailCard>
      </section>
    </SectionPage>
  );
}
