import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import generalLyceum from "@/public/images/home/general-lyceum.jpg";
import ibDiploma from "@/public/images/home/ib-diploma.jpg";
import kindergarten from "@/public/images/home/kindergarten.jpg";
import middleSchool from "@/public/images/home/middle-school.jpg";
import nursery from "@/public/images/home/nursery.jpg";
import primarySchool from "@/public/images/home/primary-school.jpg";

type Pathway = {
  number: string;
  title: string;
  description: string;
  image: StaticImageData;
  alt: string;
  panelClassName: string;
  accentClassName?: string;
};

const pathways: Pathway[] = [
  {
    number: "01",
    title: "Nursery",
    description: "A safe and nurturing start\nfor a bright future.",
    image: nursery,
    alt: "Young boy playing with building blocks in a nursery classroom",
    panelClassName: "bg-nursery",
    accentClassName: "text-nursery-ink",
  },
  {
    number: "02",
    title: "Kindergarten",
    description: "Curiosity. Creativity.\nConfidence.",
    image: kindergarten,
    alt: "Smiling girl holding up hands covered in colourful paint",
    panelClassName: "bg-kindergarten",
  },
  {
    number: "03",
    title: "Primary School",
    description: "Building knowledge,\nskills and character.",
    image: primarySchool,
    alt: "Primary school pupil writing at a desk in a classroom",
    panelClassName: "bg-primary-school",
  },
  {
    number: "04",
    title: "Middle School\n(IB MYP)",
    description: "Exploring ideas.\nMaking connections.",
    image: middleSchool,
    alt: "Student looking through a microscope during a science lesson",
    panelClassName: "bg-middle-school",
  },
  {
    number: "05",
    title: "IB Diploma",
    description: "A global perspective\nfor lifelong opportunities.",
    image: ibDiploma,
    alt: "Three students working together at a library table",
    panelClassName: "bg-ib-diploma",
  },
  {
    number: "06",
    title: "General Lyceum",
    description: "A strong foundation\nfor the future.",
    image: generalLyceum,
    alt: "Lyceum student writing during a lesson",
    panelClassName: "bg-general-lyceum",
  },
];

function PathwayCard({ pathway }: { pathway: Pathway }) {
  const { number, title, description, image, alt, panelClassName, accentClassName } = pathway;

  return (
    <li>
      <Link
        href="#pathways"
        className="group flex h-full flex-col overflow-hidden rounded-[0.3rem] transition-shadow hover:shadow-lg"
      >
        <div className="relative aspect-[306/131] overflow-hidden">
          <Image
            src={image}
            alt={alt}
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
              {title}
            </h3>
            <p className="mt-[0.2rem] text-sm leading-[1.25] whitespace-pre-line lg:text-[0.7rem] lg:leading-[1rem]">
              {description}
            </p>
          </div>
          <span
            className={`relative top-[0.62rem] ml-2 flex size-[1.8rem] shrink-0 items-center justify-center rounded-full border border-current transition-transform group-hover:translate-x-0.5 ${accentClassName ?? ""}`}
          >
            <ArrowRightIcon className="w-[0.85rem]" />
          </span>
        </div>
      </Link>
    </li>
  );
}

export function Pathways() {
  return (
    <section
      id="pathways"
      aria-labelledby="pathways-heading"
      className="mx-auto max-w-[64rem] scroll-mt-4 px-5 pt-[1.75rem] text-center lg:pr-[2.5625rem] lg:pl-[2.8125rem]"
    >
      <p className="flex items-center justify-center gap-[0.625rem] text-[0.78rem] tracking-[0.02em] uppercase">
        <span className="h-[0.1rem] w-[1.875rem] bg-gold" />
        Our Educational Pathways
        <span className="h-[0.1rem] w-[1.875rem] bg-gold" />
      </p>
      <h2
        id="pathways-heading"
        className="mt-[0.12rem] font-serif text-[2.1rem] leading-[1.15] font-medium lg:text-[1.97rem] lg:leading-[2.6rem]"
      >
        Six journeys. One school community.
      </h2>
      <p className="mt-[0.18rem] text-base leading-[1.4] lg:text-[0.9rem]">
        From the early years to university and beyond, IMS offers a complete and inspiring
        educational experience.
      </p>

      <ul className="mt-[1.28rem] grid gap-[0.55rem] text-left sm:grid-cols-2 lg:grid-cols-3">
        {pathways.map((pathway) => (
          <PathwayCard key={pathway.number} pathway={pathway} />
        ))}
      </ul>
    </section>
  );
}
