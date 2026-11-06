import { isMockMode } from "../config/env";
import { mockAuth } from "./auth.mock";
import { realAuth } from "./auth.real";
import type { AuthApi } from "./types";

// The only place that chooses between the mock and the real backend
// (NEXT_PUBLIC_PANHELLENIC_API_MODE).
const api: AuthApi = isMockMode ? mockAuth : realAuth;

export const getSession: AuthApi["getSession"] = () => api.getSession();
export const continueSession: AuthApi["continueSession"] = (request) =>
  api.continueSession(request);
export const login: AuthApi["login"] = (request) => api.login(request);
export const signup: AuthApi["signup"] = (request) => api.signup(request);
export const logout: AuthApi["logout"] = () => api.logout();
