import { env, isMockMode } from "../_lib/config/env";
import { el } from "../_lib/i18n/el";

export function MockBadge() {
  if (!env.showBackendNotes || !isMockMode) return null;

  return (
    <p
      title={el.backendNote.mockBadgeTitle}
      // At the end of the page on phones, where a fixed badge would cover the form.
      className="mx-4 mb-4 w-fit rounded-full border border-amber-500 bg-amber-100 px-3 py-1 text-xs font-bold tracking-wide text-amber-950 shadow-sm md:fixed md:bottom-3 md:left-3 md:z-50 md:m-0"
    >
      {el.backendNote.mockBadge}
    </p>
  );
}
