import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";

export default function TechnicianPage() {
  return (
    <SectionPage
      title="Technician"
      description="Technician-focused workflows for daily field work."
    >
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-950">
          Today&apos;s run sheet
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Open the mobile-friendly technician workflow for today&apos;s assigned
          jobs, access warnings, pool summaries, and action placeholders.
        </p>
        <Link
          className="mt-4 inline-flex rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
          href="/technician/today"
        >
          Open Technician Today
        </Link>
      </section>
    </SectionPage>
  );
}
