"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { el } from "../_lib/i18n/el";
import { fieldError, fieldHint, fieldInput, fieldLabel } from "../_lib/styles";
import { AlertIcon } from "./icons";

export type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "value" | "onChange" | "children"
> & {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  error?: string;
  hint?: ReactNode;
  /** Shown inside the input, at its right edge (e.g. the show-password button). */
  trailing?: ReactNode;
  /** Shown under the input, before the error. */
  below?: ReactNode;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  trailing,
  below,
  className,
  required,
  ...inputProps
}: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className={fieldLabel}>
        {label}
        {required && <span className="sr-only"> {el.fields.required}</span>}
      </label>
      {hint && (
        <p id={hintId} className={fieldHint}>
          {hint}
        </p>
      )}
      <div className="relative mt-1.5">
        <input
          id={id}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          readOnly={!onChange}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${fieldInput} ${trailing ? "pr-12" : ""}`}
          {...inputProps}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-1">{trailing}</div>
        )}
      </div>
      {below}
      {error && (
        <p id={errorId} className={fieldError}>
          <AlertIcon className="mt-px size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
