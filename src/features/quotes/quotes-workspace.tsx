"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getCustomerById,
  getJobById,
  getSiteById,
  quotes,
} from "@/lib/mock-data";

const allValue = "all";

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function statusTone(status: string) {
  if (status === "Approved") return "success" as const;
  if (status === "Sent") return "warning" as const;
  return "neutral" as const;
}

export function QuotesWorkspace() {
  const [status, setStatus] = useState(allValue);
  const [customer, setCustomer] = useState(allValue);
  const [date, setDate] = useState("");

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      return (
        (status === allValue || quote.status === status) &&
        (customer === allValue || quote.customerId === customer) &&
        (!date || quote.quoteDate === date)
      );
    });
  }, [customer, date, status]);

  const customerIds = unique(quotes.map((quote) => quote.customerId));

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[repeat(3,1fr)_auto_auto_auto_auto] lg:items-center">
          <select
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setStatus(event.target.value)}
            value={status}
          >
            <option value={allValue}>All statuses</option>
            {unique(quotes.map((quote) => quote.status)).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setCustomer(event.target.value)}
            value={customer}
          >
            <option value={allValue}>All customers</option>
            {customerIds.map((id) => (
              <option key={id} value={id}>
                {getCustomerById(id)?.name ?? id}
              </option>
            ))}
          </select>
          <input
            className="min-h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setDate(event.target.value)}
            type="date"
            value={date}
          />
          {["Create Quote", "Send Quote", "Convert to Job", "Convert to Invoice"].map(
            (action) => (
              <button
                className="min-h-10 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
                key={action}
                type="button"
              >
                {action}
              </button>
            ),
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">
            Quote register
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Mock quotes only. Sending and conversion actions are placeholders.
          </p>
        </div>
        {filteredQuotes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-[1040px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Quote</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Site</th>
                  <th className="px-5 py-3 font-semibold">Linked job</th>
                  <th className="px-5 py-3 font-semibold">Quote date</th>
                  <th className="px-5 py-3 font-semibold">Expiry</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQuotes.map((quote) => {
                  const linkedCustomer = getCustomerById(quote.customerId);
                  const site = getSiteById(quote.siteId);
                  const job = getJobById(quote.jobId);

                  return (
                    <tr className="hover:bg-slate-50" key={quote.id}>
                      <td className="px-5 py-4">
                        <Link
                          className="font-semibold text-slate-950 hover:text-cyan-700"
                          href={`/quotes/${quote.id}`}
                        >
                          {quote.number}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">
                          {quote.title}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {linkedCustomer?.name}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{site?.name}</td>
                      <td className="px-5 py-4 text-slate-600">
                        {job?.jobNumber}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {quote.quoteDate}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {quote.expiryDate}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-950">
                        {quote.totalAmount}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge tone={statusTone(quote.status)}>
                          {quote.status}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {quote.approvalStatus}
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
              description="Adjust the quote filters to show matching records."
              title="No quotes match these filters"
            />
          </div>
        )}
      </section>
    </div>
  );
}
