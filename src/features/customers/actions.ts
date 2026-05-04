"use server";

import { redirect } from "next/navigation";

import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";

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

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

async function getTableColumns(
  client: ReturnType<typeof createPostgresClient>,
  tableName: string,
) {
  const rows = await client<{ column_name: string }[]>`
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = ${tableName}
  `;

  return new Set(rows.map((row) => row.column_name));
}

function safeErrorSummary(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown customer save error.",
  };
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

  const billingAddress = joinBillingAddress({
    line1: billingLine1,
    line2: billingLine2,
    suburb: billingSuburb,
    state: billingState,
    postcode: billingPostcode,
    country: billingCountry,
  });

  const legacyNotes = [
    internalNotes ? `Internal notes: ${internalNotes}` : "",
    status ? `Customer status: ${status}` : "",
    communicationPreference
      ? `Communication preference: ${communicationPreference}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const client = createPostgresClient();

  try {
    const customerColumns = await getTableColumns(client, "customers");

    if (customerColumns.size === 0) {
      console.error("Customer creation failed: customers table is missing.");

      return {
        formError:
          "The customers table is not available yet. Please run the protected database setup route, then try again.",
      };
    }

    const candidateValues: Record<string, boolean | string | null> = {
      display_name: name,
      email: email || null,
      phone: phone || null,
      billing_address: billingAddress || null,
      customer_type: customerType,
      communication_preferences: communicationPreference || null,
      internal_notes: internalNotes || null,
      notes: legacyNotes || null,
      is_active: status === "active",
      portal_enabled: false,
    };

    // TODO: once the current migrations catch up to src/db/schema.ts, store
    // status in is_active and internal notes in internal_notes. Until then the
    // migrated table safely keeps these details in notes where available.
    const columns = Object.keys(candidateValues).filter((column) =>
      customerColumns.has(column),
    );
    const values = columns.map((column) => candidateValues[column]);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");

    await client.unsafe(
      `insert into "customers" (${columns.map(quoteIdentifier).join(", ")})
       values (${placeholders})`,
      values,
    );
  } catch (error) {
    console.error("Customer creation failed", {
      ...safeErrorSummary(error),
      formFields: {
        hasEmail: Boolean(email),
        hasPhone: Boolean(phone),
        hasBillingAddress: Boolean(billingAddress),
        customerType,
        status,
      },
      error,
    });

    return {
      formError:
        "ClearWater could not save this customer. The database is connected, but the customer table shape needs attention. Please check the Vercel server logs for the safe insert error summary.",
    };
  } finally {
    await client.end();
  }

  redirect("/customers?created=customer");
}
