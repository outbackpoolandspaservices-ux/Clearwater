import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionPage } from "@/components/app-shell/section-page";
import { StatusBadge } from "@/components/ui/status-badge";
import { getChemicalProducts } from "@/features/chemicals/data/chemicals";
import { getCustomerById } from "@/features/customers/data/customers";
import { getEquipmentForPool } from "@/features/equipment/data/equipment";
import { JobExecutionForm } from "@/features/jobs/job-execution-form";
import { getJobById } from "@/features/jobs/data/jobs";
import { getPoolById } from "@/features/pools/data/pools";
import { getSiteById } from "@/features/properties/data/sites";
import { getStockWithSource } from "@/features/stock/data/stock";
import { getWaterTests } from "@/features/water-testing/data/water-tests";
import { getTechnicianById } from "@/lib/mock-data";

type JobExecutionPageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

function priorityTone(priority: string) {
  if (priority === "Urgent" || priority === "High") {
    return "warning" as const;
  }

  return "neutral" as const;
}

export default async function JobExecutionPage({
  params,
}: JobExecutionPageProps) {
  const { jobId } = await params;
  const job = await getJobById(jobId);

  if (!job) {
    notFound();
  }

  const [customer, pool, site, waterTests, products, stockResult] = await Promise.all([
    getCustomerById(job.customerId),
    job.poolId ? getPoolById(job.poolId) : Promise.resolve(undefined),
    getSiteById(job.siteId),
    getWaterTests(),
    getChemicalProducts(),
    getStockWithSource(),
  ]);
  const technician = getTechnicianById(job.technicianId);
  const linkedEquipment = job.poolId ? await getEquipmentForPool(job.poolId) : [];
  const linkedWaterTests = waterTests.filter(
    (test) => test.jobId === job.id || Boolean(job.poolId && test.poolId === job.poolId),
  );

  return (
    <SectionPage
      title={`Execute ${job.jobNumber}`}
      description="Technician field workflow for completing the job, recording service notes, linking water tests, and updating job status."
    >
      <div className="flex flex-wrap items-center gap-3">
        <Link
          className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
          href={`/jobs/${job.id}`}
        >
          Back to job details
        </Link>
        <StatusBadge>{job.status}</StatusBadge>
        <StatusBadge tone={priorityTone(job.priority)}>
          {job.priority} priority
        </StatusBadge>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-slate-950">
          Equipment Register job foundation
        </p>
        <p className="mt-1">
          {linkedEquipment.length} pool equipment record
          {linkedEquipment.length === 1 ? "" : "s"} available for this job.
          Future job execution will mark equipment installed/replaced, capture
          service notes, and flag warranty issues from this workflow.
        </p>
        {job.poolId ? (
          <Link
            className="mt-3 inline-flex min-h-9 items-center rounded-md border border-cyan-200 px-3 font-semibold text-cyan-700 hover:bg-cyan-50"
            href={`/equipment/new?poolId=${encodeURIComponent(job.poolId)}`}
          >
            Add installed/replaced equipment
          </Link>
        ) : null}
      </div>

      <JobExecutionForm
        customer={customer}
        job={job}
        pool={pool}
        products={products}
        site={site}
        stockRecords={stockResult.stock}
        technician={technician}
        waterTestCount={linkedWaterTests.length}
      />
    </SectionPage>
  );
}
