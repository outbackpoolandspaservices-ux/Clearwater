import type postgres from "postgres";

export const setupCountTables = [
  "users",
  "customers",
  "properties",
  "pools",
  "equipment",
  "organisations",
  "roles",
  "user_roles",
  "sites",
  "reports",
  "chemical_products",
  "stock",
  "stock_movements",
] as const;

export type SetupTableCountValue = number | "missing";
export type SetupTableCounts = Record<
  (typeof setupCountTables)[number],
  SetupTableCountValue
>;

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

async function tableExists(client: postgres.Sql, tableName: string) {
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

export async function getSetupTableCounts(client: postgres.Sql) {
  const counts = {} as SetupTableCounts;

  for (const table of setupCountTables) {
    if (!(await tableExists(client, table))) {
      counts[table] = "missing";
      continue;
    }

    const result = await client.unsafe(
      `select count(*)::int as count from ${quoteIdentifier(table)}`,
    );
    counts[table] = result[0]?.count ?? 0;
  }

  return counts;
}
