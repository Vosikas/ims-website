/** Every page of the Panhellenic exams login, plus where it sends people back to. */
export const routes = {
  login: "/panhellenicexams",
  signup: "/panhellenicexams/signup",
  pending: "/panhellenicexams/signup/pending",
  forgotPassword: "/panhellenicexams/forgot-password",
  /** Mock mode only: stands in for the eClass. */
  devRedirect: "/panhellenicexams/dev/redirect",
  website: "/el",
} as const;

/** Proxied to the backend's /api by next.config.ts, so the browser sees one origin. */
export const API_BASE = "/panhellenicexams/api";
