// Class lists shared by several components of the login. The colours are the site's (globals.css).

export const fieldLabel = "block text-sm font-semibold text-navy";

export const fieldHint = "mt-1 text-sm text-ink-muted";

export const fieldInput =
  "block w-full rounded-md border border-field bg-white px-3.5 py-2.5 text-base text-navy shadow-xs transition-colors hover:border-navy focus:border-navy disabled:cursor-not-allowed disabled:border-line disabled:bg-mist disabled:text-ink-muted aria-invalid:border-danger";

export const fieldError = "mt-1.5 flex items-start gap-1.5 text-sm font-medium text-danger";

export const textLink =
  "font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:decoration-navy";

export type ButtonVariant = "primary" | "secondary";

const BUTTON_BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-wait";

// Navy on the brand gold is 4.6:1, which passes WCAG AA; white on gold would not.
const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-gold text-navy hover:bg-gold-light",
  secondary: "border border-navy bg-white text-navy hover:bg-mist",
};

/** Shared by <Button> and by links that should look like buttons. */
export function buttonClasses(variant: ButtonVariant = "primary", extra = ""): string {
  return [BUTTON_BASE, BUTTON_VARIANTS[variant], extra].filter(Boolean).join(" ");
}
