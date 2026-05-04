import { CtaBand, PageHero, Section, SiteShell } from "@/features/outback-aircon/website-shell";

export default function AboutPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          title="Local aircon cleaning for Alice Springs"
          intro="Outback Aircon Services is focused on reliable, professional aircon cleaning for local homes, rentals and commercial properties."
          image="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=80"
        />
        <Section
          title="Focused only on aircon cleaning"
          intro="We keep the service clear and specialised: cleaner indoor units, better airflow, fresher rooms and practical advice for keeping your system running well between cleans."
        >
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Local",
                text: "Servicing Alice Springs homes, rental properties, offices and commercial properties.",
              },
              {
                title: "Reliable",
                text: "Straightforward communication, clear pricing and booking options that suit busy households and property managers.",
              },
              {
                title: "Professional",
                text: "A tidy, service-first approach designed to protect comfort, air quality and long-term performance.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-[24px] border border-[#D7EEF5] bg-white p-7 shadow-lg shadow-[#1E3A5F]/5"
              >
                <h2 className="font-[var(--font-heading)] text-2xl font-extrabold">
                  {item.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#456B86]">{item.text}</p>
              </article>
            ))}
          </div>
        </Section>
        <CtaBand />
      </main>
    </SiteShell>
  );
}
