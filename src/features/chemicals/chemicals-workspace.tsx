"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ChemicalProductRecord } from "@/features/chemicals/data/chemicals";

const allValue = "all";

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function productTone(status: string) {
  if (status === "Active") return "success" as const;
  if (status === "Watch") return "warning" as const;
  return "neutral" as const;
}

export function ChemicalsWorkspace({
  products,
}: {
  products: ChemicalProductRecord[];
}) {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState(allValue);
  const [category, setCategory] = useState(allValue);
  const [purpose, setPurpose] = useState(allValue);
  const [status, setStatus] = useState(allValue);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchText = search.trim().toLowerCase();
      const haystack = [
        product.name,
        product.brand,
        product.category,
        product.subcategory,
        product.purpose,
        product.productStrength,
        product.relatedWaterIssues?.join(" "),
        product.applicationMethod,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!searchText || haystack.includes(searchText)) &&
        (brand === allValue || product.brand === brand) &&
        (category === allValue || product.category === category) &&
        (purpose === allValue || product.purpose === purpose) &&
        (status === allValue || product.status === status)
      );
    });
  }, [brand, category, products, purpose, search, status]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[1.3fr_repeat(4,1fr)_auto] lg:items-center">
          <input
            className="min-h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products, water issues, purpose, or strength"
            type="search"
            value={search}
          />
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
            onChange={(event) => setPurpose(event.target.value)}
            value={purpose}
          >
            <option value={allValue}>All purposes</option>
            {unique(products.map((product) => product.purpose)).map(
              (item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ),
            )}
          </select>
          <select
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => setStatus(event.target.value)}
            value={status}
          >
            <option value={allValue}>All statuses</option>
            {unique(products.map((product) => product.status)).map(
              (item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ),
            )}
          </select>
          <button
            className="min-h-10 rounded-md bg-cyan-600 px-4 text-sm font-semibold text-white hover:bg-cyan-700"
            type="button"
          >
            Add Product Placeholder
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">
            Chemical and product register
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            BioGuard Australia and Dryden Aqua foundation records. Technician
            review is required before product advice is used with customers.
          </p>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-[1240px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Brand</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Purpose</th>
                  <th className="px-5 py-3 font-semibold">Unit</th>
                  <th className="px-5 py-3 font-semibold">Strength</th>
                  <th className="px-5 py-3 font-semibold">Application</th>
                  <th className="px-5 py-3 font-semibold">Safety note</th>
                  <th className="px-5 py-3 font-semibold">Review</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr className="hover:bg-slate-50" key={product.id}>
                    <td className="px-5 py-4">
                      <Link
                        className="font-semibold text-slate-950 hover:text-cyan-700"
                        href={`/chemicals/${product.id}`}
                      >
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{product.brand}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {product.category}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {product.purpose}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {product.unitType}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {product.productStrength}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {product.applicationMethod}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {product.handlingNote}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      Technician review required
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={productTone(product.status)}>
                        {product.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              description="Adjust the chemical filters to show matching products."
              title="No products match these filters"
            />
          </div>
        )}
      </section>
    </div>
  );
}
