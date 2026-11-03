import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { ArrowRightIcon } from "@/components/icons";
import newsEventsImage from "@/public/images/home/news-events.jpg";
import schoolLifeImage from "@/public/images/home/school-life.jpg";

const tones = {
  dark: {
    panel: "bg-navy font-light text-white",
    title: "font-normal",
    button: "bg-white text-navy hover:bg-mist",
    fade: "from-navy sm:to-25%",
  },
  light: {
    panel: "bg-mist",
    title: "font-medium",
    button: "border border-navy/15 bg-white hover:bg-navy hover:text-white",
    fade: "from-mist sm:to-20%",
  },
};

type FeaturePanelProps = {
  id: string;
  tone: keyof typeof tones;
  text: Dictionary["schoolLife"];
  href: string;
  image: StaticImageData;
  contentClassName: string;
  photoClassName: string;
};

function FeaturePanel({
  id,
  tone,
  text,
  href,
  image,
  contentClassName,
  photoClassName,
}: FeaturePanelProps) {
  const styles = tones[tone];

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative flex scroll-mt-4 flex-col overflow-hidden sm:block sm:min-h-[16.5rem] lg:aspect-[512/204] lg:min-h-0 ${styles.panel}`}
    >
      <div className={`relative z-10 px-6 py-8 lg:px-0 lg:py-0 ${contentClassName}`}>
        <span className="block h-[0.125rem] w-[1.95rem] bg-gold" />
        <h2
          id={`${id}-heading`}
          className={`mt-[0.75rem] font-serif text-[2rem] leading-tight lg:text-[1.64rem] lg:leading-[2.1rem] el:lg:text-[1.5rem] ${styles.title}`}
        >
          {text.title}
        </h2>
        <p className="mt-[0.35rem] leading-[1.45] whitespace-pre-line lg:text-[0.81rem] lg:leading-[1.07rem]">
          {text.description}
        </p>
        <Link
          href={href}
          className={`mt-[1rem] inline-flex h-11 items-center gap-[0.8rem] rounded-full px-[1.05rem] text-xs font-bold tracking-[0.05em] uppercase transition-colors lg:h-[1.85rem] lg:text-[0.6rem] ${styles.button}`}
        >
          {text.linkLabel}
          <ArrowRightIcon className="w-[1rem]" />
        </Link>
      </div>
      <div
        className={`relative aspect-[3/2] sm:absolute sm:inset-y-0 sm:right-0 sm:aspect-auto ${photoClassName}`}
      >
        <Image
          src={image}
          alt={text.alt}
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 26vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-b to-transparent to-30% sm:bg-gradient-to-r ${styles.fade}`}
        />
      </div>
    </section>
  );
}

type FeaturePanelsProps = {
  schoolLife: Dictionary["schoolLife"];
  newsEvents: Dictionary["newsEvents"];
  newsHref: string;
};

export function FeaturePanels({ schoolLife, newsEvents, newsHref }: FeaturePanelsProps) {
  return (
    <div className="mt-[2.06rem] mb-[0.125rem] grid lg:grid-cols-2">
      <FeaturePanel
        id="school-life"
        tone="dark"
        text={schoolLife}
        href="#school-life"
        image={schoolLifeImage}
        contentClassName="lg:pt-[1.5rem] lg:pl-[3.125rem]"
        photoClassName="sm:w-[47.5%]"
      />
      <FeaturePanel
        id="news-events"
        tone="light"
        text={newsEvents}
        href={newsHref}
        image={newsEventsImage}
        contentClassName="lg:pt-[1.85rem] lg:pl-[2.45rem]"
        photoClassName="sm:w-[52.5%]"
      />
    </div>
  );
}
