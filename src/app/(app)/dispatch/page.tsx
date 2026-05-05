import { SectionPage } from "@/components/app-shell/section-page";
import { DispatchBoard } from "@/features/dispatch/dispatch-board";
import { getCustomers } from "@/features/customers/data/customers";
import { getJobsWithSource } from "@/features/jobs/data/jobs";
import { getPools } from "@/features/pools/data/pools";
import { getSites } from "@/features/properties/data/sites";
import { recurringJobs, technicians } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function DispatchPage() {
  const [customers, jobsResult, pools, sites] = await Promise.all([
    getCustomers(),
    getJobsWithSource(),
    getPools(),
    getSites(),
  ]);

  return (
    <SectionPage
      title="Dispatch"
      description="Calendar-based scheduling for technicians, service runs, drag-and-drop job planning, and route-aware workload balancing."
    >
      <DispatchBoard
        customers={customers}
        jobs={jobsResult.jobs}
        pools={pools}
        recurringJobs={recurringJobs}
        sites={sites}
        technicians={technicians}
      />
    </SectionPage>
  );
}
