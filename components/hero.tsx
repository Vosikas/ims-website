import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { ChevronDownIcon } from "@/components/icons";
import heroImage from "@/public/images/home/hero.jpg";

export function Hero({ dict }: { dict: Dictionary["hero"] }) {
  return (
    <section className="relative isolate h-[32rem] overflow-hidden bg-navy sm:h-[36rem] lg:aspect-[1024/391] lg:h-auto lg:w-full">
      <Image
        src={heroImage}
        alt={dict.alt}
        fill
        preload
        placeholder="blur"
        sizes="100vw"
        className="-z-10 object-cover object-[28%_50%] lg:object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/60 via-black/30 to-transparent lg:hidden" />

      <div className="flex h-full flex-col justify-center px-6 text-white lg:px-0 lg:pt-[1.61rem] lg:pl-[6.0625rem]">
        <h1>
          <span className="block font-display text-[5.5rem] leading-[0.95] font-medium tracking-[0.01em] lg:-ml-[0.17rem] lg:text-[7.22rem] lg:leading-[0.87]">
            IMS
          </span>
          <span className="mt-[0.5rem] block font-brand text-[0.95rem] leading-[1.45] font-light tracking-[0.2em] [word-spacing:0.2em] uppercase lg:mt-[0.42rem] lg:text-[1.26rem] lg:leading-[1.85rem]">
            International
            <br />
            Metropolitan School
          </span>
        </h1>
        <span className="mt-[0.68rem] block h-[0.17rem] w-[3.4rem] bg-gold" />
        <p className="mt-[1.05rem] font-serif text-[1.8rem] leading-[1.15] font-light tracking-[0.04em] whitespace-pre-line italic lg:text-[2rem] lg:leading-[2.25rem] el:text-[1.55rem] el:tracking-normal el:sm:text-[1.8rem] el:lg:text-[1.9rem]">
          {dict.tagline}
        </p>
      </div>

      <Link
        href="#pathways"
        aria-label={dict.scrollLabel}
        className="absolute bottom-[0.95rem] left-1/2 flex size-[2.3rem] -translate-x-1/2 items-center justify-center rounded-full border border-white/70 bg-white/50 text-navy backdrop-blur-sm transition-colors hover:bg-white/85"
      >
        <ChevronDownIcon className="w-[1.4rem]" />
      </Link>
    </section>
  );
}
