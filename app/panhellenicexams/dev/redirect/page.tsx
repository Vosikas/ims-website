import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isMockMode } from "../../_lib/config/env";
import { el } from "../../_lib/i18n/el";
import { DevRedirectView } from "../../_views/DevRedirectView";

export const metadata: Metadata = { title: el.devRedirect.title };

// The preview exists only while there is no backend to redirect to the real eClass.
export default function DevRedirectPage() {
  if (!isMockMode) notFound();
  return <DevRedirectView />;
}
