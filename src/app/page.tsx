import {
  CtaBand,
  HeroSection,
  SeniorDiscountSection,
  ServicesPreview,
  SiteShell,
  WhyChooseUsSection,
  WhyCleanSection,
  WinterEfficiencySection,
} from "@/features/outback-aircon/website-shell";

export default function Home() {
  return (
    <SiteShell>
      <main>
        <HeroSection />
        <ServicesPreview />
        <WhyCleanSection />
        <WinterEfficiencySection />
        <WhyChooseUsSection />
        <SeniorDiscountSection />
        <CtaBand />
      </main>
    </SiteShell>
  );
}
