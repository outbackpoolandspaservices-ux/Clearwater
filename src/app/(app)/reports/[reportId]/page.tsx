import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionPage } from "@/components/app-shell/section-page";
import { DetailCard, DetailList } from "@/components/ui/detail-card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCustomerById } from "@/features/customers/data/customers";
import { getJobChemicalUsage } from "@/features/jobs/data/chemical-usage";
import { getJobById } from "@/features/jobs/data/jobs";
import { getPoolById } from "@/features/pools/data/pools";
import { getSiteById } from "@/features/properties/data/sites";
import { getReportById } from "@/features/reports/data/reports";
import { getWaterTestById } from "@/features/water-testing/data/water-tests";
import {
  getBioGuardProductById,
  getChemicalRecommendationsForTest,
  getTechnicianById,
  inspectionSections,
  equipment,
} from "@/lib/mock-data";

type ReportDetailPageProps = {
  params: Promise<{
    reportId: string;
  }>;
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

function ReportSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-slate-200 py-5 first:border-t-0 first:pt-0">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function readingStatus(label: string, value?: string) {
  const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));

  if (!Number.isFinite(parsed)) {
    return "Not tested";
  }

  if (label === "Free chlorine") {
    if (parsed < 2) return "Low";
    if (parsed > 4) return "High";
  }

  if (label === "pH") {
    if (parsed < 7.2) return "Low";
    if (parsed > 7.6) return "High";
  }

  if (label === "Total alkalinity") {
    if (parsed < 80) return "Low";
    if (parsed > 120) return "High";
  }

  if (label === "Calcium hardness") {
    if (parsed > 400) return "High";
  }

  if (label === "Cyanuric acid") {
    if (parsed > 50) return "High";
  }

  if (label === "Phosphate") {
    if (parsed > 500) return "High";
  }

  return "OK";
}

export default async function ReportDetailPage({
  params,
}: ReportDetailPageProps) {
  const { reportId } = await params;
  const report = await getReportById(reportId);

  if (!report) {
    notFound();
  }

  const [customer, site, pool, job, waterTest] = await Promise.all([
    getCustomerById(report.customerId),
    getSiteById(report.siteId),
    report.poolId ? getPoolById(report.poolId) : Promise.resolve(undefined),
    getJobById(report.jobId),
    report.waterTestId
      ? getWaterTestById(report.waterTestId)
      : Promise.resolve(undefined),
  ]);
  const technician = getTechnicianById(report.technicianId || job?.technicianId || "");
  const jobUsage = job ? await getJobChemicalUsage(job.id) : [];
  const recommendations = waterTest
    ? getChemicalRecommendationsForTest(waterTest.id)
    : [];
  const linkedEquipment = equipment.filter((item) =>
    report.equipmentIds.includes(item.id),
  );
  const isInspection = report.reportType === "Pool Inspection Report";

  return (
    <SectionPage
      title={`${report.reportNumber}: ${report.reportType}`}
      description="Mock report preview. Real PDF generation, storage, and sending will be added later."
    >
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              type="button"
            >
              Download PDF Placeholder
            </button>
            <button
              className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
              type="button"
            >
              Send to Customer Placeholder
            </button>
            <button
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              type="button"
            >
              Email Report Placeholder
            </button>
            <button
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              type="button"
            >
              View Customer Portal Placeholder
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge>{report.status}</StatusBadge>
            <StatusBadge>{report.sentStatus}</StatusBadge>
          </div>
        </div>
      </section>

      <article className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-32 rotate-[-18deg] text-center text-5xl font-bold uppercase tracking-[0.3em] text-slate-100 sm:text-7xl">
          Confidential
        </div>

        <header className="relative border-b border-slate-200 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
                ClearWater
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-950">
                {report.reportType}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Outback Pool & Spa Services
              </p>
            </div>
            <dl className="grid gap-2 text-sm sm:text-right">
              <div>
                <dt className="font-medium text-slate-500">Report number</dt>
                <dd className="text-slate-950">{report.reportNumber}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Report date</dt>
                <dd className="text-slate-950">{report.reportDate}</dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="relative mt-6 space-y-2">
          <ReportSection title="Report header">
            <DetailList
              items={[
                { label: "Inspection / service date", value: report.reportDate },
                { label: "Technician", value: technician?.name ?? "Not assigned" },
                {
                  label: "Linked job",
                  value: job ? (
                    <Link
                      className="font-medium text-cyan-700 hover:text-cyan-900"
                      href={`/jobs/${job.id}`}
                    >
                      {job.jobNumber} - {job.title}
                    </Link>
                  ) : (
                    "No job linked"
                  ),
                },
                { label: "Status", value: report.status },
              ]}
            />
          </ReportSection>

          <ReportSection title="Customer details">
            <DetailList
              items={[
                { label: "Customer", value: customer?.name ?? "Not linked" },
                { label: "Phone", value: customer?.phone ?? "Not linked" },
                { label: "Email", value: customer?.email ?? "Not linked" },
                {
                  label: "Billing terms",
                  value: customer?.invoiceTerms ?? "Not linked",
                },
              ]}
            />
          </ReportSection>

          <ReportSection title="Site / property details">
            <DetailList
              items={[
                { label: "Site", value: site?.name ?? "Not linked" },
                {
                  label: "Address",
                  value: site ? `${site.address}, ${site.suburb}` : "Not linked",
                },
                { label: "Access notes", value: site?.accessNotes ?? "Not linked" },
                {
                  label: "Access warning",
                  value: site?.accessWarning ?? "No warning recorded",
                },
              ]}
            />
          </ReportSection>

          <ReportSection title="Pool details">
            <DetailList
              items={[
                { label: "Pool", value: pool?.name ?? "Not linked" },
                {
                  label: "Volume",
                  value: pool
                    ? `${pool.volumeLitres.toLocaleString("en-AU")} L`
                    : "Not linked",
                },
                { label: "Surface", value: pool?.surfaceType ?? "Not linked" },
                {
                  label: "Sanitiser",
                  value: pool?.sanitiserType ?? "Not linked",
                },
              ]}
            />
          </ReportSection>

          <ReportSection title="Water chemistry summary">
            {waterTest ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Free chlorine", waterTest.freeChlorine],
                  ["Total chlorine", waterTest.totalChlorine],
                  ["pH", waterTest.ph],
                  ["Total alkalinity", waterTest.alkalinity],
                  ["Calcium hardness", waterTest.calciumHardness],
                  ["Cyanuric acid", waterTest.cyanuricAcid],
                  ["Salt", waterTest.salt],
                  ["Phosphate", waterTest.phosphate],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-md border border-slate-200 bg-slate-50 p-3"
                  >
                    <p className="text-xs font-medium text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-950">
                      {value}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-cyan-700">
                      {readingStatus(label, value)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                description="Water chemistry will appear when a water test is linked."
                title="No water test linked"
              />
            )}
          </ReportSection>

          <ReportSection title="Chemicals added">
            {jobUsage.length > 0 ? (
              <div className="space-y-3">
                {jobUsage.map((usage) => (
                  <div
                    className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm"
                    key={usage.id}
                  >
                    <p className="font-semibold text-slate-950">
                      {usage.productName}
                    </p>
                    <p className="mt-1 text-slate-600">
                      {usage.quantityUsed}
                      {usage.reason ? ` - ${usage.reason}` : ""}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-cyan-700">
                      {usage.stockDeducted ? "Stock deducted" : "Recorded only"}
                    </p>
                  </div>
                ))}
              </div>
            ) : waterTest && waterTest.chemicalsAdded.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {waterTest.chemicalsAdded.map((chemical) => (
                  <StatusBadge key={chemical}>{chemical}</StatusBadge>
                ))}
              </div>
            ) : (
              <EmptyState
                description="Chemicals used during the job will appear here."
                title="No chemicals recorded"
              />
            )}
          </ReportSection>

          <ReportSection title="Chemical recommendations">
            {recommendations.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {recommendations.map((recommendation) => {
                  const product = getBioGuardProductById(
                    recommendation.productId,
                  );

                  return (
                    <div
                      key={recommendation.id}
                      className="rounded-md border border-slate-200 p-4"
                    >
                      <p className="text-sm font-semibold text-amber-700">
                        {recommendation.issue}
                      </p>
                      <p className="mt-2 font-semibold text-slate-950">
                        {product?.name ?? recommendation.productId}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {recommendation.suggestedDose}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                description="Balanced reports may not require corrective recommendations."
                title="No recommendations"
              />
            )}
          </ReportSection>

          <ReportSection title="Work completed">
            <p className="text-sm leading-6 text-slate-700">
              {report.workCompleted}
            </p>
          </ReportSection>

          <ReportSection title="Checklist summary">
            <p className="text-sm leading-6 text-slate-700">
              {job?.internalNotes?.includes("Checklist completed")
                ? job.internalNotes
                : "Checklist details will appear here when this report is created from a completed job execution update."}
            </p>
          </ReportSection>

          <ReportSection title="Equipment observations">
            <p className="text-sm leading-6 text-slate-700">
              {report.equipmentObservations}
            </p>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
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
          </ReportSection>

          <ReportSection title="Photos placeholder">
            <EmptyState
              description={report.photoSummary}
              title="Photo evidence will render here"
            />
          </ReportSection>

          <ReportSection title="Recommendations">
            <p className="text-sm leading-6 text-slate-700">
              {report.recommendations}
            </p>
          </ReportSection>

          <ReportSection title="Technician and customer notes">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-md border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-950">
                  Technician notes
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {job?.internalNotes ?? "No technician notes recorded."}
                </p>
              </div>
              <div className="rounded-md border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-950">
                  Customer-facing notes
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {job?.customerNotes ?? report.customerSummary}
                </p>
              </div>
            </div>
          </ReportSection>

          <ReportSection title="Summary of findings">
            <p className="text-sm leading-6 text-slate-700">
              {report.summaryOfFindings}
            </p>
          </ReportSection>

          <ReportSection title="Next service / follow-up">
            <p className="text-sm leading-6 text-slate-700">
              {report.nextService}
            </p>
          </ReportSection>

          {isInspection ? (
            <ReportSection title="Pool inspection template">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {inspectionSections.map((section) => (
                  <div
                    key={section}
                    className="rounded-md border border-slate-200 bg-slate-50 p-3"
                  >
                    <p className="text-sm font-semibold text-slate-950">
                      {section}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Mock inspection content placeholder.
                    </p>
                  </div>
                ))}
              </div>
            </ReportSection>
          ) : (
            <ReportSection title="Customer-friendly summary">
              <p className="text-sm leading-6 text-slate-700">
                {report.customerSummary}
              </p>
            </ReportSection>
          )}
        </div>
      </article>

      <section className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="PDF generation placeholder">
          <p className="text-sm leading-6 text-slate-600">
            This preview is structured for future PDF rendering, storage, and
            download. No real PDF is generated yet.
          </p>
        </DetailCard>
        <DetailCard title="Customer sending placeholder">
          <p className="text-sm leading-6 text-slate-600">
            Sending to customers will later connect to email, SMS, portal
            notifications, and communication history.
          </p>
        </DetailCard>
      </section>
    </SectionPage>
  );
}
