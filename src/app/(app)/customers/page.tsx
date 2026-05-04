import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCustomersWithSource } from "@/features/customers/data/customers";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function CustomersPage() {
  const { count, customers, source } = await getCustomersWithSource();

  return (
    <SectionPage
      title="Customers"
      description="Customer profiles, contact details, billing preferences, notes, communication history, and portal access."
    >
      <SearchFilterBar
        actionHref="/customers/new"
        actionLabel="Add Customer"
        filterLabel="All customer types"
        filterOptions={["Residential", "Commercial", "Real estate"]}
        searchPlaceholder="Search customers by name, phone, or email"
      />

      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
        <span className="font-semibold text-slate-950">Data source:</span>{" "}
        {source}
        <span className="mx-2 text-slate-300">|</span>
        <span className="font-semibold text-slate-950">
          Customer records loaded:
        </span>{" "}
        {count}
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Phone</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Sites</th>
                <th className="px-5 py-3 font-semibold">Balance</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <Link
                      className="font-semibold text-slate-950 hover:text-cyan-700"
                      href={`/customers/${customer.id}`}
                    >
                      {customer.name || "Unnamed customer"}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {customer.phone || "Not provided"}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {customer.email || "Not provided"}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {customer.type || "Residential"}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {customer.siteIds?.length ?? 0}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-950">
                    {customer.outstandingBalance || "$0"}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge
                      tone={
                        (customer.status || "Active") === "Active"
                          ? "success"
                          : "warning"
                      }
                    >
                      {customer.status || "Active"}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </SectionPage>
  );
}
