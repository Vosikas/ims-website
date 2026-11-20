import Image from "next/image";
import Link from "next/link";
import colorLogo from "@/public/images/brand/ims-logo.png";
import whiteLogo from "@/public/images/brand/ims-logo-white.png";

export type LogoLink = {
  href: string;
  label: string;
};

type LogoProps = {
  link: LogoLink;
  /** The colour logo for light backgrounds, the white one for the navy footer. */
  variant?: "color" | "white";
  className?: string;
};

// The school's official logo, with the IB World School mark, as on ims.edu.gr.
export function Logo({ link, variant = "color", className = "h-[2.9rem] lg:h-[3.2rem]" }: LogoProps) {
  const logo = variant === "white" ? whiteLogo : colorLogo;
  return (
    <Link href={link.href} aria-label={link.label} className="inline-flex shrink-0 items-center">
      <Image src={logo} alt="" preload={variant === "color"} sizes="12rem" className={`w-auto ${className}`} />
    </Link>
  );
}
