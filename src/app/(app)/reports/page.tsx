import { SectionPage } from "@/components/app-shell/section-page";
import { ReportsWorkspace } from "@/features/reports/reports-workspace";

export default function ReportsPage() {
  return (
    <SectionPage
      title="Reports"
      description="Operational and financial reports for job throughput, technician capacity, chemical usage, stock, and revenue."
    >
      <ReportsWorkspace />
    </SectionPage>
  );
}
