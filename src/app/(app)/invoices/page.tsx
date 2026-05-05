import { SectionPage } from "@/components/app-shell/section-page";
import { getInvoicesWithSource } from "@/features/invoices/data/invoices";
import { InvoicesWorkspace } from "@/features/invoices/invoices-workspace";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

type InvoicesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const params = searchParams ? await searchParams : {};
  const { invoices } = await getInvoicesWithSource();

  return (
    <SectionPage
      title="Invoices"
      description="Invoice creation, due dates, payment status, customer account history, and accounting integration readiness."
    >
      <InvoicesWorkspace
        initialFilters={{
          status: firstParam(params.status),
        }}
        invoices={invoices}
      />
    </SectionPage>
  );
}
