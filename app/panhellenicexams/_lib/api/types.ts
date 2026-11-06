// Τα types ακολουθούν το docs/panhellenic/API_CONTRACT.md. Αν αλλάξει το ένα, αλλάζει και το άλλο.

export type Role = "STUDENT" | "PARENT" | "TEACHER" | "ADMIN";

/** ADMIN is given by the school, never requested at signup. */
export type RequestableRole = Exclude<Role, "ADMIN">;

export type AppId = "eclass";

export interface SessionUser {
  id: string;
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
  email: string;
  password: string;
  rememberMe: boolean;
  app: AppId;
}

export type LoginResponse = RedirectResponse;

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  requestedRole: RequestableRole;
  acceptTerms: true;
}

export interface SignupResponse {
  status: "PENDING_APPROVAL";
}

/** Codes the backend sends in the error body. */
export type BackendErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_PENDING"
  | "ACCOUNT_LOCKED"
  | "TOO_MANY_ATTEMPTS"
  | "EMAIL_TAKEN"
  | "CSRF_INVALID";

/** Codes only the frontend produces, when there is no usable answer from the backend. */
export type ClientErrorCode = "NETWORK_ERROR" | "UNKNOWN";

export type ApiErrorCode = BackendErrorCode | ClientErrorCode;

/** Per-field codes, used both by the frontend's own checks and in the backend's fieldErrors. */
export type FieldErrorCode =
  | "REQUIRED"
  | "INVALID_EMAIL"
  | "TOO_SHORT"
  | "TOO_LONG"
  | "MISMATCH"
  | "EMAIL_TAKEN"
  | "NOT_ACCEPTED";

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
  signup(request: SignupRequest): Promise<SignupResponse>;
  logout(): Promise<void>;
}
