"use client";

import { useActionState } from "react";
import Link from "next/link";

import {
  createCustomerAction,
  type CreateCustomerFormState,
} from "@/features/customers/actions";

const initialState: CreateCustomerFormState = {};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-sm font-medium text-rose-700">{message}</p>;
}

function FormField({
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

const inputClassName =
  "min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";

export function CustomerForm() {
  const [state, formAction, isPending] = useActionState(
    createCustomerAction,
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
          Customer details
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          This creates the customer and billing profile only. Service locations
          and pool sites will be added separately in the next stage.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormField label="Customer name">
              <input
                className={inputClassName}
                name="name"
                placeholder="Flynn Drive Residence"
                type="text"
              />
              <FieldError message={state.fieldErrors?.name} />
            </FormField>
          </div>

          <FormField label="Customer type">
            <select
              className={inputClassName}
              defaultValue="residential"
              name="customerType"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="real_estate">Real estate</option>
              <option value="property_manager">Property manager</option>
              <option value="body_corporate">Body corporate</option>
            </select>
            <FieldError message={state.fieldErrors?.customerType} />
          </FormField>

          <FormField label="Status">
            <select className={inputClassName} defaultValue="active" name="status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <FieldError message={state.fieldErrors?.status} />
          </FormField>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Contact and communication
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Add at least one contact method where possible. Phone and email are
          optional for now so imported or incomplete records can still be saved.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <FormField label="Phone">
            <input
              className={inputClassName}
              name="phone"
              placeholder="08 8950 0000"
              type="tel"
            />
          </FormField>

          <FormField label="Email">
            <input
              className={inputClassName}
              name="email"
              placeholder="customer@example.com"
              type="email"
            />
            <FieldError message={state.fieldErrors?.email} />
          </FormField>

          <div className="md:col-span-2">
            <FormField label="Communication preference">
              <select
                className={inputClassName}
                defaultValue="Email and SMS reminders"
                name="communicationPreference"
              >
                <option>Email and SMS reminders</option>
                <option>Email only</option>
                <option>SMS only</option>
                <option>Phone call preferred</option>
                <option>Portal messages preferred</option>
              </select>
            </FormField>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Billing address
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          This address is for billing and customer records. It is separate from
          future service site/property addresses.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormField label="Billing address line 1">
              <input
                className={inputClassName}
                name="billingLine1"
                placeholder="12 Flynn Drive"
                type="text"
              />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField label="Billing address line 2">
              <input
                className={inputClassName}
                name="billingLine2"
                placeholder="Unit, care of, or attention line"
                type="text"
              />
            </FormField>
          </div>

          <FormField label="Billing suburb">
            <input
              className={inputClassName}
              name="billingSuburb"
              placeholder="Alice Springs"
              type="text"
            />
          </FormField>

          <FormField label="Billing state">
            <input
              className={inputClassName}
              name="billingState"
              placeholder="NT"
              type="text"
            />
          </FormField>

          <FormField label="Billing postcode">
            <input
              className={inputClassName}
              name="billingPostcode"
              placeholder="0870"
              type="text"
            />
            <FieldError message={state.fieldErrors?.billingPostcode} />
          </FormField>

          <FormField label="Billing country">
            <input
              className={inputClassName}
              defaultValue="Australia"
              name="billingCountry"
              type="text"
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <FormField
          helpText="These notes stay internal to the ClearWater business workspace."
          label="Internal notes"
        >
          <textarea
            className={`${inputClassName} min-h-28 py-3`}
            name="internalNotes"
            placeholder="Access, billing, or account context for office staff."
          />
        </FormField>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          href="/customers"
        >
          Cancel
        </Link>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving customer..." : "Save Customer"}
        </button>
      </div>
    </form>
  );
}
