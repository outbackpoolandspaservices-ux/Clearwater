import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { settingsSections } from "@/lib/mock-data";

export default function SettingsPage() {
  return (
    <SectionPage
      title="Settings"
      description="Business configuration for roles, permissions, templates, integrations, portal access, chemicals, and system preferences."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link
          className="rounded-lg border border-cyan-200 bg-cyan-50 p-5 transition hover:border-cyan-300 hover:shadow-sm"
          href="/settings/database"
        >
          <h2 className="text-base font-semibold text-slate-950">
            Database status
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Check environment setup, health endpoint, and migration guidance.
          </p>
        </Link>
        {settingsSections.map((item) => (
          <div
            key={item}
            className="rounded-lg border border-slate-200 bg-white p-5"
          >
            <h2 className="text-base font-semibold text-slate-950">{item}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Configuration placeholder ready for later implementation.
            </p>
          </div>
        ))}
      </section>
    </SectionPage>
  );
}
