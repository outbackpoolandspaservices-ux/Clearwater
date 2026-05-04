import { NextRequest, NextResponse } from "next/server";

import { createPostgresClient, getDatabaseUrl } from "@/db/connection";
import { getDataSourceLabel } from "@/lib/data-source";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
      { ok: false, message: "Unauthorized customer count request." },
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
      customers: "missing",
    });
  }

  const client = createPostgresClient(databaseUrl);

  try {
    if (!(await customersTableExists(client))) {
      return NextResponse.json({
        ok: true,
        dataSourceMode,
        databaseUrlConfigured: true,
        customers: "missing",
      });
    }

    const result = await client<{ count: number }[]>`
      select count(*)::int as count
      from customers
    `;

    return NextResponse.json({
      ok: true,
      dataSourceMode,
      databaseUrlConfigured: true,
      customers: result[0]?.count ?? 0,
    });
  } catch (error) {
    console.error("Customer count verification failed", error);

    const errorName = error instanceof Error ? error.name : "UnknownError";
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown customer count verification error.";

    return NextResponse.json(
      {
        ok: false,
        stage: "customer-count",
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
