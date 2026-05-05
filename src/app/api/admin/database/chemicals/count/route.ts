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

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized chemical product count request." },
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
      chemicalProducts: "missing",
    });
  }

  const client = createPostgresClient(databaseUrl);

  try {
    if (!(await tableExists(client, "chemical_products"))) {
      return NextResponse.json({
        ok: true,
        dataSourceMode,
        databaseUrlConfigured: true,
        chemicalProducts: "missing",
      });
    }

    const result = await client<{ count: number }[]>`
      select count(*)::int as count
      from chemical_products
    `;

    return NextResponse.json({
      ok: true,
      dataSourceMode,
      databaseUrlConfigured: true,
      chemicalProducts: result[0]?.count ?? 0,
      tableName: "chemical_products",
    });
  } catch (error) {
    console.error("Chemical product count verification failed", error);

    const errorName = error instanceof Error ? error.name : "UnknownError";
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown chemical product count verification error.";

    return NextResponse.json(
      {
        ok: false,
        stage: "chemical-product-count",
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
