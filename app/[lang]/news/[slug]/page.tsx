import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "@/components/icons";
import { NewsCard, NewsCover, NewsMeta, SampleNotice } from "@/components/news";
import { getNewsArticle, getNewsArticles } from "@/lib/news";
import { getDictionary } from "../../dictionaries";
import { hasLocale } from "../../locales";

const moreArticlesCount = 3;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!hasLocale(params.lang)) return [];
  const articles = await getNewsArticles(params.lang);
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Pick<PageProps<"/[lang]/news/[slug]">, "params">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const article = await getNewsArticle(lang, slug);
  if (!article) return {};
  return { title: `${article.title} | IMS`, description: article.excerpt };
}

export default async function NewsArticlePage({ params }: PageProps<"/[lang]/news/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const article = await getNewsArticle(lang, slug);
  if (!article) notFound();

  const { news } = await getDictionary(lang);
  const moreArticles = (await getNewsArticles(lang))
    .filter((other) => other.slug !== slug)
    .slice(0, moreArticlesCount);

  return (
    <main className="mx-auto max-w-[64rem] px-5 pt-[1.5rem] pb-[3rem] lg:pr-[2.5625rem] lg:pl-[2.8125rem]">
      <article className="mx-auto max-w-[40rem]">
        <Link
          href={`/${lang}/news`}
          className="group inline-flex items-center gap-[0.5rem] text-xs font-bold tracking-[0.05em] uppercase lg:text-[0.58rem]"
        >
          <ArrowRightIcon className="w-[0.9rem] rotate-180 transition-transform group-hover:-translate-x-0.5" />
          {news.back}
        </Link>
        <SampleNotice text={news.sampleNotice} />

        <div className="mt-[1.1rem]">
          <NewsMeta article={article} lang={lang} />
        </div>
        <h1 className="mt-[0.5rem] font-serif text-[2.1rem] leading-[1.15] font-medium lg:text-[1.97rem] lg:leading-[2.4rem] el:font-semibold">
          {article.title}
        </h1>
        <div className="relative mt-[1rem] aspect-[16/9] overflow-hidden rounded-[0.3rem]">
          <NewsCover image={article.image} sizes="(min-width: 1024px) 63vw, 100vw" preload />
        </div>
        {/* Written in the school's own CMS, not by site visitors. */}
        <div
          className="article-content mt-[1.25rem]"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      </article>

      {moreArticles.length > 0 && (
        <section className="mt-[2.5rem] border-t border-line pt-[1.5rem]">
          <h2 className="text-center font-serif text-[1.7rem] font-medium lg:text-[1.5rem] el:font-semibold">
            {news.more}
          </h2>
          <ul className="mt-[1rem] grid gap-[0.55rem] sm:grid-cols-2 lg:grid-cols-3">
            {moreArticles.map((other) => (
              <NewsCard
                key={other.slug}
                article={other}
                lang={lang}
                readMore={news.readMore}
                heading="h3"
              />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
