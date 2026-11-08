import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "../../_components/AuthLayout";
import { CheckIcon } from "../../_components/icons";
import { el } from "../../_lib/i18n/el";
import { routes } from "../../_lib/routes";
import { buttonClasses } from "../../_lib/styles";

export const metadata: Metadata = { title: el.signupDone.title };

export default function SignupDonePage() {
  const t = el.signupDone;

  return (
    <AuthLayout
      title={t.title}
      subtitle={t.subtitle}
      icon={
        <span className="mb-5 flex size-12 items-center justify-center rounded-full bg-gold/15 text-gold">
          <CheckIcon className="size-6" />
        </span>
      }
    >
      <Link href={routes.login} className={buttonClasses("primary", "mt-8 w-full")}>
        {t.toLogin}
      </Link>
    </AuthLayout>
  );
}
