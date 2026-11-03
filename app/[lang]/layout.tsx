import type { Metadata } from "next";
import {
  Commissioner,
  EB_Garamond,
  Figtree,
  Newsreader,
  Playfair_Display,
  Sacramento,
  Source_Serif_4,
} from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "../globals.css";
import { getDictionary } from "./dictionaries";
import { hasLocale, locales } from "./locales";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

// The rest are each used by one language only (see globals.css), so they aren't preloaded.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  preload: false,
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const commissioner = Commissioner({
  variable: "--font-commissioner",
  subsets: ["greek", "latin"],
  preload: false,
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["greek", "latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  preload: false,
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["greek", "latin"],
  style: "italic",
  preload: false,
});

const fontVariables = [figtree, playfair, newsreader, sacramento, commissioner, sourceSerif, garamond]
  .map((font) => font.variable)
  .join(" ");

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Pick<LayoutProps<"/[lang]">, "params">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { metadata } = await getDictionary(lang);
  return metadata;
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const logo = { href: `/${lang}`, label: dict.logo.label };

  // The header and footer live here so there's only ever one of each: visited pages stay
  // hidden in the DOM, and a footer per page would duplicate the #contact id.
  return (
    <html lang={lang} data-scroll-behavior="smooth" className={`${fontVariables} antialiased`}>
      <body className="bg-white font-sans text-navy">
        <SiteHeader lang={lang} dict={dict.header} logo={logo} />
        {children}
        <SiteFooter dict={dict.footer} logo={logo} />
      </body>
    </html>
  );
}
