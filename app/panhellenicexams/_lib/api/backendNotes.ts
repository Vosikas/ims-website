import { PASSWORD_POLICY } from "../config/passwordPolicy";

/** One entry per BACKEND-NEEDED[id] in the code and per section in docs/panhellenic/API_CONTRACT.md. */
export type BackendNoteId =
  | "session"
  | "continue"
  | "login"
  | "signup-registry"
  | "signup-verify"
  | "signup-resend"
  | "signup-complete"
  | "logout"
  | "csrf"
  | "redirect"
  | "password-policy"
  | "forgot-password";

interface BackendNoteInfo {
  endpoint: string;
  when: string;
}

export const BACKEND_NOTES: Record<BackendNoteId, BackendNoteInfo> = {
  session: {
    endpoint: "GET /api/auth/session",
    when: "Μόλις ανοίγει η σελίδα σύνδεσης: υπάρχει ήδη session;",
  },
  continue: {
    endpoint: "POST /api/auth/continue",
    when: "Αν υπάρχει session: νέο redirectUrl χωρίς ξανά login.",
  },
  login: {
    endpoint: "POST /api/auth/login",
    when: "Πατάτε «Σύνδεση»: έλεγχος αριθμού μητρώου και κωδικού, cookie session και redirectUrl.",
  },
  "signup-registry": {
    endpoint: "POST /api/auth/signup/registry",
    when: "Βήμα 1: αντιστοίχιση με το pool αριθμών μητρώου και αποστολή κωδικού στο email του σχολείου.",
  },
  "signup-verify": {
    endpoint: "POST /api/auth/signup/verify",
    when: "Βήμα 2: έλεγχος του κωδικού επιβεβαίωσης.",
  },
  "signup-resend": {
    endpoint: "POST /api/auth/signup/resend",
    when: "Βήμα 2: νέος κωδικός, με όριο αποστολών.",
  },
  "signup-complete": {
    endpoint: "POST /api/auth/signup/complete",
    when: "Βήμα 3: αποθήκευση email και κωδικού στη βάση.",
  },
  logout: {
    endpoint: "POST /api/auth/logout",
    when: "Πατάτε «Αποσύνδεση»: ο backend σβήνει το session.",
  },
  csrf: {
    endpoint: "Header X-CSRF-Token",
    when: "Σε κάθε POST: ο backend δίνει το token και το ελέγχει.",
  },
  redirect: {
    endpoint: "redirectUrl → eClass",
    when: "Μετά τη σύνδεση: διεύθυνση του eClass με κωδικό μίας χρήσης.",
  },
  "password-policy": {
    endpoint: "Κανόνας κωδικού",
    when: `Ίδιος σε frontend και backend. Προτεινόμενος: τουλάχιστον ${PASSWORD_POLICY.minLength} χαρακτήρες.`,
  },
  "forgot-password": {
    endpoint: "Φάση 2",
    when: "Επαναφορά κωδικού με σύνδεσμο στο email. Δεν υπάρχει ακόμα.",
  },
};
