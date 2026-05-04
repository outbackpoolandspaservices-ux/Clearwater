import { SectionPage } from "@/components/app-shell/section-page";
import { getCustomers } from "@/features/customers/data/customers";
import { getPools } from "@/features/pools/data/pools";
import { getSites } from "@/features/properties/data/sites";
import { getWaterTestsWithSource } from "@/features/water-testing/data/water-tests";
import { WaterTestingWorkspace } from "@/features/water-testing/water-testing-workspace";
import { technicians } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function WaterTestingPage() {
  const [customers, pools, sites, waterTestsResult] = await Promise.all([
    getCustomers(),
    getPools(),
    getSites(),
    getWaterTestsWithSource(),
  ]);
  const { count, source, waterTests } = waterTestsResult;

  return (
    <SectionPage
      title="Water Testing"
      description="Water chemistry readings, target ranges, dosing notes, visit history, and trend reporting for each pool."
    >
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
        <span className="font-semibold text-slate-950">Data source:</span>{" "}
        {source}
        <span className="mx-2 text-slate-300">|</span>
        <span className="font-semibold text-slate-950">
          Water test records loaded:
        </span>{" "}
        {count}
      </div>

      <WaterTestingWorkspace
        customers={customers}
        pools={pools}
        sites={sites}
        technicians={technicians}
        waterTests={waterTests}
      />
    </SectionPage>
  );
}
