import { SectionPage } from "@/components/app-shell/section-page";
import { InvoicesWorkspace } from "@/features/invoices/invoices-workspace";

export default function InvoicesPage() {
  return (
    <SectionPage
      title="Invoices"
      description="Invoice creation, due dates, payment status, customer account history, and accounting integration readiness."
    >
      <InvoicesWorkspace />
    </SectionPage>
  );
}
