import { env, isMockMode } from "./config/env";
import { routes } from "./routes";

export type RedirectTarget = { kind: "page"; path: string } | { kind: "external"; url: string };

// BACKEND-NEEDED[redirect]: ο backend φτιάχνει το redirectUrl από το `app` και μια δική του λίστα.
// Πότε: μετά από επιτυχημένο login ή continue. Το frontend απλώς το ακολουθεί, αν το επιτρέπει
// η λίστα NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS. Συμβόλαιο: docs/panhellenic/API_CONTRACT.md#redirect
/**
 * Decides whether the browser may follow a redirectUrl, and how. Anything that isn't on the
 * allow-list is refused, so a compromised or misconfigured answer can't send users to another site.
 */
export function resolveRedirect(redirectUrl: string): RedirectTarget | null {
  let url: URL;
  try {
    url = new URL(redirectUrl, window.location.origin);
  } catch {
    return null;
  }

  // The mock sends users to the preview page here instead of the real eClass.
  if (isMockMode && url.origin === window.location.origin && url.pathname === routes.devRedirect) {
    return { kind: "page", path: `${url.pathname}${url.search}` };
  }

  const isWebProtocol = url.protocol === "https:" || url.protocol === "http:";
  if (isWebProtocol && env.allowedRedirectOrigins.includes(url.origin)) {
    return { kind: "external", url: url.toString() };
  }

  return null;
}
