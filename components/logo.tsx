import Link from "next/link";

type LogoProps = {
  dividerClassName?: string;
  nameClassName?: string;
};

export function Logo({
  dividerClassName = "bg-gold/70",
  nameClassName = "leading-[0.82rem] tracking-[0.09em] lg:text-[0.555rem]",
}: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="IMS International Metropolitan School, home"
      className="inline-flex items-center"
    >
      <span className="font-display text-[3.03rem] leading-none font-semibold tracking-[0.01em]">
        IMS
      </span>
      <span className={`mx-[0.5rem] h-[2.25rem] w-px ${dividerClassName}`} />
      <span className={`text-[0.62rem] uppercase ${nameClassName}`}>
        International
        <br />
        Metropolitan
        <br />
        School
      </span>
    </Link>
  );
}
