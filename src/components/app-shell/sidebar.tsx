"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNavItems, navGroups } from "@/features/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="border-b border-slate-200 px-5 py-5">
        <Link
          href="/dashboard"
          className="text-lg font-semibold tracking-tight text-slate-950"
        >
          ClearWater
        </Link>
        <p className="mt-1 text-sm text-slate-500">
          Pool Service Management System
        </p>
        <p className="mt-1 text-xs font-medium text-slate-400">
          Outback Pool & Spa Services, Alice Springs
        </p>
      </div>
      <nav className="h-[calc(100vh-81px)] overflow-y-auto px-3 py-4">
        {navGroups.map((group) => {
          const items = appNavItems.filter((area) => area.group === group);

          return (
            <div key={group} className="mb-4">
              <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                {group}
              </p>
              <div className="space-y-1">
                {items.map((area) => (
                  <Link
                    key={area.href}
                    href={area.href}
                    className={[
                      "block rounded-md px-3 py-2 text-sm font-medium transition",
                      pathname === area.href || pathname.startsWith(`${area.href}/`)
                        ? "bg-cyan-50 text-cyan-800"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-950",
                    ].join(" ")}
                  >
                    {area.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
