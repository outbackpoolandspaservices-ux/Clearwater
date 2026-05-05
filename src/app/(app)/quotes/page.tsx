import { SectionPage } from "@/components/app-shell/section-page";
import { getQuotesWithSource } from "@/features/quotes/data/quotes";
import { QuotesWorkspace } from "@/features/quotes/quotes-workspace";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function QuotesPage() {
  const { quotes } = await getQuotesWithSource();

  return (
    <SectionPage
      title="Quotes"
      description="Quote drafting, line items, customer approval, expiry tracking, and conversion into jobs or invoices."
    >
      <QuotesWorkspace quotes={quotes} />
    </SectionPage>
  );
}
