import { SectionPage } from "@/components/app-shell/section-page";
import { WaterTestingWorkspace } from "@/features/water-testing/water-testing-workspace";

export default function WaterTestingPage() {
  return (
    <SectionPage
      title="Water Testing"
      description="Water chemistry readings, target ranges, dosing notes, visit history, and trend reporting for each pool."
    >
      <WaterTestingWorkspace />
    </SectionPage>
  );
}
