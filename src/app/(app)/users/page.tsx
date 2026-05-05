import { SectionPage } from "@/components/app-shell/section-page";

export default function UsersPage() {
  return (
    <SectionPage
      title="Users"
      description="Planned staff, technician, finance, admin, and customer portal user management. Authentication helpers exist, but ClearWater does not enforce login until the workflow is fully tested."
      statusLabel="Planned"
    />
  );
}
