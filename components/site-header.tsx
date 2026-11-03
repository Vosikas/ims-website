"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, Suspense, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { localeCookie, type Locale } from "@/app/[lang]/locales";
import { CloseIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { Logo, type LogoLink } from "@/components/logo";

const languages = [
  { locale: "el", code: "GR", name: "Ελληνικά" },
  { locale: "en", code: "EN", name: "English" },
] as const;

const oneYearInSeconds = 60 * 60 * 24 * 365;

type LanguageSwitchProps = {
  lang: Locale;
  label: string;
  pathname: string | null;
};

function LanguageSwitch({ lang, label, pathname }: LanguageSwitchProps) {
  // The same page in the other language: "/en/news" becomes "/el/news".
  const pathWithinLanguage = pathname?.slice(lang.length + 1) ?? "";

  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center text-sm tracking-[0.03em] lg:text-[0.62rem]"
    >
      {languages.map(({ locale, code, name }, index) => (
        <Fragment key={locale}>
          {index > 0 && <span className="mx-[0.3rem] h-[0.8rem] w-px bg-navy/50" />}
          {/* A plain link on purpose: a client navigation keeps the previous language's page
              hidden in the DOM, leaving duplicate ids and an empty document title. */}
          <a
            href={`/${locale}${pathWithinLanguage}`}
            hrefLang={locale}
            aria-label={`${code}, ${name}`}
            aria-current={locale === lang ? "true" : undefined}
            onClick={() => {
              document.cookie = `${localeCookie}=${locale}; path=/; max-age=${oneYearInSeconds}; samesite=lax`;
            }}
            className={`p-1 transition-colors hover:text-gold lg:p-0 ${
              locale === lang ? "font-semibold" : ""
            }`}
          >
            {code}
          </a>
        </Fragment>
      ))}
    </div>
  );
}

function SearchButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="cursor-pointer text-gold transition-colors hover:text-navy"
    >
      <SearchIcon className="size-5 lg:size-[0.82rem]" />
    </button>
  );
}

const admissionsClassName =
  "inline-flex items-center justify-center rounded-[0.25rem] bg-gold font-medium text-white transition-colors hover:bg-navy";

type SiteHeaderProps = {
  lang: Locale;
  dict: Dictionary["header"];
  logo: LogoLink;
};

function HeaderWithPathname(props: SiteHeaderProps) {
  return <HeaderContent {...props} pathname={usePathname()} />;
}

// The current path isn't known while prerendering an article that was published after the
// build, so usePathname needs a boundary. Its fallback is the same header without the path.
export function SiteHeader(props: SiteHeaderProps) {
  return (
    <Suspense fallback={<HeaderContent {...props} pathname={null} />}>
      <HeaderWithPathname {...props} />
    </Suspense>
  );
}

function HeaderContent({ lang, dict, logo, pathname }: SiteHeaderProps & { pathname: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const home = logo.href;
  const news = `${home}/news`;
  const navItems = [
    { label: dict.nav.home, href: home, current: pathname === home },
    { label: dict.nav.about, href: `${home}#about` },
    { label: dict.nav.pathways, href: `${home}#pathways` },
    { label: dict.nav.schoolLife, href: `${home}#school-life` },
    { label: dict.nav.newsEvents, href: news, current: pathname?.startsWith(news) },
    { label: dict.nav.contact, href: "#contact" },
  ];

  return (
    <header className="relative z-30 bg-white">
      <div className="flex h-[4.6875rem] items-center px-5 lg:pr-[3.0625rem] lg:pl-[3rem]">
        <Logo link={logo} />

        <nav
          aria-label={dict.nav.label}
          className="relative top-[0.61rem] ml-[3.58rem] hidden lg:block el:ml-[2.2rem]"
        >
          <ul className="flex gap-[0.96rem] el:gap-[0.62rem]">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={`block border-b-2 pb-[0.3rem] text-[0.592rem] font-medium whitespace-nowrap transition-colors hover:border-gold ${
                    item.current ? "border-gold" : "border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative top-[0.1rem] ml-auto hidden items-center lg:flex">
          <LanguageSwitch lang={lang} label={dict.language} pathname={pathname} />
          <span className="mr-[0.9rem] ml-[0.8rem] h-[0.9rem] w-px bg-navy/20" />
          <SearchButton label={dict.search} />
          <Link
            href="#contact"
            className={`${admissionsClassName} ml-[1.35rem] h-[2.25rem] w-[5.375rem] text-[0.62rem]`}
          >
            {dict.admissions}
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? dict.closeMenu : dict.openMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="ml-auto cursor-pointer p-1 lg:hidden"
        >
          {menuOpen ? <CloseIcon className="size-7" /> : <MenuIcon className="size-7" />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-t border-line bg-white px-5 pb-6 shadow-lg lg:hidden"
        >
          <nav aria-label={dict.nav.label}>
            <ul className="divide-y divide-line">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-3 font-medium ${item.current ? "text-gold" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-4 flex items-center gap-5">
            <LanguageSwitch lang={lang} label={dict.language} pathname={pathname} />
            <SearchButton label={dict.search} />
            <Link
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className={`${admissionsClassName} ml-auto h-11 px-6 text-sm`}
            >
              {dict.admissions}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
