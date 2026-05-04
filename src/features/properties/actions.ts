"use server";

import { redirect } from "next/navigation";

import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";

export type CreatePropertyFormState = {
  fieldErrors?: Partial<Record<string, string>>;
  formError?: string;
};

const statusValues = ["active", "inactive", "access_check"] as const;

function getString(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
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

async function tableExists(
  client: ReturnType<typeof createPostgresClient>,
  tableName: string,
) {
  const result = await client<{ exists: boolean }[]>`
    select exists (
      select 1
      from information_schema.tables
      where table_schema = 'public'
        and table_name = ${tableName}
    )
  `;

  return result[0]?.exists ?? false;
}

function optionalNumber(value: string) {
  if (!value) {
    return null;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
}

function safeErrorSummary(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown property save error.",
  };
}

export async function createPropertyAction(
  _previousState: CreatePropertyFormState,
  formData: FormData,
): Promise<CreatePropertyFormState> {
  const customerId = getString(formData, "customerId");
  const name = getString(formData, "name");
  const addressSearch = getString(formData, "addressSearch");
  const streetAddress = getString(formData, "streetAddress");
  const suburb = getString(formData, "suburb");
  const state = getString(formData, "state");
  const postcode = getString(formData, "postcode");
  const country = getString(formData, "country");
  const latitude = getString(formData, "latitude");
  const longitude = getString(formData, "longitude");
  const accessInstructions = getString(formData, "accessInstructions");
  const gateCode = getString(formData, "gateCode");
  const petWarning = getString(formData, "petWarning");
  const tenantName = getString(formData, "tenantName");
  const tenantPhone = getString(formData, "tenantPhone");
  const ownerAgentDetails = getString(formData, "ownerAgentDetails");
  const internalNotes = getString(formData, "internalNotes");
  const status = getString(formData, "status");

  const fieldErrors: NonNullable<CreatePropertyFormState["fieldErrors"]> = {};

  if (!customerId) {
    fieldErrors.customerId = "Choose the customer this property belongs to.";
  }

  if (!name) {
    fieldErrors.name = "Property/site name is required.";
  }

  if (!streetAddress) {
    fieldErrors.streetAddress = "Street address is required.";
  }

  if (!suburb) {
    fieldErrors.suburb = "Suburb is required.";
  }

  if (!statusValues.includes(status as (typeof statusValues)[number])) {
    fieldErrors.status = "Select a valid status.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  if (!hasDatabaseUrl()) {
    return {
      formError:
        "Property creation is ready, but no database URL is configured yet.",
    };
  }

  const client = createPostgresClient();

  try {
    const tableName = (await tableExists(client, "sites")) ? "sites" : "properties";

    if (!(await tableExists(client, tableName))) {
      return {
        formError:
          "The properties table is not available yet. Please run the protected database setup route, then try again.",
      };
    }

    const columns = await getTableColumns(client, tableName);
    const requiredColumns = ["customer_id", "name"];

    if (requiredColumns.some((column) => !columns.has(column))) {
      return {
        formError:
          "The properties table is missing required columns. Please check the database setup.",
      };
    }

    const metadata = [
      addressSearch ? `Address search: ${addressSearch}` : "",
      state ? `State: ${state}` : "",
      postcode ? `Postcode: ${postcode}` : "",
      country ? `Country: ${country}` : "",
      tenantName ? `Tenant name: ${tenantName}` : "",
      tenantPhone ? `Tenant phone: ${tenantPhone}` : "",
      ownerAgentDetails ? `Owner/agent details: ${ownerAgentDetails}` : "",
      status ? `Status: ${status}` : "",
      internalNotes ? `Internal site notes: ${internalNotes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // TODO: add first-class state, postcode, country, tenant and status columns
    // in a future migration. Until then, store those details in technician_notes.
    const candidateValues: Record<string, number | string | null> = {
      customer_id: customerId,
      name,
      address: streetAddress,
      address_line_1: streetAddress,
      suburb,
      gate_code: gateCode || null,
      access_notes: accessInstructions || null,
      access_warning: accessInstructions || null,
      pet_warnings: petWarning || null,
      tenant_details: [tenantName, tenantPhone].filter(Boolean).join(" | ") || null,
      owner_agent_details: ownerAgentDetails || null,
      technician_notes: metadata || null,
      latitude: optionalNumber(latitude),
      longitude: optionalNumber(longitude),
    };
    const insertColumns = Object.keys(candidateValues).filter((column) =>
      columns.has(column),
    );
    const values = insertColumns.map((column) => candidateValues[column]);
    const placeholders = insertColumns.map((_, index) => `$${index + 1}`).join(", ");

    await client.unsafe(
      `insert into ${quoteIdentifier(tableName)} (${insertColumns
        .map(quoteIdentifier)
        .join(", ")})
       values (${placeholders})`,
      values,
    );
  } catch (error) {
    console.error("Property creation failed", {
      ...safeErrorSummary(error),
      formFields: {
        hasAddress: Boolean(streetAddress),
        hasCustomerId: Boolean(customerId),
        hasLatitude: Boolean(latitude),
        hasLongitude: Boolean(longitude),
      },
      error,
    });

    return {
      formError:
        "ClearWater could not save this property. Please check the Vercel server logs for the safe property save error summary.",
    };
  } finally {
    await client.end();
  }

  redirect("/properties?created=property");
}
