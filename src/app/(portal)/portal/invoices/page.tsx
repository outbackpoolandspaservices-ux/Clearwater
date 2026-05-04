import {
  PortalButton,
  PortalCard,
  PortalEmptyState,
  PortalShell,
  portalStatusTone,
} from "@/components/portal/portal-components";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPortalData } from "@/features/portal/portal-data";
import { getPaymentsForInvoice, getSiteById } from "@/lib/mock-data";

export default function PortalInvoicesPage() {
  const { customer, invoices } = getPortalData();

  return (
    <PortalShell
      title="Invoices and Payments"
      description="Check invoice status, view billing details, and use payment placeholders until real payment processing is connected."
      customerName={customer.name}
    >
      {invoices.length ? (
        <div className="grid gap-4">
          {invoices.map((invoice) => {
            const site = getSiteById(invoice.siteId);
            const payments = getPaymentsForInvoice(invoice.id);

            return (
              <PortalCard
                key={invoice.id}
                title={invoice.number}
                eyebrow="Invoice"
                action={
                  <StatusBadge tone={portalStatusTone(invoice.paymentStatus)}>
                    {invoice.paymentStatus}
                  </StatusBadge>
                }
              >
                <div className="grid gap-4 lg:grid-cols-[1fr_16rem]">
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold text-slate-950">
                      {site?.address}, {site?.suburb}
                    </p>
                    <p className="text-slate-600">
                      Invoice date {invoice.invoiceDate} | Due {invoice.dueDate}
                    </p>
                    <div className="rounded border border-slate-200">
                      {invoice.lineItems.map((item) => (
                        <div
                          key={`${invoice.id}-${item.type}-${item.description}`}
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
                    <div className="rounded bg-slate-50 p-3">
                      <p className="font-bold text-slate-950">Payment history</p>
                      {payments.length ? (
                        <div className="mt-2 space-y-2">
                          {payments.map((payment) => (
                            <p
                              key={payment.id}
                              className="flex justify-between gap-3 text-slate-600"
                            >
                              <span>
                                {payment.date} | {payment.method}
                              </span>
                              <span className="font-bold text-slate-950">
                                {payment.amount}
                              </span>
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-slate-600">
                          No payments have been recorded for this invoice yet.
                        </p>
                      )}
                    </div>
                  </div>
                  <aside className="rounded bg-cyan-50 p-4">
                    <p className="text-sm text-slate-600">Invoice total</p>
                    <p className="mt-1 text-2xl font-black text-slate-950">
                      {invoice.totalAmount}
                    </p>
                    <p className="mt-3 text-sm text-slate-600">
                      Payment links are placeholders until a real provider is
                      connected.
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      <PortalButton href={`/invoices/${invoice.id}`}>
                        View Invoice
                      </PortalButton>
                      <PortalButton variant="primary">Pay Invoice</PortalButton>
                      <PortalButton>Download PDF</PortalButton>
                    </div>
                  </aside>
                </div>
              </PortalCard>
            );
          })}
        </div>
      ) : (
        <PortalEmptyState message="No invoices are available in this portal preview." />
      )}
    </PortalShell>
  );
}
