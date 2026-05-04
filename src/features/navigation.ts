export type NavItem = {
  title: string;
  href: string;
  description: string;
};

export const appNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "Daily operating snapshot and quick actions.",
  },
  {
    title: "Jobs",
    href: "/jobs",
    description: "Service work orders and technician workflows.",
  },
  {
    title: "Dispatch",
    href: "/dispatch",
    description: "Calendar planning, route order, and scheduling.",
  },
  {
    title: "Technician Today",
    href: "/technician/today",
    description: "Mobile technician run sheet and job actions.",
  },
  {
    title: "Customers",
    href: "/customers",
    description: "Customer records, billing contacts, and notes.",
  },
  {
    title: "Properties / Sites",
    href: "/properties",
    description: "Service locations, access details, and route metadata.",
  },
  {
    title: "Pools",
    href: "/pools",
    description: "Pool profiles, equipment context, and chemistry history.",
  },
  {
    title: "Equipment",
    href: "/equipment",
    description: "Pumps, filters, chlorinators, heaters, and warranties.",
  },
  {
    title: "Water Testing",
    href: "/water-testing",
    description: "Water chemistry readings and dosing context.",
  },
  {
    title: "Chemicals",
    href: "/chemicals",
    description: "Chemical product catalogue and safety notes.",
  },
  {
    title: "Stock",
    href: "/stock",
    description: "Van stock, low stock warnings, and product inventory.",
  },
  {
    title: "Quotes",
    href: "/quotes",
    description: "Quote drafting, approval, and conversion workflow.",
  },
  {
    title: "Invoices",
    href: "/invoices",
    description: "Invoice status, payment tracking, and accounting readiness.",
  },
  {
    title: "Reports",
    href: "/reports",
    description: "Service, inspection, stock, revenue, and performance reports.",
  },
  {
    title: "Customer Portal",
    href: "/customer-portal",
    description: "Customer self-service access and portal management.",
  },
  {
    title: "Settings",
    href: "/settings",
    description: "Business configuration, roles, templates, and integrations.",
  },
];

export const mobilePrimaryNavItems = appNavItems.filter((item) =>
  ["/dashboard", "/jobs", "/dispatch", "/technician/today", "/settings"].includes(
    item.href,
  ),
);
