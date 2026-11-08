// Τα types ακολουθούν το docs/panhellenic/API_CONTRACT.md. Αν αλλάξει το ένα, αλλάζει και το άλλο.

export type Role = "STUDENT" | "PARENT" | "TEACHER" | "ADMIN";

export type AppId = "eclass";

export interface SessionUser {
  id: string;
  registryNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface SessionResponse {
  user: SessionUser;
}

export interface ContinueRequest {
  app: AppId;
}

export interface RedirectResponse {
  redirectUrl: string;
}

export interface LoginRequest {
  registryNumber: string;
  password: string;
  rememberMe: boolean;
  app: AppId;
}

export type LoginResponse = RedirectResponse;

/** Step 1 of signup: the number is matched against the school's pool. */
export interface StartSignupRequest {
  registryNumber: string;
}

export interface StartSignupResponse {
  /** Identifies this signup in the next steps. */
  signupId: string;
  /** The email the school has on file, partly hidden. The code was sent there. */
  maskedEmail: string;
}

/** Step 2 of signup: the code from the email. */
export interface VerifySignupRequest {
  signupId: string;
  code: string;
}

export interface ResendSignupRequest {
  signupId: string;
}

/** Step 3 of signup: the account's email and password. */
export interface CompleteSignupRequest {
  signupId: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

export interface CompleteSignupResponse {
  status: "ACTIVE";
}

/** Codes the backend sends in the error body. */
export type BackendErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_LOCKED"
  | "TOO_MANY_ATTEMPTS"
  | "REGISTRY_NOT_FOUND"
  | "REGISTRY_ALREADY_USED"
  | "CODE_INVALID"
  | "CODE_EXPIRED"
  | "CSRF_INVALID";

/** Codes only the frontend produces, when there is no usable answer from the backend. */
export type ClientErrorCode = "NETWORK_ERROR" | "UNKNOWN";

export type ApiErrorCode = BackendErrorCode | ClientErrorCode;

/** Per-field codes in the backend's fieldErrors. */
export type FieldErrorCode =
  "REQUIRED" | "INVALID_EMAIL" | "TOO_SHORT" | "TOO_LONG" | "MISMATCH" | "NOT_ACCEPTED";

export interface ApiErrorBody {
  code: BackendErrorCode;
  /** For logs only. The frontend shows its own text for each code. */
  message?: string;
  fieldErrors?: Record<string, FieldErrorCode>;
}

/** What every implementation (mock or real) must offer. */
export interface AuthApi {
  getSession(): Promise<SessionUser | null>;
  continueSession(request: ContinueRequest): Promise<RedirectResponse>;
  login(request: LoginRequest): Promise<LoginResponse>;
  startSignup(request: StartSignupRequest): Promise<StartSignupResponse>;
  verifySignupCode(request: VerifySignupRequest): Promise<void>;
  resendSignupCode(request: ResendSignupRequest): Promise<void>;
  completeSignup(request: CompleteSignupRequest): Promise<CompleteSignupResponse>;
  logout(): Promise<void>;
}
