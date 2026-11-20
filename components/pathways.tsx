import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/app/[lang]/locales";
import { ArrowRightIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { pathways, type Pathway } from "@/lib/pathways";

type PathwaysDict = Dictionary["pathways"];

type PathwayCardProps = {
  pathway: Pathway;
  text: PathwaysDict["items"][Pathway["id"]];
  lang: Locale;
};

type CardLinkProps = {
  href: string;
  className: string;
  children: ReactNode;
};

// /panhellenicexams redirects to another site, which needs a full page load.
function CardLink({ href, className, children }: CardLinkProps) {
  if (href.startsWith("/panhellenicexams")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function PathwayCard({ pathway, text, lang }: PathwayCardProps) {
  const { number, image, focusClassName, panelClassName, accentClassName, slug, href } = pathway;

  return (
    <li>
      <CardLink
        href={href ?? `/${lang}/pathways/${slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-[0.3rem] transition-shadow hover:shadow-lg"
      >
        <div className="relative aspect-[306/131] overflow-hidden">
          <Image
            src={image}
            alt={text.alt}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${focusClassName}`}
          />
        </div>
        <div
          className={`flex min-h-[4.875rem] flex-1 items-center py-[0.45rem] pr-[1.05rem] pl-[1.65rem] ${panelClassName}`}
        >
          <span
            className={`relative bottom-[0.5rem] w-[2.6rem] shrink-0 font-serif text-[1.75rem] leading-none ${accentClassName ?? ""}`}
          >
            {number}
          </span>
          <div className="min-w-0 flex-1 border-l border-navy/30 pl-[0.8rem]">
            <h3 className="text-base leading-[1.15rem] font-bold tracking-[0.02em] whitespace-pre-line uppercase lg:text-[0.92rem]">
              {text.title}
            </h3>
            <p className="mt-[0.2rem] text-sm leading-[1.25] whitespace-pre-line lg:text-[0.7rem] lg:leading-[1rem]">
              {text.description}
            </p>
          </div>
          <span
            className={`relative top-[0.62rem] ml-2 flex size-[1.8rem] shrink-0 items-center justify-center rounded-full border border-current transition-transform group-hover:translate-x-0.5 ${accentClassName ?? ""}`}
          >
            <ArrowRightIcon className="w-[0.85rem]" />
          </span>
        </div>
      </CardLink>
    </li>
  );
}

export function Pathways({ dict, lang }: { dict: PathwaysDict; lang: Locale }) {
  return (
    <section
      id="pathways"
      aria-labelledby="pathways-heading"
      className="mx-auto max-w-[64rem] scroll-mt-4 px-5 pt-[1.75rem] text-center lg:pr-[2.5625rem] lg:pl-[2.8125rem]"
    >
      <SectionHeading
        as="h2"
        id="pathways-heading"
        eyebrow={dict.eyebrow}
        title={dict.title}
        intro={dict.intro}
      />

      <ul className="mt-[1.28rem] grid gap-[0.55rem] text-left sm:grid-cols-2 lg:grid-cols-3">
        {pathways.map((pathway) => (
          <PathwayCard
            key={pathway.id}
            pathway={pathway}
            text={dict.items[pathway.id]}
            lang={lang}
          />
        ))}
      </ul>
    </section>
  );
}
