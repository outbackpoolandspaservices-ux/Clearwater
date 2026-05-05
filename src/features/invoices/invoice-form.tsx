"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createInvoiceAction,
  type CreateInvoiceFormState,
} from "@/features/invoices/actions";

type Option = { id: string; label: string };

const initialState: CreateInvoiceFormState = {};
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

export function InvoiceForm({
  customers,
  jobs,
  pools,
  quotes,
  sites,
}: {
  customers: Option[];
  jobs: Option[];
  pools: Option[];
  quotes: Option[];
  sites: Option[];
}) {
  const [state, formAction, isPending] = useActionState(
    createInvoiceAction,
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
        <h2 className="text-lg font-semibold text-slate-950">Invoice details</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Customer" message={state.fieldErrors?.customerId}>
            <select className={inputClassName} defaultValue="" name="customerId">
              <option value="">Choose customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Property/site">
            <select className={inputClassName} defaultValue="" name="siteId">
              <option value="">Optional site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Pool">
            <select className={inputClassName} defaultValue="" name="poolId">
              <option value="">Optional pool</option>
              {pools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {pool.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Linked job">
            <select className={inputClassName} defaultValue="" name="jobId">
              <option value="">Optional job</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Quote">
            <select className={inputClassName} defaultValue="" name="quoteId">
              <option value="">Optional quote</option>
              {quotes.map((quote) => (
                <option key={quote.id} value={quote.id}>
                  {quote.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Due date">
            <input className={inputClassName} name="dueAt" type="date" />
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">First line item</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Item type">
            <select className={inputClassName} defaultValue="labour" name="itemType">
              <option value="labour">Labour</option>
              <option value="parts">Parts</option>
              <option value="chemicals">Chemicals</option>
              <option value="callout">Callout</option>
              <option value="equipment">Equipment</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Amount excluding GST" message={state.fieldErrors?.amount}>
            <input className={inputClassName} inputMode="decimal" name="amount" placeholder="250.00" />
          </Field>
          <Field label="Quantity" message={state.fieldErrors?.quantity}>
            <input className={inputClassName} defaultValue="1" inputMode="decimal" name="quantity" />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description" message={state.fieldErrors?.description}>
              <textarea className={`${inputClassName} min-h-24 py-3`} name="description" />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-5 text-sm leading-6 text-cyan-950">
        Xero sync and payment gateway collection remain placeholders. This
        creates a draft invoice and line item in PostgreSQL when available.
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/invoices">
          Cancel
        </Link>
        <button className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:bg-cyan-300" disabled={isPending} type="submit">
          {isPending ? "Saving invoice..." : "Save Invoice"}
        </button>
      </div>
    </form>
  );
}
