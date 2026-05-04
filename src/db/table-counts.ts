import type postgres from "postgres";

export const setupCountTables = [
  "organisations",
  "users",
  "roles",
  "user_roles",
  "customers",
  "sites",
  "pools",
  "equipment",
] as const;

export type SetupTableCounts = Record<(typeof setupCountTables)[number], number>;

export async function getSetupTableCounts(client: postgres.Sql) {
  const counts = {} as SetupTableCounts;

  for (const table of setupCountTables) {
    const result = await client.unsafe(
      `select count(*)::int as count from "${table}"`,
    );
    counts[table] = result[0]?.count ?? 0;
  }

  return counts;
}
