"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

import { createJobAction, type CreateJobFormState } from "@/features/jobs/actions";
import type { CustomerRecord } from "@/features/customers/data/customers";
import type { PoolRecord } from "@/features/pools/data/pools";
import type { SiteRecord } from "@/features/properties/data/sites";

type TechnicianOption = {
  id: string;
  name: string;
  role: string;
};

const initialState: CreateJobFormState = {};
const inputClassName =
  "min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";
const checklistOptions = [
  "Test water",
  "Empty skimmer basket",
  "Empty pump basket",
  "Brush pool",
  "Vacuum pool",
  "Scoop debris",
  "Clean waterline",
  "Check pump operation",
  "Check filter pressure",
  "Backwash/clean filter if needed",
  "Check chlorinator/sanitiser system",
  "Check heater if present",
  "Check cleaner/robot if present",
  "Add chemicals if needed",
  "Take before/after photos placeholder",
];

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

function SelectField({
  children,
  defaultValue = "",
  label,
  name,
}: {
  children: React.ReactNode;
  defaultValue?: string;
  label: string;
  name: string;
}) {
  return (
    <Field label={label}>
      <select className={inputClassName} defaultValue={defaultValue} name={name}>
        {children}
      </select>
    </Field>
  );
}

function TextAreaField({ label, name }: { label: string; name: string }) {
  return (
    <Field label={label}>
      <textarea className={`${inputClassName} min-h-24 py-3`} name={name} />
    </Field>
  );
}

function customerLabel(customer: CustomerRecord) {
  return `${customer.name} (${[customer.phone, customer.email]
    .filter(Boolean)
    .join(" | ")})`;
}

export function JobForm({
  customers,
  pools,
  sites,
  technicians,
}: {
  customers: CustomerRecord[];
  pools: PoolRecord[];
  sites: SiteRecord[];
  technicians: TechnicianOption[];
}) {
  const [state, formAction, isPending] = useActionState(
    createJobAction,
    initialState,
  );
  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");

  const searchableSites = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sites.filter((site) => {
      const customer = customers.find((item) => item.id === site.customerId);
      const sitePools = pools.filter((pool) => pool.siteId === site.id);
      const haystack = [
        customer?.name,
        customer?.phone,
        customer?.email,
        site.name,
        site.address,
        site.suburb,
        site.accessNotes,
        site.accessWarning,
        site.ownerAgentDetails,
        site.tenantDetails,
        ...sitePools.map((pool) => pool.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!query || haystack.includes(query)) &&
        (!selectedCustomerId || site.customerId === selectedCustomerId)
      );
    });
  }, [customers, pools, search, selectedCustomerId, sites]);
  const filteredSites = selectedCustomerId
    ? sites.filter((site) => site.customerId === selectedCustomerId)
    : sites;
  const filteredPools = selectedSiteId
    ? pools.filter((pool) => pool.siteId === selectedSiteId)
    : pools;

  function chooseSite(site: SiteRecord) {
    setSelectedCustomerId(site.customerId);
    setSelectedSiteId(site.id);
    setSearch(`${site.name} - ${site.address}, ${site.suburb}`);
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.formError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {state.formError}
        </div>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Customer, property and pool
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Search by customer, property, address, suburb, phone, email, or pool
          name. Selecting a customer filters sites; selecting a site filters pools.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Search customer, site, address, or pool">
              <input
                className={inputClassName}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search Flynn, Gillen, 0400, spa..."
                type="search"
                value={search}
              />
              <div className="mt-3 rounded-md border border-slate-200 bg-slate-50">
                {searchableSites.length > 0 ? (
                  <div className="max-h-56 overflow-y-auto p-2">
                    {searchableSites.slice(0, 8).map((site) => {
                      const customer = customers.find(
                        (item) => item.id === site.customerId,
                      );

                      return (
                        <button
                          className={`block w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-white hover:shadow-sm ${
                            selectedSiteId === site.id
                              ? "bg-white text-cyan-800 shadow-sm"
                              : "text-slate-700"
                          }`}
                          key={site.id}
                          onClick={() => chooseSite(site)}
                          type="button"
                        >
                          <span className="block font-semibold text-slate-950">
                            {site.name}
                          </span>
                          <span className="mt-1 block text-slate-600">
                            {site.address}, {site.suburb}
                          </span>
                          <span className="mt-1 block text-slate-500">
                            {customer?.name ?? "Unknown customer"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="px-3 py-3 text-sm text-slate-500">
                    No matching customers, sites, or pools found
                  </p>
                )}
              </div>
            </Field>
          </div>

          <Field label="Customer">
            <select
              className={inputClassName}
              name="customerId"
              onChange={(event) => {
                setSelectedCustomerId(event.target.value);
                setSelectedSiteId("");
              }}
              value={selectedCustomerId}
            >
              <option value="">Choose a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customerLabel(customer)}
                </option>
              ))}
            </select>
            <FieldError message={state.fieldErrors?.customerId} />
          </Field>

          <Field label="Property/site">
            <select
              className={inputClassName}
              name="siteId"
              onChange={(event) => setSelectedSiteId(event.target.value)}
              value={selectedSiteId}
            >
              <option value="">Choose a property/site</option>
              {filteredSites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name} - {site.address}, {site.suburb}
                </option>
              ))}
            </select>
            <FieldError message={state.fieldErrors?.siteId} />
          </Field>

          <Field label="Pool">
            <select className={inputClassName} defaultValue="" name="poolId">
              <option value="">Choose a pool if relevant</option>
              {filteredPools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {pool.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Job details and scheduling
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Job title">
            <input
              className={inputClassName}
              name="title"
              placeholder="Regular service"
              type="text"
            />
            <FieldError message={state.fieldErrors?.title} />
          </Field>

          <SelectField label="Job type" name="jobType">
            <option value="">Choose job type</option>
            <option value="regular_service">Regular service</option>
            <option value="one_off_service">One-off service</option>
            <option value="pool_inspection">Pool inspection</option>
            <option value="water_test_only">Water test only</option>
            <option value="green_pool_recovery">Green pool recovery</option>
            <option value="vacuum_and_clean">Vacuum and clean</option>
            <option value="equipment_inspection">Equipment inspection</option>
            <option value="pump_repair">Pump repair</option>
            <option value="filter_service">Filter service</option>
            <option value="chlorinator_service">Chlorinator service</option>
            <option value="heater_inspection_repair">
              Heater inspection/repair
            </option>
            <option value="leak_investigation">Leak investigation</option>
            <option value="handover_new_owner_visit">
              Handover/new owner visit
            </option>
            <option value="emergency_callout">Emergency callout</option>
            <option value="quote_visit">Quote visit</option>
            <option value="other">Other</option>
          </SelectField>

          <SelectField defaultValue="draft" label="Status" name="status">
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="ready">Ready</option>
            <option value="in_progress">In progress</option>
            <option value="waiting_on_parts">Waiting on parts</option>
            <option value="waiting_on_customer">Waiting on customer</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="follow_up_required">Follow-up required</option>
          </SelectField>

          <SelectField defaultValue="Normal" label="Priority" name="priority">
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </SelectField>

          <Field label="Preferred date">
            <input className={inputClassName} name="preferredDate" type="date" />
          </Field>

          <Field label="Scheduled date">
            <input className={inputClassName} name="scheduledDate" type="date" />
          </Field>

          <Field label="Scheduled start time">
            <input
              className={inputClassName}
              name="scheduledStartTime"
              type="time"
            />
          </Field>

          <Field label="Estimated duration in minutes">
            <input
              className={inputClassName}
              inputMode="numeric"
              name="estimatedDurationMinutes"
              placeholder="75"
              type="number"
            />
            <FieldError message={state.fieldErrors?.estimatedDurationMinutes} />
          </Field>

          <SelectField label="Assigned technician" name="assignedTechnicianId">
            <option value="">Unassigned</option>
            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.name} - {technician.role}
              </option>
            ))}
          </SelectField>

          <SelectField defaultValue="no" label="Recurring job" name="recurringJob">
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </SelectField>

          <SelectField label="Recurrence pattern placeholder" name="recurrencePattern">
            <option value="">No recurrence pattern</option>
            <option value="weekly">Weekly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="custom">Custom</option>
          </SelectField>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Scope and checklist
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {checklistOptions.map((item) => (
            <label
              className="flex min-h-11 items-center gap-3 rounded-md border border-slate-200 px-3 text-sm text-slate-700"
              key={item}
            >
              <input
                className="h-4 w-4 rounded border-slate-300 text-cyan-600"
                name="checklist"
                type="checkbox"
                value={item}
              />
              {item}
            </label>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <TextAreaField label="Customer notes" name="customerNotes" />
          <TextAreaField label="Technician notes" name="technicianNotes" />
          <TextAreaField label="Internal notes" name="internalNotes" />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Repair-specific fields
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextAreaField label="Reported issue" name="reportedIssue" />
          <TextAreaField label="Fault observed" name="faultObserved" />
          <TextAreaField label="Diagnosis notes" name="diagnosisNotes" />
          <TextAreaField label="Parts required" name="partsRequired" />

          <SelectField defaultValue="no" label="Parts ordered" name="partsOrdered">
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </SelectField>

          <SelectField defaultValue="no" label="Quote required" name="quoteRequired">
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </SelectField>

          <SelectField
            defaultValue="no"
            label="Customer approval required"
            name="customerApprovalRequired"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </SelectField>

          <SelectField
            defaultValue="no"
            label="Follow-up required"
            name="followUpRequired"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </SelectField>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          href="/jobs"
        >
          Cancel
        </Link>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving job..." : "Save Job"}
        </button>
      </div>
    </form>
  );
}
