import { CtaBand, GalleryGrid, PageHero, SiteShell } from "@/features/outback-aircon/website-shell";

export default function GalleryPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          title="Before and After Gallery"
          intro="A realistic preview of how service galleries can show cleaner units, fresher rooms and property-ready results."
          image="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=80"
        />
        <GalleryGrid />
        <CtaBand />
      </main>
    </SiteShell>
  );
}
