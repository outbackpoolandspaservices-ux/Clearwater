import { NextRequest, NextResponse } from "next/server";

import { createPostgresClient, getDatabaseUrl } from "@/db/connection";
import { getDataSourceLabel } from "@/lib/data-source";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CustomerListRow = {
  id: string;
  created_at?: Date | string | null;
  customer_type?: string | null;
  display_name?: string | null;
  email?: string | null;
  name?: string | null;
  phone?: string | null;
};

function getRequestSetupKey(request: NextRequest) {
  return (
    request.headers.get("x-clearwater-setup-key") ??
    request.nextUrl.searchParams.get("CLEARWATER_SETUP_KEY") ??
    request.nextUrl.searchParams.get("setupKey")
  );
}

function isAuthorised(request: NextRequest) {
  const expectedKey = process.env.CLEARWATER_SETUP_KEY;
  const requestKey = getRequestSetupKey(request);

  return Boolean(expectedKey && requestKey && requestKey === expectedKey);
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

async function customersTableExists(client: ReturnType<typeof createPostgresClient>) {
  const result = await client<{ exists: boolean }[]>`
    select exists (
      select 1
      from information_schema.tables
      where table_schema = 'public'
        and table_name = 'customers'
    )
  `;

  return result[0]?.exists ?? false;
}

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized customer list request." },
      { status: 401 },
    );
  }

  const databaseUrl = getDatabaseUrl();
  const dataSourceMode = getDataSourceLabel();

  if (!databaseUrl) {
    return NextResponse.json({
      ok: true,
      dataSourceMode,
      databaseUrlConfigured: false,
      customers: [],
    });
  }

  const client = createPostgresClient(databaseUrl);

  try {
    if (!(await customersTableExists(client))) {
      return NextResponse.json({
        ok: true,
        dataSourceMode,
        databaseUrlConfigured: true,
        customers: [],
      });
    }

    const tableColumns = await getTableColumns(client, "customers");
    const readableColumns = [
      "id",
      "display_name",
      "name",
      "email",
      "phone",
      "customer_type",
      "created_at",
    ].filter((column) => tableColumns.has(column));

    if (!readableColumns.includes("id")) {
      return NextResponse.json({
        ok: true,
        dataSourceMode,
        databaseUrlConfigured: true,
        customers: [],
      });
    }

    const rows = await client.unsafe<CustomerListRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "customers"
       order by ${tableColumns.has("created_at") ? '"created_at" desc' : '"id" asc'}`,
    );

    return NextResponse.json({
      ok: true,
      dataSourceMode,
      databaseUrlConfigured: true,
      customers: rows.map((customer) => ({
        id: customer.id,
        display_name: customer.display_name ?? customer.name ?? null,
        email: customer.email ?? null,
        phone: customer.phone ?? null,
        customer_type: customer.customer_type ?? null,
        created_at: customer.created_at ?? null,
      })),
    });
  } catch (error) {
    console.error("Customer list debug endpoint failed", error);

    const errorName = error instanceof Error ? error.name : "UnknownError";
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown customer list verification error.";

    return NextResponse.json(
      {
        ok: false,
        stage: "customer-list",
        errorName,
        errorMessage,
        dataSourceMode,
        databaseUrlConfigured: true,
      },
      { status: 500 },
    );
  } finally {
    await client.end();
  }
}
