"use client";

import { el } from "../_lib/i18n/el";

export type SummaryItem = { id: string; message: string };

/** The list of problems after a failed submit. Each one moves focus to its field. */
export function ErrorSummary({ items }: { items: SummaryItem[] }) {
  if (items.length === 0) return null;

  return (
    <div
      role="alert"
      className="mt-6 rounded-lg border border-danger/40 bg-danger-soft p-4 text-sm text-danger"
    >
      <p className="font-semibold">{el.errorSummaryTitle}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => {
                event.preventDefault();
                document.getElementById(item.id)?.focus();
              }}
              className="underline underline-offset-2"
            >
              {item.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
