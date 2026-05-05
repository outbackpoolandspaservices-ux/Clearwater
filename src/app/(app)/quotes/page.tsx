import { SectionPage } from "@/components/app-shell/section-page";
import { getQuotesWithSource } from "@/features/quotes/data/quotes";
import { QuotesWorkspace } from "@/features/quotes/quotes-workspace";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function QuotesPage() {
  const { count, quotes, source } = await getQuotesWithSource();

  return (
    <SectionPage
      title="Quotes"
      description="Quote drafting, line items, customer approval, expiry tracking, and conversion into jobs or invoices."
    >
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">Data source:</span>{" "}
        {source} <span className="mx-2 text-slate-300">|</span>
        <span className="font-semibold text-slate-900">
          Quote records loaded:
        </span>{" "}
        {count}
      </div>
      <QuotesWorkspace quotes={quotes} />
    </SectionPage>
  );
}
