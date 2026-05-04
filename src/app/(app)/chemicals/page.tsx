import { SectionPage } from "@/components/app-shell/section-page";
import { ChemicalsWorkspace } from "@/features/chemicals/chemicals-workspace";

export default function ChemicalsPage() {
  return (
    <SectionPage
      title="Chemicals"
      description="Chemical catalogue, unit handling, safety notes, dosing references, and links to stock usage."
    >
      <ChemicalsWorkspace />
    </SectionPage>
  );
}
