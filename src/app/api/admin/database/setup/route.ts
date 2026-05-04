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
type SetupStage = "migration" | "seed" | "table-counts";

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

function getSafeError(error: unknown) {
  const errorName = error instanceof Error ? error.name : "UnknownError";
  const rawMessage =
    error instanceof Error ? error.message : "Unknown database setup error.";
  const databaseUrl = getDatabaseUrl();
  const errorMessage = databaseUrl
    ? rawMessage.replaceAll(databaseUrl, "[database-url-redacted]")
    : rawMessage;

  return {
    errorName,
    errorMessage,
  };
}

function setupErrorResponse({
  dataSourceMode,
  databaseUrlSource,
  error,
  migrationStatus,
  seedStatus,
  stage,
  tableCounts,
}: {
  dataSourceMode: string;
  databaseUrlSource: string | null;
  error: unknown;
  migrationStatus: SetupStatus;
  seedStatus: SetupStatus;
  stage: SetupStage;
  tableCounts: SetupTableCounts | null;
}) {
  console.error(`ClearWater database setup failed during ${stage}`, error);

  const { errorName, errorMessage } = getSafeError(error);

  return NextResponse.json(
    {
      ok: false,
      stage,
      errorName,
      errorMessage,
      dataSourceMode,
      databaseUrlConfigured: true,
      configuredEnvVar: databaseUrlSource,
      migration: {
        status: migrationStatus,
      },
      seed: {
        status: seedStatus,
      },
      tableCounts,
    },
    { status: 500 },
  );
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
    try {
      await migrate(db, { migrationsFolder: "drizzle" });
      migrationStatus = "applied";
    } catch (error) {
      migrationStatus = "failed";

      return setupErrorResponse({
        dataSourceMode,
        databaseUrlSource,
        error,
        migrationStatus,
        seedStatus,
        stage: "migration",
        tableCounts,
      });
    }

    try {
      await seedInitialClearWaterData(client);
      seedStatus = "applied";
    } catch (error) {
      seedStatus = "failed";

      return setupErrorResponse({
        dataSourceMode,
        databaseUrlSource,
        error,
        migrationStatus,
        seedStatus,
        stage: "seed",
        tableCounts,
      });
    }

    try {
      tableCounts = await getSetupTableCounts(client);
    } catch (error) {
      return setupErrorResponse({
        dataSourceMode,
        databaseUrlSource,
        error,
        migrationStatus,
        seedStatus,
        stage: "table-counts",
        tableCounts,
      });
    }

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
    return setupErrorResponse({
      dataSourceMode,
      databaseUrlSource,
      error,
      migrationStatus,
      seedStatus,
      stage: "migration",
      tableCounts,
    });
  } finally {
    await client.end();
  }
}
