export type ApiMode = "mock" | "real";

const DEFAULT_ECLASS_URL = "http://ims-eclass.local";

/** Keeps only valid origins, so "http://ims-eclass.local/" and "http://ims-eclass.local" compare equal. */
function parseOrigins(value: string | undefined): string[] {
  const entries = (value ?? DEFAULT_ECLASS_URL).split(",");
  return entries.flatMap((entry) => {
    try {
      return [new URL(entry.trim()).origin];
    } catch {
      return [];
    }
  });
}

// NEXT_PUBLIC_ variables are written into the browser code at build time, so each one must be
// read by its full name. They are listed, with their defaults, in docs/panhellenic/README.md.
export const env = {
  apiMode: (process.env.NEXT_PUBLIC_PANHELLENIC_API_MODE === "real" ? "real" : "mock") as ApiMode,
  eclassUrl: process.env.NEXT_PUBLIC_ECLASS_URL || DEFAULT_ECLASS_URL,
  allowedRedirectOrigins: parseOrigins(process.env.NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS),
  // On by default while developing, and never in a production build whatever the setting says.
  showBackendNotes:
    process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_SHOW_BACKEND_NOTES !== "false",
};

export const isMockMode = env.apiMode === "mock";
