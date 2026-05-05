"use client";

import Link from "next/link";
import {
  CalendarDays,
  LayoutDashboard,
  Settings,
  Smartphone,
  TestTubeDiagonal,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { mobilePrimaryNavItems } from "@/features/navigation";

const icons = {
  "/dashboard": LayoutDashboard,
  "/jobs": CalendarDays,
  "/technician/today": Smartphone,
  "/water-testing": TestTubeDiagonal,
  "/settings": Settings,
};

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white lg:hidden">
      <div className="grid grid-cols-5">
        {mobilePrimaryNavItems.map((item) => {
          const Icon = icons[item.href as keyof typeof icons];
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-xs font-medium",
                active ? "text-cyan-700" : "text-slate-500",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>
                {item.title === "Technician Today"
                  ? "Tech"
                  : item.title === "Water Testing"
                    ? "Water"
                    : item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
