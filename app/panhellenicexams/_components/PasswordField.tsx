"use client";

import { useState, type KeyboardEvent } from "react";
import { el } from "../_lib/i18n/el";
import { EyeIcon, EyeOffIcon } from "./icons";
import { TextField, type TextFieldProps } from "./TextField";

type PasswordFieldProps = Omit<TextFieldProps, "type" | "trailing" | "below">;

/** A password input with a show/hide button and a Caps Lock warning. */
export function PasswordField({ onBlur, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const detectCapsLock = (event: KeyboardEvent<HTMLInputElement>) =>
    setCapsLock(event.getModifierState("CapsLock"));

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      onKeyDown={detectCapsLock}
      onKeyUp={detectCapsLock}
      onBlur={(event) => {
        setCapsLock(false);
        onBlur?.(event);
      }}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={el.fields.showPassword}
          aria-pressed={visible}
          aria-controls={props.id}
          className="flex size-10 items-center justify-center rounded-md text-ink-muted hover:text-navy"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
      below={
        // Always rendered, so screen readers announce the warning when it appears.
        <p
          role="status"
          className={capsLock ? "mt-1.5 text-sm font-medium text-amber-800" : "sr-only"}
        >
          {capsLock ? el.fields.capsLock : ""}
        </p>
      }
    />
  );
}
