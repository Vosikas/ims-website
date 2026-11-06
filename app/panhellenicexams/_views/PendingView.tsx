"use client";

import Link from "next/link";
import { AuthLayout } from "../_components/AuthLayout";
import { BackendNote } from "../_components/BackendNote";
import { CheckIcon, ClockIcon } from "../_components/icons";
import { el } from "../_lib/i18n/el";
import { usePendingEmail } from "../_lib/pendingSignup";
import { routes } from "../_lib/routes";
import { buttonClasses } from "../_lib/styles";

export function PendingView() {
  const t = el.pending;
  const email = usePendingEmail();

  return (
    <AuthLayout
      title={t.title}
      subtitle={email ? t.receivedFor(email) : t.received}
      icon={
        <span className="mb-5 flex size-12 items-center justify-center rounded-full bg-gold/15 text-gold">
          <ClockIcon className="size-6" />
        </span>
      }
    >
      <h2 className="sr-only">{t.stepsLabel}</h2>
      <ol className="mt-8 space-y-4">
        {t.steps.map((step, index) => {
          const done = index === 0;
          const current = index === 1;
          return (
            <li key={step.text} className="flex items-start gap-3">
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                  done
                    ? "border-gold bg-gold text-navy"
                    : current
                      ? "border-gold text-navy"
                      : "border-field text-ink-muted"
                }`}
              >
                {done ? <CheckIcon className="size-4" /> : index + 1}
              </span>
              <span>
                <span className="block font-medium">{step.text}</span>
                <span className="text-sm text-ink-muted">{step.status}</span>
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-sm text-ink-muted">{t.afterApproval}</p>

      <Link href={routes.login} className={buttonClasses("primary", "mt-6 w-full")}>
        {t.backToLogin}
      </Link>

      <BackendNote ids={["signup"]} />
    </AuthLayout>
  );
}
