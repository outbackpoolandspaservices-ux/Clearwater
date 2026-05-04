import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Phone,
  Quote,
  ShieldCheck,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  audience,
  business,
  contactMethods,
  galleryItems,
  navItems,
  services,
  suburbs,
  whyClean,
} from "./site-data";

type Children = {
  children: React.ReactNode;
};

export function SiteShell({ children }: Children) {
  return (
    <div className="min-h-screen bg-[#F5FAFC] text-[#1E3A5F]">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#D7EEF5] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-[#2FA8CC] text-white shadow-lg shadow-[#2FA8CC]/25">
            <WindMark />
          </span>
          <span>
            <span className="block font-[var(--font-heading)] text-lg font-extrabold leading-tight tracking-tight">
              Outback Aircon
            </span>
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[#4E7894]">
              Alice Springs
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-bold text-[#305472] lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[#2FA8CC]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={business.mobileHref}
            className="inline-flex items-center gap-2 rounded-full border border-[#BFE6F0] px-4 py-2 text-sm font-extrabold text-[#1E3A5F] hover:border-[#2FA8CC]"
          >
            <Phone className="size-4" />
            Call Now
          </Link>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 rounded-full bg-[#2FA8CC] px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-[#2FA8CC]/25 hover:bg-[#238EAE]"
          >
            Request a Quote
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
      <nav className="grid max-w-[100vw] grid-cols-1 gap-2 overflow-hidden border-t border-[#E4F4F8] bg-white px-5 py-3 text-sm font-bold text-[#315775] sm:flex sm:flex-wrap lg:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-[#D7EEF5] px-3 py-1.5 text-center sm:shrink-0"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#123151] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-[#2FA8CC]">
              <WindMark />
            </span>
            <div>
              <p className="font-[var(--font-heading)] text-xl font-extrabold">
                {business.name}
              </p>
              <p className="text-sm font-semibold text-[#BDECF7]">
                {business.location}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#D9F5FB]">
            Local aircon cleaning for homes, rentals, agencies, offices and
            commercial properties across Alice Springs.
          </p>
        </div>
        <div>
          <p className="font-[var(--font-heading)] text-sm font-extrabold uppercase tracking-[0.16em] text-[#6ECBE3]">
            Pages
          </p>
          <div className="mt-4 grid gap-2 text-sm font-semibold text-[#D9F5FB]">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-[var(--font-heading)] text-sm font-extrabold uppercase tracking-[0.16em] text-[#6ECBE3]">
            Contact
          </p>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-[#D9F5FB]">
            {contactMethods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <method.icon className="size-4" />
                {method.value}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs font-semibold text-[#BDECF7]">
        Prices include GST. 20% senior discount available.
      </div>
    </footer>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <div
          className="h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.78) 18%, rgba(255,255,255,0.04) 55%), url('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1800&q=80')",
          }}
          role="img"
          aria-label="Technician servicing an air conditioning system"
        />
      </div>
      <div className="mx-auto grid min-h-[720px] max-w-7xl items-center px-5 py-16 lg:grid-cols-[1.03fr_0.97fr] lg:px-8">
        <div className="relative z-10 min-w-0 max-w-[350px] sm:max-w-3xl">
          <h1 className="font-[var(--font-heading)] text-4xl font-extrabold leading-[1.08] tracking-tight text-[#1E3A5F] sm:text-6xl lg:text-7xl">
            Professional Aircon Cleaning in Alice Springs
          </h1>
          <p className="mt-6 text-xl font-extrabold text-[#2FA8CC] sm:text-3xl">
            Cleaner Air • Better Performance • Lower Power Bills
          </p>
          <p className="mt-6 text-lg leading-8 text-[#456B86] sm:max-w-2xl">
            Premium split-system cleaning for local homes, rentals, seniors,
            property managers, offices and commercial spaces.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2FA8CC] px-7 py-4 text-base font-extrabold text-white shadow-xl shadow-[#2FA8CC]/25 hover:bg-[#238EAE]"
            >
              Request a Quote
              <ArrowRight className="size-5" />
            </Link>
            <Link
              href={business.mobileHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#B8E4EF] bg-white px-7 py-4 text-base font-extrabold text-[#1E3A5F] hover:border-[#2FA8CC]"
            >
              <Phone className="size-5" />
              Call Now
            </Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              "Local Alice Springs service",
              "Prices include GST",
              "20% senior discount",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#D7EEF5] bg-[#F5FAFC] px-4 py-3 text-sm font-extrabold text-[#315775]"
              >
                <CheckCircle2 className="mb-2 size-5 text-[#2FA8CC]" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 lg:hidden">
          <PhotoFrame
            image="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80"
            alt="Technician servicing an air conditioning system"
            className="aspect-[4/3]"
          />
        </div>
      </div>
    </section>
  );
}

export function ServicesPreview() {
  return (
    <Section
      title="Aircon Cleaning Services"
      intro="Choose the clean that matches your property, season and indoor air quality needs."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} compact />
        ))}
      </div>
    </Section>
  );
}

export function WhyCleanSection() {
  return (
    <section className="bg-[#EAF7FB]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <h2 className="font-[var(--font-heading)] text-4xl font-extrabold tracking-tight text-[#1E3A5F]">
            Why clean your aircon?
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#456B86]">
            In Alice Springs, dust, heat and heavy seasonal use can make an
            aircon work harder than it should. Regular cleaning keeps the unit
            healthier, fresher and easier to rely on.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {whyClean.map((item) => (
            <InfoPanel key={item.title} icon={item.icon} title={item.title}>
              {item.text}
            </InfoPanel>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WinterEfficiencySection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8">
        <PhotoFrame
          image="https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1300&q=80"
          alt="Comfortable modern living room with air conditioning"
          className="aspect-[5/4]"
        />
        <div>
          <h2 className="font-[var(--font-heading)] text-4xl font-extrabold tracking-tight">
            Winter heating efficiency matters too
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#456B86]">
            Reverse-cycle systems need clean airflow for heating as well as
            cooling. A dusty unit can take longer to warm the room, use more
            power and leave the air feeling stale.
          </p>
          <div className="mt-7 grid gap-3">
            {[
              "Prepare units before cold desert mornings",
              "Support smoother airflow for bedrooms and living areas",
              "Keep rentals and offices more comfortable year-round",
            ].map((item) => (
              <p key={item} className="flex gap-3 text-base font-bold text-[#315775]">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#2FA8CC]" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUsSection() {
  return (
    <Section
      title="Local, reliable and focused on aircon cleaning"
      intro="A straightforward service experience for households, real estate teams and commercial properties."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InfoPanel icon={ShieldCheck} title="Professional care">
          Clear communication, tidy work and service recommendations without
          pushy sales.
        </InfoPanel>
        <InfoPanel icon={Clock} title="Easy booking">
          Request a quote online or call directly to arrange a suitable time.
        </InfoPanel>
        <InfoPanel icon={Star} title="Alice Springs focus">
          Built around local homes, rentals, offices and desert conditions.
        </InfoPanel>
        <InfoPanel icon={Quote} title="Transparent pricing">
          Simple per-unit pricing with GST included and a senior discount.
        </InfoPanel>
      </div>
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {audience.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-2xl border border-[#D7EEF5] bg-white px-4 py-3 text-sm font-extrabold text-[#315775]"
          >
            <item.icon className="size-5 text-[#2FA8CC]" />
            {item.label}
          </div>
        ))}
      </div>
    </Section>
  );
}

export function SeniorDiscountSection() {
  return (
    <section className="bg-[#123151] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <h2 className="font-[var(--font-heading)] text-4xl font-extrabold tracking-tight">
            20% senior discount available
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#D9F5FB]">
            Ask about the senior discount when requesting a quote or booking
            your service.
          </p>
        </div>
        <Link
          href="/quote"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-extrabold text-[#123151] hover:bg-[#EAF7FB]"
        >
          Request a Quote
          <ArrowRight className="size-5" />
        </Link>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="bg-[#2FA8CC] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <h2 className="font-[var(--font-heading)] text-3xl font-extrabold tracking-tight">
            Ready for cleaner air?
          </h2>
          <p className="mt-2 text-base font-semibold text-[#EAF7FB]">
            Book a professional aircon clean in Alice Springs.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/quote"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-[#1E3A5F] hover:bg-[#EAF7FB]"
          >
            Request a Quote
          </Link>
          <Link
            href={business.mobileHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-extrabold text-white hover:bg-white/10"
          >
            <Phone className="size-4" />
            Call Now
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PageHero({
  title,
  intro,
  image,
}: {
  title: string;
  intro: string;
  image?: string;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <h1 className="font-[var(--font-heading)] text-4xl font-extrabold leading-tight tracking-tight text-[#1E3A5F] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#456B86]">
            {intro}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2FA8CC] px-6 py-3 text-sm font-extrabold text-white hover:bg-[#238EAE]"
            >
              Request a Quote
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={business.mobileHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#B8E4EF] px-6 py-3 text-sm font-extrabold text-[#1E3A5F] hover:border-[#2FA8CC]"
            >
              <Phone className="size-4" />
              Call Now
            </Link>
          </div>
        </div>
        {image ? (
          <PhotoFrame image={image} alt={title} className="aspect-[5/3]" />
        ) : null}
      </div>
    </section>
  );
}

export function ServiceCard({
  service,
  compact = false,
}: {
  service: (typeof services)[number];
  compact?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-[#D7EEF5] bg-white shadow-xl shadow-[#1E3A5F]/5">
      <PhotoFrame
        image={service.image}
        alt={`${service.name} aircon service`}
        className="aspect-[4/3] rounded-none shadow-none"
      />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <service.icon className="size-6 text-[#2FA8CC]" />
              <h2 className="font-[var(--font-heading)] text-2xl font-extrabold">
                {service.name}
              </h2>
            </div>
            <p className="mt-2 text-lg font-extrabold text-[#2FA8CC]">
              {service.price}
            </p>
          </div>
          {service.tag ? (
            <span className="rounded-full bg-[#EAF7FB] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[#238EAE]">
              {service.tag}
            </span>
          ) : null}
        </div>
        <p className="mt-4 text-sm leading-7 text-[#456B86]">
          {service.description}
        </p>
        {!compact ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <FeatureList title="What's included" items={service.included} />
            <FeatureList title="Benefits" items={service.benefits} />
          </div>
        ) : null}
        <Link
          href="/quote"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2FA8CC] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#238EAE]"
        >
          Request quote
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

export function PricingComparison() {
  return (
    <Section
      title="Simple per-unit pricing"
      intro="All prices include GST. Steam Cleaning is the most popular option for deeper seasonal cleaning."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.slug}
            className={`relative rounded-[28px] border bg-white p-6 shadow-xl shadow-[#1E3A5F]/5 ${
              service.tag === "Most Popular"
                ? "border-[#2FA8CC] ring-4 ring-[#2FA8CC]/15"
                : "border-[#D7EEF5]"
            }`}
          >
            {service.tag ? (
              <span className="absolute right-5 top-5 rounded-full bg-[#123151] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-white">
                {service.tag}
              </span>
            ) : null}
            <service.icon className="size-8 text-[#2FA8CC]" />
            <h2 className="mt-5 font-[var(--font-heading)] text-2xl font-extrabold">
              {service.name}
            </h2>
            <p className="mt-3 text-3xl font-extrabold text-[#2FA8CC]">
              {service.price.replace(" incl. GST per unit", "")}
            </p>
            <p className="mt-1 text-sm font-bold text-[#66859B]">
              incl. GST per unit
            </p>
            <p className="mt-5 text-sm leading-7 text-[#456B86]">
              {service.description}
            </p>
            <FeatureList title="Included" items={service.included} />
            <Link
              href="/quote"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2FA8CC] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#238EAE]"
            >
              Request a Quote
            </Link>
          </article>
        ))}
      </div>
      <div className="mt-8 rounded-[28px] bg-[#123151] p-7 text-white">
        <h3 className="font-[var(--font-heading)] text-2xl font-extrabold">
          20% senior discount available
        </h3>
        <p className="mt-2 text-sm leading-7 text-[#D9F5FB]">
          Mention the senior discount when booking. Final pricing can depend on
          property access, number of units and service requirements.
        </p>
      </div>
    </Section>
  );
}

export function GalleryGrid() {
  return (
    <Section
      title="Before and after gallery"
      intro="Real job photos can replace these service-related placeholders later."
    >
      <div className="grid gap-6">
        {galleryItems.map((item) => (
          <article
            key={item.caption}
            className="rounded-[28px] border border-[#D7EEF5] bg-white p-5 shadow-xl shadow-[#1E3A5F]/5"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <BeforeAfterImage label="Before" image={item.before} />
              <BeforeAfterImage label="After" image={item.after} />
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-bold text-[#315775]">{item.caption}</p>
              <span className="w-fit rounded-full bg-[#EAF7FB] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[#238EAE]">
                {item.category}
              </span>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function QuoteForm() {
  return (
    <Section
      title="Request a quote or booking"
      intro="This form is ready to connect to a backend or replace with a Google Form embed later."
    >
      <form className="grid gap-5 rounded-[32px] border border-[#D7EEF5] bg-white p-5 shadow-xl shadow-[#1E3A5F]/5 md:grid-cols-2 md:p-8">
        <FormField label="Full name" name="name" />
        <FormField label="Phone" name="phone" type="tel" />
        <FormField label="Email" name="email" type="email" />
        <SelectField label="Suburb" name="suburb" options={suburbs} />
        <SelectField
          label="Property type"
          name="propertyType"
          options={["Residential", "Commercial", "Rental / Real estate"]}
        />
        <SelectField
          label="Number of units"
          name="units"
          options={["1", "2", "3", "4", "5+"]}
        />
        <SelectField
          label="Service type"
          name="serviceType"
          options={services.map((service) => service.name)}
        />
        <FormField label="Preferred date" name="preferredDate" type="date" />
        <SelectField
          label="Preferred time"
          name="preferredTime"
          options={["Morning", "Afternoon"]}
        />
        <label className="md:col-span-2">
          <span className="text-sm font-extrabold text-[#315775]">
            Additional notes
          </span>
          <textarea
            name="notes"
            rows={5}
            className="mt-2 w-full rounded-2xl border border-[#C7E7F0] bg-[#F8FCFD] px-4 py-3 text-base outline-none focus:border-[#2FA8CC] focus:ring-4 focus:ring-[#2FA8CC]/15"
          />
        </label>
        <div className="md:col-span-2">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2FA8CC] px-7 py-4 text-base font-extrabold text-white shadow-xl shadow-[#2FA8CC]/20 hover:bg-[#238EAE] sm:w-auto"
          >
            Request a Quote
            <ArrowRight className="size-5" />
          </button>
          <p className="mt-3 text-sm font-semibold text-[#66859B]">
            Prefer to speak with someone? Call {business.mobile}.
          </p>
        </div>
      </form>
    </Section>
  );
}

export function ContactSection() {
  return (
    <Section
      title="Contact Outback Aircon Services"
      intro="Servicing Alice Springs homes, rentals, real estate portfolios, offices and commercial properties."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="grid gap-4">
          {contactMethods.map((method) => (
            <a
              key={method.label}
              href={method.href}
              className="flex items-center gap-4 rounded-[24px] border border-[#D7EEF5] bg-white p-5 shadow-lg shadow-[#1E3A5F]/5 hover:border-[#2FA8CC]"
            >
              <span className="grid size-12 place-items-center rounded-full bg-[#EAF7FB] text-[#2FA8CC]">
                <method.icon className="size-6" />
              </span>
              <span>
                <span className="block text-sm font-extrabold uppercase tracking-[0.12em] text-[#66859B]">
                  {method.label}
                </span>
                <span className="block text-lg font-extrabold text-[#1E3A5F]">
                  {method.value}
                </span>
              </span>
            </a>
          ))}
          <div className="rounded-[24px] border border-[#D7EEF5] bg-white p-5 shadow-lg shadow-[#1E3A5F]/5">
            <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#66859B]">
              Service Area
            </p>
            <p className="mt-2 text-lg font-extrabold">Alice Springs service area</p>
          </div>
        </div>
        <div className="rounded-[28px] bg-[#123151] p-8 text-white">
          <h2 className="font-[var(--font-heading)] text-3xl font-extrabold">
            Need an aircon cleaned soon?
          </h2>
          <p className="mt-4 text-base leading-8 text-[#D9F5FB]">
            Tell us your suburb, property type, number of units and preferred
            service. We will help you choose the right clean.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-[#123151]"
            >
              Request a Quote
            </Link>
            <Link
              href={business.mobileHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-extrabold text-white"
            >
              Call Now
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Section({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-[#F5FAFC]">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <h2 className="font-[var(--font-heading)] text-4xl font-extrabold tracking-tight text-[#1E3A5F] sm:text-5xl">
            {title}
          </h2>
          {intro ? (
            <p className="mt-5 text-lg leading-8 text-[#456B86]">{intro}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function InfoPanel({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[24px] border border-[#D7EEF5] bg-white p-6 shadow-lg shadow-[#1E3A5F]/5">
      <Icon className="size-8 text-[#2FA8CC]" />
      <h3 className="mt-5 font-[var(--font-heading)] text-xl font-extrabold">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[#456B86]">{children}</p>
    </article>
  );
}

function FeatureList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5">
      <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#66859B]">
        {title}
      </h3>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <p key={item} className="flex gap-2 text-sm font-semibold text-[#315775]">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#2FA8CC]" />
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function PhotoFrame({
  image,
  alt,
  className = "",
}: {
  image: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[28px] bg-cover bg-center shadow-2xl shadow-[#1E3A5F]/12 ${className}`}
      style={{ backgroundImage: `url('${image}')` }}
      role="img"
      aria-label={alt}
    />
  );
}

function BeforeAfterImage({ label, image }: { label: string; image: string }) {
  return (
    <div className="relative">
      <PhotoFrame image={image} alt={`${label} aircon cleaning example`} className="aspect-[4/3]" />
      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[#1E3A5F] shadow-lg">
        {label}
      </span>
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label>
      <span className="text-sm font-extrabold text-[#315775]">{label}</span>
      <input
        name={name}
        type={type}
        className="mt-2 w-full rounded-2xl border border-[#C7E7F0] bg-[#F8FCFD] px-4 py-3 text-base outline-none focus:border-[#2FA8CC] focus:ring-4 focus:ring-[#2FA8CC]/15"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label>
      <span className="text-sm font-extrabold text-[#315775]">{label}</span>
      <select
        name={name}
        className="mt-2 w-full rounded-2xl border border-[#C7E7F0] bg-[#F8FCFD] px-4 py-3 text-base outline-none focus:border-[#2FA8CC] focus:ring-4 focus:ring-[#2FA8CC]/15"
        defaultValue=""
      >
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function WindMark() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="size-7"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 15.5h15.4c3.1 0 5.6-2.1 5.6-4.7 0-2.1-1.7-3.8-3.9-3.8-1.8 0-3.3 1.1-3.8 2.6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M8 23h20.6c2.5 0 4.4 1.7 4.4 3.8s-1.8 3.8-4 3.8c-1.7 0-3.1-.9-3.8-2.3"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M7 19.3h24"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
