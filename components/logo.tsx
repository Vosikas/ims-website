import Link from "next/link";

export type LogoLink = {
  href: string;
  label: string;
};

type LogoProps = {
  link: LogoLink;
  dividerClassName?: string;
  nameClassName?: string;
};

export function Logo({
  link,
  dividerClassName = "bg-gold/70",
  nameClassName = "leading-[0.82rem] tracking-[0.09em] lg:text-[0.555rem]",
}: LogoProps) {
  return (
    <Link href={link.href} aria-label={link.label} className="inline-flex items-center">
      <span className="font-display text-[3.03rem] leading-none font-semibold tracking-[0.01em]">
        IMS
      </span>
      <span className={`mx-[0.5rem] h-[2.25rem] w-px ${dividerClassName}`} />
      <span className={`font-brand text-[0.62rem] uppercase ${nameClassName}`}>
        International
        <br />
        Metropolitan
        <br />
        School
      </span>
    </Link>
  );
}
