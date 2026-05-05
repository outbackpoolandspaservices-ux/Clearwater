import { SectionPage } from "@/components/app-shell/section-page";
import { getCustomers } from "@/features/customers/data/customers";
import { getJobs } from "@/features/jobs/data/jobs";
import { getSites } from "@/features/properties/data/sites";
import { getReportsWithSource } from "@/features/reports/data/reports";
import { ReportsWorkspace } from "@/features/reports/reports-workspace";
import { technicians } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function ReportsPage() {
  const [{ reports }, customers, jobs, sites] = await Promise.all([
    getReportsWithSource(),
    getCustomers(),
    getJobs(),
    getSites(),
  ]);

  return (
    <SectionPage
      title="Reports"
      description="Customer-facing service and inspection report previews for Outback Pool & Spa Services. Business performance reporting is planned for a later phase."
    >
      <ReportsWorkspace
        customers={customers}
        jobs={jobs}
        reports={reports}
        sites={sites}
        technicians={technicians}
      />
    </SectionPage>
  );
}
