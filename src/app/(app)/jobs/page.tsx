import { SectionPage } from "@/components/app-shell/section-page";
import { getCustomers } from "@/features/customers/data/customers";
import { getJobsWithSource } from "@/features/jobs/data/jobs";
import { JobsWorkflow } from "@/features/jobs/jobs-workflow";
import { getPools } from "@/features/pools/data/pools";
import { getSites } from "@/features/properties/data/sites";
import { recurringJobs, technicians } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function JobsPage() {
  const [customers, jobsResult, pools, sites] = await Promise.all([
    getCustomers(),
    getJobsWithSource(),
    getPools(),
    getSites(),
  ]);
  const { jobs } = jobsResult;

  return (
    <SectionPage
      title="Jobs"
      description="Work orders for regular servicing, repairs, green pool recovery, equipment installs, and completed service history."
    >
      <JobsWorkflow
        customers={customers}
        jobs={jobs}
        pools={pools}
        recurringJobs={recurringJobs}
        sites={sites}
        technicians={technicians}
      />
    </SectionPage>
  );
}
