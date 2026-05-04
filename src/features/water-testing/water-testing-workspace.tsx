"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import type { CustomerRecord } from "@/features/customers/data/customers";
import type { PoolRecord } from "@/features/pools/data/pools";
import type { SiteRecord } from "@/features/properties/data/sites";
import type { WaterTestRecord } from "@/features/water-testing/data/water-tests";

const allValue = "all";

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function alertTone(alertStatus: string) {
  return alertStatus === "Balanced" ? ("success" as const) : ("warning" as const);
}

const entryFields = [
  "Free chlorine",
  "Total chlorine",
  "pH",
  "Total alkalinity",
  "Calcium hardness",
  "Cyanuric acid",
  "Salt",
  "Phosphate",
  "Water temperature",
];

type TechnicianRecord = {
  id: string;
  name: string;
  role: string;
};

export function WaterTestingWorkspace({
  customers,
  pools,
  sites,
  technicians,
  waterTests,
}: {
  customers: CustomerRecord[];
  pools: PoolRecord[];
  sites: SiteRecord[];
  technicians: TechnicianRecord[];
  waterTests: WaterTestRecord[];
}) {
  const [customer, setCustomer] = useState(allValue);
  const [technician, setTechnician] = useState(allValue);
  const [alertStatus, setAlertStatus] = useState(allValue);
  const [date, setDate] = useState("");

  const filteredTests = useMemo(() => {
    return waterTests.filter((test) => {
      return (
        (customer === allValue || test.customerId === customer) &&
        (technician === allValue || test.technicianId === technician) &&
        (alertStatus === allValue || test.alertStatus === alertStatus) &&
        (!date || test.date === date)
      );
    });
  }, [alertStatus, customer, date, technician, waterTests]);

  const customerOptions = unique(waterTests.map((test) => test.customerId));
  const alertOptions = unique(waterTests.map((test) => test.alertStatus));

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[repeat(4,1fr)_auto_auto] lg:items-center">
          <select
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setCustomer(event.target.value)}
            value={customer}
          >
            <option value={allValue}>All customers</option>
            {customerOptions.map((id) => {
              const linkedCustomer = customers.find((item) => item.id === id);

              return (
                <option key={id} value={id}>
                  {linkedCustomer?.name ?? id}
                </option>
              );
            })}
          </select>
          <select
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setTechnician(event.target.value)}
            value={technician}
          >
            <option value={allValue}>All technicians</option>
            {technicians.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setAlertStatus(event.target.value)}
            value={alertStatus}
          >
            <option value={allValue}>All alert statuses</option>
            {alertOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            className="min-h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setDate(event.target.value)}
            type="date"
            value={date}
          />
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-cyan-600 px-4 text-sm font-semibold text-white hover:bg-cyan-700"
            href="/water-testing/new"
          >
            Add Water Test
          </Link>
          <button
            className="min-h-10 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
            type="button"
          >
            Sync SpinTouch
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">
            Recent water tests
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Mock manual tests now. SpinTouch Bluetooth sync is planned later.
          </p>
        </div>
        {filteredTests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-[1280px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Test</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Site</th>
                  <th className="px-5 py-3 font-semibold">Pool</th>
                  <th className="px-5 py-3 font-semibold">Technician</th>
                  <th className="px-5 py-3 font-semibold">FC</th>
                  <th className="px-5 py-3 font-semibold">TC</th>
                  <th className="px-5 py-3 font-semibold">pH</th>
                  <th className="px-5 py-3 font-semibold">TA</th>
                  <th className="px-5 py-3 font-semibold">CH</th>
                  <th className="px-5 py-3 font-semibold">CYA</th>
                  <th className="px-5 py-3 font-semibold">Salt</th>
                  <th className="px-5 py-3 font-semibold">Phosphate</th>
                  <th className="px-5 py-3 font-semibold">Temp</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTests.map((test) => {
                  const pool = pools.find((item) => item.id === test.poolId);
                  const site =
                    sites.find((item) => item.id === test.siteId) ??
                    sites.find((item) => item.id === pool?.siteId);
                  const linkedCustomer =
                    customers.find((item) => item.id === test.customerId) ??
                    customers.find((item) => item.id === site?.customerId);
                  const linkedTechnician = technicians.find(
                    (item) => item.id === test.technicianId,
                  );

                  return (
                    <tr key={test.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <Link
                          className="font-semibold text-slate-950 hover:text-cyan-700"
                          href={`/water-testing/${test.id}`}
                        >
                          {test.date}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">{test.time}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {linkedCustomer?.name}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{site?.name}</td>
                      <td className="px-5 py-4 text-slate-600">{pool?.name}</td>
                      <td className="px-5 py-4 text-slate-600">
                        {linkedTechnician?.name}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {test.freeChlorine}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {test.totalChlorine}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{test.ph}</td>
                      <td className="px-5 py-4 text-slate-600">
                        {test.alkalinity}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {test.calciumHardness}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {test.cyanuricAcid}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{test.salt}</td>
                      <td className="px-5 py-4 text-slate-600">
                        {test.phosphate}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {test.waterTemperature}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge tone={alertTone(test.alertStatus)}>
                          {test.alertStatus}
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
              description="Adjust the customer, technician, alert, or date filters to show matching water tests."
              title="No water tests match these filters"
            />
          </div>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Mobile water test entry
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Placeholder fields for technician entry. No form submission yet.
            </p>
          </div>
          <StatusBadge>SpinTouch sync planned</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {entryFields.map((field) => (
            <label key={field} className="text-sm font-medium text-slate-700">
              {field}
              <input
                className="mt-1 min-h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                placeholder="Enter reading"
                type="text"
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
