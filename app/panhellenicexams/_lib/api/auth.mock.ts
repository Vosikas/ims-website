import { routes } from "../routes";
import { ApiError } from "./errors";
import type { AppId, AuthApi, RedirectResponse, SessionUser } from "./types";

/**
 * A stand-in for the backend, so the pages can be shown before it exists. For now it checks
 * nothing: any registry number and password sign in, and any code is accepted. Checks arrive with
 * the validation stage (see docs/panhellenic/API_CONTRACT.md). Everything here is fictional.
 *
 * These numbers only decide which role a demo login gets. Any other number is a student.
 */
const DEMO_USERS: SessionUser[] = [
  {
    id: "u-student",
    registryNumber: "1001",
    firstName: "Μαρία",
    lastName: "Δημητρίου",
    email: "student@ims.test",
    role: "STUDENT",
  },
  {
    id: "u-parent",
    registryNumber: "2001",
    firstName: "Ελένη",
    lastName: "Δημητρίου",
    email: "parent@ims.test",
    role: "PARENT",
  },
  {
    id: "u-teacher",
    registryNumber: "3001",
    firstName: "Νίκος",
    lastName: "Γεωργίου",
    email: "teacher@ims.test",
    role: "TEACHER",
  },
];

// In the browser's memory only, like a cookie the page can't see. A reload signs the demo user out.
let currentUser: SessionUser | null = null;

function delay(ms = 500) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/** With no backend there is no eClass code to hand out, so the mock sends the browser to a preview page. */
function redirectFor(app: AppId): RedirectResponse {
  return { redirectUrl: `${routes.devRedirect}?app=${app}` };
}

function userFor(registryNumber: string): SessionUser {
  const found = DEMO_USERS.find((user) => user.registryNumber === registryNumber);
  if (found) return found;
  return { ...DEMO_USERS[0], registryNumber: registryNumber || DEMO_USERS[0].registryNumber };
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

  async login({ registryNumber, app }) {
    await delay();
    currentUser = userFor(registryNumber);
    return redirectFor(app);
  },

  async startSignup() {
    await delay();
    return { signupId: "mock-signup", maskedEmail: "m•••@example.com" };
  },

  async verifySignupCode() {
    await delay();
  },

  async resendSignupCode() {
    await delay(400);
  },

  async completeSignup() {
    await delay();
    return { status: "ACTIVE" };
  },

  async logout() {
    await delay(300);
    currentUser = null;
  },
};
