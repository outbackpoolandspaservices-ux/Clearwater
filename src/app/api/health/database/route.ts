import { NextResponse } from "next/server";

import {
  createPostgresClient,
  getDatabaseUrl,
  getDatabaseUrlSource,
} from "@/db/connection";
import { getDataSourceLabel } from "@/lib/data-source";

export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = getDatabaseUrl();
  const configuredEnvVar = getDatabaseUrlSource();
  const checkedAt = new Date().toISOString();

  if (!databaseUrl) {
    return NextResponse.json(
      {
        ok: false,
        checkedAt,
        dataSourceMode: getDataSourceLabel(),
        databaseUrlConfigured: false,
        configuredEnvVar: null,
        status: "not_configured",
        message:
          "No database URL is configured. The app can still run in mock mode.",
      },
      { status: 200 },
    );
  }

  const client = createPostgresClient(databaseUrl);

  try {
    const result = await client`select 1 as health_check`;
    const healthCheck = result[0]?.health_check;

    return NextResponse.json({
      ok: healthCheck === 1,
      checkedAt,
      dataSourceMode: getDataSourceLabel(),
      databaseUrlConfigured: true,
      configuredEnvVar,
      status: healthCheck === 1 ? "connected" : "unexpected_response",
      message:
        healthCheck === 1
          ? "Database connection succeeded."
          : "Database responded, but the health check result was unexpected.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown database connection error.";

    return NextResponse.json(
      {
        ok: false,
        checkedAt,
        dataSourceMode: getDataSourceLabel(),
        databaseUrlConfigured: true,
        configuredEnvVar,
        status: "connection_failed",
        message,
      },
      { status: 200 },
    );
  } finally {
    await client.end();
  }
}
