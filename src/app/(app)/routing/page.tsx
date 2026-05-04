import { SectionPage } from "@/components/app-shell/section-page";
import { RoutingWorkspace } from "@/features/routing/routing-workspace";

export default function RoutingPage() {
  return (
    <SectionPage
      title="Routing"
      description="Route planning for Alice Springs service runs, technician availability, travel time, and optimisation experiments."
    >
      <RoutingWorkspace />
    </SectionPage>
  );
}
