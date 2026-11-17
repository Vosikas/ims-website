import Image from "next/image";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import entrance from "@/public/images/campus/entrance.jpg";

export function About({ dict }: { dict: Dictionary["about"] }) {
  const { mission, history } = dict;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="mx-auto max-w-[64rem] scroll-mt-4 px-5 pt-[2.6rem] lg:pr-[2.5625rem] lg:pl-[2.8125rem]"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-[2.6rem]">
        <div>
          <h2
            id="about-heading"
            className="font-serif text-[2.1rem] leading-[1.15] font-medium text-balance lg:text-[1.97rem] lg:leading-[2.45rem] el:font-semibold"
          >
            {dict.title}
          </h2>
          <span className="mt-[0.7rem] block h-[0.125rem] w-[1.95rem] bg-gold" />
          <p className="mt-[0.9rem] text-[1.05rem] leading-[1.6] lg:text-[0.95rem] lg:leading-[1.55rem]">
            {dict.lead}
          </p>
          <p className="mt-[0.7rem] text-base leading-[1.6] lg:text-[0.88rem] lg:leading-[1.45rem]">
            {dict.campuses}
          </p>

          <h3 className="mt-[1.8rem] font-serif text-[1.5rem] leading-tight font-medium lg:text-[1.3rem] el:font-semibold">
            {mission.title}
          </h3>
          <p className="mt-[0.5rem] text-base leading-[1.6] lg:text-[0.88rem] lg:leading-[1.45rem]">
            {mission.text}
          </p>
        </div>

        {/* The emblem as it stands on the building: a lighthouse made of books. */}
        <figure className="self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[0.3rem] bg-mist lg:aspect-[5/6]">
            <Image
              src={entrance}
              alt={mission.emblemAlt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 28vw, 100vw"
              className="scale-[1.55] object-cover object-[24%_18%] [transform-origin:24%_18%]"
            />
          </div>
          <figcaption className="mt-[0.7rem] font-serif text-[1.15rem] leading-[1.45] italic lg:text-[0.98rem] lg:leading-[1.4rem]">
            {mission.emblem}
          </figcaption>
        </figure>
      </div>

      <div className="mt-[2.6rem]">
        <h3 className="font-serif text-[1.5rem] leading-tight font-medium lg:text-[1.3rem] el:font-semibold">
          {history.title}
        </h3>
        {/* Four dates on one line: the order is the point. */}
        <ol className="mt-[1.1rem] grid gap-x-[1.6rem] gap-y-[1.4rem] sm:grid-cols-2 lg:grid-cols-4">
          {history.items.map(({ year, text }) => (
            <li key={year} className="border-t border-line pt-[0.9rem]">
              <span className="relative -top-[1.27rem] block size-[0.7rem] rounded-full border-2 border-white bg-gold" />
              <p className="-mt-[0.7rem] font-display text-[2.2rem] leading-none font-semibold tracking-[0.01em] lg:text-[1.9rem]">
                {year}
              </p>
              <p className="mt-[0.5rem] text-sm leading-[1.5] lg:text-[0.78rem] lg:leading-[1.2rem]">
                {text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
