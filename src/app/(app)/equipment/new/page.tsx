import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { getCustomers } from "@/features/customers/data/customers";
import { EquipmentForm } from "@/features/equipment/equipment-form";
import { getPools } from "@/features/pools/data/pools";
import { getSites } from "@/features/properties/data/sites";
import { technicians } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

type NewEquipmentPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewEquipmentPage({
  searchParams,
}: NewEquipmentPageProps) {
  const query = searchParams ? await searchParams : {};
  const [customers, sites, pools] = await Promise.all([
    getCustomers(),
    getSites(),
    getPools(),
  ]);

  return (
    <SectionPage
      title="Add Equipment"
      description="Record equipment that has been sold, installed, serviced, replaced, or captured for warranty and service history."
    >
      <div className="flex">
        <Link
          className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
          href="/equipment"
        >
          Back to Equipment Register
        </Link>
      </div>

      <EquipmentForm
        customers={customers}
        pools={pools}
        preselectedPoolId={firstParam(query.poolId)}
        sites={sites}
        technicians={technicians}
      />
    </SectionPage>
  );
}
