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

async function propertyTableName(client: ReturnType<typeof createPostgresClient>) {
  const result = await client<{ table_name: string }[]>`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in ('sites', 'properties')
    order by case table_name when 'sites' then 0 else 1 end
    limit 1
  `;

  return result[0]?.table_name ?? null;
}

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized property count request." },
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
      properties: "missing",
    });
  }

  const client = createPostgresClient(databaseUrl);

  try {
    const tableName = await propertyTableName(client);

    if (!tableName) {
      return NextResponse.json({
        ok: true,
        dataSourceMode,
        databaseUrlConfigured: true,
        properties: "missing",
      });
    }

    const result = await client.unsafe<{ count: number }[]>(
      `select count(*)::int as count from ${quoteIdentifier(tableName)}`,
    );

    return NextResponse.json({
      ok: true,
      dataSourceMode,
      databaseUrlConfigured: true,
      properties: result[0]?.count ?? 0,
      tableName,
    });
  } catch (error) {
    console.error("Property count verification failed", error);

    const errorName = error instanceof Error ? error.name : "UnknownError";
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown property count verification error.";

    return NextResponse.json(
      {
        ok: false,
        stage: "property-count",
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
