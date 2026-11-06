"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Alert } from "../_components/Alert";
import { AuthLayout } from "../_components/AuthLayout";
import { BackendNote } from "../_components/BackendNote";
import { Button } from "../_components/Button";
import { Checkbox } from "../_components/Checkbox";
import { ErrorSummary } from "../_components/ErrorSummary";
import { PasswordField } from "../_components/PasswordField";
import { Spinner } from "../_components/Spinner";
import { TextField } from "../_components/TextField";
import { continueSession, getSession, login } from "../_lib/api/auth";
import { errorCode } from "../_lib/api/errors";
import type { FieldErrorCode } from "../_lib/api/types";
import { APP } from "../_lib/config/apps";
import { useFollowRedirect } from "../_lib/hooks";
import { el } from "../_lib/i18n/el";
import { apiErrorMessage } from "../_lib/messages";
import { routes } from "../_lib/routes";
import { textLink } from "../_lib/styles";
import { validateEmail, validateRequired } from "../_lib/validation";

type Field = "email" | "password";
const FIELDS: Field[] = ["email", "password"];
const fieldId = (field: Field) => `login-${field}`;

type Phase = "checking" | "form" | "redirecting";

export function LoginView() {
  const t = el.login;
  const followRedirect = useFollowRedirect();

  const [phase, setPhase] = useState<Phase>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Someone who is already signed in goes straight on to the eClass.
  useEffect(() => {
    let active = true;

    // BACKEND-NEEDED[session]: εδώ ρωτάμε τον backend αν ο χρήστης είναι ήδη συνδεδεμένος.
    getSession()
      .then(async (user) => {
        if (!active) return;
        if (!user) {
          setPhase("form");
          return;
        }
        // BACKEND-NEEDED[continue]: υπάρχει session, οπότε ζητάμε νέο redirectUrl χωρίς ξανά login.
        const { redirectUrl } = await continueSession({ app: APP });
        if (!active) return;
        setPhase("redirecting");
        if (!followRedirect(redirectUrl)) {
          setServerError(el.apiErrors.REDIRECT_BLOCKED);
          setPhase("form");
        }
      })
      // If the check itself fails, the user can still sign in normally.
      .catch(() => {
        if (active) setPhase("form");
      });

    return () => {
      active = false;
    };
  }, [followRedirect]);

  const errors: Record<Field, FieldErrorCode | undefined> = {
    email: validateEmail(email),
    password: validateRequired(password),
  };
  const labels: Record<Field, string> = { email: t.email, password: t.password };
  const messageFor = (field: Field) => {
    const code = errors[field];
    return code && (submitted || touched[field]) ? el.fieldError(code, labels[field]) : undefined;
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
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    setSubmitting(true);
    try {
      // BACKEND-NEEDED[login]: εδώ η φόρμα στέλνεται στον backend.
      const { redirectUrl } = await login({ email: email.trim(), password, rememberMe, app: APP });
      // Next keeps visited pages alive but hidden, so the password must not stay in this form.
      setPassword("");
      setPhase("redirecting");
      if (!followRedirect(redirectUrl)) {
        setServerError(el.apiErrors.REDIRECT_BLOCKED);
        setPhase("form");
      }
    } catch (error) {
      setServerError(apiErrorMessage(error));
      if (errorCode(error) === "INVALID_CREDENTIALS") {
        document.getElementById(fieldId("password"))?.focus();
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (phase !== "form") {
    return (
      <AuthLayout title={t.title}>
        <p role="status" className="mt-8 flex items-center gap-3 text-ink-muted">
          <Spinner className="size-5" />
          {phase === "checking" ? t.checkingSession : t.redirecting}
        </p>
        <BackendNote ids={["session", "continue", "redirect"]} />
      </AuthLayout>
    );
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
        <TextField
          id={fieldId("email")}
          label={t.email}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          value={email}
          onChange={setEmail}
          onBlur={() => markTouched("email")}
          error={messageFor("email")}
        />
        <PasswordField
          id={fieldId("password")}
          label={t.password}
          autoComplete="current-password"
          required
          value={password}
          onChange={setPassword}
          onBlur={() => markTouched("password")}
          error={messageFor("password")}
        />

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <Checkbox id="login-remember" checked={rememberMe} onChange={setRememberMe}>
            {t.rememberMe}
          </Checkbox>
          <Link href={routes.forgotPassword} className={`${textLink} text-sm`}>
            {t.forgotPassword}
          </Link>
        </div>

        <Button type="submit" loading={submitting} loadingLabel={t.submitting} className="w-full">
          {t.submit}
        </Button>
      </form>

      <p className="mt-8 border-t border-line pt-6 text-center text-sm text-ink-muted">
        {t.noAccount}{" "}
        <Link href={routes.signup} className={textLink}>
          {t.signupLink}
        </Link>
      </p>

      <BackendNote ids={["session", "continue", "login", "redirect", "csrf"]} />
    </AuthLayout>
  );
}
