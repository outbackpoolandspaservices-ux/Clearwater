"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getCustomerById,
  getJobById,
  getSiteById,
  getTechnicianById,
  reports,
  technicians,
} from "@/lib/mock-data";

const allValue = "all";

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function statusTone(status: string) {
  if (status === "Ready") {
    return "success" as const;
  }

  if (status === "Draft") {
    return "warning" as const;
  }

  return "neutral" as const;
}

export function ReportsWorkspace() {
  const [reportType, setReportType] = useState(allValue);
  const [status, setStatus] = useState(allValue);
  const [technician, setTechnician] = useState(allValue);
  const [customer, setCustomer] = useState(allValue);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      return (
        (reportType === allValue || report.reportType === reportType) &&
        (status === allValue || report.status === status) &&
        (technician === allValue || report.technicianId === technician) &&
        (customer === allValue || report.customerId === customer)
      );
    });
  }, [customer, reportType, status, technician]);

  const customerIds = unique(reports.map((report) => report.customerId));

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 xl:grid-cols-[repeat(4,1fr)_auto_auto] xl:items-center">
          <select
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setReportType(event.target.value)}
            value={reportType}
          >
            <option value={allValue}>All report types</option>
            {unique(reports.map((report) => report.reportType)).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setStatus(event.target.value)}
            value={status}
          >
            <option value={allValue}>All statuses</option>
            {unique(reports.map((report) => report.status)).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
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
            onChange={(event) => setCustomer(event.target.value)}
            value={customer}
          >
            <option value={allValue}>All customers</option>
            {customerIds.map((id) => {
              const linkedCustomer = getCustomerById(id);

              return (
                <option key={id} value={id}>
                  {linkedCustomer?.name ?? id}
                </option>
              );
            })}
          </select>
          <button
            className="min-h-10 rounded-md bg-cyan-600 px-4 text-sm font-semibold text-white hover:bg-cyan-700"
            type="button"
          >
            Create Service Report
          </button>
          <button
            className="min-h-10 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
            type="button"
          >
            Create Inspection Report
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">
            Report register
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Mock report previews only. PDF generation and sending will be added later.
          </p>
        </div>

        {filteredReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-[1040px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Report</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Site</th>
                  <th className="px-5 py-3 font-semibold">Linked job</th>
                  <th className="px-5 py-3 font-semibold">Technician</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Sent</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => {
                  const linkedCustomer = getCustomerById(report.customerId);
                  const site = getSiteById(report.siteId);
                  const job = getJobById(report.jobId);
                  const linkedTechnician = getTechnicianById(report.technicianId);

                  return (
                    <tr key={report.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <Link
                          className="font-semibold text-slate-950 hover:text-cyan-700"
                          href={`/reports/${report.id}`}
                        >
                          {report.reportNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {report.reportType}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {linkedCustomer?.name}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{site?.name}</td>
                      <td className="px-5 py-4 text-slate-600">
                        {job?.jobNumber}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {linkedTechnician?.name}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {report.reportDate}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge tone={statusTone(report.status)}>
                          {report.status}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {report.sentStatus}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            type="button"
                          >
                            Download PDF
                          </button>
                          <button
                            className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            type="button"
                          >
                            Send to Customer
                          </button>
                        </div>
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
              description="Adjust the filters to bring report previews back into view."
              title="No reports match these filters"
            />
          </div>
        )}
      </section>
    </div>
  );
}
