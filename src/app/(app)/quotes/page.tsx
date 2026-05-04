import { SectionPage } from "@/components/app-shell/section-page";
import { QuotesWorkspace } from "@/features/quotes/quotes-workspace";

export default function QuotesPage() {
  return (
    <SectionPage
      title="Quotes"
      description="Quote drafting, line items, customer approval, expiry tracking, and conversion into jobs or invoices."
    >
      <QuotesWorkspace />
    </SectionPage>
  );
}
