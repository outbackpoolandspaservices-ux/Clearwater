import Link from "next/link";

import { featureAreas } from "@/features/registry";

type SectionPageProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
  statusLabel?: string;
};

export function SectionPage({
  title,
  description,
  children,
  statusLabel,
}: SectionPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8">
      <header className="border-b border-slate-200 pb-6">
        <p className="text-sm font-medium text-cyan-700">
          ClearWater workspace
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            {title}
          </h1>
          {statusLabel ? (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
              {statusLabel}
            </span>
          ) : null}
        </div>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          {description}
        </p>
      </header>

      {children ?? (
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-base font-semibold text-slate-950">
              Foundation ready
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This module has a route, feature folder, and database direction so
              future ClearWater work can add behavior without reshaping the app.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-base font-semibold text-slate-950">
              Related areas
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {featureAreas.slice(0, 6).map((area) => (
                <Link
                  key={area.href}
                  href={area.href}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-cyan-300 hover:text-cyan-800"
                >
                  {area.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
