"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Alert } from "../_components/Alert";
import { AuthLayout } from "../_components/AuthLayout";
import { BackendNote } from "../_components/BackendNote";
import { Button } from "../_components/Button";
import { Checkbox } from "../_components/Checkbox";
import { PasswordField } from "../_components/PasswordField";
import { Spinner } from "../_components/Spinner";
import { TextField } from "../_components/TextField";
import { auth } from "../_lib/api/auth";
import { APP } from "../_lib/config/apps";
import { useFollowRedirect } from "../_lib/hooks";
import { el } from "../_lib/i18n/el";
import { apiErrorMessage } from "../_lib/messages";
import { routes } from "../_lib/routes";
import { textLink } from "../_lib/styles";

type Phase = "checking" | "form" | "redirecting";

export function LoginView() {
  const t = el.login;
  const followRedirect = useFollowRedirect();

  const [phase, setPhase] = useState<Phase>("checking");
  const [registryNumber, setRegistryNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Someone who is already signed in goes straight on to the eClass.
  useEffect(() => {
    let active = true;

    // BACKEND-NEEDED[session]: εδώ ρωτάμε τον backend αν ο χρήστης είναι ήδη συνδεδεμένος.
    auth
      .getSession()
      .then(async (user) => {
        if (!active) return;
        if (!user) {
          setPhase("form");
          return;
        }
        // BACKEND-NEEDED[continue]: υπάρχει session, οπότε ζητάμε νέο redirectUrl χωρίς ξανά login.
        const { redirectUrl } = await auth.continueSession({ app: APP });
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
      // Next keeps visited pages alive but hidden; on return this page should check again.
      setPhase("checking");
    };
  }, [followRedirect]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setServerError(null);
    setSubmitting(true);
    try {
      // BACKEND-NEEDED[login]: εδώ ο αριθμός μητρώου και ο κωδικός στέλνονται στον backend.
      const { redirectUrl } = await auth.login({
        registryNumber: registryNumber.trim(),
        password,
        rememberMe,
        app: APP,
      });
      // Next keeps visited pages alive but hidden, so the credentials must not stay in this form.
      setRegistryNumber("");
      setPassword("");
      setPhase("redirecting");
      if (!followRedirect(redirectUrl)) {
        setServerError(el.apiErrors.REDIRECT_BLOCKED);
        setPhase("form");
      }
    } catch (error) {
      setServerError(apiErrorMessage(error));
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

      <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-5">
        <TextField
          id="login-registry"
          label={t.registryNumber}
          inputMode="numeric"
          autoComplete="username"
          required
          value={registryNumber}
          onChange={setRegistryNumber}
        />
        <PasswordField
          id="login-password"
          label={t.password}
          autoComplete="current-password"
          required
          value={password}
          onChange={setPassword}
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
