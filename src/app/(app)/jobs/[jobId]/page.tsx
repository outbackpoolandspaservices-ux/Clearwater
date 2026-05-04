import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionPage } from "@/components/app-shell/section-page";
import { DetailCard, DetailList } from "@/components/ui/detail-card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCustomerById } from "@/features/customers/data/customers";
import { getJobById } from "@/features/jobs/data/jobs";
import { getPoolById } from "@/features/pools/data/pools";
import { getSiteById } from "@/features/properties/data/sites";
import {
  getEquipmentForPool,
  getBioGuardProductById,
  getJobProfitabilityByJobId,
  getStockUsageForJob,
  getTechnicianById,
  getWaterTestsByIds,
  invoices,
  quotes,
} from "@/lib/mock-data";

const workflowSteps = [
  "New",
  "Quote Required",
  "Quoted",
  "Approved",
  "Scheduled",
  "On the Way",
  "In Progress",
  "Completed",
  "Report Sent",
  "Invoiced",
  "Paid",
];

const statusStepMap: Record<string, string> = {
  New: "New",
  "Quote Required": "Quote Required",
  Quoted: "Quoted",
  "Quote Sent": "Quoted",
  "Quote Approved": "Approved",
  "Ready to Schedule": "Approved",
  Scheduled: "Scheduled",
  "On the Way": "On the Way",
  "On The Way": "On the Way",
  "In Progress": "In Progress",
  Completed: "Completed",
  "Report Sent": "Report Sent",
  Invoiced: "Invoiced",
  Paid: "Paid",
};

const technicianActions = [
  "Send On The Way",
  "Start Job",
  "Add Water Test",
  "Add Photos",
  "Add Chemicals Used",
  "Complete Job",
];

function statusTone(status: string) {
  if (["Completed", "Paid"].includes(status)) {
    return "success" as const;
  }

  if (["Quote Required", "Ready to Schedule"].includes(status)) {
    return "warning" as const;
  }

  return "neutral" as const;
}

function priorityTone(priority: string) {
  return priority === "High" ? ("danger" as const) : ("neutral" as const);
}

type JobDetailPageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { jobId } = await params;
  const job = await getJobById(jobId);

  if (!job) {
    notFound();
  }

  const [customer, pool, site] = await Promise.all([
    getCustomerById(job.customerId),
    job.poolId ? getPoolById(job.poolId) : Promise.resolve(undefined),
    getSiteById(job.siteId),
  ]);
  const technician = getTechnicianById(job.technicianId);
  const linkedEquipment = pool ? getEquipmentForPool(pool.id) : [];
  const linkedWaterTests = getWaterTestsByIds(job.waterTestIds);
  const linkedQuote = quotes.find((quote) => quote.number === job.quoteId);
  const linkedInvoice = invoices.find(
    (invoice) => invoice.number === job.invoiceId,
  );
  const jobUsage = getStockUsageForJob(job.id);
  const profitability = getJobProfitabilityByJobId(job.id);
  const activeStep = statusStepMap[job.status] ?? "New";
  const activeStepIndex = workflowSteps.indexOf(activeStep);

  return (
    <SectionPage
      title={`${job.jobNumber}: ${job.title}`}
      description="Job workspace for dispatch, technician workflow, site context, water testing, equipment, photos, and billing follow-up."
    >
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge tone={statusTone(job.status)}>{job.status}</StatusBadge>
        <StatusBadge tone={priorityTone(job.priority)}>
          {job.priority} priority
        </StatusBadge>
        <p className="text-sm text-slate-600">
          {job.scheduledDate} at {job.scheduledTime}
        </p>
        {site?.address ? (
          <Link
            className="inline-flex min-h-9 items-center rounded-md border border-cyan-200 px-3 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${site.address}, ${site.suburb}`,
            )}`}
            rel="noreferrer"
            target="_blank"
          >
            Open in Maps
          </Link>
        ) : null}
      </div>

      <DetailCard title="Workflow status">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {workflowSteps.map((step, index) => {
            const complete = index < activeStepIndex;
            const active = index === activeStepIndex;

            return (
              <div
                key={step}
                className={[
                  "rounded-md border px-3 py-3 text-sm",
                  active
                    ? "border-cyan-300 bg-cyan-50 text-cyan-900"
                    : complete
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-500",
                ].join(" ")}
              >
                <p className="font-semibold">{step}</p>
              </div>
            );
          })}
        </div>
      </DetailCard>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DetailCard title="Job summary">
          <DetailList
            items={[
              { label: "Job type", value: job.jobType },
              { label: "Assigned technician", value: technician?.name },
              { label: "Scheduled date", value: job.scheduledDate },
              { label: "Scheduled time", value: job.scheduledTime },
              { label: "Estimated duration", value: job.estimatedDuration },
              { label: "Actual start", value: job.actualStart ?? "Not started" },
              {
                label: "Actual finish",
                value: job.actualFinish ?? "Not completed",
              },
            ]}
          />
        </DetailCard>

        <DetailCard title="Technician actions">
          <div className="grid gap-3 sm:grid-cols-2">
            {technicianActions.map((action) => (
              <button
                key={action}
                className={[
                  "rounded-md px-3 py-3 text-left text-sm font-semibold transition",
                  action === "Start Job" || action === "Complete Job"
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                    : "border border-slate-200 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800",
                ].join(" ")}
                type="button"
              >
                {action}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            These controls are placeholders only. Job state changes will be
            connected in a later workflow.
          </p>
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <DetailCard title="Customer details">
          {customer ? (
            <DetailList
              items={[
                {
                  label: "Customer",
                  value: (
                    <Link
                      className="font-medium text-cyan-700 hover:text-cyan-900"
                      href={`/customers/${customer.id}`}
                    >
                      {customer.name}
                    </Link>
                  ),
                },
                { label: "Phone", value: customer.phone },
                { label: "Email", value: customer.email },
                { label: "Preference", value: customer.communicationPreference },
              ]}
            />
          ) : (
            <EmptyState
              description="This job does not have a linked customer."
              title="No customer linked"
            />
          )}
        </DetailCard>

        <DetailCard title="Site and access">
          {site ? (
            <DetailList
              items={[
                {
                  label: "Site",
                  value: (
                    <Link
                      className="font-medium text-cyan-700 hover:text-cyan-900"
                      href={`/properties/${site.id}`}
                    >
                      {site.name}
                    </Link>
                  ),
                },
                { label: "Address", value: `${site.address}, ${site.suburb}` },
                { label: "Access", value: site.accessNotes },
                { label: "Gate code", value: site.gateCode },
                { label: "Pets / warnings", value: site.petWarning },
              ]}
            />
          ) : (
            <EmptyState
              description="This job does not have a linked site."
              title="No site linked"
            />
          )}
        </DetailCard>

        <DetailCard title="Linked pool">
          {pool ? (
            <DetailList
              items={[
                {
                  label: "Pool",
                  value: (
                    <Link
                      className="font-medium text-cyan-700 hover:text-cyan-900"
                      href={`/pools/${pool.id}`}
                    >
                      {pool.name}
                    </Link>
                  ),
                },
                {
                  label: "Volume",
                  value: `${pool.volumeLitres.toLocaleString("en-AU")} L`,
                },
                { label: "Surface", value: pool.surfaceType },
                { label: "Sanitiser", value: pool.sanitiserType },
                { label: "Alert", value: pool.alertStatus },
              ]}
            />
          ) : (
            <EmptyState
              description="This job does not have a linked pool."
              title="No pool linked"
            />
          )}
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Internal notes">
          <p className="text-sm leading-6 text-slate-700">{job.internalNotes}</p>
        </DetailCard>

        <DetailCard title="Customer notes">
          <p className="text-sm leading-6 text-slate-700">{job.customerNotes}</p>
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Linked water tests">
          {linkedWaterTests.length > 0 ? (
            <div className="space-y-3">
              {linkedWaterTests.map((test) => (
                <Link
                  key={test.id}
                  className="grid gap-3 rounded-md border border-slate-200 p-4 text-sm md:grid-cols-[110px_repeat(4,1fr)]"
                  href={`/water-testing/${test.id}`}
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
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              description="Water tests recorded during the job will appear here."
              title="No water tests linked"
            />
          )}
        </DetailCard>

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
              description="Equipment linked through the pool profile will appear here."
              title="No equipment linked"
            />
          )}
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Photos">
          <EmptyState
            description="Before, after, equipment, damage, and completion photos will be uploaded here in a later workflow."
            title="Photo placeholders"
          />
        </DetailCard>

        <DetailCard title="Quote and invoice summary">
          <DetailList
            items={[
              {
                label: "Quote",
                value: linkedQuote
                  ? `${linkedQuote.number} - ${linkedQuote.status}`
                  : "No quote linked",
              },
              {
                label: "Invoice",
                value: linkedInvoice
                  ? `${linkedInvoice.number} - ${linkedInvoice.status}`
                  : "No invoice linked",
              },
            ]}
          />
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <DetailCard title="Job profitability placeholder">
          {profitability ? (
            <DetailList
              items={[
                { label: "Labour time", value: profitability.labourTime },
                { label: "Travel time", value: profitability.travelTime },
                { label: "Chemical cost", value: profitability.chemicalCost },
                { label: "Parts cost", value: profitability.partsCost },
                { label: "Invoice value", value: profitability.invoiceValue },
                {
                  label: "Estimated margin",
                  value: profitability.estimatedMargin,
                },
              ]}
            />
          ) : (
            <EmptyState
              description="Profitability planning values will appear here once usage and billing are linked."
              title="No profitability data"
            />
          )}
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Mock/planned only. This will later be calculated from labour,
            travel, stock usage, parts, and invoice data.
          </p>
        </DetailCard>

        <DetailCard title="Chemical and stock usage">
          {jobUsage.length > 0 ? (
            <div className="space-y-3">
              {jobUsage.map((usage) => {
                const product = getBioGuardProductById(usage.productId);

                return (
                  <div
                    className="grid gap-3 rounded-md border border-slate-200 p-4 text-sm sm:grid-cols-[1fr_120px_120px_120px]"
                    key={usage.id}
                  >
                    <Link
                      className="font-semibold text-slate-950 hover:text-cyan-700"
                      href={`/chemicals/${usage.productId}`}
                    >
                      {product?.name}
                    </Link>
                    <p className="text-slate-600">{usage.quantityUsed}</p>
                    <p className="text-slate-600">{usage.cost}</p>
                    <p className="font-medium text-cyan-700">
                      {usage.margin}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              description="Chemicals and stock used on this job will appear here."
              title="No stock usage linked"
            />
          )}
        </DetailCard>
      </section>
    </SectionPage>
  );
}
