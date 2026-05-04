import postgres from "postgres";

const databaseUrlEnvNames = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
] as const;

export type DatabaseUrlEnvName = (typeof databaseUrlEnvNames)[number];

export function getDatabaseUrlSource(): DatabaseUrlEnvName | null {
  return (
    databaseUrlEnvNames.find((name) => Boolean(process.env[name]?.trim())) ?? null
  );
}

export function getDatabaseUrl() {
  const source = getDatabaseUrlSource();

  return source ? process.env[source]?.trim() : undefined;
}

export function hasDatabaseUrl() {
  return Boolean(getDatabaseUrl());
}

export function getRequiredDatabaseUrl() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error(
      "No database URL is configured. Add DATABASE_URL, POSTGRES_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL_NON_POOLING before running database commands.",
    );
  }

  return databaseUrl;
}

export function createPostgresClient(databaseUrl = getRequiredDatabaseUrl()) {
  return postgres(databaseUrl, {
    max: 1,
    prepare: false,
  });
}
