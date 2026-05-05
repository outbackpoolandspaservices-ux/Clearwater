export type NavItem = {
  title: string;
  href: string;
  description: string;
  group: "Operations" | "Pool Data" | "Water Care" | "Commercial" | "Customer" | "Admin";
};

export const appNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "Daily operating snapshot and quick actions.",
    group: "Operations",
  },
  {
    title: "Jobs",
    href: "/jobs",
    description: "Service work orders and technician workflows.",
    group: "Operations",
  },
  {
    title: "Technician Today",
    href: "/technician/today",
    description: "Mobile technician run sheet and job actions.",
    group: "Operations",
  },
  {
    title: "Dispatch",
    href: "/dispatch",
    description: "Calendar planning, route order, and scheduling.",
    group: "Operations",
  },
  {
    title: "Customers",
    href: "/customers",
    description: "Customer records, billing contacts, and notes.",
    group: "Pool Data",
  },
  {
    title: "Properties / Sites",
    href: "/properties",
    description: "Service locations, access details, and route metadata.",
    group: "Pool Data",
  },
  {
    title: "Pools",
    href: "/pools",
    description: "Pool profiles, equipment context, and chemistry history.",
    group: "Pool Data",
  },
  {
    title: "Equipment Register",
    href: "/equipment",
    description: "Customer-linked equipment, serial numbers, warranties, and service history.",
    group: "Pool Data",
  },
  {
    title: "Water Testing",
    href: "/water-testing",
    description: "Water chemistry readings, guide ranges, and technician-reviewed recommendations.",
    group: "Water Care",
  },
  {
    title: "Chemicals",
    href: "/chemicals",
    description: "Chemical product catalogue and safety notes.",
    group: "Water Care",
  },
  {
    title: "Stock",
    href: "/stock",
    description: "Van stock, low stock warnings, and product inventory.",
    group: "Water Care",
  },
  {
    title: "Quotes",
    href: "/quotes",
    description: "Quote drafting, approval, and conversion workflow.",
    group: "Commercial",
  },
  {
    title: "Invoices",
    href: "/invoices",
    description: "Invoice status, payment tracking, and accounting readiness.",
    group: "Commercial",
  },
  {
    title: "Reports",
    href: "/reports",
    description: "Customer-facing service reports and inspection report previews.",
    group: "Commercial",
  },
  {
    title: "Portal",
    href: "/portal",
    description: "Customer self-service access and portal management.",
    group: "Customer",
  },
  {
    title: "Settings",
    href: "/settings",
    description: "Business configuration, roles, templates, and integrations.",
    group: "Admin",
  },
];

export const mobilePrimaryNavItems = appNavItems.filter((item) =>
  ["/dashboard", "/jobs", "/technician/today", "/water-testing", "/settings"].includes(
    item.href,
  ),
);

export const navGroups = [
  "Operations",
  "Pool Data",
  "Water Care",
  "Commercial",
  "Customer",
  "Admin",
] as const;
