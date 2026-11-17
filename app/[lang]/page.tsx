import { notFound } from "next/navigation";
import { CampusGallery } from "@/components/campus-gallery";
import { FeaturePanels } from "@/components/feature-panels";
import { Hero } from "@/components/hero";
import { Pathways } from "@/components/pathways";
import { Pillars } from "@/components/pillars";
import { getDictionary } from "./dictionaries";
import { hasLocale } from "./locales";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <main>
      <Hero dict={dict.hero} />
      <Pathways dict={dict.pathways} />
      <Pillars dict={dict.pillars} />
      <CampusGallery dict={dict.campus} />
      <FeaturePanels
        schoolLife={dict.schoolLife}
        newsEvents={dict.newsEvents}
        newsHref={`/${lang}/news`}
      />
    </main>
  );
}
