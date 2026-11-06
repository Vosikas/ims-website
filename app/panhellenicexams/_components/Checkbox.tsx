"use client";

import type { ReactNode } from "react";
import { fieldError } from "../_lib/styles";
import { AlertIcon } from "./icons";

type CheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
  error?: string;
  children: ReactNode;
};

export function Checkbox({ id, checked, onChange, onBlur, error, children }: CheckboxProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-navy">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-gold"
        />
        <span>{children}</span>
      </label>
      {error && (
        <p id={errorId} className={fieldError}>
          <AlertIcon className="mt-px size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
