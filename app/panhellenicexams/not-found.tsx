import Link from "next/link";
import { AuthLayout } from "./_components/AuthLayout";
import { el } from "./_lib/i18n/el";
import { routes } from "./_lib/routes";
import { buttonClasses } from "./_lib/styles";

export default function PanhellenicNotFound() {
  const t = el.notFound;

  return (
    <AuthLayout title={t.title} subtitle={t.subtitle}>
      <title>{`${t.title} | ${el.meta.defaultTitle}`}</title>
      <Link href={routes.login} className={buttonClasses("primary", "mt-8 w-full")}>
        {t.backToLogin}
      </Link>
    </AuthLayout>
  );
}
