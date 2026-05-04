import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { PoolForm } from "@/features/pools/pool-form";
import { getSites } from "@/features/properties/data/sites";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function NewPoolPage() {
  const sites = await getSites();

  return (
    <SectionPage
      title="Add Pool"
      description="Create a pool profile linked to an existing property/site. Jobs, equipment, and water testing remain separate workflows."
    >
      <div className="flex">
        <Link
          className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
          href="/pools"
        >
          Back to pools
        </Link>
      </div>

      <PoolForm sites={sites} />
    </SectionPage>
  );
}
