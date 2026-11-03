import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-navy text-white">
      <div className="flex flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:h-[6.2rem] lg:pt-0 lg:pr-[3.125rem] lg:pb-[0.4rem] lg:pl-[3rem]">
        <Logo dividerClassName="bg-white/40" nameClassName="leading-[0.86rem] tracking-[0.13em]" />
        <div className="relative lg:top-[0.55rem] sm:text-right">
          <p className="font-script text-[1.65rem] leading-[1.45rem] text-white/85">
            A world of opportunities
            <br />
            starts here.
          </p>
          <span className="mt-[0.3rem] block h-[0.125rem] w-[1.9rem] bg-gold sm:ml-auto" />
        </div>
      </div>
    </footer>
  );
}
