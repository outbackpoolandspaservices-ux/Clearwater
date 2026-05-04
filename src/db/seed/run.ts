import type postgres from "postgres";

import { customerSeeds } from "./customers";
import { equipmentSeeds } from "./equipment";
import { organisationSeed } from "./organisation";
import { poolSeeds } from "./pools";
import { siteSeeds } from "./sites";
import { roleSeeds, userRoleSeeds, userSeeds } from "./users-roles";

type SeedValue = boolean | number | string | null;
type SeedRow = Record<string, SeedValue>;

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function optionalString<T extends object>(item: T, key: string) {
  const value = (item as Record<string, unknown>)[key];

  return typeof value === "string" && value ? value : null;
}

async function getTableColumns(client: postgres.Sql, tableName: string) {
  const rows = await client<{ column_name: string }[]>`
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = ${tableName}
  `;

  return new Set(rows.map((row) => row.column_name));
}

async function tableExists(client: postgres.Sql, tableName: string) {
  const rows = await client<{ exists: boolean }[]>`
    select exists (
      select 1
      from information_schema.tables
      where table_schema = 'public'
        and table_name = ${tableName}
    )
  `;

  return rows[0]?.exists ?? false;
}

async function upsertSeedRows(
  client: postgres.Sql,
  tableName: string,
  rows: SeedRow[],
  conflictColumns = ["id"],
) {
  if (rows.length === 0 || !(await tableExists(client, tableName))) {
    return;
  }

  const tableColumns = await getTableColumns(client, tableName);

  for (const row of rows) {
    const columns = Object.keys(row).filter((column) => tableColumns.has(column));

    const usableConflictColumns = conflictColumns.filter((column) =>
      columns.includes(column),
    );

    if (usableConflictColumns.length !== conflictColumns.length) {
      continue;
    }

    const insertColumns = columns.map(quoteIdentifier).join(", ");
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
    const updateColumns = columns.filter(
      (column) => !usableConflictColumns.includes(column),
    );
    const values = columns.map((column) => row[column]);

    const conflictAction =
      updateColumns.length > 0
        ? `do update set ${updateColumns
            .map(
              (column) =>
                `${quoteIdentifier(column)} = excluded.${quoteIdentifier(column)}`,
            )
            .join(", ")}`
        : "do nothing";

    await client.unsafe(
      `insert into ${quoteIdentifier(tableName)} (${insertColumns})
       values (${placeholders})
       on conflict (${usableConflictColumns.map(quoteIdentifier).join(", ")}) ${conflictAction}`,
      values,
    );
  }
}

function organisationRows(): SeedRow[] {
  return [
    {
      id: organisationSeed.id,
      name: organisationSeed.name,
      trading_name: organisationSeed.tradingName,
      email: organisationSeed.email,
      phone: organisationSeed.phone,
      abn: organisationSeed.abn,
      default_timezone: organisationSeed.defaultTimezone,
    },
  ];
}

function userRows(): SeedRow[] {
  return userSeeds.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.defaultRole,
    default_role: user.defaultRole,
    active_organisation_id: user.activeOrganisationId,
    is_active: true,
  }));
}

function roleRows(): SeedRow[] {
  return roleSeeds.map((role) => ({
    id: role.id,
    organisation_id: role.organisationId,
    key: role.key,
    name: role.name,
    description: role.description,
  }));
}

function userRoleRows(): SeedRow[] {
  return userRoleSeeds.map((userRole) => ({
    id: `${userRole.userId}:${userRole.roleId}:${userRole.organisationId}`,
    user_id: userRole.userId,
    role_id: userRole.roleId,
    organisation_id: userRole.organisationId,
  }));
}

function customerRows(): SeedRow[] {
  return customerSeeds.map((customer) => ({
    id: customer.id,
    organisation_id: customer.organisationId,
    display_name: customer.displayName,
    email: customer.email,
    phone: customer.phone,
    customer_type: customer.customerType,
    billing_address: customer.billingAddress,
    invoice_terms: customer.invoiceTerms ?? null,
    communication_preferences: customer.communicationPreferences ?? null,
    property_manager_details: customer.propertyManagerDetails ?? null,
    owner_details: customer.ownerDetails ?? null,
    internal_notes: customer.internalNotes ?? null,
    notes: customer.internalNotes ?? null,
    portal_enabled: customer.portalEnabled ?? false,
    portal_user_id: customer.portalUserId ?? null,
    is_active: true,
  }));
}

function siteRows(): SeedRow[] {
  return siteSeeds.map((site) => ({
    id: site.id,
    organisation_id: site.organisationId,
    customer_id: site.customerId,
    name: site.name,
    address: site.addressLine1,
    address_line_1: site.addressLine1,
    suburb: site.suburb,
    state: site.state,
    postcode: site.postcode,
    gate_code: site.gateCode,
    access_notes: site.accessNotes,
    access_warning: site.accessWarning,
    pet_warnings: site.petWarnings,
    tenant_details: site.tenantDetails,
    owner_agent_details: site.ownerAgentDetails,
    is_active: true,
  }));
}

function poolRows(): SeedRow[] {
  return poolSeeds.map((pool) => ({
    id: pool.id,
    organisation_id: pool.organisationId,
    site_id: pool.siteId,
    property_id: pool.siteId,
    name: pool.name,
    label: pool.name,
    volume_litres: pool.volumeLitres,
    pool_type: pool.poolType,
    surface: pool.surfaceType,
    surface_type: pool.surfaceType,
    sanitiser_type: pool.sanitiserType,
    environment: pool.environment,
    heater_information: pool.heaterInformation ?? null,
    spa_information: pool.spaInformation ?? null,
    normal_chemical_behaviour: pool.normalChemicalBehaviour,
    target_ranges: JSON.stringify(pool.targetRanges),
    service_notes: pool.serviceNotes,
    notes: pool.serviceNotes,
    is_active: true,
  }));
}

function equipmentRows(): SeedRow[] {
  return equipmentSeeds.map((item) => ({
    id: item.id,
    organisation_id: item.organisationId,
    site_id: item.siteId,
    pool_id: item.poolId,
    category: item.equipmentType,
    equipment_type: item.equipmentType,
    brand: item.brand,
    model: item.model,
    serial_number: item.serialNumber ?? null,
    condition_notes: item.conditionNotes ?? null,
    repair_history: optionalString(item, "repairHistory"),
    replacement_recommendation: optionalString(item, "replacementRecommendation"),
  }));
}

export async function seedInitialClearWaterData(client: postgres.Sql) {
  await upsertSeedRows(client, "organisations", organisationRows());
  await upsertSeedRows(client, "users", userRows());
  await upsertSeedRows(client, "roles", roleRows());
  await upsertSeedRows(client, "user_roles", userRoleRows(), [
    "user_id",
    "role_id",
    "organisation_id",
  ]);
  await upsertSeedRows(client, "customers", customerRows());
  await upsertSeedRows(client, "sites", siteRows());
  await upsertSeedRows(client, "properties", siteRows());
  await upsertSeedRows(client, "pools", poolRows());
  await upsertSeedRows(client, "equipment", equipmentRows());
}
