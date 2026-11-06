import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { resolveRedirect } from "./redirect";

/** Follows a backend redirectUrl if it is allowed. Returns false when it was refused. */
export function useFollowRedirect() {
  const router = useRouter();
  return useCallback(
    (redirectUrl: string): boolean => {
      const target = resolveRedirect(redirectUrl);
      if (!target) return false;
      if (target.kind === "page") router.replace(target.path);
      else window.location.assign(target.url);
      return true;
    },
    [router],
  );
}
