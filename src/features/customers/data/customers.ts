import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";
import { customers, getCustomerById as getMockCustomerById } from "@/lib/mock-data";

const mockCustomers = customers;

export type CustomerRecord = (typeof mockCustomers)[number];

type DatabaseCustomerRow = {
  id: string;
  display_name?: string | null;
  email?: string | null;
  phone?: string | null;
  billing_address?: string | null;
  notes?: string | null;
  customer_type?: string | null;
  invoice_terms?: string | null;
  communication_preferences?: string | null;
  property_manager_details?: string | null;
  owner_details?: string | null;
  portal_enabled?: boolean | null;
  is_active?: boolean | null;
};

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function formatCustomerType(value?: string | null) {
  if (!value) {
    return "Residential";
  }

  const labels: Record<string, string> = {
    body_corporate: "Body corporate",
    commercial: "Commercial",
    property_manager: "Property manager",
    real_estate: "Real estate",
    residential: "Residential",
  };

  return labels[value] ?? value;
}

function safeReadError(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown customer read error.",
  };
}

function logCustomerSource(source: "database" | "mock", count: number) {
  console.info("ClearWater customers data source", {
    count,
    source,
  });
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

async function getSiteIdsForCustomer(
  client: ReturnType<typeof createPostgresClient>,
  customerId: string,
) {
  const tableName = (await tableExists(client, "sites")) ? "sites" : "properties";

  if (!(await tableExists(client, tableName))) {
    return [];
  }

  const columns = await getTableColumns(client, tableName);

  if (!columns.has("id") || !columns.has("customer_id")) {
    return [];
  }

  const rows = await client.unsafe(
    `select "id" from ${quoteIdentifier(tableName)} where "customer_id" = $1`,
    [customerId],
  );

  return rows.map((row) => String(row.id));
}

function mapDatabaseCustomer(
  customer: DatabaseCustomerRow,
  siteIds: string[],
): CustomerRecord {
  const notes = customer.notes ?? "";

  return {
    id: customer.id,
    name: customer.display_name ?? "Unnamed customer",
    phone: customer.phone ?? "Not provided",
    email: customer.email ?? "Not provided",
    type: formatCustomerType(customer.customer_type),
    billingAddress: customer.billing_address ?? "Not provided",
    invoiceTerms: customer.invoice_terms ?? "Not set",
    communicationPreference:
      customer.communication_preferences ?? "No preference recorded",
    internalNotes:
      notes ||
      customer.property_manager_details ||
      customer.owner_details ||
      "No internal notes recorded",
    outstandingBalance: "$0",
    status: customer.is_active === false ? "Inactive" : "Active",
    siteIds,
    quoteSummary: "No database quotes linked yet",
    invoiceSummary: "No database invoices linked yet",
  };
}

async function getCustomersFromDatabase(): Promise<CustomerRecord[]> {
  const client = createPostgresClient();

  try {
    const columns = await getTableColumns(client, "customers");

    if (!columns.has("id") || !columns.has("display_name")) {
      throw new Error("The customers table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "display_name",
      "email",
      "phone",
      "billing_address",
      "notes",
      "customer_type",
      "invoice_terms",
      "communication_preferences",
      "property_manager_details",
      "owner_details",
      "portal_enabled",
      "is_active",
    ].filter((column) => columns.has(column));

    const rows = await client.unsafe<DatabaseCustomerRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "customers"
       order by "display_name" asc`,
    );

    return Promise.all(
      rows.map(async (customer) =>
        mapDatabaseCustomer(
          customer,
          await getSiteIdsForCustomer(client, customer.id),
        ),
      ),
    );
  } finally {
    await client.end();
  }
}

async function getCustomerFromDatabaseById(
  customerId: string,
): Promise<CustomerRecord | undefined> {
  const client = createPostgresClient();

  try {
    const columns = await getTableColumns(client, "customers");

    if (!columns.has("id") || !columns.has("display_name")) {
      throw new Error("The customers table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "display_name",
      "email",
      "phone",
      "billing_address",
      "notes",
      "customer_type",
      "invoice_terms",
      "communication_preferences",
      "property_manager_details",
      "owner_details",
      "portal_enabled",
      "is_active",
    ].filter((column) => columns.has(column));

    const rows = await client.unsafe<DatabaseCustomerRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "customers"
       where "id" = $1
       limit 1`,
      [customerId],
    );
    const customer = rows[0];

    if (!customer) {
      return undefined;
    }

    return mapDatabaseCustomer(
      customer,
      await getSiteIdsForCustomer(client, customer.id),
    );
  } finally {
    await client.end();
  }
}

export async function getCustomers() {
  if (!hasDatabaseUrl()) {
    logCustomerSource("mock", mockCustomers.length);

    return mockCustomers;
  }

  try {
    const databaseCustomers = await getCustomersFromDatabase();

    logCustomerSource("database", databaseCustomers.length);

    return databaseCustomers;
  } catch (error) {
    console.error(
      "Falling back to mock customers after database read failed",
      safeReadError(error),
    );
    logCustomerSource("mock", mockCustomers.length);

    return mockCustomers;
  }
}

export async function getCustomerById(customerId: string) {
  if (!hasDatabaseUrl()) {
    console.info("ClearWater customer detail data source", {
      customerId,
      source: "mock",
    });

    return getMockCustomerById(customerId);
  }

  try {
    const databaseCustomer = await getCustomerFromDatabaseById(customerId);

    if (databaseCustomer) {
      console.info("ClearWater customer detail data source", {
        customerId,
        source: "database",
      });

      return databaseCustomer;
    }

    console.info("ClearWater customer detail data source", {
      customerId,
      source: "mock",
    });

    return getMockCustomerById(customerId);
  } catch (error) {
    console.error(
      "Falling back to mock customer after database detail read failed",
      safeReadError(error),
    );
    console.info("ClearWater customer detail data source", {
      customerId,
      source: "mock",
    });

    return getMockCustomerById(customerId);
  }
}
