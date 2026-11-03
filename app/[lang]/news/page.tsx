import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeaturedNewsCard, NewsCard, SampleNotice } from "@/components/news";
import { SectionHeading } from "@/components/section-heading";
import { getNewsArticles } from "@/lib/news";
import { getDictionary } from "../dictionaries";
import { hasLocale } from "../locales";

export async function generateMetadata({
  params,
}: Pick<PageProps<"/[lang]/news">, "params">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { news } = await getDictionary(lang);
  return { title: news.metaTitle, description: news.intro };
}

export default async function NewsPage({ params }: PageProps<"/[lang]/news">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { news } = await getDictionary(lang);
  const [featured, ...others] = await getNewsArticles(lang);

  return (
    <main className="mx-auto max-w-[64rem] px-5 pt-[1.75rem] pb-[3rem] text-center lg:pr-[2.5625rem] lg:pl-[2.8125rem]">
      <SectionHeading as="h1" eyebrow={news.eyebrow} title={news.title} intro={news.intro} />
      <SampleNotice text={news.sampleNotice} />

      {featured ? (
        <FeaturedNewsCard article={featured} lang={lang} readMore={news.readMore} />
      ) : (
        <p className="mt-[2rem] text-base lg:text-[0.9rem]">{news.empty}</p>
      )}

      {others.length > 0 && (
        <ul className="mt-[0.55rem] grid gap-[0.55rem] text-left sm:grid-cols-2 lg:grid-cols-3">
          {others.map((article) => (
            <NewsCard key={article.slug} article={article} lang={lang} readMore={news.readMore} />
          ))}
        </ul>
      )}
    </main>
  );
}
