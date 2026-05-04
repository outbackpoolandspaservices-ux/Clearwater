import { SectionPage } from "@/components/app-shell/section-page";
import { JobsWorkflow } from "@/features/jobs/jobs-workflow";

export default function JobsPage() {
  return (
    <SectionPage
      title="Jobs"
      description="Work orders for regular servicing, repairs, green pool recovery, equipment installs, and completed service history."
    >
      <JobsWorkflow />
    </SectionPage>
  );
}
