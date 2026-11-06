"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert } from "../_components/Alert";
import { AuthLayout } from "../_components/AuthLayout";
import { BackendNote } from "../_components/BackendNote";
import { Button } from "../_components/Button";
import { Spinner } from "../_components/Spinner";
import { getSession, logout } from "../_lib/api/auth";
import type { SessionUser } from "../_lib/api/types";
import { env } from "../_lib/config/env";
import { el } from "../_lib/i18n/el";
import { routes } from "../_lib/routes";
import { buttonClasses } from "../_lib/styles";

/**
 * Mock mode only. Stands in for the moment the browser would leave for the eClass, so the
 * whole flow can be shown before the backend and the WordPress site exist.
 */
export function DevRedirectView() {
  const t = el.devRedirect;
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;
    getSession()
      .then((current) => {
        if (!active) return;
        if (current) setUser(current);
        else router.replace(routes.login);
      })
      .catch(() => {
        if (active) router.replace(routes.login);
      });
    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      // BACKEND-NEEDED[logout]: εδώ ο backend σβήνει το session.
      await logout();
    } finally {
      router.replace(routes.login);
    }
  }

  const eclassTarget = `${env.eclassUrl.replace(/\/$/, "")}/?ims_code=${t.codePlaceholder}`;

  return (
    <AuthLayout title={t.title} subtitle={t.subtitle}>
      {!user ? (
        <p role="status" className="mt-8 flex items-center gap-3 text-ink-muted">
          <Spinner className="size-5" />
          {t.loading}
        </p>
      ) : (
        <>
          <Alert tone="success" className="mt-6">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              <dt className="font-semibold">{t.name}</dt>
              <dd>
                {user.firstName} {user.lastName}
              </dd>
              <dt className="font-semibold">{t.email}</dt>
              <dd className="break-all">{user.email}</dd>
              <dt className="font-semibold">{t.role}</dt>
              <dd>{el.roles[user.role]}</dd>
            </dl>
          </Alert>

          <p className="mt-6 text-sm text-ink-muted">{t.wouldGo}</p>
          <code className="mt-2 block rounded-md bg-mist px-3 py-2 font-mono text-sm break-all">
            {eclassTarget}
          </code>

          <div className="mt-6 grid gap-3">
            <a
              href={env.eclassUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("primary", "w-full")}
            >
              {t.openEclass}
            </a>
            <p className="-mt-1 text-center text-xs text-ink-muted">{t.openEclassHint}</p>
            <Button
              variant="secondary"
              loading={loggingOut}
              loadingLabel={t.loggingOut}
              onClick={handleLogout}
              className="w-full"
            >
              {t.logout}
            </Button>
          </div>
        </>
      )}

      <BackendNote ids={["redirect", "logout"]} />
    </AuthLayout>
  );
}
