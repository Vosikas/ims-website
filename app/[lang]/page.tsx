import { notFound } from "next/navigation";
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
      <FeaturePanels
        schoolLife={dict.schoolLife}
        newsEvents={dict.newsEvents}
        newsHref={`/${lang}/news`}
      />
    </main>
  );
}
