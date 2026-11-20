import Image from "next/image";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import ioannis from "@/public/images/school/director-ioannis-dimitrellos.jpg";
import konstantina from "@/public/images/school/director-konstantina-valsamidou-dimitrellou.jpg";

// In the same order as dict.leaders.
const portraits = [ioannis, konstantina];

export function LeadershipMessage({ dict }: { dict: Dictionary["message"] }) {
  return (
    <section aria-labelledby="message-heading" className="mt-[2.6rem] bg-navy text-white">
      <div className="mx-auto grid max-w-[64rem] gap-8 px-6 py-[2.8rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-[3rem] lg:pr-[2.5625rem] lg:pl-[2.8125rem]">
        {/* The school's motto, in Demosthenes' own words, in a face with Greek letters on either page. */}
        <figure>
          <blockquote
            lang="el"
            className="font-[family-name:var(--font-source-serif)] text-[1.85rem] leading-[1.2] font-light text-balance italic lg:text-[1.75rem] lg:leading-[2.15rem]"
          >
            {dict.motto}
          </blockquote>
          <span className="mt-[0.9rem] block h-[0.125rem] w-[1.95rem] bg-gold" />
          <figcaption className="mt-[0.8rem] text-sm leading-[1.5] text-white/80 lg:text-[0.8rem]">
            <span className="block">{dict.mottoMeaning}</span>
            <span className="mt-[0.15rem] block text-white/65">{dict.mottoAuthor}</span>
          </figcaption>
        </figure>

        <div>
          <h2
            id="message-heading"
            className="font-serif text-[1.6rem] leading-tight font-normal lg:text-[1.45rem]"
          >
            {dict.title}
          </h2>
          <p className="mt-[0.8rem] text-base leading-[1.65] font-light lg:text-[0.9rem] lg:leading-[1.5rem]">
            {dict.text}
          </p>
          {/* The two directors who sign the message, in the order ims.edu.gr shows them. */}
          <ul className="mt-[1.3rem] flex flex-wrap gap-x-[1.4rem] gap-y-[1rem]">
            {dict.leaders.map((name, i) => (
              <li key={name} className="w-[7.5rem] lg:w-[6.4rem]">
                <figure>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[0.3rem] bg-white/10">
                    <Image
                      src={portraits[i]}
                      alt={name}
                      fill
                      placeholder="blur"
                      sizes="8rem"
                      className="object-cover object-[50%_22%]"
                    />
                  </div>
                  <figcaption className="mt-[0.5rem] text-xs leading-[1.35] font-bold tracking-[0.04em] text-white/85 uppercase lg:text-[0.58rem]">
                    {name}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
