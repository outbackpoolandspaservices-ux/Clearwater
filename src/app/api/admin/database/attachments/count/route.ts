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

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized attachments count request." },
      { status: 401 },
    );
  }

  const databaseUrl = getDatabaseUrl();
  const dataSourceMode = getDataSourceLabel();

  if (!databaseUrl) {
    return NextResponse.json({
      ok: true,
      attachments: "missing",
      dataSourceMode,
      databaseUrlConfigured: false,
    });
  }

  const client = createPostgresClient(databaseUrl);

  try {
    const exists = await client<{ exists: boolean }[]>`
      select exists (
        select 1
        from information_schema.tables
        where table_schema = 'public'
          and table_name = 'attachments'
      )
    `;

    if (!exists[0]?.exists) {
      return NextResponse.json({
        ok: true,
        attachments: "missing",
        dataSourceMode,
        databaseUrlConfigured: true,
      });
    }

    const result = await client<{ count: number }[]>`
      select count(*)::int as count
      from attachments
    `;

    return NextResponse.json({
      ok: true,
      attachments: result[0]?.count ?? 0,
      dataSourceMode,
      databaseUrlConfigured: true,
    });
  } finally {
    await client.end();
  }
}
