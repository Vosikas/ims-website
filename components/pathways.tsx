import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { ArrowRightIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import generalLyceum from "@/public/images/home/general-lyceum.jpg";
import ibDiploma from "@/public/images/home/ib-diploma.jpg";
import kindergarten from "@/public/images/home/kindergarten.jpg";
import middleSchool from "@/public/images/home/middle-school.jpg";
import nursery from "@/public/images/home/nursery.jpg";
import primarySchool from "@/public/images/home/primary-school.jpg";

type PathwaysDict = Dictionary["pathways"];

type Pathway = {
  id: keyof PathwaysDict["items"];
  number: string;
  image: StaticImageData;
  panelClassName: string;
  accentClassName?: string;
  /** A page of another app that the site serves through a rewrite (see next.config.ts). */
  appHref?: string;
};

const pathways: Pathway[] = [
  {
    id: "nursery",
    number: "01",
    image: nursery,
    panelClassName: "bg-nursery",
    accentClassName: "text-nursery-ink",
  },
  { id: "kindergarten", number: "02", image: kindergarten, panelClassName: "bg-kindergarten" },
  { id: "primarySchool", number: "03", image: primarySchool, panelClassName: "bg-primary-school" },
  { id: "middleSchool", number: "04", image: middleSchool, panelClassName: "bg-middle-school" },
  { id: "ibDiploma", number: "05", image: ibDiploma, panelClassName: "bg-ib-diploma" },
  {
    id: "generalLyceum",
    number: "06",
    image: generalLyceum,
    panelClassName: "bg-general-lyceum",
    appHref: "/panhellenicexams",
  },
];

type PathwayCardProps = {
  pathway: Pathway;
  text: PathwaysDict["items"][Pathway["id"]];
};

type CardLinkProps = {
  appHref?: string;
  className: string;
  children: ReactNode;
};

// Another app's page needs a full page load: Next's client-side navigation can't render it.
function CardLink({ appHref, className, children }: CardLinkProps) {
  if (appHref) {
    return (
      <a href={appHref} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href="#pathways" className={className}>
      {children}
    </Link>
  );
}

function PathwayCard({ pathway, text }: PathwayCardProps) {
  const { number, image, panelClassName, accentClassName, appHref } = pathway;

  return (
    <li>
      <CardLink
        appHref={appHref}
        className="group flex h-full flex-col overflow-hidden rounded-[0.3rem] transition-shadow hover:shadow-lg"
      >
        <div className="relative aspect-[306/131] overflow-hidden">
          <Image
            src={image}
            alt={text.alt}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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

export function Pathways({ dict }: { dict: PathwaysDict }) {
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
          <PathwayCard key={pathway.id} pathway={pathway} text={dict.items[pathway.id]} />
        ))}
      </ul>
    </section>
  );
}
