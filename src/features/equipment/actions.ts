"use server";

import { redirect } from "next/navigation";

import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";
import {
  equipmentBrandOptions,
  equipmentTypeOptions,
  manualEquipmentStatusOptions,
  recordTypeOptions,
  warrantyPeriodUnitOptions,
  warrantyProviderOptions,
} from "@/features/equipment/options";
import { calculateWarrantyExpiryDate } from "@/features/equipment/warranty";

export type CreateEquipmentFormState = {
  fieldErrors?: Partial<Record<string, string>>;
  formError?: string;
};

function getString(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function getBoolean(formData: FormData, field: string) {
  return formData.get(field) === "on" || formData.get(field) === "true";
}

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
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

async function getDefaultOrganisationId(
  client: ReturnType<typeof createPostgresClient>,
) {
  if (!(await tableExists(client, "organisations"))) {
    return null;
  }

  const rows = await client<{ id: string }[]>`
    select id
    from organisations
    order by created_at asc nulls last, id asc
    limit 1
  `;

  return rows[0]?.id ?? null;
}

function parsePositiveInteger(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseMoneyToCents(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value.replace(/[$,\s]/g, ""));

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return Math.round(parsed * 100);
}

function isValidDate(value: string) {
  return !value || /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function buildEvidenceChecklist(formData: FormData) {
  const categories = formData.getAll("evidenceCategories");

  return categories
    .filter((category): category is string => typeof category === "string")
    .map((category) => ({
      category,
      notes: getString(formData, `evidenceNote:${category}`),
      recorded: true,
      required: true,
    }));
}

function safeErrorSummary(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown equipment save error.",
  };
}

export async function createEquipmentAction(
  _previousState: CreateEquipmentFormState,
  formData: FormData,
): Promise<CreateEquipmentFormState> {
  const displayName = getString(formData, "displayName");
  const equipmentType = getString(formData, "equipmentType");
  const brand = getString(formData, "brand");
  const manualBrand = getString(formData, "manualBrand");
  const model = getString(formData, "model");
  const serialNumber = getString(formData, "serialNumber");
  const sku = getString(formData, "sku");
  const supplier = getString(formData, "supplier");
  const purchaseDate = getString(formData, "purchaseDate");
  const installedDate = getString(formData, "installedDate");
  const warrantyPeriodNumberValue = getString(formData, "warrantyPeriodNumber");
  const warrantyPeriodUnit = getString(formData, "warrantyPeriodUnit");
  const manualStatus = getString(formData, "manualStatus");
  const recordType = getString(formData, "recordType");
  const customerId = getString(formData, "customerId");
  const siteId = getString(formData, "siteId");
  const poolId = getString(formData, "poolId");
  const manualCustomerName = getString(formData, "manualCustomerName");
  const manualCustomerContact = getString(formData, "manualCustomerContact");
  const manualAddress = getString(formData, "manualAddress");
  const priceSold = getString(formData, "priceSold");
  const costPrice = getString(formData, "costPrice");
  const installerUserId = getString(formData, "installerUserId");
  const linkedQuoteId = getString(formData, "linkedQuoteId");
  const linkedInvoiceId = getString(formData, "linkedInvoiceId");
  const linkedJobId = getString(formData, "linkedJobId");
  const warrantyProvider = getString(formData, "warrantyProvider");
  const warrantyNotes = getString(formData, "warrantyNotes");
  const warrantyClaimNotes = getString(formData, "warrantyClaimNotes");
  const internalNotes = getString(formData, "internalNotes");
  const customerFacingNotes = getString(formData, "customerFacingNotes");
  const serviceNotes = getString(formData, "serviceNotes");
  const futureMaintenanceNotes = getString(formData, "futureMaintenanceNotes");
  const serialNumberRequired = getBoolean(formData, "serialNumberRequired");
  const labourIncluded = getBoolean(formData, "labourIncluded");
  const fieldErrors: NonNullable<CreateEquipmentFormState["fieldErrors"]> = {};
  const warrantyPeriodNumber = parsePositiveInteger(warrantyPeriodNumberValue);

  if (!displayName) {
    fieldErrors.displayName = "Equipment display name is required.";
  }

  if (!equipmentTypeOptions.includes(equipmentType as never)) {
    fieldErrors.equipmentType = "Choose an equipment type.";
  }

  if (!equipmentBrandOptions.includes(brand as never) && !manualBrand) {
    fieldErrors.brand = "Choose a brand or enter a manual brand.";
  }

  if (serialNumberRequired && !serialNumber) {
    fieldErrors.serialNumber = "Serial number is marked as required.";
  }

  if (purchaseDate && !isValidDate(purchaseDate)) {
    fieldErrors.purchaseDate = "Use a valid purchase date.";
  }

  if (installedDate && !isValidDate(installedDate)) {
    fieldErrors.installedDate = "Use a valid installed date.";
  }

  if (warrantyPeriodNumberValue && warrantyPeriodNumber === null) {
    fieldErrors.warrantyPeriodNumber = "Enter a whole number greater than 0.";
  }

  if (
    warrantyPeriodUnit &&
    !warrantyPeriodUnitOptions.includes(warrantyPeriodUnit as never)
  ) {
    fieldErrors.warrantyPeriodUnit = "Choose months or years.";
  }

  if (!recordTypeOptions.includes(recordType as never)) {
    fieldErrors.recordType = "Choose a valid record type.";
  }

  if (!manualEquipmentStatusOptions.includes(manualStatus as never)) {
    fieldErrors.manualStatus = "Choose a valid equipment status.";
  }

  if (!warrantyProviderOptions.includes(warrantyProvider as never)) {
    fieldErrors.warrantyProvider = "Choose a valid warranty provider.";
  }

  if (!customerId && !manualCustomerName) {
    fieldErrors.customerId =
      "Choose a customer or enter a manual customer name.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  if (!hasDatabaseUrl()) {
    return {
      formError:
        "Equipment Register creation is ready, but no database URL is configured yet.",
    };
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "equipment"))) {
      return {
        formError:
          "The equipment table is not available yet. Please run the protected database setup route, then try again.",
      };
    }

    const columns = await getTableColumns(client, "equipment");
    const organisationId = columns.has("organisation_id")
      ? await getDefaultOrganisationId(client)
      : null;

    if (columns.has("organisation_id") && !organisationId) {
      return {
        formError:
          "Equipment records need an organisation record before saving. Please run the protected database setup route, then try again.",
      };
    }

    const warrantyExpiryDate = calculateWarrantyExpiryDate({
      installedDate,
      purchaseDate,
      warrantyPeriodNumber,
      warrantyPeriodUnit,
    });
    const finalBrand = brand === "Other / Unknown" && manualBrand ? manualBrand : brand;
    const legacyNotes = [
      internalNotes ? `Internal notes: ${internalNotes}` : "",
      customerFacingNotes ? `Customer-facing notes: ${customerFacingNotes}` : "",
      serviceNotes ? `Service notes: ${serviceNotes}` : "",
      futureMaintenanceNotes
        ? `Future maintenance notes: ${futureMaintenanceNotes}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
    const candidateValues: Record<string, boolean | number | string | null> = {
      organisation_id: organisationId,
      customer_id: customerId || null,
      site_id: siteId || null,
      pool_id: poolId || null,
      display_name: displayName,
      equipment_type: equipmentType,
      brand: finalBrand || null,
      model: model || null,
      serial_number: serialNumber || null,
      sku: sku || null,
      supplier: supplier || null,
      purchase_date: purchaseDate || null,
      installed_on: installedDate || null,
      warranty_period_number: warrantyPeriodNumber,
      warranty_period_unit: warrantyPeriodUnit || null,
      warranty_expires_on: warrantyExpiryDate,
      manual_status: manualStatus,
      record_type: recordType,
      price_sold_cents: parseMoneyToCents(priceSold),
      cost_price_cents: parseMoneyToCents(costPrice),
      labour_included: labourIncluded,
      linked_quote_id: linkedQuoteId || null,
      linked_invoice_id: linkedInvoiceId || null,
      linked_job_id: linkedJobId || null,
      installer_user_id: installerUserId || null,
      warranty_provider: warrantyProvider,
      warranty_notes: warrantyNotes || null,
      warranty_claim_notes: warrantyClaimNotes || null,
      serial_number_required: serialNumberRequired,
      internal_notes: internalNotes || null,
      customer_facing_notes: customerFacingNotes || null,
      service_notes: serviceNotes || null,
      future_maintenance_notes: futureMaintenanceNotes || null,
      evidence_checklist: JSON.stringify(buildEvidenceChecklist(formData)),
      manual_customer_name: manualCustomerName || null,
      manual_customer_contact: manualCustomerContact || null,
      manual_address: manualAddress || null,
      condition_notes: legacyNotes || null,
    };
    const insertColumns = Object.keys(candidateValues).filter((column) =>
      columns.has(column),
    );
    const values = insertColumns.map((column) => candidateValues[column]);
    const placeholders = insertColumns.map((_, index) => `$${index + 1}`).join(", ");

    await client.unsafe(
      `insert into "equipment" (${insertColumns.map(quoteIdentifier).join(", ")})
       values (${placeholders})`,
      values,
    );
  } catch (error) {
    console.error("Equipment Register creation failed", {
      ...safeErrorSummary(error),
      formFields: {
        displayName,
        equipmentType,
        brand,
        hasCustomerId: Boolean(customerId),
        hasManualCustomerName: Boolean(manualCustomerName),
        hasSerialNumber: Boolean(serialNumber),
      },
      error,
    });

    return {
      formError:
        "ClearWater could not save this equipment record. Please check the Vercel server logs for the safe equipment save error summary.",
    };
  } finally {
    await client.end();
  }

  redirect("/equipment?created=equipment");
}
