import { notFound } from "next/navigation";
import { About } from "@/components/about";
import { CampusGallery } from "@/components/campus-gallery";
import { FeaturePanels } from "@/components/feature-panels";
import { CinematicIntro } from "@/components/cinematic-intro";
import { Hero } from "@/components/hero";
import { LeadershipMessage } from "@/components/leadership-message";
import { Pathways } from "@/components/pathways";
import { Pillars } from "@/components/pillars";
import { getDictionary } from "./dictionaries";
import { hasLocale } from "./locales";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      {/* Proposal 1: a child walks the corridor and grows into a graduate. The scale hides the
          video's black bars; the frame sits a little left to keep the walker in view on phones. */}
      <CinematicIntro
        src="/videos/intro-journey.mp4"
        label={dict.intro.label}
        skipLabel={dict.intro.skip}
        videoClassName="scale-[1.13] object-[42%_50%] origin-[42%_50%]"
        barClassName="bg-gradient-to-r from-amber-200 via-amber-300 to-[#e0a845]"
        title="International Metropolitan School"
      />
      <main>
        <Hero dict={dict.hero} />
        <Pathways dict={dict.pathways} lang={lang} />
        <About dict={dict.about} />
        <Pillars dict={dict.pillars} />
        <LeadershipMessage dict={dict.message} />
        <CampusGallery dict={dict.campus} />
        <FeaturePanels
          schoolLife={dict.schoolLife}
          newsEvents={dict.newsEvents}
          schoolLifeHref={`/${lang}/school-life`}
          newsHref={`/${lang}/news`}
        />
      </main>
    </>
  );
}
