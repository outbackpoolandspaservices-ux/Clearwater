"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ChemicalProductRecord } from "@/features/chemicals/data/chemicals";
import type { StockRecord, StockUsageRecord } from "@/features/stock/data/stock";
import {
  getCustomerById,
  getJobById,
  getTechnicianById,
  technicians,
} from "@/lib/mock-data";

const allValue = "all";

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function stockTone(status: string) {
  if (status === "Low stock") return "danger" as const;
  if (status === "Watch") return "warning" as const;
  return "success" as const;
}

export function StockWorkspace({
  initialFilter,
  initialSearch,
  products,
  stockRecords,
  usageRecords,
}: {
  initialFilter?: string;
  initialSearch?: string;
  products: ChemicalProductRecord[];
  stockRecords: StockRecord[];
  usageRecords: StockUsageRecord[];
}) {
  const [search, setSearch] = useState(initialSearch ?? "");
  const [technician, setTechnician] = useState(allValue);
  const [category, setCategory] = useState(allValue);
  const [lowStock, setLowStock] = useState(
    initialFilter === "low" ? "low" : allValue,
  );
  const [brand, setBrand] = useState(allValue);

  const filteredStock = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return stockRecords.filter((stock) => {
      const product = products.find((item) => item.id === stock.productId);
      const isLow = stock.stockStatus === "Low stock";
      const haystack = [
        product?.name,
        product?.brand,
        product?.category,
        stock.vanName,
        stock.supplier,
        stock.stockStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!searchText || haystack.includes(searchText)) &&
        (technician === allValue || stock.technicianId === technician) &&
        (category === allValue || product?.category === category) &&
        (lowStock === allValue ||
          (lowStock === "low" ? isLow : !isLow)) &&
        (brand === allValue || product?.brand === brand)
      );
    });
  }, [brand, category, lowStock, products, search, stockRecords, technician]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[1.3fr_repeat(4,1fr)_auto_auto_auto_auto] lg:items-center">
          <input
            className="min-h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products, vans, suppliers, or stock status"
            type="search"
            value={search}
          />
          <select
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setTechnician(event.target.value)}
            value={technician}
          >
            <option value={allValue}>All vans</option>
            {technicians.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setCategory(event.target.value)}
            value={category}
          >
            <option value={allValue}>All categories</option>
            {unique(products.map((product) => product.category)).map(
              (item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ),
            )}
          </select>
          <select
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setLowStock(event.target.value)}
            value={lowStock}
          >
            <option value={allValue}>All stock levels</option>
            <option value="low">Low stock only</option>
            <option value="normal">Normal / watch only</option>
          </select>
          <select
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setBrand(event.target.value)}
            value={brand}
          >
            <option value={allValue}>All brands</option>
            {unique(products.map((product) => product.brand)).map(
              (item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ),
            )}
          </select>
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-cyan-600 px-3 text-sm font-semibold text-white hover:bg-cyan-700"
            href="/stock/new"
          >
            Add Stock
          </Link>
          {["Adjust Stock", "Transfer Stock", "Reorder"].map((action) => (
              <button
                className="min-h-10 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
                key={action}
                type="button"
              >
                {action}
              </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">
            Van inventory
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Van stock reads from PostgreSQL when available, with mock fallback.
            Supplier ordering and transfer actions are placeholders.
          </p>
        </div>
        {filteredStock.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-[1120px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Brand</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Van</th>
                  <th className="px-5 py-3 font-semibold">Quantity</th>
                  <th className="px-5 py-3 font-semibold">Cost</th>
                  <th className="px-5 py-3 font-semibold">Sell</th>
                  <th className="px-5 py-3 font-semibold">Low threshold</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStock.map((stock) => {
                  const product = products.find((item) => item.id === stock.productId);
                  const linkedTechnician = getTechnicianById(stock.technicianId);

                  return (
                    <tr className="hover:bg-slate-50" key={stock.id}>
                      <td className="px-5 py-4">
                        <Link
                          className="font-semibold text-slate-950 hover:text-cyan-700"
                          href={`/chemicals/${stock.productId}`}
                        >
                          {product?.name}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {product?.brand}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {product?.category}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {stock.vanName}
                        <p className="mt-1 text-xs text-slate-500">
                          {linkedTechnician?.role}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-950">
                        {stock.quantityOnHand} {stock.unit}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {stock.unitCost}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {stock.sellingPrice}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {stock.lowStockThreshold} {stock.unit}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge tone={stockTone(stock.stockStatus)}>
                          {stock.stockStatus}
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
              description="Adjust the stock filters to show matching inventory."
              title="No stock matches these filters"
            />
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">
            Recent chemical usage
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Job usage examples remain planning data until job chemical usage is
            connected in the next phase.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[940px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Job</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">Quantity</th>
                <th className="px-5 py-3 font-semibold">Cost</th>
                <th className="px-5 py-3 font-semibold">Charge</th>
                <th className="px-5 py-3 font-semibold">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usageRecords.map((usage) => {
                const job = getJobById(usage.jobId);
                const customer = job ? getCustomerById(job.customerId) : undefined;
                const product = products.find((item) => item.id === usage.productId);

                return (
                  <tr className="hover:bg-slate-50" key={usage.id}>
                    <td className="px-5 py-4">
                      <Link
                        className="font-semibold text-slate-950 hover:text-cyan-700"
                        href={`/jobs/${usage.jobId}`}
                      >
                        {job?.jobNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {customer?.name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {product?.name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {usage.quantityUsed}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{usage.cost}</td>
                    <td className="px-5 py-4 font-medium text-slate-950">
                      {usage.chargeAmount}
                    </td>
                    <td className="px-5 py-4 text-cyan-700">{usage.margin}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
