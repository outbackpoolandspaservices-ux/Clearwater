"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { ChemicalProductRecord } from "@/features/chemicals/data/chemicals";
import { createStockAction, type CreateStockFormState } from "@/features/stock/actions";

type TechnicianOption = {
  id: string;
  name: string;
  role: string;
};

const initialState: CreateStockFormState = {};
const inputClassName =
  "min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";

function Field({
  children,
  label,
  message,
}: {
  children: React.ReactNode;
  label: string;
  message?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <div className="mt-2">{children}</div>
      {message ? <p className="mt-1 text-sm text-rose-700">{message}</p> : null}
    </label>
  );
}

export function StockForm({
  products,
  technicians,
}: {
  products: ChemicalProductRecord[];
  technicians: TechnicianOption[];
}) {
  const [state, formAction, isPending] = useActionState(
    createStockAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.formError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {state.formError}
        </div>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Van stock details
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Product" message={state.fieldErrors?.productId}>
            <select className={inputClassName} defaultValue="" name="productId">
              <option value="">Choose product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.category}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Technician / van">
            <select className={inputClassName} defaultValue="" name="vanUserId">
              <option value="">Unassigned van</option>
              {technicians.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.name} - {technician.role}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Van/location name" message={state.fieldErrors?.locationName}>
            <input
              className={inputClassName}
              name="locationName"
              placeholder="Sam's service van"
              type="text"
            />
          </Field>
          <Field label="Quantity on hand" message={state.fieldErrors?.quantityOnHand}>
            <input
              className={inputClassName}
              inputMode="decimal"
              name="quantityOnHand"
              placeholder="4"
              type="text"
            />
          </Field>
          <Field label="Unit" message={state.fieldErrors?.unit}>
            <input className={inputClassName} name="unit" placeholder="kg, L, bag" />
          </Field>
          <Field label="Low stock threshold">
            <input
              className={inputClassName}
              inputMode="decimal"
              name="lowStockThreshold"
              placeholder="1"
              type="text"
            />
          </Field>
          <Field label="Unit cost">
            <input
              className={inputClassName}
              inputMode="decimal"
              name="unitCost"
              placeholder="24.50"
              type="text"
            />
          </Field>
          <Field label="Selling price">
            <input
              className={inputClassName}
              inputMode="decimal"
              name="sellingPrice"
              placeholder="39.95"
              type="text"
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Supplier">
              <input
                className={inputClassName}
                name="supplier"
                placeholder="BioGuard supplier / local supplier"
                type="text"
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Initial movement note">
              <textarea
                className={`${inputClassName} min-h-24 py-3`}
                name="movementNote"
                placeholder="Initial van load, restock from supplier, or setup adjustment notes"
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-5 text-sm leading-6 text-cyan-950">
        This form creates the stock record and an initial received movement when
        the movement table is available. Adjust, used on job, transfer, reorder,
        and write-off actions are prepared as the next stock workflow steps.
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          href="/stock"
        >
          Cancel
        </Link>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:bg-cyan-300"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving stock..." : "Save Stock"}
        </button>
      </div>
    </form>
  );
}
