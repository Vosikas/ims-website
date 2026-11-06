import { ApiError, errorCode } from "./api/errors";
import { el } from "./i18n/el";

/** The text shown for an error. Never the backend's own message, only ours for its code. */
export function apiErrorMessage(error: unknown): string {
  const code = errorCode(error);
  if (code === "TOO_MANY_ATTEMPTS" && error instanceof ApiError && error.retryAfterSeconds) {
    return el.tooManyAttemptsIn(Math.max(1, Math.ceil(error.retryAfterSeconds / 60)));
  }
  return el.apiErrors[code];
}
