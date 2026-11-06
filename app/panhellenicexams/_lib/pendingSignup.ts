import { useSyncExternalStore } from "react";

// The signup page hands the email to the pending page through memory, never through the URL.
// A reload loses it, and the pending page then shows a generic message.

let pendingEmail: string | null = null;
const listeners = new Set<() => void>();

export function setPendingEmail(email: string) {
  pendingEmail = email;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The email of the signup that just went through, or null (always null on the server). */
export function usePendingEmail(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => pendingEmail,
    () => null,
  );
}
