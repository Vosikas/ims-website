import type { StaticImageData } from "next/image";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import ibDiploma from "@/public/images/school/computer-lab-students.jpg";
import kindergarten from "@/public/images/school/kindergarten-crafts.jpg";
import middleSchool from "@/public/images/school/middle-school-lounge.jpg";
import nursery from "@/public/images/school/nursery-mud-kitchen.jpg";
import primarySchool from "@/public/images/school/primary-parachute-game.jpg";
import generalLyceum from "@/public/images/school/students-studying.jpg";

export type PathwayId = keyof Dictionary["pathways"]["items"];
export type PagedPathwayId = keyof Dictionary["pathwayPages"]["items"];

export type Pathway = {
  id: PathwayId;
  number: string;
  /** The school's own photo, from ims.edu.gr. */
  image: StaticImageData;
  /** Where the photo is cropped, for the wide card and the pathway page. */
  focusClassName: string;
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
    focusClassName: "object-[40%_45%]",
    panelClassName: "bg-nursery",
    accentClassName: "text-nursery-ink",
    slug: "nursery",
  },
  {
    id: "kindergarten",
    number: "02",
    image: kindergarten,
    focusClassName: "object-[50%_42%]",
    panelClassName: "bg-kindergarten",
    slug: "kindergarten",
  },
  {
    id: "primarySchool",
    number: "03",
    image: primarySchool,
    focusClassName: "object-[45%_45%]",
    panelClassName: "bg-primary-school",
    slug: "primary-school",
  },
  {
    id: "middleSchool",
    number: "04",
    image: middleSchool,
    focusClassName: "object-[55%_60%]",
    panelClassName: "bg-middle-school",
    slug: "middle-school",
  },
  {
    id: "ibDiploma",
    number: "05",
    image: ibDiploma,
    focusClassName: "object-[50%_62%]",
    panelClassName: "bg-ib-diploma",
    slug: "ib-diploma",
  },
  // The General Lyceum card opens the Panhellenic exams platform, as shown in the presentation.
  {
    id: "generalLyceum",
    number: "06",
    image: generalLyceum,
    focusClassName: "object-[50%_45%]",
    panelClassName: "bg-general-lyceum",
    href: "/panhellenicexams",
  },
];

/** The pathways that have a page of their own, in the order the cards show them. */
export const pagedPathways = pathways.filter(
  (pathway): pathway is Pathway & { id: PagedPathwayId; slug: string } => Boolean(pathway.slug),
);
