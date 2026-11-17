import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { pagedPathways } from "@/lib/pathways";
import { getDictionary } from "../../dictionaries";
import { hasLocale } from "../../locales";

export function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!hasLocale(params.lang)) return [];
  return pagedPathways.map(({ slug }) => ({ slug }));
}

const findPathway = (slug: string) => pagedPathways.find((pathway) => pathway.slug === slug);
const oneLine = (text: string) => text.replace(/\n/g, " ");

export async function generateMetadata({
  params,
}: Pick<PageProps<"/[lang]/pathways/[slug]">, "params">): Promise<Metadata> {
  const { lang, slug } = await params;
  const pathway = findPathway(slug);
  if (!hasLocale(lang) || !pathway) return {};
  const { pathways } = await getDictionary(lang);
  const text = pathways.items[pathway.id];
  return { title: `${oneLine(text.title)} | IMS`, description: oneLine(text.description) };
}

// The page reads its slug inside Suspense, so navigating to it never waits on URL data.
export default function PathwayPage({ params }: PageProps<"/[lang]/pathways/[slug]">) {
  return (
    <Suspense fallback={null}>
      <Pathway params={params} />
    </Suspense>
  );
}

async function Pathway({ params }: Pick<PageProps<"/[lang]/pathways/[slug]">, "params">) {
  const { lang, slug } = await params;
  const pathway = findPathway(slug);
  if (!hasLocale(lang) || !pathway) notFound();

  const { pathways, pathwayPages } = await getDictionary(lang);
  const card = pathways.items[pathway.id];
  const page = pathwayPages.items[pathway.id];
  const index = pagedPathways.indexOf(pathway);
  const next = pagedPathways[(index + 1) % pagedPathways.length];

  return (
    <main className="mx-auto max-w-[64rem] px-5 pt-[1.4rem] pb-[3rem] lg:pr-[2.5625rem] lg:pl-[2.8125rem]">
      <Link
        href={`/${lang}#pathways`}
        className="group inline-flex items-center gap-[0.4rem] text-xs font-bold tracking-[0.05em] uppercase lg:text-[0.6rem]"
      >
        <ArrowRightIcon className="w-[0.9rem] rotate-180 transition-transform group-hover:-translate-x-0.5" />
        {pathwayPages.back}
      </Link>

      <header className="mt-[0.9rem] grid overflow-hidden rounded-[0.3rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div
          className={`flex flex-col justify-center px-6 py-7 lg:px-[2rem] lg:py-[1.8rem] ${pathway.panelClassName}`}
        >
          <span
            className={`font-serif text-[2.2rem] leading-none ${pathway.accentClassName ?? ""}`}
          >
            {pathway.number}
          </span>
          <h1 className="mt-[0.6rem] font-serif text-[2.4rem] leading-[1.05] font-medium whitespace-pre-line lg:text-[2.1rem] el:font-semibold">
            {card.title}
          </h1>
          <p className="mt-[0.5rem] text-base leading-[1.4] whitespace-pre-line lg:text-[0.88rem]">
            {card.description}
          </p>
          <dl className="mt-[1.1rem] grid grid-cols-2 gap-4 border-t border-navy/20 pt-[0.8rem]">
            <div>
              <dt className="text-xs font-bold tracking-[0.04em] uppercase lg:text-[0.58rem]">
                {pathwayPages.ages}
              </dt>
              <dd className="mt-[0.1rem] text-base lg:text-[0.85rem]">{page.ages}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-[0.04em] uppercase lg:text-[0.58rem]">
                {pathwayPages.programme}
              </dt>
              <dd className="mt-[0.1rem] text-base lg:text-[0.85rem]">{page.programme}</dd>
            </div>
          </dl>
        </div>
        <div className="relative aspect-[612/256] lg:aspect-auto lg:min-h-[17rem]">
          {/* A generated placeholder until the school's own photo comes from WordPress. */}
          <Image
            src={pathway.image}
            alt={page.alt}
            fill
            preload
            placeholder="blur"
            sizes="(min-width: 1024px) 34vw, 100vw"
            className="object-cover"
          />
        </div>
      </header>

      <div className="mt-[2rem] grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-[2.4rem]">
        <div className="max-w-[40rem]">
          {page.quote && (
            <figure className="mb-[1.4rem]">
              <blockquote className="font-serif text-[1.3rem] leading-[1.45] italic lg:text-[1.1rem] lg:leading-[1.65rem]">
                {page.quote}
              </blockquote>
              <figcaption className="mt-[0.5rem] text-sm text-navy/75 lg:text-[0.72rem]">
                {page.quoteSource}
              </figcaption>
            </figure>
          )}
          <div className="space-y-[0.9rem] text-[1.0625rem] leading-[1.65] lg:text-[0.9rem] lg:leading-[1.5rem]">
            {page.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <aside className="self-start rounded-[0.3rem] bg-mist px-[1.25rem] py-[1.1rem]">
          <h2 className="font-serif text-[1.4rem] leading-tight font-medium lg:text-[1.15rem] el:font-semibold">
            {pathwayPages.glance}
          </h2>
          <ul className="mt-[0.6rem] list-disc space-y-[0.45rem] pl-[1.1rem] text-sm leading-[1.5] marker:text-gold lg:text-[0.76rem] lg:leading-[1.15rem]">
            {page.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
          <Link
            href={`/${lang}/contact`}
            className="mt-[1.1rem] inline-flex h-11 items-center gap-[0.8rem] rounded-full bg-navy px-[1.05rem] text-xs font-bold tracking-[0.05em] text-white uppercase transition-colors hover:bg-navy/85 lg:h-[1.85rem] lg:text-[0.6rem]"
          >
            {pathwayPages.contact}
            <ArrowRightIcon className="w-[1rem]" />
          </Link>
        </aside>
      </div>

      <nav aria-label={pathwayPages.next} className="mt-[2.4rem] border-t border-line pt-[1rem]">
        <Link
          href={`/${lang}/pathways/${next.slug}`}
          className="group inline-flex items-center gap-[0.8rem]"
        >
          <span className="text-xs tracking-[0.04em] uppercase lg:text-[0.6rem]">
            {pathwayPages.next}
          </span>
          <span className="font-serif text-[1.3rem] leading-tight font-medium lg:text-[1.1rem] el:font-semibold">
            {oneLine(pathways.items[next.id].title)}
          </span>
          <ArrowRightIcon className="w-[1rem] transition-transform group-hover:translate-x-0.5" />
        </Link>
      </nav>
    </main>
  );
}
