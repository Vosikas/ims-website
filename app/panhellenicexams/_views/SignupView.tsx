"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert } from "../_components/Alert";
import { AuthLayout } from "../_components/AuthLayout";
import { BackendNote } from "../_components/BackendNote";
import { Button } from "../_components/Button";
import { Checkbox } from "../_components/Checkbox";
import { ErrorSummary } from "../_components/ErrorSummary";
import { PasswordField } from "../_components/PasswordField";
import { RoleCards } from "../_components/RoleCards";
import { TextField } from "../_components/TextField";
import { signup } from "../_lib/api/auth";
import { ApiError } from "../_lib/api/errors";
import type { FieldErrorCode, RequestableRole } from "../_lib/api/types";
import { el } from "../_lib/i18n/el";
import { apiErrorMessage } from "../_lib/messages";
import { setPendingEmail } from "../_lib/pendingSignup";
import { routes } from "../_lib/routes";
import { textLink } from "../_lib/styles";
import {
  validateConfirmation,
  validateEmail,
  validateNewPassword,
  validateRequired,
} from "../_lib/validation";

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  requestedRole: RequestableRole | "";
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};
type Field = keyof Values;

// In the order they appear, so focus goes to the first problem on the page.
const FIELDS: Field[] = [
  "firstName",
  "lastName",
  "email",
  "requestedRole",
  "password",
  "confirmPassword",
  "acceptTerms",
];
const fieldId = (field: Field) => `signup-${field}`;

const INITIAL: Values = {
  firstName: "",
  lastName: "",
  email: "",
  requestedRole: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

export function SignupView() {
  const t = el.signup;
  const router = useRouter();

  const [values, setValues] = useState<Values>(INITIAL);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [serverFieldErrors, setServerFieldErrors] = useState<
    Partial<Record<Field, FieldErrorCode>>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function update<K extends Field>(field: K, value: Values[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    // A backend error about a field no longer applies once the user changes it.
    setServerFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  const errors: Record<Field, FieldErrorCode | undefined> = {
    firstName: validateRequired(values.firstName),
    lastName: validateRequired(values.lastName),
    email: serverFieldErrors.email ?? validateEmail(values.email),
    requestedRole: values.requestedRole ? undefined : "REQUIRED",
    password: serverFieldErrors.password ?? validateNewPassword(values.password),
    confirmPassword: validateConfirmation(values.password, values.confirmPassword),
    acceptTerms: values.acceptTerms ? undefined : "NOT_ACCEPTED",
  };

  const labels: Record<Field, string> = {
    firstName: t.firstName,
    lastName: t.lastName,
    email: t.email,
    requestedRole: t.roleLegend,
    password: t.password,
    confirmPassword: t.confirmPassword,
    acceptTerms: t.terms,
  };

  const messageFor = (field: Field): string | undefined => {
    const code = errors[field];
    const visible = submitted || touched[field] || Boolean(serverFieldErrors[field]);
    if (!code || !visible) return undefined;
    if (field === "requestedRole") return t.roleRequired;
    if (field === "acceptTerms") return t.termsRequired;
    return el.fieldError(code, labels[field]);
  };

  const summary = submitted
    ? FIELDS.flatMap((field) => {
        const message = messageFor(field);
        return message ? [{ id: fieldId(field), message }] : [];
      })
    : [];

  const markTouched = (field: Field) => setTouched((current) => ({ ...current, [field]: true }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitted(true);
    setServerError(null);
    const firstInvalid = FIELDS.find((field) => errors[field]);
    if (firstInvalid || !values.requestedRole) {
      document.getElementById(fieldId(firstInvalid ?? "requestedRole"))?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const email = values.email.trim();
      // BACKEND-NEEDED[signup]: εδώ η αίτηση εγγραφής στέλνεται στον backend.
      await signup({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email,
        password: values.password,
        requestedRole: values.requestedRole,
        acceptTerms: true,
      });
      setPendingEmail(email);
      // Next keeps visited pages alive but hidden, so the passwords must not stay in this form.
      setValues(INITIAL);
      setTouched({});
      setSubmitted(false);
      router.push(routes.pending);
    } catch (error) {
      const fieldErrors = error instanceof ApiError ? error.fieldErrors : {};
      const known = FIELDS.filter((field) => fieldErrors[field]);
      if (known.length > 0) {
        setServerFieldErrors(Object.fromEntries(known.map((field) => [field, fieldErrors[field]])));
        document.getElementById(fieldId(known[0]))?.focus();
      } else {
        setServerError(apiErrorMessage(error));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title={t.title} subtitle={t.subtitle}>
      {serverError && (
        <Alert tone="error" className="mt-6">
          {serverError}
        </Alert>
      )}
      <ErrorSummary items={summary} />

      <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-5">
        <p className="text-sm text-ink-muted">{t.allRequired}</p>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id={fieldId("firstName")}
            label={t.firstName}
            autoComplete="given-name"
            required
            value={values.firstName}
            onChange={(value) => update("firstName", value)}
            onBlur={() => markTouched("firstName")}
            error={messageFor("firstName")}
          />
          <TextField
            id={fieldId("lastName")}
            label={t.lastName}
            autoComplete="family-name"
            required
            value={values.lastName}
            onChange={(value) => update("lastName", value)}
            onBlur={() => markTouched("lastName")}
            error={messageFor("lastName")}
          />
        </div>

        <TextField
          id={fieldId("email")}
          label={t.email}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          value={values.email}
          onChange={(value) => update("email", value)}
          onBlur={() => markTouched("email")}
          error={messageFor("email")}
        />

        <RoleCards
          id={fieldId("requestedRole")}
          name="requestedRole"
          legend={t.roleLegend}
          hint={t.roleHint}
          value={values.requestedRole}
          onChange={(role) => update("requestedRole", role)}
          error={messageFor("requestedRole")}
        />
        {values.requestedRole === "PARENT" && <Alert tone="info">{t.parentNote}</Alert>}

        <PasswordField
          id={fieldId("password")}
          label={t.password}
          hint={t.passwordHint}
          autoComplete="new-password"
          required
          value={values.password}
          onChange={(value) => update("password", value)}
          onBlur={() => markTouched("password")}
          error={messageFor("password")}
        />
        <PasswordField
          id={fieldId("confirmPassword")}
          label={t.confirmPassword}
          autoComplete="new-password"
          required
          value={values.confirmPassword}
          onChange={(value) => update("confirmPassword", value)}
          onBlur={() => markTouched("confirmPassword")}
          error={messageFor("confirmPassword")}
        />

        <div>
          <Checkbox
            id={fieldId("acceptTerms")}
            checked={values.acceptTerms}
            onChange={(checked) => update("acceptTerms", checked)}
            error={messageFor("acceptTerms")}
          >
            {t.terms}
          </Checkbox>
          <details className="mt-2 ml-8 text-sm text-ink-muted">
            <summary className="cursor-pointer font-medium text-navy">{t.termsMore}</summary>
            <p className="mt-1">{t.termsPlaceholder}</p>
          </details>
        </div>

        <Button type="submit" loading={submitting} loadingLabel={t.submitting} className="w-full">
          {t.submit}
        </Button>
      </form>

      <p className="mt-8 border-t border-line pt-6 text-center text-sm text-ink-muted">
        {t.haveAccount}{" "}
        <Link href={routes.login} className={textLink}>
          {t.loginLink}
        </Link>
      </p>

      <BackendNote ids={["signup", "password-policy", "csrf"]} />
    </AuthLayout>
  );
}
