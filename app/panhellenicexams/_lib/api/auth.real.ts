import { apiRequest } from "./client";
import { ApiError } from "./errors";
import type { AuthApi, SessionResponse } from "./types";

/** The real backend (BACKEND, Quarkus). Used when NEXT_PUBLIC_PANHELLENIC_API_MODE=real. */
export const realAuth: AuthApi = {
  async getSession() {
    // BACKEND-NEEDED[session]: GET /api/auth/session
    // Πότε: μόλις ανοίγει η σελίδα σύνδεσης, για να μη ζητάμε login από όποιον είναι ήδη μέσα.
    // Στέλνει: τίποτα (μόνο το cookie) · Περιμένει: SessionResponse, ή 401 αν δεν υπάρχει session
    // Συμβόλαιο: docs/panhellenic/API_CONTRACT.md#session
    try {
      const response = await apiRequest<SessionResponse>("GET", "/auth/session");
      return response.user;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return null;
      throw error;
    }
  },

  continueSession(request) {
    // BACKEND-NEEDED[continue]: POST /api/auth/continue
    // Πότε: υπάρχει ήδη session, οπότε ζητάμε νέο redirectUrl χωρίς ξανά login.
    // Στέλνει: ContinueRequest · Περιμένει: RedirectResponse ή ApiError
    // Συμβόλαιο: docs/panhellenic/API_CONTRACT.md#continue
    return apiRequest("POST", "/auth/continue", request);
  },

  login(request) {
    // BACKEND-NEEDED[login]: POST /api/auth/login
    // Πότε: ο χρήστης πατά «Σύνδεση» στη σελίδα σύνδεσης.
    // Στέλνει: LoginRequest · Περιμένει: LoginResponse (και cookie session) ή ApiError
    // Συμβόλαιο: docs/panhellenic/API_CONTRACT.md#login
    return apiRequest("POST", "/auth/login", request);
  },

  signup(request) {
    // BACKEND-NEEDED[signup]: POST /api/auth/signup
    // Πότε: ο χρήστης πατά «Δημιουργία λογαριασμού» στη σελίδα εγγραφής.
    // Στέλνει: SignupRequest · Περιμένει: SignupResponse ή ApiError
    // Συμβόλαιο: docs/panhellenic/API_CONTRACT.md#signup
    return apiRequest("POST", "/auth/signup", request);
  },

  async logout() {
    // BACKEND-NEEDED[logout]: POST /api/auth/logout
    // Πότε: ο χρήστης πατά «Αποσύνδεση» (τώρα στη σελίδα προσομοίωσης, αργότερα και από το eClass).
    // Στέλνει: τίποτα (μόνο το cookie) · Περιμένει: 204
    // Συμβόλαιο: docs/panhellenic/API_CONTRACT.md#logout
    await apiRequest<void>("POST", "/auth/logout");
  },
};
