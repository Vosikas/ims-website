import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Logo, type LogoLink } from "@/components/logo";

type SiteFooterProps = {
  dict: Dictionary["footer"];
  logo: LogoLink;
};

export function SiteFooter({ dict, logo }: SiteFooterProps) {
  return (
    <footer className="bg-navy text-white">
      <div className="flex flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:h-[6.2rem] lg:pt-0 lg:pr-[3.125rem] lg:pb-[0.4rem] lg:pl-[3rem]">
        <Logo
          link={logo}
          dividerClassName="bg-white/40"
          nameClassName="leading-[0.86rem] tracking-[0.13em]"
        />
        <div className="relative lg:top-[0.55rem] sm:text-right">
          <p className="font-script text-[1.65rem] leading-[1.45rem] whitespace-pre-line text-white/85 el:text-[1.5rem] el:leading-[1.65rem] el:italic">
            {dict.tagline}
          </p>
          <span className="mt-[0.3rem] block h-[0.125rem] w-[1.9rem] bg-gold sm:ml-auto" />
        </div>
      </div>
    </footer>
  );
}
