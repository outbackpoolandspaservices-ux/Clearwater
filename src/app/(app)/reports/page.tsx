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
  const [{ count, reports, source }, customers, jobs, sites] = await Promise.all([
    getReportsWithSource(),
    getCustomers(),
    getJobs(),
    getSites(),
  ]);

  return (
    <SectionPage
      title="Reports"
      description="Operational and financial reports for job throughput, technician capacity, chemical usage, stock, and revenue."
    >
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">Data source:</span>{" "}
        {source} <span className="mx-2 text-slate-300">|</span>
        <span className="font-semibold text-slate-900">
          Report records loaded:
        </span>{" "}
        {count}
      </div>
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
