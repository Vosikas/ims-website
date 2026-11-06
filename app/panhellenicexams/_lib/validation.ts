import type { FieldErrorCode } from "./api/types";
import { PASSWORD_POLICY } from "./config/passwordPolicy";

// A light check for typing mistakes only. The backend decides what counts as a valid address.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRequired(value: string): FieldErrorCode | undefined {
  return value.trim() ? undefined : "REQUIRED";
}

export function validateEmail(value: string): FieldErrorCode | undefined {
  const email = value.trim();
  if (!email) return "REQUIRED";
  return EMAIL_PATTERN.test(email) ? undefined : "INVALID_EMAIL";
}

export function validateNewPassword(value: string): FieldErrorCode | undefined {
  if (!value) return "REQUIRED";
  if (value.length < PASSWORD_POLICY.minLength) return "TOO_SHORT";
  if (value.length > PASSWORD_POLICY.maxLength) return "TOO_LONG";
  return undefined;
}

export function validateConfirmation(
  password: string,
  confirmation: string,
): FieldErrorCode | undefined {
  if (!confirmation) return "REQUIRED";
  return password === confirmation ? undefined : "MISMATCH";
}
