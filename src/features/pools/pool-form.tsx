"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

import { createPoolAction, type CreatePoolFormState } from "@/features/pools/actions";
import type { CustomerRecord } from "@/features/customers/data/customers";
import type { SiteRecord } from "@/features/properties/data/sites";

const initialState: CreatePoolFormState = {};

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

function siteOptionLabel({
  customerContact,
  customerName,
  site,
}: Pick<SiteSearchOption, "customerContact" | "customerName" | "site">) {
  return `${site.name} - ${site.address}, ${site.suburb} - ${customerName}${
    customerContact ? ` (${customerContact})` : ""
  }`;
}

type SiteSearchOption = {
  customerName: string;
  customerContact: string;
  searchText: string;
  site: SiteRecord;
};

function buildSiteSearchOptions(
  customers: CustomerRecord[],
  sites: SiteRecord[],
): SiteSearchOption[] {
  return sites.map((site) => {
    const customer = customers.find((item) => item.id === site.customerId);
    const customerName = customer?.name ?? site.ownerOrAgent ?? "Unknown customer";
    const customerContact = [customer?.phone, customer?.email]
      .filter(Boolean)
      .join(" | ");
    const searchText = [
      site.name,
      site.address,
      site.suburb,
      site.accessWarning,
      site.accessNotes,
      site.tenantDetails,
      site.ownerAgentDetails,
      customerName,
      customer?.phone,
      customer?.email,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return {
      customerContact,
      customerName,
      searchText,
      site,
    };
  });
}

export function PoolForm({
  customers,
  sites,
}: {
  customers: CustomerRecord[];
  sites: SiteRecord[];
}) {
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [siteSearch, setSiteSearch] = useState("");
  const [state, formAction, isPending] = useActionState(
    createPoolAction,
    initialState,
  );
  const siteOptions = useMemo(
    () => buildSiteSearchOptions(customers, sites),
    [customers, sites],
  );
  const filteredSiteOptions = useMemo(() => {
    const query = siteSearch.trim().toLowerCase();

    if (!query) {
      return siteOptions;
    }

    return siteOptions.filter((option) => option.searchText.includes(query));
  }, [siteOptions, siteSearch]);
  const selectedSiteOption = siteOptions.find(
    (option) => option.site.id === selectedSiteId,
  );

  function selectSite(option: SiteSearchOption) {
    setSelectedSiteId(option.site.id);
    setSiteSearch(siteOptionLabel(option));
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.formError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {state.formError}
        </div>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">Pool identity</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Link this pool to a service property. Detailed fields that are not yet
          first-class database columns are stored safely in pool notes.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field
              helpText="Search by site name, customer, address, suburb, notes, phone, or email. The selected property/site ID is saved with the pool."
              label="Search properties/sites"
            >
              <input
                className={inputClassName}
                onChange={(event) => setSiteSearch(event.target.value)}
                placeholder="Search Flynn, Mia, Gillen, 0400..."
                type="search"
                value={siteSearch}
              />
              <div className="mt-3 rounded-md border border-slate-200 bg-slate-50">
                {filteredSiteOptions.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto p-2">
                    {filteredSiteOptions.slice(0, 8).map((option) => (
                      <button
                        className={`block w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-white hover:shadow-sm ${
                          selectedSiteId === option.site.id
                            ? "bg-white text-cyan-800 shadow-sm"
                            : "text-slate-700"
                        }`}
                        key={option.site.id}
                        onClick={() => selectSite(option)}
                        type="button"
                      >
                        <span className="block font-semibold text-slate-950">
                          {option.site.name}
                        </span>
                        <span className="mt-1 block text-slate-600">
                          {option.site.address}, {option.site.suburb}
                        </span>
                        <span className="mt-1 block text-slate-500">
                          {option.customerName}
                          {option.customerContact
                            ? ` - ${option.customerContact}`
                            : ""}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="px-3 py-3 text-sm text-slate-500">
                    No matching properties/sites found
                  </p>
                )}
              </div>
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field
              helpText={
                selectedSiteOption
                  ? `Selected: ${siteOptionLabel(selectedSiteOption)}`
                  : "Choose a result above or select a property/site from the list."
              }
              label="Property/site"
            >
              <select
                className={inputClassName}
                name="siteId"
                onChange={(event) => setSelectedSiteId(event.target.value)}
                value={selectedSiteId}
              >
                <option value="">Choose a property/site</option>
                {siteOptions.map((option) => (
                  <option key={option.site.id} value={option.site.id}>
                    {siteOptionLabel(option)}
                  </option>
                ))}
              </select>
              <FieldError message={state.fieldErrors?.siteId} />
            </Field>
          </div>

          <Field label="Pool name">
            <input
              className={inputClassName}
              name="name"
              placeholder="Main family pool"
              type="text"
            />
            <FieldError message={state.fieldErrors?.name} />
          </Field>

          <Field label="Pool volume in litres">
            <input
              className={inputClassName}
              inputMode="numeric"
              name="volumeLitres"
              placeholder="52000"
              type="number"
            />
            <FieldError message={state.fieldErrors?.volumeLitres} />
          </Field>

          <SelectField label="Pool type" name="poolType">
            <option value="">Choose pool type</option>
            <option value="Residential pool">Residential pool</option>
            <option value="Commercial pool">Commercial pool</option>
            <option value="Body corporate / shared pool">
              Body corporate / shared pool
            </option>
            <option value="Rental property pool">Rental property pool</option>
            <option value="Holiday accommodation pool">
              Holiday accommodation pool
            </option>
            <option value="Spa">Spa</option>
            <option value="Plunge pool">Plunge pool</option>
            <option value="Lap pool">Lap pool</option>
            <option value="Therapy / hydrotherapy pool">
              Therapy / hydrotherapy pool
            </option>
            <option value="Other">Other</option>
          </SelectField>

          <SelectField label="Pool shape" name="poolShape">
            <option value="">Choose pool shape</option>
            <option value="Rectangular">Rectangular</option>
            <option value="Kidney">Kidney</option>
            <option value="Freeform">Freeform</option>
            <option value="L-shaped">L-shaped</option>
            <option value="Round">Round</option>
            <option value="Oval">Oval</option>
            <option value="Figure-eight">Figure-eight</option>
            <option value="Lap pool">Lap pool</option>
            <option value="Spa / circular">Spa / circular</option>
            <option value="Custom / unknown">Custom / unknown</option>
          </SelectField>

          <SelectField label="Pool use type" name="poolUseType">
            <option value="">Choose use type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="rental">Rental</option>
            <option value="holiday_accommodation">Holiday accommodation</option>
            <option value="body_corporate">Body corporate</option>
          </SelectField>

          <SelectField defaultValue="active" label="Status" name="status">
            <option value="active">Active</option>
            <option value="monitor">Monitor</option>
            <option value="inactive">Inactive</option>
          </SelectField>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Environment and water source
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <SelectField label="Indoor or outdoor" name="environment">
            <option value="">Choose environment</option>
            <option value="outdoor">Outdoor</option>
            <option value="indoor">Indoor</option>
          </SelectField>

          <SelectField label="Covered or uncovered" name="covered">
            <option value="">Choose cover</option>
            <option value="covered">Covered</option>
            <option value="uncovered">Uncovered</option>
          </SelectField>

          <SelectField label="Shaded" name="shaded">
            <option value="">Choose shade level</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="partial">Partial</option>
          </SelectField>

          <SelectField label="Exposure level" name="exposureLevel">
            <option value="">Choose exposure</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </SelectField>

          <SelectField label="Leaf/debris load" name="leafDebrisLoad">
            <option value="">Choose debris load</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </SelectField>

          <SelectField label="Dust exposure" name="dustExposure">
            <option value="">Choose dust exposure</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </SelectField>

          <SelectField label="Surrounding surface" name="surroundingSurface">
            <option value="">Choose surface</option>
            <option value="concrete">Concrete</option>
            <option value="pavers">Pavers</option>
            <option value="lawn">Lawn</option>
            <option value="dirt">Dirt</option>
            <option value="decking">Decking</option>
            <option value="other">Other</option>
          </SelectField>

          <SelectField label="Water source" name="waterSource">
            <option value="">Choose water source</option>
            <option value="town_water">Town water</option>
            <option value="bore_water">Bore water</option>
            <option value="rainwater">Rainwater</option>
            <option value="trucked_water">Trucked water</option>
            <option value="mixed">Mixed</option>
            <option value="unknown">Unknown</option>
          </SelectField>

          <SelectField label="Hard water risk" name="hardWaterRisk">
            <option value="">Choose risk</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="unknown">Unknown</option>
          </SelectField>

          <div className="md:col-span-2">
            <TextAreaField label="Source water notes" name="sourceWaterNotes" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Construction and systems
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <SelectField label="Surface type" name="surfaceType">
            <option value="">Choose surface</option>
            <option value="concrete">Concrete</option>
            <option value="pebblecrete">Pebblecrete</option>
            <option value="fibreglass">Fibreglass</option>
            <option value="vinyl">Vinyl</option>
            <option value="tiled">Tiled</option>
            <option value="painted">Painted</option>
            <option value="other">Other</option>
          </SelectField>

          <Field label="Approximate age of pool">
            <input className={inputClassName} name="poolAge" placeholder="10 years" />
          </Field>

          <SelectField label="Recent resurfacing" name="recentResurfacing">
            <option value="">Choose resurfacing status</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="unknown">Unknown</option>
          </SelectField>

          <SelectField label="Coping condition" name="copingCondition">
            <option value="">Choose coping condition</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Loose coping">Loose coping</option>
            <option value="Cracked coping">Cracked coping</option>
            <option value="Missing sections">Missing sections</option>
            <option value="Sharp edges/safety concern">
              Sharp edges/safety concern
            </option>
            <option value="Stained/discoloured">Stained/discoloured</option>
            <option value="Not inspected">Not inspected</option>
            <option value="Not applicable">Not applicable</option>
            <option value="Other / notes">Other / notes</option>
          </SelectField>

          <SelectField label="Skimmer condition" name="skimmerCondition">
            <option value="">Choose skimmer condition</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Cracked/damaged">Cracked/damaged</option>
            <option value="Basket missing">Basket missing</option>
            <option value="Lid damaged/missing">Lid damaged/missing</option>
            <option value="Weir door missing/damaged">
              Weir door missing/damaged
            </option>
            <option value="Blocked/restricted">Blocked/restricted</option>
            <option value="Not inspected">Not inspected</option>
            <option value="Not applicable">Not applicable</option>
            <option value="Other / notes">Other / notes</option>
          </SelectField>

          <SelectField label="Sanitation type" name="sanitiserType">
            <option value="">Choose sanitation</option>
            <option value="salt">Salt</option>
            <option value="chlorine">Chlorine</option>
            <option value="mineral">Mineral</option>
            <option value="magnesium">Magnesium</option>
            <option value="ozone">Ozone</option>
            <option value="uv">UV</option>
            <option value="bromine">Bromine</option>
            <option value="unknown">Unknown</option>
          </SelectField>

          <Field label="Chlorinator type">
            <input className={inputClassName} name="chlorinatorType" />
          </Field>
          <p className="text-sm leading-6 text-slate-500 md:col-span-2">
            Salt level requirements will be calculated from the selected
            chlorinator/equipment profile where available.
          </p>

          <SelectField label="Filtration type" name="filtrationType">
            <option value="">Choose filtration</option>
            <option value="cartridge">Cartridge</option>
            <option value="sand">Sand</option>
            <option value="glass_media">Glass media</option>
            <option value="de">DE</option>
            <option value="unknown">Unknown</option>
          </SelectField>

          <Field label="Pump type">
            <input className={inputClassName} name="pumpType" />
          </Field>

          <SelectField label="Heater type" name="heaterType">
            <option value="">Choose heater type</option>
            <option value="None">None</option>
            <option value="Electric heat pump">Electric heat pump</option>
            <option value="Gas heater">Gas heater</option>
            <option value="Solar heating">Solar heating</option>
            <option value="Electric resistance heater">
              Electric resistance heater
            </option>
            <option value="Integrated spa heater">Integrated spa heater</option>
            <option value="Unknown">Unknown</option>
            <option value="Not inspected">Not inspected</option>
            <option value="Other / notes">Other / notes</option>
          </SelectField>

          <SelectField label="Spa attached" name="spaAttached">
            <option value="">Choose spa status</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </SelectField>

          <Field label="Automation/controller system">
            <input className={inputClassName} name="automationSystem" />
          </Field>

          <SelectField label="Cleaner type" name="cleanerType">
            <option value="">Choose cleaner</option>
            <option value="robotic">Robotic</option>
            <option value="suction">Suction</option>
            <option value="pressure">Pressure</option>
            <option value="manual">Manual</option>
            <option value="in_floor">In-floor</option>
            <option value="none">None</option>
            <option value="unknown">Unknown</option>
          </SelectField>

          <div className="md:col-span-2">
            <TextAreaField label="Shell/structure notes" name="shellStructureNotes" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">Water chemistry</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Water chemistry targets will be shown during water testing based on pool
          type, sanitiser system, chlorinator/equipment settings, and water
          conditions.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">Service notes</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextAreaField
            label="Normal chemical behaviour"
            name="normalChemicalBehaviour"
          />
          <TextAreaField label="Recurring issues" name="recurringIssues" />
          <TextAreaField
            label="Access/safety notes specific to the pool"
            name="accessSafetyNotes"
          />
          <TextAreaField label="Technician notes" name="technicianNotes" />
          <TextAreaField label="Customer preferences" name="customerPreferences" />
          <TextAreaField label="Internal notes" name="internalNotes" />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          href="/pools"
        >
          Cancel
        </Link>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving pool..." : "Save Pool"}
        </button>
      </div>
    </form>
  );
}
