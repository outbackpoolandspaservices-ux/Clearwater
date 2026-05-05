import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";
import {
  customers as mockCustomers,
  equipment as mockEquipment,
  getCustomerById as getMockCustomerById,
  getInvoiceById,
  getJobById as getMockJobById,
  getPoolById as getMockPoolById,
  getQuoteById,
  getSiteById as getMockSiteById,
  getTechnicianById,
  sites as mockSites,
} from "@/lib/mock-data";
import {
  calculateWarrantyExpiryDate,
  calculateWarrantyStatus,
  getWarrantyStartDate,
  type WarrantyStatus,
} from "@/features/equipment/warranty";

export type EquipmentRegisterRecord = {
  id: string;
  displayName: string;
  equipmentType: string;
  brand: string;
  model: string;
  serialNumber: string;
  sku: string;
  supplier: string;
  purchaseDate: string | null;
  installedDate: string | null;
  warrantyPeriodNumber: number | null;
  warrantyPeriodUnit: string;
  warrantyStartDate: string | null;
  warrantyExpiryDate: string | null;
  warrantyStatus: WarrantyStatus;
  manualStatus: string;
  notes: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  siteId: string | null;
  siteName: string;
  addressDisplay: string;
  poolId: string | null;
  poolName: string;
  recordType: string;
  priceSold: string;
  costPrice: string;
  labourIncluded: boolean;
  linkedQuoteId: string | null;
  linkedQuoteLabel: string;
  linkedInvoiceId: string | null;
  linkedInvoiceLabel: string;
  linkedJobId: string | null;
  linkedJobLabel: string;
  installerUserId: string | null;
  installerName: string;
  warrantyProvider: string;
  warrantyNotes: string;
  warrantyClaimNotes: string;
  serialNumberRequired: boolean;
  internalNotes: string;
  customerFacingNotes: string;
  serviceNotes: string;
  futureMaintenanceNotes: string;
  evidenceChecklist: EvidenceChecklistItem[];
};

export type EvidenceChecklistItem = {
  category: string;
  required: boolean;
  recorded: boolean;
  notes: string;
};

export type EquipmentDataSource = "database" | "mock";
export type EquipmentLoadResult = {
  count: number;
  equipment: EquipmentRegisterRecord[];
  source: EquipmentDataSource;
};

type EquipmentDatabaseRow = {
  id: string;
  display_name?: string | null;
  equipment_type?: string | null;
  brand?: string | null;
  model?: string | null;
  serial_number?: string | null;
  sku?: string | null;
  supplier?: string | null;
  purchase_date?: string | null;
  installed_on?: string | null;
  warranty_period_number?: number | null;
  warranty_period_unit?: string | null;
  warranty_expires_on?: string | null;
  manual_status?: string | null;
  record_type?: string | null;
  price_sold_cents?: number | null;
  cost_price_cents?: number | null;
  labour_included?: boolean | null;
  linked_quote_id?: string | null;
  linked_invoice_id?: string | null;
  linked_job_id?: string | null;
  installer_user_id?: string | null;
  warranty_provider?: string | null;
  warranty_notes?: string | null;
  warranty_claim_notes?: string | null;
  serial_number_required?: boolean | null;
  internal_notes?: string | null;
  customer_facing_notes?: string | null;
  service_notes?: string | null;
  future_maintenance_notes?: string | null;
  evidence_checklist?: EvidenceChecklistItem[] | null;
  condition_notes?: string | null;
  repair_history?: string | null;
  replacement_recommendation?: string | null;
  customer_id?: string | null;
  manual_customer_name?: string | null;
  manual_customer_contact?: string | null;
  manual_address?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
  site_id?: string | null;
  site_name?: string | null;
  address_line_1?: string | null;
  suburb?: string | null;
  state?: string | null;
  postcode?: string | null;
  pool_id?: string | null;
  pool_name?: string | null;
  installer_name?: string | null;
  quote_number?: string | null;
  invoice_number?: string | null;
  job_number?: string | null;
  job_title?: string | null;
};

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function formatMoney(cents?: number | null) {
  if (!cents) {
    return "Not recorded";
  }

  return new Intl.NumberFormat("en-AU", {
    currency: "AUD",
    style: "currency",
  }).format(cents / 100);
}

function safeReadError(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown equipment read error.",
  };
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

async function getTableColumns(
  client: ReturnType<typeof createPostgresClient>,
  tableName: string,
) {
  const rows = await client<{ column_name: string }[]>`
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = ${tableName}
  `;

  return new Set(rows.map((row) => row.column_name));
}

function dateOnly(value?: string | Date | null) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
}

function addressFromRow(row: EquipmentDatabaseRow) {
  const address = [
    row.address_line_1,
    [row.suburb, row.state, row.postcode].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  return row.manual_address || address || "Address not linked";
}

function mapDatabaseEquipment(row: EquipmentDatabaseRow): EquipmentRegisterRecord {
  const installedDate = dateOnly(row.installed_on);
  const purchaseDate = dateOnly(row.purchase_date);
  const calculatedExpiry =
    dateOnly(row.warranty_expires_on) ??
    calculateWarrantyExpiryDate({
      installedDate,
      purchaseDate,
      warrantyPeriodNumber: row.warranty_period_number,
      warrantyPeriodUnit: row.warranty_period_unit,
    });
  const equipmentType = row.equipment_type ?? "Equipment";
  const brand = row.brand ?? "Unknown";
  const model = row.model ?? "Model not recorded";
  const displayName =
    row.display_name || [brand, model, equipmentType].filter(Boolean).join(" ");

  return {
    id: row.id,
    displayName,
    equipmentType,
    brand,
    model,
    serialNumber: row.serial_number ?? "Not recorded",
    sku: row.sku ?? "Not recorded",
    supplier: row.supplier ?? "Not recorded",
    purchaseDate,
    installedDate,
    warrantyPeriodNumber: row.warranty_period_number ?? null,
    warrantyPeriodUnit: row.warranty_period_unit ?? "Not recorded",
    warrantyStartDate: getWarrantyStartDate({ installedDate, purchaseDate }),
    warrantyExpiryDate: calculatedExpiry,
    warrantyStatus: calculateWarrantyStatus(calculatedExpiry),
    manualStatus: row.manual_status ?? "Active",
    notes: row.condition_notes ?? "",
    customerId: row.customer_id ?? null,
    customerName:
      row.customer_name ?? row.manual_customer_name ?? "Manual / unlinked customer",
    customerPhone: row.customer_phone ?? row.manual_customer_contact ?? "",
    customerEmail: row.customer_email ?? "",
    siteId: row.site_id ?? null,
    siteName: row.site_name ?? "Unlinked property/site",
    addressDisplay: addressFromRow(row),
    poolId: row.pool_id ?? null,
    poolName: row.pool_name ?? "Unlinked pool",
    recordType: row.record_type ?? "Existing equipment recorded",
    priceSold: formatMoney(row.price_sold_cents),
    costPrice: formatMoney(row.cost_price_cents),
    labourIncluded: row.labour_included ?? false,
    linkedQuoteId: row.linked_quote_id ?? null,
    linkedQuoteLabel: row.quote_number ?? "No quote linked",
    linkedInvoiceId: row.linked_invoice_id ?? null,
    linkedInvoiceLabel: row.invoice_number ?? "No invoice linked",
    linkedJobId: row.linked_job_id ?? null,
    linkedJobLabel: row.job_number
      ? `${row.job_number}: ${row.job_title ?? "Job"}`
      : "No job linked",
    installerUserId: row.installer_user_id ?? null,
    installerName: row.installer_name ?? "Not recorded",
    warrantyProvider: row.warranty_provider ?? "Unknown",
    warrantyNotes: row.warranty_notes ?? "",
    warrantyClaimNotes: row.warranty_claim_notes ?? "",
    serialNumberRequired: row.serial_number_required ?? false,
    internalNotes: row.internal_notes ?? "",
    customerFacingNotes: row.customer_facing_notes ?? "",
    serviceNotes: row.service_notes ?? row.repair_history ?? "",
    futureMaintenanceNotes:
      row.future_maintenance_notes ?? row.replacement_recommendation ?? "",
    evidenceChecklist: row.evidence_checklist ?? [],
  };
}

function getMockEquipmentFallback(): EquipmentRegisterRecord[] {
  return mockEquipment.map((item, index) => {
    const pool = getMockPoolById(item.poolId);
    const site = pool ? getMockSiteById(pool.siteId) : undefined;
    const customer = site ? getMockCustomerById(site.customerId) : undefined;
    const installedDate = index % 3 === 0 ? "2023-06-15" : "2025-09-10";
    const warrantyPeriodNumber = index % 3 === 0 ? 2 : 3;
    const warrantyPeriodUnit = "years";
    const warrantyExpiryDate = calculateWarrantyExpiryDate({
      installedDate,
      purchaseDate: null,
      warrantyPeriodNumber,
      warrantyPeriodUnit,
    });

    return {
      id: item.id,
      displayName: `${item.brand} ${item.model}`,
      equipmentType: item.type,
      brand: item.brand,
      model: item.model,
      serialNumber: index % 2 === 0 ? `SN-CW-${1000 + index}` : "Not recorded",
      sku: "Not recorded",
      supplier: "Not recorded",
      purchaseDate: null,
      installedDate,
      warrantyPeriodNumber,
      warrantyPeriodUnit,
      warrantyStartDate: installedDate,
      warrantyExpiryDate,
      warrantyStatus: calculateWarrantyStatus(warrantyExpiryDate),
      manualStatus: item.condition.includes("Noisy") ? "Monitor" : "Active",
      notes: item.condition,
      customerId: customer?.id ?? null,
      customerName: customer?.name ?? "Unlinked customer",
      customerPhone: customer?.phone ?? "",
      customerEmail: customer?.email ?? "",
      siteId: site?.id ?? null,
      siteName: site?.name ?? "Unlinked property/site",
      addressDisplay: site ? `${site.address}, ${site.suburb}` : "Address not linked",
      poolId: pool?.id ?? null,
      poolName: pool?.name ?? "Unlinked pool",
      recordType: "Existing equipment recorded",
      priceSold: "Not recorded",
      costPrice: "Not recorded",
      labourIncluded: false,
      linkedQuoteId: null,
      linkedQuoteLabel: "No quote linked",
      linkedInvoiceId: null,
      linkedInvoiceLabel: "No invoice linked",
      linkedJobId: null,
      linkedJobLabel: "No job linked",
      installerUserId: null,
      installerName: "Not recorded",
      warrantyProvider: "Unknown",
      warrantyNotes: "",
      warrantyClaimNotes: "",
      serialNumberRequired: item.type !== "Filter",
      internalNotes: item.condition,
      customerFacingNotes: "",
      serviceNotes: item.condition,
      futureMaintenanceNotes: "Review during future services.",
      evidenceChecklist: [],
    };
  });
}

async function getEquipmentFromDatabase(): Promise<EquipmentRegisterRecord[]> {
  if (!hasDatabaseUrl()) {
    throw new Error("No database URL is configured.");
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "equipment"))) {
      throw new Error("The equipment table is not available.");
    }

    const equipmentColumns = await getTableColumns(client, "equipment");

    if (!equipmentColumns.has("id")) {
      throw new Error("The equipment table is missing an id column.");
    }

    const customerColumns = (await tableExists(client, "customers"))
      ? await getTableColumns(client, "customers")
      : new Set<string>();
    const siteColumns = (await tableExists(client, "sites"))
      ? await getTableColumns(client, "sites")
      : new Set<string>();
    const poolColumns = (await tableExists(client, "pools"))
      ? await getTableColumns(client, "pools")
      : new Set<string>();

    const equipmentSelects = [
      "id",
      "display_name",
      "equipment_type",
      "brand",
      "model",
      "serial_number",
      "sku",
      "supplier",
      "purchase_date",
      "installed_on",
      "warranty_period_number",
      "warranty_period_unit",
      "warranty_expires_on",
      "manual_status",
      "record_type",
      "price_sold_cents",
      "cost_price_cents",
      "labour_included",
      "linked_quote_id",
      "linked_invoice_id",
      "linked_job_id",
      "installer_user_id",
      "warranty_provider",
      "warranty_notes",
      "warranty_claim_notes",
      "serial_number_required",
      "internal_notes",
      "customer_facing_notes",
      "service_notes",
      "future_maintenance_notes",
      "evidence_checklist",
      "condition_notes",
      "repair_history",
      "replacement_recommendation",
      "customer_id",
      "manual_customer_name",
      "manual_customer_contact",
      "manual_address",
      "site_id",
      "pool_id",
    ]
      .filter((column) => equipmentColumns.has(column))
      .map((column) => `e.${quoteIdentifier(column)} as ${quoteIdentifier(column)}`);

    const joins: string[] = [];
    const relatedSelects: string[] = [];

    if (equipmentColumns.has("customer_id") && customerColumns.has("id")) {
      joins.push(`left join "customers" c on c."id" = e."customer_id"`);
      if (customerColumns.has("display_name")) {
        relatedSelects.push(`c."display_name" as "customer_name"`);
      }
      if (customerColumns.has("phone")) {
        relatedSelects.push(`c."phone" as "customer_phone"`);
      }
      if (customerColumns.has("email")) {
        relatedSelects.push(`c."email" as "customer_email"`);
      }
    }

    if (equipmentColumns.has("site_id") && siteColumns.has("id")) {
      joins.push(`left join "sites" s on s."id" = e."site_id"`);
      for (const [column, alias] of [
        ["name", "site_name"],
        ["address_line_1", "address_line_1"],
        ["suburb", "suburb"],
        ["state", "state"],
        ["postcode", "postcode"],
      ]) {
        if (siteColumns.has(column)) {
          relatedSelects.push(`s.${quoteIdentifier(column)} as ${quoteIdentifier(alias)}`);
        }
      }
    }

    if (equipmentColumns.has("pool_id") && poolColumns.has("id")) {
      joins.push(`left join "pools" p on p."id" = e."pool_id"`);
      if (poolColumns.has("name")) {
        relatedSelects.push(`p."name" as "pool_name"`);
      }
    }

    const selectList = [...equipmentSelects, ...relatedSelects].join(", ");
    const orderColumn = equipmentColumns.has("installed_on")
      ? "installed_on"
      : equipmentColumns.has("display_name")
        ? "display_name"
        : "id";

    const rows = await client.unsafe<EquipmentDatabaseRow[]>(
      `select ${selectList}
       from "equipment" e
       ${joins.join("\n")}
       order by e.${quoteIdentifier(orderColumn)} desc nulls last`,
    );

    return rows.map(mapDatabaseEquipment);
  } finally {
    await client.end();
  }
}

export async function getEquipmentWithSource(): Promise<EquipmentLoadResult> {
  try {
    const equipment = await getEquipmentFromDatabase();

    return {
      count: equipment.length,
      equipment,
      source: "database",
    };
  } catch (error) {
    console.error(
      "Falling back to mock equipment after database read failed",
      safeReadError(error),
    );
    const equipment = getMockEquipmentFallback();

    return {
      count: equipment.length,
      equipment,
      source: "mock",
    };
  }
}

export async function getEquipmentRegister() {
  const result = await getEquipmentWithSource();

  return result.equipment;
}

export async function getEquipmentById(equipmentId: string) {
  const equipment = await getEquipmentRegister();

  return equipment.find((item) => item.id === equipmentId);
}

export async function getEquipmentForPool(poolId: string) {
  const equipment = await getEquipmentRegister();

  return equipment.filter((item) => item.poolId === poolId);
}

export function getEquipmentLinkedRecordLabels(item: EquipmentRegisterRecord) {
  return {
    job: item.linkedJobId ? getMockJobById(item.linkedJobId)?.jobNumber : item.linkedJobLabel,
    quote: item.linkedQuoteId ? getQuoteById(item.linkedQuoteId)?.number : item.linkedQuoteLabel,
    invoice: item.linkedInvoiceId
      ? getInvoiceById(item.linkedInvoiceId)?.number
      : item.linkedInvoiceLabel,
    installer: item.installerUserId
      ? getTechnicianById(item.installerUserId)?.name
      : item.installerName,
  };
}

export function getEquipmentRelationshipOptions() {
  return {
    customers: mockCustomers,
    sites: mockSites,
  };
}
