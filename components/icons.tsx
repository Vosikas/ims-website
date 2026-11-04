import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 16" strokeWidth={1.4} {...props}>
      <path d="M1.5 8h21M16 1.5 22.5 8 16 14.5" />
    </Icon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 14" strokeWidth={1.4} {...props}>
      <path d="m1.5 1.5 10.5 11 10.5-11" />
    </Icon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" strokeWidth={1.6} {...props}>
      <path d="M3 6.5h18M3 12h18M3 17.5h18" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" strokeWidth={1.6} {...props}>
      <path d="m5 5 14 14M19 5 5 19" />
    </Icon>
  );
}

export function GraduationCapIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 56 42" strokeWidth={1.7} {...props}>
      <path d="M27 3 54 14 27 25 2 14Z" />
      <path d="M12 19v11c0 3 7 7 15 7s15-4 15-7V19" />
      <path d="M26 13.5 47.5 18v10" />
      <rect x="46" y="28" width="3.2" height="11" rx="1.6" />
    </Icon>
  );
}

export function CommunityIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 48 44" strokeWidth={1.7} {...props}>
      <circle cx="24" cy="9.5" r="6.5" />
      <circle cx="9" cy="14" r="4.5" />
      <circle cx="39" cy="14" r="4.5" />
      <path d="M12 42v-8c0-7 5.5-12 12-12s12 5 12 12v8Z" />
      <path d="M12.5 22.5c-1.1-.3-2.3-.5-3.5-.5-4.5 0-7.5 3.5-7.5 8.5V37H12" />
      <path d="M35.5 22.5c1.1-.3 2.3-.5 3.5-.5 4.5 0 7.5 3.5 7.5 8.5V37H36" />
    </Icon>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 44 44" strokeWidth={1.6} {...props}>
      <circle cx="22" cy="22" r="20" />
      <ellipse cx="22" cy="22" rx="9.5" ry="20" />
      <path d="M22 2v40M2 22h40" />
      <path d="M5.5 11c5 2.700 10.500 4 16.500 4s11.500-1.300 16.500-4" />
      <path d="M5.500 33c5-2.700 10.500-4 16.500-4s11.500 1.300 16.500 4" />
    </Icon>
  );
}

export function LeavesIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 46 44" strokeWidth={1.7} {...props}>
      <path d="M22 42V29" />
      <path d="M22 37C10 37 1 28 1 12c12 0 21 10 21 25Z" />
      <path d="M22 29c-1-13 7-23 22-27 1.500 14-6 26-22 27Z" />
      <path d="m22 29 11-15" />
    </Icon>
  );
}
