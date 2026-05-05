"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import type { InvoiceRecord } from "@/features/invoices/data/invoices";

const allValue = "all";

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function paymentTone(status: string) {
  if (status === "Paid") return "success" as const;
  if (status === "Overdue") return "danger" as const;
  if (status === "Partially paid") return "warning" as const;
  return "neutral" as const;
}

function xeroTone(status: string) {
  if (status === "Synced") return "success" as const;
  if (status === "Sync failed") return "danger" as const;
  if (status === "Ready to sync") return "warning" as const;
  return "neutral" as const;
}

export function InvoicesWorkspace({ invoices }: { invoices: InvoiceRecord[] }) {
  const [paymentStatus, setPaymentStatus] = useState(allValue);
  const [xeroStatus, setXeroStatus] = useState(allValue);
  const [customer, setCustomer] = useState(allValue);
  const [date, setDate] = useState("");

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      return (
        (paymentStatus === allValue ||
          invoice.paymentStatus === paymentStatus) &&
        (xeroStatus === allValue || invoice.xeroSyncStatus === xeroStatus) &&
        (customer === allValue || invoice.customerId === customer) &&
        (!date || invoice.invoiceDate === date)
      );
    });
  }, [customer, date, invoices, paymentStatus, xeroStatus]);

  const customerIds = unique(invoices.map((invoice) => invoice.customerId));

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[repeat(4,1fr)_auto_auto_auto_auto] lg:items-center">
          <select
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setPaymentStatus(event.target.value)}
            value={paymentStatus}
          >
            <option value={allValue}>All payment statuses</option>
            {unique(invoices.map((invoice) => invoice.paymentStatus)).map(
              (item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ),
            )}
          </select>
          <select
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setXeroStatus(event.target.value)}
            value={xeroStatus}
          >
            <option value={allValue}>All Xero statuses</option>
            {unique(invoices.map((invoice) => invoice.xeroSyncStatus)).map(
              (item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ),
            )}
          </select>
          <select
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setCustomer(event.target.value)}
            value={customer}
          >
            <option value={allValue}>All customers</option>
            {customerIds.map((id) => (
              <option key={id} value={id}>
                {invoices.find((invoice) => invoice.customerId === id)
                  ?.customerName || id}
              </option>
            ))}
          </select>
          <input
            className="min-h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setDate(event.target.value)}
            type="date"
            value={date}
          />
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-cyan-600 px-3 text-sm font-semibold text-white hover:bg-cyan-700"
            href="/invoices/new"
          >
            Create Invoice
          </Link>
          {["Send Invoice", "Add Payment", "Sync with Xero"].map((action) => (
            <button
              className="min-h-10 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
              key={action}
              type="button"
            >
              {action} Placeholder
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">
            Invoice register
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Invoices read from PostgreSQL when available with mock fallback.
            Xero and payment gateway integration are placeholders.
          </p>
        </div>
        {filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-[1040px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Invoice</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Site</th>
                  <th className="px-5 py-3 font-semibold">Linked job</th>
                  <th className="px-5 py-3 font-semibold">Invoice date</th>
                  <th className="px-5 py-3 font-semibold">Due date</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Payment</th>
                  <th className="px-5 py-3 font-semibold">Xero</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((invoice) => {
                  return (
                    <tr className="hover:bg-slate-50" key={invoice.id}>
                      <td className="px-5 py-4">
                        <Link
                          className="font-semibold text-slate-950 hover:text-cyan-700"
                          href={`/invoices/${invoice.id}`}
                        >
                          {invoice.number}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {invoice.customerName || invoice.customerId}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {invoice.siteName || invoice.siteId}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {invoice.jobNumber || invoice.jobId || "No job linked"}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {invoice.invoiceDate}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {invoice.dueDate}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-950">
                        {invoice.totalAmount}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge tone={paymentTone(invoice.paymentStatus)}>
                          {invoice.paymentStatus}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge tone={xeroTone(invoice.xeroSyncStatus)}>
                          {invoice.xeroSyncStatus}
                        </StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              description="Adjust the invoice filters to show matching records."
              title="No invoices match these filters"
            />
          </div>
        )}
      </section>
    </div>
  );
}
