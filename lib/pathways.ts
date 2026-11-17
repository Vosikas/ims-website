import type { StaticImageData } from "next/image";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import generalLyceum from "@/public/images/home/general-lyceum.jpg";
import ibDiploma from "@/public/images/home/ib-diploma.jpg";
import kindergarten from "@/public/images/home/kindergarten.jpg";
import middleSchool from "@/public/images/home/middle-school.jpg";
import nursery from "@/public/images/home/nursery.jpg";
import primarySchool from "@/public/images/home/primary-school.jpg";

export type PathwayId = keyof Dictionary["pathways"]["items"];
export type PagedPathwayId = keyof Dictionary["pathwayPages"]["items"];

export type Pathway = {
  id: PathwayId;
  number: string;
  /**
   * Generated placeholder photos, to be replaced by the school's own once they come from its
   * WordPress media library.
   */
  image: StaticImageData;
  panelClassName: string;
  accentClassName?: string;
  /** The pathway's own page under /[lang]/pathways/. */
  slug?: string;
  /** Where the card leads instead, when it leaves the site. */
  href?: string;
};

export const pathways: Pathway[] = [
  {
    id: "nursery",
    number: "01",
    image: nursery,
    panelClassName: "bg-nursery",
    accentClassName: "text-nursery-ink",
    slug: "nursery",
  },
  {
    id: "kindergarten",
    number: "02",
    image: kindergarten,
    panelClassName: "bg-kindergarten",
    slug: "kindergarten",
  },
  {
    id: "primarySchool",
    number: "03",
    image: primarySchool,
    panelClassName: "bg-primary-school",
    slug: "primary-school",
  },
  {
    id: "middleSchool",
    number: "04",
    image: middleSchool,
    panelClassName: "bg-middle-school",
    slug: "middle-school",
  },
  {
    id: "ibDiploma",
    number: "05",
    image: ibDiploma,
    panelClassName: "bg-ib-diploma",
    slug: "ib-diploma",
  },
  // The General Lyceum card opens the Panhellenic exams platform, as shown in the presentation.
  {
    id: "generalLyceum",
    number: "06",
    image: generalLyceum,
    panelClassName: "bg-general-lyceum",
    href: "/panhellenicexams",
  },
];

/** The pathways that have a page of their own, in the order the cards show them. */
export const pagedPathways = pathways.filter(
  (pathway): pathway is Pathway & { id: PagedPathwayId; slug: string } => Boolean(pathway.slug),
);
