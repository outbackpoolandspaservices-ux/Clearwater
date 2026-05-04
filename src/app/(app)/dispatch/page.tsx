import { SectionPage } from "@/components/app-shell/section-page";
import { DispatchBoard } from "@/features/dispatch/dispatch-board";

export default function DispatchPage() {
  return (
    <SectionPage
      title="Dispatch"
      description="Calendar-based scheduling for technicians, service runs, drag-and-drop job planning, and route-aware workload balancing."
    >
      <DispatchBoard />
    </SectionPage>
  );
}
