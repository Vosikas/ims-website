import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/app/[lang]/locales";
import { ArrowRightIcon } from "@/components/icons";
import { usingSampleContent, type NewsArticle, type NewsImage } from "@/lib/news";

const dateLocales: Record<Locale, string> = {
  en: "en-GB",
  el: "el-GR",
};

function formatDate(date: string, lang: Locale) {
  return new Intl.DateTimeFormat(dateLocales[lang], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Athens",
  }).format(new Date(date));
}

export function NewsMeta({ article, lang }: { article: NewsArticle; lang: Locale }) {
  return (
    <p className="flex flex-wrap items-center gap-x-[0.45rem] text-xs tracking-[0.04em] uppercase lg:text-[0.6rem]">
      {article.category && (
        <>
          <span className="font-bold">{article.category}</span>
          <span aria-hidden="true" className="h-[0.7rem] w-px bg-gold" />
        </>
      )}
      <time dateTime={article.date}>{formatDate(article.date, lang)}</time>
    </p>
  );
}

// Fills its positioned parent. WordPress posts don't always have a featured image.
export function NewsCover({
  image,
  sizes,
  preload = false,
  className = "",
}: {
  image: NewsImage | null;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  if (!image) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center bg-navy font-display text-[3.5rem] font-semibold text-white/90"
      >
        IMS
      </div>
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      preload={preload}
      sizes={sizes}
      className={`object-cover ${className}`}
    />
  );
}

export function SampleNotice({ text }: { text: string }) {
  if (!usingSampleContent) return null;

  return (
    <p className="mx-auto mt-[0.9rem] w-fit max-w-full rounded-[0.3rem] border border-gold/60 px-[0.8rem] py-[0.3rem] text-center text-xs lg:text-[0.62rem]">
      {text}
    </p>
  );
}

type NewsCardProps = {
  article: NewsArticle;
  lang: Locale;
  readMore: string;
  heading?: "h2" | "h3";
};

const coverZoom = "transition-transform duration-500 group-hover:scale-105";

function ReadMore({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-[0.5rem] text-xs font-bold tracking-[0.05em] uppercase lg:text-[0.58rem]">
      {text}
      <ArrowRightIcon className="w-[0.9rem] transition-transform group-hover:translate-x-0.5" />
    </span>
  );
}

export function NewsCard({ article, lang, readMore, heading: Heading = "h2" }: NewsCardProps) {
  return (
    <li>
      <Link
        href={`/${lang}/news/${article.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-[0.3rem] bg-mist transition-shadow hover:shadow-lg"
      >
        <div className="relative aspect-[306/170] overflow-hidden">
          <NewsCover
            image={article.image}
            sizes="(min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
            className={coverZoom}
          />
        </div>
        <div className="flex flex-1 flex-col px-[1rem] pt-[0.8rem] pb-[0.9rem]">
          <NewsMeta article={article} lang={lang} />
          <Heading className="mt-[0.4rem] font-serif text-[1.35rem] leading-[1.25] font-medium lg:text-[1.1rem] lg:leading-[1.4rem] el:font-semibold">
            {article.title}
          </Heading>
          <p className="mt-[0.35rem] mb-[0.8rem] text-sm leading-[1.4] lg:text-[0.72rem] lg:leading-[1.05rem]">
            {article.excerpt}
          </p>
          <span className="mt-auto">
            <ReadMore text={readMore} />
          </span>
        </div>
      </Link>
    </li>
  );
}

export function FeaturedNewsCard({ article, lang, readMore }: Omit<NewsCardProps, "heading">) {
  return (
    <Link
      href={`/${lang}/news/${article.slug}`}
      className="group mt-[1.28rem] flex flex-col overflow-hidden rounded-[0.3rem] bg-mist text-left transition-shadow hover:shadow-lg lg:flex-row"
    >
      <div className="relative aspect-[3/2] overflow-hidden lg:aspect-auto lg:min-h-[16.5rem] lg:w-[52%]">
        <NewsCover
          image={article.image}
          sizes="(min-width: 1024px) 50vw, 100vw"
          preload
          className={coverZoom}
        />
      </div>
      <div className="flex flex-col justify-center px-[1.25rem] py-[1.25rem] lg:w-[48%] lg:px-[1.9rem]">
        <span className="mb-[0.7rem] block h-[0.125rem] w-[1.95rem] bg-gold" />
        <NewsMeta article={article} lang={lang} />
        <h2 className="mt-[0.5rem] font-serif text-[1.7rem] leading-[1.2] font-medium lg:text-[1.5rem] lg:leading-[1.85rem] el:font-semibold">
          {article.title}
        </h2>
        <p className="mt-[0.5rem] mb-[1rem] leading-[1.45] lg:text-[0.81rem] lg:leading-[1.15rem]">
          {article.excerpt}
        </p>
        <ReadMore text={readMore} />
      </div>
    </Link>
  );
}
