"use client";

import type { ButtonHTMLAttributes } from "react";
import { buttonClasses, type ButtonVariant } from "../_lib/styles";
import { Spinner } from "./Spinner";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  /** While true the button shows a spinner and the caller must ignore further clicks. */
  loading?: boolean;
  loadingLabel?: string;
};

export function Button({
  variant = "primary",
  loading = false,
  loadingLabel,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      // aria-disabled rather than disabled, so focus stays on the button while it works.
      aria-disabled={loading || undefined}
      className={buttonClasses(variant, className)}
      {...rest}
    >
      {loading && <Spinner />}
      <span>{loading && loadingLabel ? loadingLabel : children}</span>
    </button>
  );
}
