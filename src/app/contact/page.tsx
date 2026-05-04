import { ContactSection, PageHero, SiteShell } from "@/features/outback-aircon/website-shell";

export default function ContactPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          title="Contact"
          intro="Call, email or request a quote for professional aircon cleaning across the Alice Springs service area."
          image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80"
        />
        <ContactSection />
      </main>
    </SiteShell>
  );
}
