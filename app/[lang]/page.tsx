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
      {/* Proposal 2: an anime painting of the school becomes the real photograph. Scaled from the
          top left, the watermark in the bottom-right corner falls outside the frame; the frame
          sits a little left so phones keep the IMS sign in view. No text: the video shows the name. */}
      <CinematicIntro
        src="/videos/intro-anime.mp4"
        label={dict.intro.label}
        skipLabel={dict.intro.skip}
        videoClassName="scale-[1.12] origin-top-left object-[22%_50%]"
        barClassName="bg-gradient-to-r from-white via-white to-[#e6cc94]"
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
