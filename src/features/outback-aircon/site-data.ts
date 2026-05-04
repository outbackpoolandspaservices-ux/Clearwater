import {
  BadgeCheck,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Home,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  ThermometerSun,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Service = {
  slug: string;
  name: string;
  price: string;
  tag?: string;
  description: string;
  image: string;
  included: string[];
  benefits: string[];
  icon: LucideIcon;
};

export const business = {
  name: "Outback Aircon Services",
  location: "Alice Springs, NT",
  mobile: "0451 748 807",
  mobileHref: "tel:0451748807",
  landline: "08 82348 807",
  landlineHref: "tel:0882348807",
  email: "outbackairconservices@gmail.com",
  emailHref: "mailto:outbackairconservices@gmail.com",
  domain: "outbackairconservices.com.au",
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/quote", label: "Quote / Booking" },
  { href: "/contact", label: "Contact" },
];

export const services: Service[] = [
  {
    slug: "regular-cleaning",
    name: "Regular Cleaning",
    price: "$120 incl. GST per unit",
    description:
      "Standard aircon clean to remove dust and debris, improve airflow and support efficiency.",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=80",
    included: [
      "Front cover and filter clean",
      "Dust and debris removal",
      "Indoor unit wipe-down",
      "Basic airflow and operation check",
    ],
    benefits: [
      "Helps your system breathe properly",
      "Supports lower running costs",
      "Ideal for routine home maintenance",
    ],
    icon: Wind,
  },
  {
    slug: "steam-cleaning",
    name: "Steam Cleaning",
    price: "$140 incl. GST per unit",
    tag: "Most Popular",
    description:
      "Deeper clean using steam to help remove built-up dirt, grime, mould and bacteria.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=80",
    included: [
      "Steam clean of accessible indoor unit surfaces",
      "Filter, cover and vent treatment",
      "Mould and grime focused clean",
      "Post-clean performance check",
    ],
    benefits: [
      "A deeper clean for busy households",
      "Helps reduce musty smells",
      "Great before peak heating or cooling seasons",
    ],
    icon: Sparkles,
  },
  {
    slug: "ozone-cleaning",
    name: "Ozone Cleaning",
    price: "$165 incl. GST per unit",
    tag: "Premium",
    description:
      "Premium treatment to help reduce odours, mould and bacteria and improve indoor air quality.",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=80",
    included: [
      "Premium deodorising treatment",
      "Indoor air quality focused process",
      "Filter and accessible surface clean",
      "Service recommendations for ongoing freshness",
    ],
    benefits: [
      "Best for odour concerns",
      "Helpful for rentals and offices",
      "Supports a fresher indoor environment",
    ],
    icon: ShieldCheck,
  },
];

export const suburbs = [
  "Alice Springs",
  "East Side",
  "Braitling",
  "Gillen",
  "Larapinta",
  "Sadadeen",
  "The Gap",
  "Araluen",
  "Desert Springs",
  "Ilparpa",
  "Ross",
  "Other Alice Springs area",
];

export const whyClean = [
  {
    title: "Cleaner Indoor Air",
    text: "Dust, mould and bacteria can build up inside split systems and move through living spaces.",
    icon: Wind,
  },
  {
    title: "Better Performance",
    text: "A clean aircon can move air more freely, helping rooms feel comfortable faster.",
    icon: ThermometerSun,
  },
  {
    title: "Lower Power Bills",
    text: "When airflow improves, the system does not need to work as hard to heat or cool.",
    icon: CheckCircle2,
  },
];

export const audience = [
  { label: "Homeowners", icon: Home },
  { label: "Renters", icon: BadgeCheck },
  { label: "Seniors", icon: ShieldCheck },
  { label: "Real estate agencies", icon: ClipboardCheck },
  { label: "Property managers", icon: CalendarCheck },
  { label: "Landlords", icon: Home },
  { label: "Offices and commercial properties", icon: Building2 },
];

export const galleryItems = [
  {
    category: "Residential",
    caption: "Split-system clean for a family living area.",
    before:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80",
    after:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "Rental Property",
    caption: "Freshen-up clean ready for a tenancy inspection.",
    before:
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=900&q=80",
    after:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "Commercial",
    caption: "Office aircon clean focused on comfort and airflow.",
    before:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    after:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
  },
];

export const contactMethods = [
  { label: "Mobile", value: business.mobile, href: business.mobileHref, icon: Phone },
  {
    label: "Landline",
    value: business.landline,
    href: business.landlineHref,
    icon: Phone,
  },
  { label: "Email", value: business.email, href: business.emailHref, icon: Mail },
];
