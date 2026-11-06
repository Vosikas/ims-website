"use client";

import type { ReactNode } from "react";
import type { RequestableRole } from "../_lib/api/types";
import { el } from "../_lib/i18n/el";
import { fieldError, fieldHint, fieldLabel } from "../_lib/styles";
import { AlertIcon, CheckIcon, ParentIcon, StudentIcon, TeacherIcon } from "./icons";

const OPTIONS: { role: RequestableRole; icon: ReactNode }[] = [
  { role: "STUDENT", icon: <StudentIcon className="size-6" /> },
  { role: "PARENT", icon: <ParentIcon className="size-6" /> },
  { role: "TEACHER", icon: <TeacherIcon className="size-6" /> },
];

type RoleCardsProps = {
  /** Given to the first radio, so the error summary can move focus to the group. */
  id: string;
  name: string;
  legend: string;
  hint?: string;
  value: RequestableRole | "";
  onChange: (role: RequestableRole) => void;
  onBlur?: () => void;
  error?: string;
};

/** A radio group drawn as cards. Arrow keys move between them, as with any radio group. */
export function RoleCards({
  id,
  name,
  legend,
  hint,
  value,
  onChange,
  onBlur,
  error,
}: RoleCardsProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset aria-describedby={describedBy}>
      <legend className={fieldLabel}>{legend}</legend>
      {hint && (
        <p id={hintId} className={fieldHint}>
          {hint}
        </p>
      )}

      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        {OPTIONS.map(({ role, icon }, index) => (
          <label
            key={role}
            className={`group relative flex cursor-pointer flex-col gap-1 rounded-lg border bg-white p-3 transition-colors hover:border-navy has-checked:border-gold has-checked:bg-gold/10 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-gold ${error ? "border-danger" : "border-field"}`}
          >
            <input
              id={index === 0 ? id : undefined}
              type="radio"
              name={name}
              value={role}
              checked={value === role}
              onChange={() => onChange(role)}
              onBlur={onBlur}
              className="sr-only"
            />
            <span className="text-navy">{icon}</span>
            <span className="font-semibold">{el.roles[role]}</span>
            <span className="text-xs leading-snug text-ink-muted">{el.roleDescriptions[role]}</span>
            <span className="absolute top-2 right-2 hidden size-5 items-center justify-center rounded-full bg-gold text-navy group-has-checked:flex">
              <CheckIcon className="size-3.5" />
            </span>
          </label>
        ))}
      </div>

      {error && (
        <p id={errorId} className={fieldError}>
          <AlertIcon className="mt-px size-4 shrink-0" />
          {error}
        </p>
      )}
    </fieldset>
  );
}
