import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { getCustomers } from "@/features/customers/data/customers";
import { PropertyForm } from "@/features/properties/property-form";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function NewPropertyPage() {
  const customers = await getCustomers();

  return (
    <SectionPage
      title="Add Property / Site"
      description="Create a service location and link it to an existing customer. Pools and jobs remain separate workflows."
    >
      <div className="flex">
        <Link
          className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
          href="/properties"
        >
          Back to properties
        </Link>
      </div>

      <PropertyForm customers={customers} />
    </SectionPage>
  );
}
