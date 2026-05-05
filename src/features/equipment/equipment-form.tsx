"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

import { createEquipmentAction, type CreateEquipmentFormState } from "./actions";
import {
  equipmentBrandOptions,
  equipmentTypeOptions,
  evidenceCategoryOptions,
  manualEquipmentStatusOptions,
  recordTypeOptions,
  warrantyPeriodUnitOptions,
  warrantyProviderOptions,
} from "./options";
import type { CustomerRecord } from "@/features/customers/data/customers";
import type { PoolRecord } from "@/features/pools/data/pools";
import type { SiteRecord } from "@/features/properties/data/sites";
import type { technicians } from "@/lib/mock-data";

const initialState: CreateEquipmentFormState = {};

const inputClassName =
  "min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";

type TechnicianRecord = (typeof technicians)[number];

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="mt-1 text-sm font-medium text-rose-700">{message}</p>
  ) : null;
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

function TextField({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <Field label={label}>
      <input
        className={inputClassName}
        name={name}
        placeholder={placeholder}
        type={type}
      />
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
  return `${customer.name}${customer.phone ? ` - ${customer.phone}` : ""}${
    customer.email ? ` - ${customer.email}` : ""
  }`;
}

function relationshipSearchText({
  customer,
  pool,
  site,
}: {
  customer?: CustomerRecord;
  pool?: PoolRecord;
  site?: SiteRecord;
}) {
  return [
    customer?.name,
    customer?.phone,
    customer?.email,
    site?.name,
    site?.address,
    site?.suburb,
    site?.accessNotes,
    pool?.name,
    pool?.serviceNotes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function EquipmentForm({
  customers,
  pools,
  preselectedPoolId,
  sites,
  technicians,
}: {
  customers: CustomerRecord[];
  pools: PoolRecord[];
  preselectedPoolId?: string;
  sites: SiteRecord[];
  technicians: TechnicianRecord[];
}) {
  const [state, formAction, isPending] = useActionState(
    createEquipmentAction,
    initialState,
  );
  const preselectedPool = pools.find((pool) => pool.id === preselectedPoolId);
  const preselectedSite = preselectedPool
    ? sites.find((site) => site.id === preselectedPool.siteId)
    : undefined;
  const [customerId, setCustomerId] = useState(preselectedSite?.customerId ?? "");
  const [siteId, setSiteId] = useState(preselectedSite?.id ?? "");
  const [poolId, setPoolId] = useState(preselectedPool?.id ?? "");
  const [relationshipSearch, setRelationshipSearch] = useState("");
  const [brand, setBrand] = useState("Other / Unknown");
  const filteredSites = sites.filter(
    (site) => !customerId || site.customerId === customerId,
  );
  const filteredPools = pools.filter((pool) => !siteId || pool.siteId === siteId);
  const relationshipMatches = useMemo(() => {
    const query = relationshipSearch.trim().toLowerCase();

    return pools
      .map((pool) => {
        const site = sites.find((item) => item.id === pool.siteId);
        const customer = site
          ? customers.find((item) => item.id === site.customerId)
          : undefined;

        return {
          customer,
          pool,
          searchText: relationshipSearchText({ customer, pool, site }),
          site,
        };
      })
      .filter((item) => !query || item.searchText.includes(query))
      .slice(0, 8);
  }, [customers, pools, relationshipSearch, sites]);

  function chooseRelationship(match: (typeof relationshipMatches)[number]) {
    setCustomerId(match.customer?.id ?? "");
    setSiteId(match.site?.id ?? "");
    setPoolId(match.pool.id);
    setRelationshipSearch(
      `${match.pool.name} - ${match.site?.name ?? "Site"} - ${
        match.customer?.name ?? "Customer"
      }`,
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.formError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {state.formError}
        </div>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">Equipment details</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextField
              label="Equipment name / display name"
              name="displayName"
              placeholder="AstralPool Viron P320 pump"
            />
            <FieldError message={state.fieldErrors?.displayName} />
          </div>

          <SelectField label="Equipment type" name="equipmentType">
            <option value="">Choose equipment type</option>
            {equipmentTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectField>
          <FieldError message={state.fieldErrors?.equipmentType} />

          <Field
            helpText="Starter list only. Use Other / Unknown with manual entry for brands not yet configured."
            label="Brand"
          >
            <select
              className={inputClassName}
              name="brand"
              onChange={(event) => setBrand(event.target.value)}
              value={brand}
            >
              {equipmentBrandOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <FieldError message={state.fieldErrors?.brand} />
          </Field>

          {brand === "Other / Unknown" ? (
            <TextField
              label="Manual brand"
              name="manualBrand"
              placeholder="Enter brand if known"
            />
          ) : null}

          <TextField label="Model" name="model" placeholder="Viron P320" />
          <TextField label="Serial number" name="serialNumber" />
          <TextField label="SKU / supplier product code" name="sku" />
          <TextField label="Supplier" name="supplier" />
          <TextField label="Purchase date" name="purchaseDate" type="date" />
          <TextField label="Installed date" name="installedDate" type="date" />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Customer / property / pool
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Search existing records, or use the manual customer fields for unlinked
          warranty history.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Search customer, address, phone, email, pool or notes">
              <input
                className={inputClassName}
                onChange={(event) => setRelationshipSearch(event.target.value)}
                placeholder="Search Flynn, 0400, chlorinator, Gillen..."
                type="search"
                value={relationshipSearch}
              />
              <div className="mt-3 rounded-md border border-slate-200 bg-slate-50">
                <div className="max-h-64 overflow-y-auto p-2">
                  {relationshipMatches.map((match) => (
                    <button
                      className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-white hover:shadow-sm"
                      key={match.pool.id}
                      onClick={() => chooseRelationship(match)}
                      type="button"
                    >
                      <span className="block font-semibold text-slate-950">
                        {match.pool.name}
                      </span>
                      <span className="block text-slate-600">
                        {match.site?.name} - {match.site?.address},{" "}
                        {match.site?.suburb}
                      </span>
                      <span className="block text-slate-500">
                        {match.customer?.name} - {match.customer?.phone}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </Field>
          </div>

          <Field label="Customer">
            <select
              className={inputClassName}
              name="customerId"
              onChange={(event) => {
                setCustomerId(event.target.value);
                setSiteId("");
                setPoolId("");
              }}
              value={customerId}
            >
              <option value="">Manual / unlinked customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customerLabel(customer)}
                </option>
              ))}
            </select>
            <FieldError message={state.fieldErrors?.customerId} />
          </Field>

          <Field label="Property/Site">
            <select
              className={inputClassName}
              name="siteId"
              onChange={(event) => {
                setSiteId(event.target.value);
                setPoolId("");
              }}
              value={siteId}
            >
              <option value="">No linked property/site</option>
              {filteredSites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name} - {site.address}, {site.suburb}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Pool">
            <select
              className={inputClassName}
              name="poolId"
              onChange={(event) => setPoolId(event.target.value)}
              value={poolId}
            >
              <option value="">No linked pool</option>
              {filteredPools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {pool.name}
                </option>
              ))}
            </select>
          </Field>

          <TextField label="Manual customer name" name="manualCustomerName" />
          <TextField
            label="Manual customer contact"
            name="manualCustomerContact"
            placeholder="Phone or email"
          />
          <div className="md:col-span-2">
            <TextField label="Manual address" name="manualAddress" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Sale and install details
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <SelectField
            defaultValue="Existing equipment recorded"
            label="Record type"
            name="recordType"
          >
            {recordTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectField>
          <SelectField defaultValue="Active" label="Equipment status" name="manualStatus">
            {manualEquipmentStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectField>
          <TextField label="Price sold" name="priceSold" placeholder="1485.00" />
          <TextField label="Cost price if available" name="costPrice" />
          <SelectField label="Installer / technician" name="installerUserId">
            <option value="">Not recorded</option>
            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.name}
              </option>
            ))}
          </SelectField>
          <div className="flex items-center gap-3 pt-8">
            <input
              className="h-4 w-4 rounded border-slate-300 text-cyan-600"
              id="labourIncluded"
              name="labourIncluded"
              type="checkbox"
            />
            <label className="text-sm font-semibold text-slate-800" htmlFor="labourIncluded">
              Labour included
            </label>
          </div>
          <TextField label="Linked quote ID" name="linkedQuoteId" />
          <TextField label="Linked invoice ID" name="linkedInvoiceId" />
          <TextField label="Linked job ID" name="linkedJobId" />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">Warranty details</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          ClearWater calculates warranty status from installed date when available,
          otherwise purchase date, plus warranty period.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextField
            label="Warranty period number"
            name="warrantyPeriodNumber"
            type="number"
          />
          <SelectField label="Warranty period unit" name="warrantyPeriodUnit">
            <option value="">Unknown</option>
            {warrantyPeriodUnitOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectField>
          <SelectField
            defaultValue="Unknown"
            label="Warranty provider"
            name="warrantyProvider"
          >
            {warrantyProviderOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectField>
          <div className="flex items-center gap-3 pt-8">
            <input
              className="h-4 w-4 rounded border-slate-300 text-cyan-600"
              id="serialNumberRequired"
              name="serialNumberRequired"
              type="checkbox"
            />
            <label
              className="text-sm font-semibold text-slate-800"
              htmlFor="serialNumberRequired"
            >
              Serial number required
            </label>
          </div>
          <TextAreaField label="Warranty notes" name="warrantyNotes" />
          <TextAreaField label="Warranty claim notes" name="warrantyClaimNotes" />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Installation Photos / Warranty Evidence
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Photo upload storage is planned. For now, this section records the
          required evidence checklist for supplier warranty claims and customer
          proof.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {evidenceCategoryOptions.map((category) => (
            <label
              className="rounded-md border border-slate-200 bg-slate-50 p-3"
              key={category}
            >
              <span className="flex items-center gap-3">
                <input
                  className="h-4 w-4 rounded border-slate-300 text-cyan-600"
                  name="evidenceCategories"
                  type="checkbox"
                  value={category}
                />
                <span className="text-sm font-semibold text-slate-800">
                  {category}
                </span>
              </span>
              <input
                className={`${inputClassName} mt-3 bg-white`}
                name={`evidenceNote:${category}`}
                placeholder="Evidence note"
                type="text"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">Notes</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextAreaField label="Internal notes" name="internalNotes" />
          <TextAreaField label="Customer-facing notes" name="customerFacingNotes" />
          <TextAreaField label="Service notes" name="serviceNotes" />
          <TextAreaField
            label="Future maintenance notes"
            name="futureMaintenanceNotes"
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          href="/equipment"
        >
          Cancel
        </Link>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving equipment..." : "Save Equipment"}
        </button>
      </div>
    </form>
  );
}
