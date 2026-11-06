import type { Metadata } from "next";
import { el } from "../_lib/i18n/el";
import { SignupView } from "../_views/SignupView";

export const metadata: Metadata = { title: el.signup.title };

export default function SignupPage() {
  return <SignupView />;
}
