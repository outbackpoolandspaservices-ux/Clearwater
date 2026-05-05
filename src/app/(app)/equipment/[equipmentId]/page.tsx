import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionPage } from "@/components/app-shell/section-page";
import { DetailCard, DetailList } from "@/components/ui/detail-card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { getEquipmentById } from "@/features/equipment/data/equipment";
import { evidenceCategoryOptions } from "@/features/equipment/options";
import { warrantyTone } from "@/features/equipment/warranty";

type EquipmentDetailPageProps = {
  params: Promise<{
    equipmentId: string;
  }>;
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function EquipmentDetailPage({
  params,
}: EquipmentDetailPageProps) {
  const { equipmentId } = await params;
  const equipment = await getEquipmentById(equipmentId);

  if (!equipment) {
    notFound();
  }

  const recordedEvidence = new Map(
    equipment.evidenceChecklist.map((item) => [item.category, item]),
  );

  return (
    <SectionPage
      title={equipment.displayName}
      description={`${equipment.equipmentType} / ${equipment.brand} / ${equipment.model}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge tone={warrantyTone(equipment.warrantyStatus)}>
          {equipment.warrantyStatus}
        </StatusBadge>
        <StatusBadge>{equipment.manualStatus}</StatusBadge>
        <p className="font-mono text-sm text-slate-600">
          Serial: {equipment.serialNumber}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          className="inline-flex min-h-10 items-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          href="/equipment"
        >
          Back to Equipment Register
        </Link>
        <button
          className="inline-flex min-h-10 items-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-500"
          type="button"
        >
          Edit equipment placeholder
        </button>
        {equipment.customerId ? (
          <Link
            className="inline-flex min-h-10 items-center rounded-md border border-cyan-200 px-4 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
            href={`/customers/${equipment.customerId}`}
          >
            Open customer
          </Link>
        ) : null}
        {equipment.siteId ? (
          <Link
            className="inline-flex min-h-10 items-center rounded-md border border-cyan-200 px-4 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
            href={`/properties/${equipment.siteId}`}
          >
            Open property/site
          </Link>
        ) : null}
        {equipment.poolId ? (
          <Link
            className="inline-flex min-h-10 items-center rounded-md border border-cyan-200 px-4 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
            href={`/pools/${equipment.poolId}`}
          >
            Open pool
          </Link>
        ) : null}
      </div>

      <section className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Equipment details">
          <DetailList
            items={[
              { label: "Display name", value: equipment.displayName },
              { label: "Type", value: equipment.equipmentType },
              { label: "Brand", value: equipment.brand },
              { label: "Model", value: equipment.model },
              { label: "Serial number", value: equipment.serialNumber },
              { label: "SKU / supplier code", value: equipment.sku },
              { label: "Supplier", value: equipment.supplier },
              { label: "Manual status", value: equipment.manualStatus },
            ]}
          />
        </DetailCard>

        <DetailCard title="Customer / property / pool relationship">
          <DetailList
            items={[
              { label: "Customer", value: equipment.customerName },
              { label: "Phone", value: equipment.customerPhone || "Not recorded" },
              { label: "Email", value: equipment.customerEmail || "Not recorded" },
              { label: "Property/Site", value: equipment.siteName },
              { label: "Address", value: equipment.addressDisplay },
              { label: "Pool", value: equipment.poolName },
            ]}
          />
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Sale and install details">
          <DetailList
            items={[
              { label: "Record type", value: equipment.recordType },
              { label: "Purchase date", value: equipment.purchaseDate ?? "Not recorded" },
              { label: "Installed date", value: equipment.installedDate ?? "Not recorded" },
              { label: "Price sold", value: equipment.priceSold },
              { label: "Cost price", value: equipment.costPrice },
              {
                label: "Labour included",
                value: equipment.labourIncluded ? "Yes" : "No",
              },
              { label: "Installer / technician", value: equipment.installerName },
            ]}
          />
        </DetailCard>

        <DetailCard title="Warranty summary">
          <DetailList
            items={[
              {
                label: "Warranty start date",
                value: equipment.warrantyStartDate ?? "Unknown",
              },
              {
                label: "Warranty period",
                value: equipment.warrantyPeriodNumber
                  ? `${equipment.warrantyPeriodNumber} ${equipment.warrantyPeriodUnit}`
                  : "Unknown",
              },
              {
                label: "Warranty expiry date",
                value: equipment.warrantyExpiryDate ?? "Unknown",
              },
              {
                label: "Calculated warranty status",
                value: (
                  <StatusBadge tone={warrantyTone(equipment.warrantyStatus)}>
                    {equipment.warrantyStatus}
                  </StatusBadge>
                ),
              },
              { label: "Warranty provider", value: equipment.warrantyProvider },
              {
                label: "Serial number required",
                value: equipment.serialNumberRequired ? "Yes" : "No",
              },
            ]}
          />
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {equipment.warrantyNotes || "No warranty notes recorded."}
          </p>
        </DetailCard>
      </section>

      <DetailCard title="Installation Photos / Warranty Evidence">
        <p className="text-sm leading-6 text-slate-600">
          Photo upload storage is planned. For now, this section records the
          required evidence checklist for supplier warranty claims, customer proof,
          future servicing, and protecting Outback Pool & Spa Services.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {evidenceCategoryOptions.map((category) => {
            const evidence = recordedEvidence.get(category);

            return (
              <div
                className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm"
                key={category}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{category}</p>
                  <StatusBadge tone={evidence ? "success" : "neutral"}>
                    {evidence ? "Recorded" : "Needed"}
                  </StatusBadge>
                </div>
                <p className="mt-2 text-slate-600">
                  {evidence?.notes || "Evidence note placeholder"}
                </p>
              </div>
            );
          })}
        </div>
      </DetailCard>

      <section className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Linked records">
          <DetailList
            items={[
              { label: "Linked job", value: equipment.linkedJobLabel },
              { label: "Linked quote", value: equipment.linkedQuoteLabel },
              { label: "Linked invoice", value: equipment.linkedInvoiceLabel },
              {
                label: "Linked service report",
                value: "Foundation placeholder",
              },
            ]}
          />
        </DetailCard>

        <DetailCard title="Notes">
          <DetailList
            items={[
              {
                label: "Internal notes",
                value: equipment.internalNotes || "No internal notes",
              },
              {
                label: "Customer-facing notes",
                value:
                  equipment.customerFacingNotes || "No customer-facing notes",
              },
              {
                label: "Service notes",
                value: equipment.serviceNotes || "No service notes",
              },
              {
                label: "Future maintenance notes",
                value:
                  equipment.futureMaintenanceNotes ||
                  "No future maintenance notes",
              },
            ]}
          />
        </DetailCard>
      </section>

      <DetailCard title="Future service/warranty reminders">
        <EmptyState
          description="TODO: add automatic warranty expiry reminders, supplier warranty claim packs, and equipment service reminders in a future phase."
          title="Reminder automation planned"
        />
      </DetailCard>
    </SectionPage>
  );
}
