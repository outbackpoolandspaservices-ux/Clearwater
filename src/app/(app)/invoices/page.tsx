import { SectionPage } from "@/components/app-shell/section-page";
import { getInvoicesWithSource } from "@/features/invoices/data/invoices";
import { InvoicesWorkspace } from "@/features/invoices/invoices-workspace";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function InvoicesPage() {
  const { count, invoices, source } = await getInvoicesWithSource();

  return (
    <SectionPage
      title="Invoices"
      description="Invoice creation, due dates, payment status, customer account history, and accounting integration readiness."
    >
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">Data source:</span>{" "}
        {source} <span className="mx-2 text-slate-300">|</span>
        <span className="font-semibold text-slate-900">
          Invoice records loaded:
        </span>{" "}
        {count}
      </div>
      <InvoicesWorkspace invoices={invoices} />
    </SectionPage>
  );
}
