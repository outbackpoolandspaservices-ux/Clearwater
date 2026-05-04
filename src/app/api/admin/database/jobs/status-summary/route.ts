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
      { ok: false, message: "Unauthorized job status summary request." },
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
      jobs: "missing",
      statusSummary: [],
    });
  }

  const client = createPostgresClient(databaseUrl);

  try {
    if (!(await tableExists(client, "jobs"))) {
      return NextResponse.json({
        ok: true,
        dataSourceMode,
        databaseUrlConfigured: true,
        jobs: "missing",
        statusSummary: [],
      });
    }

    const rows = await client<{ count: number; status: string }[]>`
      select status::text as status, count(*)::int as count
      from jobs
      group by status
      order by status asc
    `;

    return NextResponse.json({
      ok: true,
      dataSourceMode,
      databaseUrlConfigured: true,
      statusSummary: rows,
      tableName: "jobs",
    });
  } catch (error) {
    console.error("Job status summary verification failed", error);

    const errorName = error instanceof Error ? error.name : "UnknownError";
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown job status summary verification error.";

    return NextResponse.json(
      {
        ok: false,
        stage: "job-status-summary",
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
