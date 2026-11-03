import { FeaturePanels } from "@/components/feature-panels";
import { Hero } from "@/components/hero";
import { Pathways } from "@/components/pathways";
import { Pillars } from "@/components/pillars";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Pathways />
        <Pillars />
        <FeaturePanels />
      </main>
      <SiteFooter />
    </>
  );
}
