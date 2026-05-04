import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionPage } from "@/components/app-shell/section-page";
import { DetailCard, DetailList } from "@/components/ui/detail-card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getBioGuardProductById,
  getChemicalRecommendationsForTest,
  getCustomerById,
  getJobById,
  getPoolById,
  getSiteById,
  getTechnicianById,
  getWaterTestById,
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

export default async function WaterTestDetailPage({
  params,
}: WaterTestDetailPageProps) {
  const { testId } = await params;
  const test = getWaterTestById(testId);

  if (!test) {
    notFound();
  }

  const customer = getCustomerById(test.customerId);
  const site = getSiteById(test.siteId);
  const pool = getPoolById(test.poolId);
  const technician = getTechnicianById(test.technicianId);
  const linkedJob = test.jobId ? getJobById(test.jobId) : undefined;
  const recommendations = getChemicalRecommendationsForTest(test.id);

  return (
    <SectionPage
      title={`Water Test: ${pool?.name ?? test.id}`}
      description="Mock water test detail with chemistry readings, target ranges, alerts, BioGuard product recommendations, and future SpinTouch-ready structure."
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

        <DetailCard title="Target chemistry ranges">
          <p className="text-sm leading-6 text-slate-700">
            {pool?.targetRanges ?? "No target range recorded for this pool."}
          </p>
        </DetailCard>
      </section>

      <DetailCard title="Full water chemistry readings">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[
            ["Free chlorine", test.freeChlorine],
            ["Total chlorine", test.totalChlorine],
            ["pH", test.ph],
            ["Total alkalinity", test.alkalinity],
            ["Calcium hardness", test.calciumHardness],
            ["Cyanuric acid", test.cyanuricAcid],
            ["Salt", test.salt],
            ["Phosphate", test.phosphate],
            ["Water temperature", test.waterTemperature],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-md border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {value}
              </p>
            </div>
          ))}
        </div>
      </DetailCard>

      <DetailCard title="Readings outside target range">
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

      <DetailCard title="Chemical recommendations">
        {recommendations.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {recommendations.map((recommendation) => {
              const product = getBioGuardProductById(recommendation.productId);

              return (
                <article
                  key={recommendation.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <p className="text-sm font-semibold text-amber-700">
                    {recommendation.issue}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-slate-950">
                    {product?.name ?? recommendation.productId}
                  </h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div>
                      <dt className="font-medium text-slate-500">
                        Suggested dose
                      </dt>
                      <dd className="mt-1 text-slate-950">
                        {recommendation.suggestedDose}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-500">
                        Application method
                      </dt>
                      <dd className="mt-1 text-slate-950">
                        {recommendation.applicationMethod}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-500">
                        Safety / handling note
                      </dt>
                      <dd className="mt-1 text-slate-950">
                        {recommendation.safetyNote}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-500">
                        Alternative product
                      </dt>
                      <dd className="mt-1 text-slate-950">
                        {recommendation.alternativeProduct}
                      </dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            description="Balanced tests may not need a corrective product recommendation."
            title="No corrective dosing recommended"
          />
        )}
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
