"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { appNavItems } from "@/features/navigation";

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div>
          <Link
            href="/dashboard"
            className="text-lg font-semibold tracking-tight text-slate-950"
          >
            ClearWater
          </Link>
          <p className="text-xs font-medium text-slate-500 sm:text-sm">
            Built for Outback Pool & Spa Services
          </p>
        </div>

        <details className="relative lg:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-slate-200 text-slate-700">
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Open navigation</span>
          </summary>
          <div className="absolute right-0 mt-3 max-h-[70vh] w-72 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
            {appNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "block rounded-md px-3 py-2 text-sm font-medium",
                  pathname === item.href
                    ? "bg-cyan-50 text-cyan-800"
                    : "text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
