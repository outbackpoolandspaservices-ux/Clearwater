import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { EquipmentRegisterWorkspace } from "@/features/equipment/equipment-register-workspace";
import { getEquipmentWithSource } from "@/features/equipment/data/equipment";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

type EquipmentPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EquipmentPage({ searchParams }: EquipmentPageProps) {
  const query = searchParams ? await searchParams : {};
  const created = query.created === "equipment";
  const result = await getEquipmentWithSource();

  return (
    <SectionPage
      title="Equipment Register"
      description="Serial number, warranty, installation, service, and customer history for equipment sold, installed, serviced, replaced, or recorded by Outback Pool & Spa Services."
      statusLabel={result.source === "database" ? "Database-backed" : "Mock fallback"}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Stock tracks what the business has on hand. The Equipment Register tracks
          equipment once it belongs to a customer, property, pool, job, quote, or
          invoice history.
        </p>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700"
          href="/equipment/new"
        >
          Add Equipment
        </Link>
      </div>

      {created ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
          Equipment record saved. Warranty status is calculated from the recorded
          install or purchase date and warranty period.
        </div>
      ) : null}

      <EquipmentRegisterWorkspace equipment={result.equipment} />
    </SectionPage>
  );
}
