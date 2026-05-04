import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { DetailCard, DetailList } from "@/components/ui/detail-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDatabaseUrlSource, hasDatabaseUrl } from "@/db/connection";
import { getDataSourceLabel } from "@/lib/data-source";

function statusTone(enabled: boolean) {
  return enabled ? ("success" as const) : ("warning" as const);
}

export default function DatabaseSettingsPage() {
  const dataSourceMode = getDataSourceLabel();
  const databaseUrlConfigured = hasDatabaseUrl();
  const databaseUrlSource = getDatabaseUrlSource();
  const mockModeActive = dataSourceMode === "mock";

  return (
    <SectionPage
      title="Database Status"
      description="Safe database setup diagnostics for ClearWater. This page does not switch the app away from mock data."
    >
      <section className="grid gap-4 xl:grid-cols-3">
        <DetailCard title="Data source mode">
          <div className="space-y-3">
            <StatusBadge tone={mockModeActive ? "warning" : "success"}>
              {dataSourceMode}
            </StatusBadge>
            <p className="text-sm leading-6 text-slate-600">
              Mock data remains active unless `CLEARWATER_DATA_SOURCE` is
              intentionally changed after database queries are implemented.
            </p>
          </div>
        </DetailCard>

        <DetailCard title="Database URL">
          <div className="space-y-3">
            <StatusBadge tone={statusTone(databaseUrlConfigured)}>
              {databaseUrlConfigured ? "Configured" : "Not configured"}
            </StatusBadge>
            <p className="text-sm leading-6 text-slate-600">
              {databaseUrlSource
                ? `Detected ${databaseUrlSource}. Value is hidden for safety.`
                : "Add DATABASE_URL or a Vercel Postgres URL variable when ready."}
            </p>
          </div>
        </DetailCard>

        <DetailCard title="Connection status">
          <div className="space-y-3">
            <StatusBadge>Check via API</StatusBadge>
            <p className="text-sm leading-6 text-slate-600">
              Use the health endpoint to attempt a live database connection
              without exposing secrets.
            </p>
            <Link
              className="inline-flex rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
              href="/api/health/database"
            >
              Open health check JSON
            </Link>
          </div>
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <DetailCard title="Migration and seed guidance">
          <DetailList
            items={[
              { label: "Generate migration", value: "npm run db:generate" },
              { label: "Apply migration", value: "npm run db:migrate" },
              { label: "Seed demo records", value: "npm run db:seed" },
              { label: "Review schema", value: "docs/database-schema.md" },
            ]}
          />
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Run these only after a real PostgreSQL URL is configured. The seed
            currently prepares organisation, users/roles, customers, sites,
            pools, and equipment.
          </p>
        </DetailCard>

        <DetailCard title="Safety checklist">
          <ul className="space-y-3 text-sm leading-6 text-slate-700">
            <li>Keep `CLEARWATER_DATA_SOURCE=mock` for the current demo.</li>
            <li>Do not remove `src/lib/mock-data.ts`.</li>
            <li>
              Customers, Sites, and Pools use a data access layer with mock
              fallback.
            </li>
            <li>
              Jobs, Water Testing, Reports, Invoices, Routing, and Portal remain
              mock-data workflows.
            </li>
          </ul>
        </DetailCard>
      </section>
    </SectionPage>
  );
}
