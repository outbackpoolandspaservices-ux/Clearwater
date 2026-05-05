"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { StatusBadge } from "@/components/ui/status-badge";
import type { EquipmentRegisterRecord } from "@/features/equipment/data/equipment";
import {
  equipmentBrandOptions,
  equipmentTypeOptions,
  manualEquipmentStatusOptions,
  recordTypeOptions,
} from "@/features/equipment/options";
import { warrantyTone, type WarrantyStatus } from "@/features/equipment/warranty";

const inputClassName =
  "min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";

const warrantyFilterOptions: ("All" | WarrantyStatus)[] = [
  "All",
  "Active",
  "Expiring soon",
  "Expired",
  "Unknown",
];

function matchesFilter(value: string, filter: string) {
  return filter === "All" || value === filter;
}

export function EquipmentRegisterWorkspace({
  equipment,
}: {
  equipment: EquipmentRegisterRecord[];
}) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [brandFilter, setBrandFilter] = useState("All");
  const [warrantyFilter, setWarrantyFilter] = useState("All");
  const [recordTypeFilter, setRecordTypeFilter] = useState("All");
  const [manualStatusFilter, setManualStatusFilter] = useState("All");

  const filteredEquipment = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase();

    return equipment.filter((item) => {
      const searchText = [
        item.displayName,
        item.equipmentType,
        item.brand,
        item.model,
        item.serialNumber,
        item.customerName,
        item.customerPhone,
        item.customerEmail,
        item.siteName,
        item.addressDisplay,
        item.poolName,
        item.recordType,
        item.manualStatus,
        item.internalNotes,
        item.serviceNotes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!normalisedQuery || searchText.includes(normalisedQuery)) &&
        matchesFilter(item.equipmentType, typeFilter) &&
        matchesFilter(item.brand, brandFilter) &&
        matchesFilter(item.warrantyStatus, warrantyFilter) &&
        matchesFilter(item.recordType, recordTypeFilter) &&
        matchesFilter(item.manualStatus, manualStatusFilter)
      );
    });
  }, [
    brandFilter,
    equipment,
    manualStatusFilter,
    query,
    recordTypeFilter,
    typeFilter,
    warrantyFilter,
  ]);

  const activeWarranties = equipment.filter(
    (item) => item.warrantyStatus === "Active",
  ).length;
  const expiringSoon = equipment.filter(
    (item) => item.warrantyStatus === "Expiring soon",
  ).length;
  const expired = equipment.filter(
    (item) => item.warrantyStatus === "Expired",
  ).length;
  const unknown = equipment.filter(
    (item) => item.warrantyStatus === "Unknown",
  ).length;

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Active warranty", activeWarranties, "success"],
          ["Expiring soon", expiringSoon, "warning"],
          ["Expired", expired, "danger"],
          ["Unknown", unknown, "neutral"],
        ].map(([label, value, tone]) => (
          <div
            className="rounded-lg border border-slate-200 bg-white p-4"
            key={label}
          >
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-2xl font-semibold text-slate-950">{value}</p>
              <StatusBadge tone={tone as "danger" | "neutral" | "success" | "warning"}>
                Warranty
              </StatusBadge>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 xl:grid-cols-[1.3fr_repeat(5,1fr)]">
          <input
            className={inputClassName}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search customer, address, pool, brand, model, serial, type, notes..."
            type="search"
            value={query}
          />
          <select
            className={inputClassName}
            onChange={(event) => setTypeFilter(event.target.value)}
            value={typeFilter}
          >
            <option value="All">All types</option>
            {equipmentTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            className={inputClassName}
            onChange={(event) => setBrandFilter(event.target.value)}
            value={brandFilter}
          >
            <option value="All">All brands</option>
            {equipmentBrandOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            className={inputClassName}
            onChange={(event) => setWarrantyFilter(event.target.value)}
            value={warrantyFilter}
          >
            {warrantyFilterOptions.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "All warranty" : option}
              </option>
            ))}
          </select>
          <select
            className={inputClassName}
            onChange={(event) => setRecordTypeFilter(event.target.value)}
            value={recordTypeFilter}
          >
            <option value="All">All record types</option>
            {recordTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            className={inputClassName}
            onChange={(event) => setManualStatusFilter(event.target.value)}
            value={manualStatusFilter}
          >
            <option value="All">All statuses</option>
            {manualEquipmentStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[1350px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {[
                  "Equipment",
                  "Type",
                  "Brand",
                  "Model",
                  "Serial number",
                  "Customer",
                  "Property/Site",
                  "Pool",
                  "Record type",
                  "Installed date",
                  "Warranty expiry",
                  "Warranty status",
                  "Equipment status",
                  "Actions",
                ].map((heading) => (
                  <th className="px-4 py-3 font-semibold" key={heading}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEquipment.map((item) => (
                <tr className="hover:bg-cyan-50/40" key={item.id}>
                  <td className="px-4 py-3">
                    <Link
                      className="font-semibold text-slate-950 hover:text-cyan-700"
                      href={`/equipment/${item.id}`}
                    >
                      {item.displayName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{item.equipmentType}</td>
                  <td className="px-4 py-3 text-slate-700">{item.brand}</td>
                  <td className="px-4 py-3 text-slate-700">{item.model}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">
                    {item.serialNumber}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{item.customerName}</td>
                  <td className="px-4 py-3 text-slate-700">{item.siteName}</td>
                  <td className="px-4 py-3 text-slate-700">{item.poolName}</td>
                  <td className="px-4 py-3 text-slate-700">{item.recordType}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {item.installedDate ?? "Not recorded"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {item.warrantyExpiryDate ?? "Unknown"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={warrantyTone(item.warrantyStatus)}>
                      {item.warrantyStatus}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge>{item.manualStatus}</StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      className="font-semibold text-cyan-700 hover:text-cyan-900"
                      href={`/equipment/${item.id}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredEquipment.length === 0 ? (
          <p className="border-t border-slate-100 px-4 py-6 text-sm text-slate-500">
            No equipment records match the current filters.
          </p>
        ) : null}
      </section>
    </div>
  );
}
