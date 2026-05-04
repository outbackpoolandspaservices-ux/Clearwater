import { CtaBand, PageHero, PricingComparison, SiteShell } from "@/features/outback-aircon/website-shell";

export default function PricingPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          title="Aircon Cleaning Pricing"
          intro="Clear per-unit pricing for professional aircon cleaning. Prices include GST and a 20% senior discount is available."
          image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80"
        />
        <PricingComparison />
        <CtaBand />
      </main>
    </SiteShell>
  );
}
