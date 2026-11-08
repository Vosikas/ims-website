"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert } from "../_components/Alert";
import { AuthLayout } from "../_components/AuthLayout";
import { BackendNote } from "../_components/BackendNote";
import { Button } from "../_components/Button";
import { Checkbox } from "../_components/Checkbox";
import { PasswordField } from "../_components/PasswordField";
import { SignupSteps } from "../_components/SignupSteps";
import { TextField } from "../_components/TextField";
import { auth } from "../_lib/api/auth";
import { el } from "../_lib/i18n/el";
import { apiErrorMessage } from "../_lib/messages";
import { routes } from "../_lib/routes";
import { textLink } from "../_lib/styles";

type Step = "registry" | "code" | "account";
const STEPS: Step[] = ["registry", "code", "account"];

/**
 * Signup in three steps: the registry number is matched against the school's pool, a confirmation
 * code goes to the email the school has on file, and the user then sets an email and password.
 * Nothing is checked yet; every step simply moves on.
 */
export function SignupView() {
  const t = el.signup;
  const router = useRouter();

  const [step, setStep] = useState<Step>("registry");
  const [registryNumber, setRegistryNumber] = useState("");
  const [signupId, setSignupId] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [code, setCode] = useState("");
  const [resent, setResent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  /** Runs one call to the server: one at a time, with any error shown above the form. */
  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setServerError(null);
    try {
      await action();
    } catch (error) {
      setServerError(apiErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  function goTo(next: Step) {
    setServerError(null);
    setResent(false);
    setStep(next);
  }

  function handleRegistry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      // BACKEND-NEEDED[signup-registry]: εδώ ο αριθμός μητρώου αντιστοιχίζεται στο pool.
      const started = await auth.startSignup({ registryNumber: registryNumber.trim() });
      setSignupId(started.signupId);
      setMaskedEmail(started.maskedEmail);
      setCode("");
      goTo("code");
    });
  }

  function handleCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      // BACKEND-NEEDED[signup-verify]: εδώ ελέγχεται ο κωδικός επιβεβαίωσης από το email.
      await auth.verifySignupCode({ signupId, code: code.trim() });
      goTo("account");
    });
  }

  function handleResend() {
    void run(async () => {
      // BACKEND-NEEDED[signup-resend]: εδώ ο backend στέλνει νέο κωδικό.
      await auth.resendSignupCode({ signupId });
      setResent(true);
    });
  }

  function handleAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      // BACKEND-NEEDED[signup-complete]: εδώ το email και ο κωδικός αποθηκεύονται στη βάση.
      await auth.completeSignup({ signupId, email: email.trim(), password, acceptTerms });
      // Next keeps visited pages alive but hidden, so nothing may stay in this form.
      setRegistryNumber("");
      setCode("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAcceptTerms(false);
      goTo("registry");
      router.push(routes.signupDone);
    });
  }

  const subtitles: Record<Step, string> = {
    registry: t.registrySubtitle,
    code: t.codeSubtitle(maskedEmail),
    account: t.accountSubtitle,
  };

  return (
    <AuthLayout title={t.title} subtitle={subtitles[step]}>
      <SignupSteps current={STEPS.indexOf(step)} />

      {serverError && (
        <Alert tone="error" className="mt-6">
          {serverError}
        </Alert>
      )}

      {step === "registry" && (
        <form noValidate onSubmit={handleRegistry} className="mt-6 space-y-5">
          <TextField
            id="signup-registry"
            label={t.registryNumber}
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            required
            value={registryNumber}
            onChange={setRegistryNumber}
          />
          <Button type="submit" loading={busy} loadingLabel={t.continuing} className="w-full">
            {t.continue}
          </Button>
        </form>
      )}

      {step === "code" && (
        <form noValidate onSubmit={handleCode} className="mt-6 space-y-5">
          <TextField
            id="signup-code"
            label={t.code}
            hint={t.codeHint}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            autoFocus
            required
            value={code}
            onChange={setCode}
          />
          <div>
            <button type="button" onClick={handleResend} className={`${textLink} text-sm`}>
              {t.resend}
            </button>
            {/* Always rendered, so screen readers announce the message when it appears. */}
            <p role="status" className={resent ? "mt-2 text-sm text-ink-muted" : "sr-only"}>
              {resent ? t.resent : ""}
            </p>
          </div>
          <Button type="submit" loading={busy} loadingLabel={t.continuing} className="w-full">
            {t.continue}
          </Button>
          <Button variant="secondary" onClick={() => goTo("registry")} className="w-full">
            {t.back}
          </Button>
        </form>
      )}

      {step === "account" && (
        <form noValidate onSubmit={handleAccount} className="mt-6 space-y-5">
          <TextField
            id="signup-email"
            label={t.email}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            autoFocus
            required
            value={email}
            onChange={setEmail}
          />
          <PasswordField
            id="signup-password"
            label={t.password}
            hint={t.passwordHint}
            autoComplete="new-password"
            required
            value={password}
            onChange={setPassword}
          />
          <PasswordField
            id="signup-confirm-password"
            label={t.confirmPassword}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          <div>
            <Checkbox id="signup-terms" checked={acceptTerms} onChange={setAcceptTerms}>
              {t.terms}
            </Checkbox>
            <details className="mt-2 ml-8 text-sm text-ink-muted">
              <summary className="cursor-pointer font-medium text-navy">{t.termsMore}</summary>
              <p className="mt-1">{t.termsPlaceholder}</p>
            </details>
          </div>
          <Button type="submit" loading={busy} loadingLabel={t.continuing} className="w-full">
            {t.submit}
          </Button>
        </form>
      )}

      <p className="mt-8 border-t border-line pt-6 text-center text-sm text-ink-muted">
        {t.haveAccount}{" "}
        <Link href={routes.login} className={textLink}>
          {t.loginLink}
        </Link>
      </p>

      {step === "registry" && <BackendNote ids={["signup-registry", "csrf"]} />}
      {step === "code" && <BackendNote ids={["signup-verify", "signup-resend"]} />}
      {step === "account" && <BackendNote ids={["signup-complete", "password-policy"]} />}
    </AuthLayout>
  );
}
