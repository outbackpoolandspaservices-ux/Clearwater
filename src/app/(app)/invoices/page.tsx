import { SectionPage } from "@/components/app-shell/section-page";
import { getInvoicesWithSource } from "@/features/invoices/data/invoices";
import { InvoicesWorkspace } from "@/features/invoices/invoices-workspace";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function InvoicesPage() {
  const { invoices } = await getInvoicesWithSource();

  return (
    <SectionPage
      title="Invoices"
      description="Invoice creation, due dates, payment status, customer account history, and accounting integration readiness."
    >
      <InvoicesWorkspace invoices={invoices} />
    </SectionPage>
  );
}
