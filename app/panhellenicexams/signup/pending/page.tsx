import type { Metadata } from "next";
import { el } from "../../_lib/i18n/el";
import { PendingView } from "../../_views/PendingView";

export const metadata: Metadata = { title: el.pending.title };

export default function PendingPage() {
  return <PendingView />;
}
