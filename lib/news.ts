import { cacheLife, cacheTag } from "next/cache";
import type { Locale } from "@/app/[lang]/locales";

/*
 * News comes from the school's official WordPress at ims.edu.gr, through its REST API.
 * Whatever the school publishes there as a post shows up here within 15 minutes;
 * revalidateTag("news") from a publish webhook makes it instant.
 *
 * WordPress keeps each language apart (WPML). Until the school has published a post in a
 * language, that language's pages show the posts of the main language, English, so the
 * page is never empty while there is news to show.
 */

export const newsSource = "https://ims.edu.gr";
const newsLanguage: Locale = "en";
const postsUrl = `${newsSource}/wp-json/wp/v2/posts`;

// The only images next/image may load from the school's site (see next.config.ts).
const imageHost = "ims.edu.gr";
const imagePath = "/wp-content/uploads/";

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
  // The post on ims.edu.gr.
  link: string;
  // The language it is written in, which can differ from the page's.
  language: Locale;
};

type WpTerm = { taxonomy: string; slug: string; name: string };

type WpPost = {
  slug: string;
  date_gmt: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:term"?: WpTerm[][];
    "wp:featuredmedia"?: { source_url?: string; alt_text?: string }[];
  };
};

// Newest first.
export async function getNewsArticles(locale: Locale): Promise<NewsArticle[]> {
  "use cache";
  cacheLife("default");
  cacheTag("news");

  return findPosts(locale, {});
}

export async function getNewsArticle(locale: Locale, slug: string): Promise<NewsArticle | null> {
  "use cache";
  cacheLife("default");
  cacheTag("news");

  const [article] = await findPosts(locale, { slug });
  return article ?? null;
}

async function findPosts(locale: Locale, query: Record<string, string>): Promise<NewsArticle[]> {
  const own = await fetchPosts({ ...query, lang: locale });
  if (own.length > 0 || locale === newsLanguage) {
    return own.map((post) => toArticle(post, locale));
  }
  const main = await fetchPosts({ ...query, lang: newsLanguage });
  return main.map((post) => toArticle(post, newsLanguage));
}

// A school site that is down or slow leaves the news empty rather than breaking the page.
async function fetchPosts(query: Record<string, string>): Promise<WpPost[]> {
  const url = new URL(postsUrl);
  url.search = new URLSearchParams({ _embed: "wp:term,wp:featuredmedia", per_page: "30", ...query }).toString();
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return [];
    const posts: unknown = await response.json();
    return Array.isArray(posts) ? (posts as WpPost[]) : [];
  } catch {
    return [];
  }
}

function toArticle(post: WpPost, language: Locale): NewsArticle {
  const category = post._embedded?.["wp:term"]
    ?.flat()
    .find((term) => term.taxonomy === "category" && term.slug !== "uncategorized");
  return {
    slug: post.slug,
    title: plainText(post.title.rendered),
    excerpt: plainText(post.excerpt.rendered).replace(/\s*\[…\]$/, "…"),
    date: post.date_gmt.endsWith("Z") ? post.date_gmt : `${post.date_gmt}Z`,
    category: category ? plainText(category.name) : null,
    image: toImage(post._embedded?.["wp:featuredmedia"]?.[0]),
    contentHtml: tidyHtml(post.content.rendered),
    link: post.link,
    language,
  };
}

function toImage(media: { source_url?: string; alt_text?: string } | undefined): NewsImage | null {
  if (!media?.source_url) return null;
  const url = new URL(media.source_url, newsSource);
  // An image kept anywhere else would make next/image fail, so the post shows the IMS tile instead.
  if (url.protocol !== "https:" || url.hostname !== imageHost || !url.pathname.startsWith(imagePath)) {
    return null;
  }
  return { src: url.href, alt: plainText(media.alt_text ?? "") };
}

/*
 * The posts are written in the school's own WordPress, not by visitors. This only drops what
 * the page can't use (scripts, styles, inline handlers) and points the post's own relative
 * links and images at ims.edu.gr. It is a tidy-up, not a sanitiser for untrusted HTML.
 */
function tidyHtml(html: string): string {
  return html
    .replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, "")
    .replace(/\s(href|src)\s*=\s*(["'])\/(?!\/)/gi, ` $1=$2${newsSource}/`)
    .trim();
}

const namedEntities: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  laquo: "«",
  raquo: "»",
};

// WordPress sends titles and excerpts as HTML; the site shows them as text.
function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (entity, name: string) => namedEntities[name.toLowerCase()] ?? entity)
    .replace(/\s+/g, " ")
    .trim();
}
