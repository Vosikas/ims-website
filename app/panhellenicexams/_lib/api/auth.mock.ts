import { routes } from "../routes";
import { ApiError } from "./errors";
import type { AppId, AuthApi, RedirectResponse, SessionUser } from "./types";

/**
 * A stand-in for the backend, so the pages can be shown before it exists. It answers the way
 * API_CONTRACT.md says the backend will. Everything here is fictional.
 *
 * All demo accounts share one password, which is also written in docs/panhellenic/README.md.
 */
const DEMO_PASSWORD = "IMS-demo-2026";

type AccountStatus = "ACTIVE" | "PENDING" | "LOCKED";

const ACCOUNTS: { status: AccountStatus; user: SessionUser }[] = [
  {
    status: "ACTIVE",
    user: {
      id: "u-student",
      firstName: "Μαρία",
      lastName: "Δημητρίου",
      email: "student@ims.test",
      role: "STUDENT",
    },
  },
  {
    status: "ACTIVE",
    user: {
      id: "u-teacher",
      firstName: "Νίκος",
      lastName: "Γεωργίου",
      email: "teacher@ims.test",
      role: "TEACHER",
    },
  },
  {
    status: "ACTIVE",
    user: {
      id: "u-parent",
      firstName: "Ελένη",
      lastName: "Δημητρίου",
      email: "parent@ims.test",
      role: "PARENT",
    },
  },
  {
    status: "PENDING",
    user: {
      id: "u-pending",
      firstName: "Γιώργος",
      lastName: "Αντωνίου",
      email: "pending@ims.test",
      role: "STUDENT",
    },
  },
  {
    status: "LOCKED",
    user: {
      id: "u-locked",
      firstName: "Κώστας",
      lastName: "Ιωάννου",
      email: "locked@ims.test",
      role: "STUDENT",
    },
  },
];

/** Signing up with this address always answers EMAIL_TAKEN. */
const TAKEN_EMAIL = "taken@ims.test";

// In the browser's memory only, like a cookie the page can't see. A reload signs the demo user out.
let currentUser: SessionUser | null = null;

function delay(ms = 600) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/** With no backend there is no eClass code to hand out, so the mock sends the browser to a preview page. */
function redirectFor(app: AppId): RedirectResponse {
  return { redirectUrl: `${routes.devRedirect}?app=${app}` };
}

function findAccount(email: string) {
  const wanted = email.trim().toLowerCase();
  return ACCOUNTS.find((account) => account.user.email === wanted);
}

export const mockAuth: AuthApi = {
  async getSession() {
    await delay(250);
    return currentUser;
  },

  async continueSession({ app }) {
    await delay(300);
    if (!currentUser) throw new ApiError(401, "UNAUTHENTICATED");
    return redirectFor(app);
  },

  async login({ email, password, app }) {
    await delay();
    const account = findAccount(email);
    // The password is checked before the status, so a wrong guess learns nothing about the account.
    if (!account || password !== DEMO_PASSWORD) throw new ApiError(401, "INVALID_CREDENTIALS");
    if (account.status === "PENDING") throw new ApiError(403, "ACCOUNT_PENDING");
    if (account.status === "LOCKED") throw new ApiError(423, "ACCOUNT_LOCKED");
    currentUser = account.user;
    return redirectFor(app);
  },

  async signup({ email }) {
    await delay();
    const normalized = email.trim().toLowerCase();
    if (normalized === TAKEN_EMAIL || findAccount(normalized)) {
      throw new ApiError(409, "EMAIL_TAKEN", { email: "EMAIL_TAKEN" });
    }
    return { status: "PENDING_APPROVAL" };
  },

  async logout() {
    await delay(300);
    currentUser = null;
  },
};
