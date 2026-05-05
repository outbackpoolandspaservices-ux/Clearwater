import { SectionPage } from "@/components/app-shell/section-page";
import { getQuotesWithSource } from "@/features/quotes/data/quotes";
import { QuotesWorkspace } from "@/features/quotes/quotes-workspace";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

type QuotesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function QuotesPage({ searchParams }: QuotesPageProps) {
  const params = searchParams ? await searchParams : {};
  const { quotes } = await getQuotesWithSource();

  return (
    <SectionPage
      title="Quotes"
      description="Quote drafting, line items, customer approval, expiry tracking, and conversion into jobs or invoices."
    >
      <QuotesWorkspace
        initialFilters={{
          status: firstParam(params.status),
        }}
        quotes={quotes}
      />
    </SectionPage>
  );
}
