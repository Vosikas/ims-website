import Image, { type StaticImageData } from "next/image";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import entrance from "@/public/images/campus/entrance.jpg";
import labConversation from "@/public/images/campus/lab-conversation.jpg";
import library from "@/public/images/campus/library.jpg";
import makerspace from "@/public/images/campus/makerspace.jpg";
import team from "@/public/images/campus/team.jpg";

type CampusDict = Dictionary["campus"];

type Photo = {
  id: keyof CampusDict["items"];
  image: StaticImageData;
  /** Where the photo sits: two columns on phones, four from 1024px. */
  placeClassName: string;
  /** Keeps the subject in frame when the cell crops the photo. */
  focusClassName: string;
  sizes: string;
};

// Reading order on desktop: the entrance, the team, the library, then the two rooms below.
const photos: Photo[] = [
  {
    id: "entrance",
    image: entrance,
    placeClassName: "col-start-1 row-start-1 row-span-2",
    focusClassName: "object-[30%_22%]",
    sizes: "(min-width: 1024px) 23vw, 50vw",
  },
  {
    id: "team",
    image: team,
    placeClassName: "col-span-2 col-start-1 row-start-3 lg:col-start-2 lg:row-start-1",
    focusClassName: "object-[50%_45%]",
    sizes: "(min-width: 1024px) 46vw, 100vw",
  },
  {
    id: "library",
    image: library,
    placeClassName: "col-start-2 row-start-1 row-span-2 lg:col-start-4",
    focusClassName: "object-[45%_70%]",
    sizes: "(min-width: 1024px) 23vw, 50vw",
  },
  {
    id: "makerspace",
    image: makerspace,
    placeClassName: "col-start-1 row-start-4 lg:col-start-2 lg:row-start-2",
    focusClassName: "object-[62%_55%]",
    sizes: "(min-width: 1024px) 23vw, 50vw",
  },
  {
    id: "lab",
    image: labConversation,
    placeClassName: "col-start-2 row-start-4 lg:col-start-3 lg:row-start-2",
    focusClassName: "object-[55%_40%]",
    sizes: "(min-width: 1024px) 23vw, 50vw",
  },
];

export function CampusGallery({ dict }: { dict: CampusDict }) {
  return (
    <section
      id="campus"
      aria-labelledby="campus-heading"
      className="mx-auto max-w-[64rem] scroll-mt-4 px-5 pt-[2.4rem] lg:pr-[2.5625rem] lg:pl-[2.8125rem]"
    >
      <div className="text-center">
        <h2
          id="campus-heading"
          className="font-serif text-[2.1rem] leading-[1.15] font-medium text-balance lg:text-[1.97rem] lg:leading-[2.6rem] el:font-semibold"
        >
          {dict.title}
        </h2>
        <span className="mx-auto mt-[0.45rem] block h-[0.125rem] w-[1.95rem] bg-gold" />
        <p className="mt-[0.55rem] text-base leading-[1.4] lg:text-[0.9rem]">{dict.intro}</p>
      </div>

      <ul className="mt-[1.28rem] grid auto-rows-[8.5rem] grid-cols-2 gap-[0.55rem] sm:auto-rows-[12rem] lg:auto-rows-[9.6rem] lg:grid-cols-4">
        {photos.map(({ id, image, placeClassName, focusClassName, sizes }) => (
          <li key={id} className={`relative overflow-hidden rounded-[0.3rem] bg-mist ${placeClassName}`}>
            <figure className="h-full">
              <Image
                src={image}
                alt={dict.items[id].alt}
                fill
                placeholder="blur"
                sizes={sizes}
                className={`object-cover ${focusClassName}`}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 via-navy/35 to-transparent px-[0.8rem] pt-[1.6rem] pb-[0.6rem] text-sm leading-tight text-white lg:text-[0.72rem]">
                {dict.items[id].caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
