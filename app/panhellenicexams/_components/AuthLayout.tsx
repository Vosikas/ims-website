import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import generalLyceum from "@/public/images/home/general-lyceum.jpg";
import { el } from "../_lib/i18n/el";
import { routes } from "../_lib/routes";
import { ArrowLeftIcon } from "./icons";
import { MockBadge } from "./MockBadge";

type AuthLayoutProps = {
  title: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
};

const logoLink = { href: routes.website, label: el.layout.logoLabel };

/** Navy brand panel beside the page on wider screens, a navy band above it on phones. */
export function AuthLayout({ title, subtitle, icon, children }: AuthLayoutProps) {
  const t = el.layout;

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-cols-2">
      {/* The header runs the full height of the page; its content stays in view while the form scrolls. */}
      <header className="bg-navy text-white">
        <div className="flex h-[4.6875rem] items-center justify-between gap-4 px-5 md:hidden">
          <Logo link={logoLink} />
          <p className="text-right text-[0.7rem] font-semibold tracking-[0.12em] text-gold uppercase">
            {t.platform}
          </p>
        </div>

        <div className="relative isolate hidden h-dvh flex-col justify-between overflow-hidden p-10 md:sticky md:top-0 md:flex lg:p-14">
          <Image
            src={generalLyceum}
            alt=""
            fill
            placeholder="blur"
            sizes="50vw"
            className="-z-20 object-cover opacity-25"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-navy/80 via-navy/90 to-navy" />
          <Logo link={logoLink} />
          <div>
            <span className="block h-px w-16 bg-gold" />
            <p className="mt-6 font-script text-4xl leading-tight italic lg:text-5xl">
              {t.taglineFirst}
              <br />
              {t.taglineSecond}
            </p>
            <p className="mt-6 text-sm font-semibold tracking-[0.16em] text-gold uppercase">
              {t.platform} · {t.lyceum}
            </p>
          </div>
          <p className="text-xs text-white/60">{t.schoolName}</p>
        </div>
      </header>

      <main className="flex flex-col px-4 pt-4 pb-10 md:min-h-dvh md:px-10 lg:px-16">
        <div className="flex justify-end">
          <Link
            href={routes.website}
            className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-navy underline-offset-4 hover:underline"
          >
            <ArrowLeftIcon className="size-4" />
            {t.backToSite}
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          {icon}
          <h1 className="font-serif text-3xl leading-tight font-semibold md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-ink-muted">{subtitle}</p>}
          {children}
        </div>
      </main>

      <MockBadge />
    </div>
  );
}
