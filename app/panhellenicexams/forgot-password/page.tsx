import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "../_components/Alert";
import { AuthLayout } from "../_components/AuthLayout";
import { BackendNote } from "../_components/BackendNote";
import { Button } from "../_components/Button";
import { TextField } from "../_components/TextField";
import { el } from "../_lib/i18n/el";
import { routes } from "../_lib/routes";
import { textLink } from "../_lib/styles";

export const metadata: Metadata = { title: el.forgotPassword.title };

// BACKEND-NEEDED[forgot-password]: Φάση 2. Ο backend θα στέλνει email με σύνδεσμο επαναφοράς.
// Πότε: ο χρήστης γράφει τον αριθμό μητρώου του και πατά «Αποστολή συνδέσμου».
// Συμβόλαιο: docs/panhellenic/API_CONTRACT.md#forgot-password
/** A visible placeholder: the form is drawn but disabled until the backend can send email. */
export default function ForgotPasswordPage() {
  const t = el.forgotPassword;

  return (
    <AuthLayout title={t.title} subtitle={t.subtitle}>
      <Alert tone="info" className="mt-6">
        {t.notYet}
      </Alert>

      <div className="relative mt-6 rounded-lg border-2 border-dashed border-line p-5">
        <span className="absolute -top-3 right-4 rounded-full bg-navy px-3 py-0.5 text-xs font-semibold text-white">
          {t.phaseBadge}
        </span>
        <div className="space-y-5" aria-disabled="true">
          <TextField id="forgot-registry" label={t.registryNumber} value="" disabled />
          <Button className="w-full" disabled>
            {t.submit}
          </Button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm">
        <Link href={routes.login} className={textLink}>
          {t.backToLogin}
        </Link>
      </p>

      <BackendNote ids={["forgot-password"]} />
    </AuthLayout>
  );
}
