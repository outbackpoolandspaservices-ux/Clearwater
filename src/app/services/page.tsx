import { CtaBand, PageHero, ServiceCard, SiteShell } from "@/features/outback-aircon/website-shell";
import { services } from "@/features/outback-aircon/site-data";

export default function ServicesPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          title="Aircon Cleaning Services"
          intro="Regular, steam and ozone cleaning options for Alice Springs homes, rentals, offices and managed properties."
          image="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=80"
        />
        <section className="bg-[#F5FAFC]">
          <div className="mx-auto grid max-w-7xl gap-7 px-5 py-16 lg:px-8">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </section>
        <CtaBand />
      </main>
    </SiteShell>
  );
}
