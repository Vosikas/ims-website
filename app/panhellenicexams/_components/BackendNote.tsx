import { BACKEND_NOTES, type BackendNoteId } from "../_lib/api/backendNotes";
import { env, isMockMode } from "../_lib/config/env";
import { el } from "../_lib/i18n/el";
import { PlugIcon } from "./icons";

/**
 * The visible counterpart of the BACKEND-NEEDED comments: what this screen needs from the backend.
 * Only while developing; a production build never shows it.
 */
export function BackendNote({ ids }: { ids: BackendNoteId[] }) {
  if (!env.showBackendNotes) return null;
  const t = el.backendNote;

  return (
    <aside
      aria-label={t.title}
      className="mt-10 rounded-lg border-2 border-dashed border-amber-500 bg-amber-50 p-4 text-sm text-amber-950"
    >
      <p className="flex items-center gap-2 font-semibold">
        <PlugIcon className="size-4" />
        {t.title}
      </p>
      <p className="mt-1 text-xs text-amber-900">{isMockMode ? t.mockNow : t.realNow}</p>

      <ul className="mt-3 space-y-3">
        {ids.map((id) => (
          <li key={id} className="border-t border-amber-300 pt-3">
            <p className="font-mono text-[0.8rem] font-semibold break-words">
              {BACKEND_NOTES[id].endpoint}
            </p>
            <p className="mt-0.5">{BACKEND_NOTES[id].when}</p>
            <p className="mt-0.5 text-xs text-amber-900">
              {t.contract} <code className="break-all">docs/panhellenic/API_CONTRACT.md#{id}</code>
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
