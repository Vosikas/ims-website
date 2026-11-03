import { cacheLife, cacheTag } from "next/cache";
import type { Locale } from "@/app/[lang]/locales";
import { getSampleArticles } from "@/lib/news-samples";

/*
 * The only place the site reads news from. It serves sample articles for now.
 *
 * To connect WordPress, replace the bodies of the two functions below with calls to its
 * REST API (/wp-json/wp/v2/posts?_embed) and set usingSampleContent to false. NewsArticle
 * follows that API's fields, so no page or component needs to change:
 *
 *   slug         slug
 *   title        title.rendered, with HTML entities decoded
 *   excerpt      excerpt.rendered, as plain text
 *   date         date_gmt
 *   category     _embedded["wp:term"][0][0].name
 *   image        _embedded["wp:featuredmedia"][0]: source_url and alt_text
 *   contentHtml  content.rendered
 *
 * Also add the WordPress host to images.remotePatterns in next.config.ts. Cached results
 * refresh every 15 minutes; revalidateTag("news") from a publish webhook makes it instant.
 */

export type NewsImage = {
  src: string;
  alt: string;
};

export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string | null;
  image: NewsImage | null;
  contentHtml: string;
};

export const usingSampleContent = true;

// Newest first.
export async function getNewsArticles(locale: Locale): Promise<NewsArticle[]> {
  "use cache";
  cacheLife("default");
  cacheTag("news");

  return getSampleArticles(locale);
}

export async function getNewsArticle(locale: Locale, slug: string): Promise<NewsArticle | null> {
  "use cache";
  cacheLife("default");
  cacheTag("news");

  return getSampleArticles(locale).find((article) => article.slug === slug) ?? null;
}
