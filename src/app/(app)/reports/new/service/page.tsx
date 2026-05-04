import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionPage } from "@/components/app-shell/section-page";
import { getCustomerById } from "@/features/customers/data/customers";
import { getJobById } from "@/features/jobs/data/jobs";
import { getPoolById } from "@/features/pools/data/pools";
import { getSiteById } from "@/features/properties/data/sites";
import { ServiceReportForm } from "@/features/reports/service-report-form";
import { getWaterTests } from "@/features/water-testing/data/water-tests";
import { getTechnicianById } from "@/lib/mock-data";

type NewServiceReportPageProps = {
  searchParams?: Promise<{
    jobId?: string;
  }>;
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function NewServiceReportPage({
  searchParams,
}: NewServiceReportPageProps) {
  const params = searchParams ? await searchParams : {};
  const jobId = params.jobId ?? "";

  if (!jobId) {
    return (
      <SectionPage
        title="Create Service Report"
        description="Choose a completed job before creating a service report."
      >
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          A job ID is required to prefill a service report. Open a job detail
          page and choose Create Service Report.
        </div>
        <Link
          className="inline-flex min-h-10 items-center rounded-md bg-cyan-600 px-4 text-sm font-semibold text-white hover:bg-cyan-700"
          href="/jobs"
        >
          Choose a job
        </Link>
      </SectionPage>
    );
  }

  const job = await getJobById(jobId);

  if (!job) {
    notFound();
  }

  const [customer, site, pool, waterTests] = await Promise.all([
    getCustomerById(job.customerId),
    getSiteById(job.siteId),
    job.poolId ? getPoolById(job.poolId) : Promise.resolve(undefined),
    getWaterTests(),
  ]);
  const linkedWaterTests = waterTests
    .filter((test) => test.jobId === job.id || test.poolId === job.poolId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const latestWaterTest = linkedWaterTests[0];
  const technician = getTechnicianById(job.technicianId);

  return (
    <SectionPage
      title="Create Service Report"
      description="Build a customer-facing service report preview from a completed job, linked pool profile, water test, and technician notes."
    >
      <div className="flex">
        <Link
          className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
          href={`/jobs/${job.id}`}
        >
          Back to job details
        </Link>
      </div>

      <ServiceReportForm
        customer={customer}
        job={job}
        pool={pool}
        site={site}
        technician={technician}
        waterTest={latestWaterTest}
      />
    </SectionPage>
  );
}
