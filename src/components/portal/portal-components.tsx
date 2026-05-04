import Link from "next/link";
import { CreditCard, FileText, MessageSquare, Wrench } from "lucide-react";

const portalNavItems = [
  { href: "/portal", label: "Overview" },
  { href: "/portal/jobs", label: "Jobs" },
  { href: "/portal/reports", label: "Reports" },
  { href: "/portal/quotes", label: "Quotes" },
  { href: "/portal/invoices", label: "Invoices" },
];

type PortalShellProps = {
  title: string;
  description: string;
  customerName: string;
  children: React.ReactNode;
};

export function PortalShell({
  title,
  description,
  customerName,
  children,
}: PortalShellProps) {
  return (
    <main className="min-h-screen bg-cyan-50/50 text-slate-950">
      <header className="border-b border-cyan-100 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/portal" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded bg-cyan-700 text-sm font-black text-white">
                CW
              </div>
              <div>
                <p className="text-lg font-black tracking-tight text-slate-950">
                  ClearWater
                </p>
                <p className="text-sm font-semibold text-cyan-800">
                  Outback Pool & Spa Services
                </p>
              </div>
            </Link>
            <div className="rounded border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-slate-700">
              <span className="font-semibold text-slate-950">{customerName}</span>
              <span className="mx-2 text-cyan-700">|</span>
              Customer portal preview
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {portalNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded border border-cyan-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-300 hover:text-cyan-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-800">
            Customer Portal
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
        {children}
      </section>
    </main>
  );
}

type PortalCardProps = {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export function PortalCard({ title, eyebrow, children, action }: PortalCardProps) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-lg font-black tracking-tight text-slate-950">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

type PortalButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  href?: string;
};

const buttonClasses = {
  primary: "border-cyan-700 bg-cyan-700 text-white hover:bg-cyan-800",
  secondary: "border-slate-200 bg-white text-slate-800 hover:border-cyan-300",
  danger: "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300",
};

export function PortalButton({
  children,
  variant = "secondary",
  href,
}: PortalButtonProps) {
  const classes = [
    "inline-flex min-h-10 items-center justify-center gap-2 rounded border px-3 py-2 text-sm font-bold shadow-sm transition",
    buttonClasses[variant],
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type="button">
      {children}
    </button>
  );
}

export function PortalQuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <PortalButton variant="primary">
        <Wrench className="h-4 w-4" />
        Request a Service
      </PortalButton>
      <PortalButton>
        <MessageSquare className="h-4 w-4" />
        Send Message
      </PortalButton>
      <PortalButton href="/portal/reports">
        <FileText className="h-4 w-4" />
        View Reports
      </PortalButton>
      <PortalButton href="/portal/invoices">
        <CreditCard className="h-4 w-4" />
        Pay Invoice
      </PortalButton>
    </div>
  );
}

export function PortalEmptyState({ message }: { message: string }) {
  return (
    <div className="rounded border border-dashed border-cyan-200 bg-cyan-50 p-5 text-sm text-slate-600">
      {message}
    </div>
  );
}

export function portalStatusTone(status: string) {
  const normalized = status.toLowerCase();

  if (
    normalized.includes("unpaid") ||
    normalized.includes("overdue") ||
    normalized.includes("declined") ||
    normalized.includes("failed")
  ) {
    return "danger" as const;
  }

  if (
    normalized.includes("paid") ||
    normalized.includes("approved") ||
    normalized.includes("ready") ||
    normalized.includes("completed")
  ) {
    return "success" as const;
  }

  if (
    normalized.includes("awaiting") ||
    normalized.includes("sent") ||
    normalized.includes("scheduled") ||
    normalized.includes("draft")
  ) {
    return "warning" as const;
  }

  return "neutral" as const;
}
