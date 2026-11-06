import type { Metadata } from "next";
import { el } from "./_lib/i18n/el";
import { LoginView } from "./_views/LoginView";

// The layout's title template only reaches child segments, so this page sets the whole title.
export const metadata: Metadata = {
  title: { absolute: `${el.login.title} | ${el.meta.defaultTitle}` },
};

export default function LoginPage() {
  return <LoginView />;
}
