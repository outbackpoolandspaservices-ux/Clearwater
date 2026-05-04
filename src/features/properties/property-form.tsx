"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createPropertyAction,
  type CreatePropertyFormState,
} from "@/features/properties/actions";
import type { CustomerRecord } from "@/features/customers/data/customers";

const initialState: CreatePropertyFormState = {};

const inputClassName =
  "min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-sm font-medium text-rose-700">{message}</p>;
}

function Field({
  children,
  helpText,
  label,
}: {
  children: React.ReactNode;
  helpText?: string;
  label: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <div className="mt-2">{children}</div>
      {helpText ? (
        <p className="mt-1 text-sm leading-5 text-slate-500">{helpText}</p>
      ) : null}
    </label>
  );
}

export function PropertyForm({ customers }: { customers: CustomerRecord[] }) {
  const [state, formAction, isPending] = useActionState(
    createPropertyAction,
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
          Customer and address search
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Google Places autocomplete is planned for a later stage. Manual address
          entry works now.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Customer">
              <select className={inputClassName} defaultValue="" name="customerId">
                <option value="">Choose a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.email ? `(${customer.email})` : ""}
                  </option>
                ))}
              </select>
              <FieldError message={state.fieldErrors?.customerId} />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field
              helpText="Foundation field for future Google Places autocomplete."
              label="Address search"
            >
              <input
                className={inputClassName}
                name="addressSearch"
                placeholder="Start typing an address"
                type="search"
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Property details
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Site/property name">
              <input
                className={inputClassName}
                name="name"
                placeholder="Flynn Drive Residence"
                type="text"
              />
              <FieldError message={state.fieldErrors?.name} />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Street address">
              <input
                className={inputClassName}
                name="streetAddress"
                placeholder="18 Flynn Drive"
                type="text"
              />
              <FieldError message={state.fieldErrors?.streetAddress} />
            </Field>
          </div>

          <Field label="Suburb">
            <input
              className={inputClassName}
              name="suburb"
              placeholder="Alice Springs"
              type="text"
            />
            <FieldError message={state.fieldErrors?.suburb} />
          </Field>

          <Field label="State">
            <input className={inputClassName} name="state" placeholder="NT" />
          </Field>

          <Field label="Postcode">
            <input className={inputClassName} name="postcode" placeholder="0870" />
          </Field>

          <Field label="Country">
            <input
              className={inputClassName}
              defaultValue="Australia"
              name="country"
            />
          </Field>

          <Field helpText="Placeholder for later geocoding." label="Latitude">
            <input className={inputClassName} name="latitude" placeholder="-23.698" />
          </Field>

          <Field helpText="Placeholder for later geocoding." label="Longitude">
            <input className={inputClassName} name="longitude" placeholder="133.88" />
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">Access and notes</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Access instructions">
              <textarea
                className={`${inputClassName} min-h-24 py-3`}
                name="accessInstructions"
                placeholder="Side gate, key safe, parking, hazards, or preferred access."
              />
            </Field>
          </div>

          <Field label="Gate code">
            <input className={inputClassName} name="gateCode" placeholder="4421" />
          </Field>

          <Field label="Dog/pet warning">
            <input
              className={inputClassName}
              name="petWarning"
              placeholder="Friendly dog may be in yard"
            />
          </Field>

          <Field label="Tenant name">
            <input className={inputClassName} name="tenantName" />
          </Field>

          <Field label="Tenant phone">
            <input className={inputClassName} name="tenantPhone" type="tel" />
          </Field>

          <div className="md:col-span-2">
            <Field label="Owner/agent details">
              <textarea
                className={`${inputClassName} min-h-24 py-3`}
                name="ownerAgentDetails"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Internal site notes">
              <textarea
                className={`${inputClassName} min-h-24 py-3`}
                name="internalNotes"
              />
            </Field>
          </div>

          <Field label="Status">
            <select className={inputClassName} defaultValue="active" name="status">
              <option value="active">Active</option>
              <option value="access_check">Access check</option>
              <option value="inactive">Inactive</option>
            </select>
            <FieldError message={state.fieldErrors?.status} />
          </Field>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          href="/properties"
        >
          Cancel
        </Link>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving property..." : "Save Property"}
        </button>
      </div>
    </form>
  );
}
