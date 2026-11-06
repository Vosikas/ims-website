import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";
import { getDictionary } from "./dictionaries";
import { hasLocale, locales } from "./locales";

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

  // The header and footer live here so there's only ever one of each, as visited pages stay
  // hidden in the DOM.
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
