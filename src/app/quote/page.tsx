import { PageHero, QuoteForm, SiteShell } from "@/features/outback-aircon/website-shell";

export default function QuotePage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          title="Quote / Booking"
          intro="Tell us what you need cleaned and when you would prefer a visit. The form is ready for a future backend or Google Form embed."
          image="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80"
        />
        <QuoteForm />
      </main>
    </SiteShell>
  );
}
