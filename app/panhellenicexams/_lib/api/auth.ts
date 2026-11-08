import { isMockMode } from "../config/env";
import { mockAuth } from "./auth.mock";
import { realAuth } from "./auth.real";
import type { AuthApi } from "./types";

// The only place that chooses between the mock and the real backend
// (NEXT_PUBLIC_PANHELLENIC_API_MODE).
export const auth: AuthApi = isMockMode ? mockAuth : realAuth;
