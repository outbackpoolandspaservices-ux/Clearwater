import {
  PortalButton,
  PortalCard,
  PortalEmptyState,
  PortalShell,
  portalStatusTone,
} from "@/components/portal/portal-components";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPortalData } from "@/features/portal/portal-data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function PortalQuotesPage() {
  const { customer, quotes, sites } = await getPortalData();

  return (
    <PortalShell
      title="Your Quotes"
      description="Review quote details, approve work, or let the team know if a quote is not right for you."
      customerName={customer.name}
    >
      {quotes.length ? (
        <div className="grid gap-4">
          {quotes.map((quote) => {
            const site = sites.find((item) => item.id === quote.siteId);

            return (
              <PortalCard key={quote.id} title={quote.title} eyebrow={quote.number}>
                <div className="grid gap-4 lg:grid-cols-[1fr_16rem]">
                  <div className="space-y-3 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge tone={portalStatusTone(quote.status)}>
                        {quote.status}
                      </StatusBadge>
                      <StatusBadge tone={portalStatusTone(quote.approvalStatus)}>
                        {quote.approvalStatus}
                      </StatusBadge>
                    </div>
                    <p className="text-slate-600">
                      {site ? `${site.address}, ${site.suburb}` : quote.siteName}
                    </p>
                    <p className="text-slate-600">
                      Quote date {quote.quoteDate} | Expires {quote.expiryDate}
                    </p>
                    <div className="rounded border border-slate-200">
                      {quote.lineItems.map((item) => (
                        <div
                          key={`${quote.id}-${item.type}-${item.description}`}
                          className="flex justify-between gap-3 border-b border-slate-100 p-3 last:border-b-0"
                        >
                          <span>
                            <span className="font-bold text-slate-950">
                              {item.type}:
                            </span>{" "}
                            {item.description}
                          </span>
                          <span className="font-bold text-slate-950">
                            {item.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <aside className="rounded bg-cyan-50 p-4">
                    <p className="text-sm text-slate-600">Quote total</p>
                    <p className="mt-1 text-2xl font-black text-slate-950">
                      {quote.totalAmount}
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      <PortalButton href={`/quotes/${quote.id}`}>
                        View Quote
                      </PortalButton>
                      <PortalButton variant="primary">Approve Quote</PortalButton>
                      <PortalButton variant="danger">Decline Quote</PortalButton>
                    </div>
                  </aside>
                </div>
              </PortalCard>
            );
          })}
        </div>
      ) : (
        <PortalEmptyState message="No quotes are waiting for review." />
      )}
    </PortalShell>
  );
}
