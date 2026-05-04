import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import {
  createPostgresClient,
  getDatabaseUrl,
  getDatabaseUrlSource,
} from "@/db/connection";
import { seedInitialClearWaterData } from "@/db/seed/run";
import { getSetupTableCounts, type SetupTableCounts } from "@/db/table-counts";
import { getDataSourceLabel } from "@/lib/data-source";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SetupStatus = "applied" | "skipped" | "failed";

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

export function GET(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized database setup request." },
      { status: 401 },
    );
  }

  return NextResponse.json(
    {
      ok: false,
      message:
        "Use POST with the setup key to run the one-time database setup workflow.",
    },
    { status: 405 },
  );
}

export async function POST(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized database setup request." },
      { status: 401 },
    );
  }

  const databaseUrl = getDatabaseUrl();
  const databaseUrlSource = getDatabaseUrlSource();
  const dataSourceMode = getDataSourceLabel();

  let migrationStatus: SetupStatus = "skipped";
  let seedStatus: SetupStatus = "skipped";
  let tableCounts: SetupTableCounts | null = null;

  if (!databaseUrl) {
    return NextResponse.json({
      ok: true,
      dataSourceMode,
      databaseUrlConfigured: false,
      configuredEnvVar: null,
      migration: {
        status: migrationStatus,
        message: "No database URL configured. Migration skipped.",
      },
      seed: {
        status: seedStatus,
        message: "No database URL configured. Seed skipped.",
      },
      tableCounts,
    });
  }

  const client = createPostgresClient(databaseUrl);
  const db = drizzle(client);

  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    migrationStatus = "applied";

    await seedInitialClearWaterData(db);
    seedStatus = "applied";

    tableCounts = await getSetupTableCounts(client);

    return NextResponse.json({
      ok: true,
      dataSourceMode,
      databaseUrlConfigured: true,
      configuredEnvVar: databaseUrlSource,
      migration: {
        status: migrationStatus,
        message: "Drizzle migration workflow completed.",
      },
      seed: {
        status: seedStatus,
        message: "Initial ClearWater seed workflow completed.",
      },
      tableCounts,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database setup error.";

    return NextResponse.json(
      {
        ok: false,
        dataSourceMode,
        databaseUrlConfigured: true,
        configuredEnvVar: databaseUrlSource,
        migration: {
          status: migrationStatus === "applied" ? migrationStatus : "failed",
        },
        seed: {
          status: seedStatus === "applied" ? seedStatus : "failed",
        },
        tableCounts,
        message,
      },
      { status: 500 },
    );
  } finally {
    await client.end();
  }
}
