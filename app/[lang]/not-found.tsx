import Link from "next/link";
import { lang } from "next/root-params";
import { getDictionary } from "./dictionaries";
import { defaultLocale, hasLocale } from "./locales";

export default async function NotFound() {
  const param = await lang();
  const locale = hasLocale(param) ? param : defaultLocale;
  const { notFound } = await getDictionary(locale);

  return (
    <main className="mx-auto max-w-[40rem] px-5 py-[5rem] text-center">
      <h1 className="font-serif text-[2.1rem] leading-[1.15] font-medium lg:text-[1.97rem] el:font-semibold">
        {notFound.title}
      </h1>
      <p className="mt-[0.5rem] text-base lg:text-[0.9rem]">{notFound.text}</p>
      <Link
        href={`/${locale}`}
        className="mt-[1.25rem] inline-flex h-11 items-center rounded-full bg-navy px-[1.25rem] text-xs font-bold tracking-[0.05em] text-white uppercase transition-colors hover:bg-gold lg:h-[1.85rem] lg:text-[0.6rem]"
      >
        {notFound.link}
      </Link>
    </main>
  );
}
