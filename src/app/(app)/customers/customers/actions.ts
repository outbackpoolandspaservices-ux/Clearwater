"use server";

import { redirect } from "next/navigation";
import { drizzle } from "drizzle-orm/postgres-js";

import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";
import { customers, organisations } from "@/db/schema";
import { organisationSeed } from "@/db/seed/organisation";

export type CreateCustomerFormState = {
  fieldErrors?: Partial<Record<string, string>>;
  formError?: string;
};

const customerTypeValues = [
  "residential",
  "commercial",
  "real_estate",
  "property_manager",
  "body_corporate",
] as const;

const statusValues = ["active", "inactive"] as const;

function getString(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPostcode(postcode: string) {
  return /^[A-Za-z0-9 -]{3,10}$/.test(postcode);
}

function joinBillingAddress(parts: {
  line1: string;
  line2: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}) {
  return [
    parts.line1,
    parts.line2,
    [parts.suburb, parts.state, parts.postcode].filter(Boolean).join(" "),
    parts.country,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function createCustomerAction(
  _previousState: CreateCustomerFormState,
  formData: FormData,
): Promise<CreateCustomerFormState> {
  const name = getString(formData, "name");
  const phone = getString(formData, "phone");
  const email = getString(formData, "email");
  const customerType = getString(formData, "customerType");
  const communicationPreference = getString(formData, "communicationPreference");
  const internalNotes = getString(formData, "internalNotes");
  const status = getString(formData, "status");
  const billingLine1 = getString(formData, "billingLine1");
  const billingLine2 = getString(formData, "billingLine2");
  const billingSuburb = getString(formData, "billingSuburb");
  const billingState = getString(formData, "billingState");
  const billingPostcode = getString(formData, "billingPostcode");
  const billingCountry = getString(formData, "billingCountry");

  const fieldErrors: NonNullable<CreateCustomerFormState["fieldErrors"]> = {};

  if (!name) {
    fieldErrors.name = "Customer name is required.";
  }

  if (email && !isValidEmail(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (billingPostcode && !isValidPostcode(billingPostcode)) {
    fieldErrors.billingPostcode =
      "Enter a valid postcode, or leave this field blank.";
  }

  if (!customerTypeValues.includes(customerType as (typeof customerTypeValues)[number])) {
    fieldErrors.customerType = "Select a valid customer type.";
  }

  if (!statusValues.includes(status as (typeof statusValues)[number])) {
    fieldErrors.status = "Select a valid customer status.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  if (!hasDatabaseUrl()) {
    return {
      formError:
        "Customer creation is ready, but no database URL is configured yet. Add DATABASE_URL or a supported POSTGRES_URL variable, then try again.",
    };
  }

  const client = createPostgresClient();
  const db = drizzle(client);

  try {
    await db.insert(organisations).values(organisationSeed).onConflictDoNothing();

    await db.insert(customers).values({
      organisationId: organisationSeed.id,
      displayName: name,
      email: email || null,
      phone: phone || null,
      customerType: customerType as (typeof customerTypeValues)[number],
      billingAddress: joinBillingAddress({
        line1: billingLine1,
        line2: billingLine2,
        suburb: billingSuburb,
        state: billingState,
        postcode: billingPostcode,
        country: billingCountry,
      }),
      communicationPreferences: communicationPreference || null,
      internalNotes: internalNotes || null,
      isActive: status === "active",
    });
  } catch (error) {
    console.error("Customer creation failed", error);

    return {
      formError:
        "ClearWater could not save this customer yet. Please check the database setup and try again.",
    };
  } finally {
    await client.end();
  }

  redirect("/customers?created=customer");
}
