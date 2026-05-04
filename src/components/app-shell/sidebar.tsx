"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNavItems } from "@/features/navigation";

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
        <p className="mt-1 text-sm text-slate-500">Pool service management</p>
      </div>
      <nav className="h-[calc(100vh-81px)] overflow-y-auto px-3 py-4">
        {appNavItems.map((area) => (
          <Link
            key={area.href}
            href={area.href}
            className={[
              "block rounded-md px-3 py-2 text-sm font-medium transition",
              pathname === area.href
                ? "bg-cyan-50 text-cyan-800"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-950",
            ].join(" ")}
          >
            {area.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
