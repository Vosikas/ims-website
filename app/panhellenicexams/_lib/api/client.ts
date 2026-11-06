import { API_BASE } from "../routes";
import { ApiError, type FieldErrors } from "./errors";
import type { ApiErrorCode, BackendErrorCode } from "./types";

const TIMEOUT_MS = 10_000;

const BACKEND_CODES: readonly BackendErrorCode[] = [
  "VALIDATION_ERROR",
  "UNAUTHENTICATED",
  "INVALID_CREDENTIALS",
  "ACCOUNT_PENDING",
  "ACCOUNT_LOCKED",
  "TOO_MANY_ATTEMPTS",
  "EMAIL_TAKEN",
  "CSRF_INVALID",
];

function isBackendCode(value: unknown): value is BackendErrorCode {
  return BACKEND_CODES.some((code) => code === value);
}

function readCookie(name: string): string | undefined {
  const entry = document.cookie.split("; ").find((cookie) => cookie.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : undefined;
}

function toApiError(response: Response, body: unknown): ApiError {
  const data = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};

  let code: ApiErrorCode;
  if (isBackendCode(data.code)) code = data.code;
  else if (response.status === 401) code = "UNAUTHENTICATED";
  // The backend always sends a JSON body with its errors (API_CONTRACT.md). A 5xx without one
  // comes from the site's proxy in front of it, usually because the backend isn't running.
  else if (response.status >= 500 && body === null) code = "NETWORK_ERROR";
  else code = "UNKNOWN";

  const fieldErrors =
    typeof data.fieldErrors === "object" && data.fieldErrors !== null
      ? (data.fieldErrors as FieldErrors)
      : {};

  const retryAfter = Number(response.headers.get("Retry-After"));
  return new ApiError(
    response.status,
    code,
    fieldErrors,
    Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : undefined,
  );
}

export async function apiRequest<T>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (method !== "GET") {
    // BACKEND-NEEDED[csrf]: ο backend δίνει CSRF token και το ελέγχει σε κάθε POST.
    // Πότε: σε κάθε login, signup, continue και logout. Η προσωρινή υπόθεση είναι cookie
    // XSRF-TOKEN που το frontend στέλνει πίσω στο header X-CSRF-Token. Ο backend αποφασίζει.
    // Συμβόλαιο: docs/panhellenic/API_CONTRACT.md#csrf
    const csrfToken = readCookie("XSRF-TOKEN");
    if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      // The session lives in an httpOnly cookie that only the backend can read or set.
      credentials: "include",
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR");
  } finally {
    window.clearTimeout(timer);
  }

  if (response.status === 204) return undefined as T;

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) throw toApiError(response, data);
  return data as T;
}
