"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ArrowRightIcon } from "@/components/icons";
import { InlineScript } from "./inline-script";

const OVERLAY_ID = "ims-intro";
const LOCK_ID = "ims-intro-lock";
// Once per browser tab: someone coming back to the home page shouldn't sit through it again.
const SEEN_KEY = "ims-intro-seen";
// "?intro" in the address plays it again, for showing it to someone.
const FORCE_PATTERN = "[?&]intro(=|&|$)";

export type IntroControls = {
  /** Ends the intro: the overlay leaves and the home page takes over. */
  finish: () => void;
  /** True from the moment the overlay starts leaving, so a scene can stop its work. */
  leaving: boolean;
  reducedMotion: boolean;
};

type IntroOverlayProps = {
  label: string;
  skipLabel: string;
  /** "wipe" lifts the overlay off the page; "dissolve" fades into the page underneath. */
  exit?: "wipe" | "dissolve";
  /** Without a calm version, visitors who ask for reduced motion land straight on the page. */
  playWithReducedMotion?: boolean;
  className?: string;
  children: (controls: IntroControls) => ReactNode;
};

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) !== null;
  } catch {
    return false;
  }
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function shouldPlay(playWithReducedMotion: boolean) {
  if (new RegExp(FORCE_PATTERN).test(window.location.search)) return true;
  if (readSeen()) return false;
  return playWithReducedMotion || !window.matchMedia(REDUCED_MOTION).matches;
}

// Decided once per page load. It flips to false when the intro ends, so coming back to the home
// page through the site's own links doesn't play it again.
let decision: boolean | undefined;
const noSubscription = () => () => {};

function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// The same decision as shouldPlay, made before the first paint on a full page load, so a visitor
// who has already seen the intro never sees it flash.
function decisionScript(playWithReducedMotion: boolean) {
  return `(function(){var o=document.getElementById("${OVERLAY_ID}");if(!o)return;var seen=false;try{seen=sessionStorage.getItem("${SEEN_KEY}")!==null}catch(e){}var play=new RegExp("${FORCE_PATTERN}").test(location.search)||(!seen&&(${playWithReducedMotion}||!matchMedia("(prefers-reduced-motion: reduce)").matches));if(!play){o.hidden=true;var l=document.getElementById("${LOCK_ID}");if(l)l.media="not all"}})()`;
}

/** Makes everything but the overlay unreachable, and returns how to undo it. */
function isolate(overlay: HTMLElement) {
  const made: Element[] = [];
  for (
    let node: HTMLElement | null = overlay;
    node && node !== document.body;
    node = node.parentElement
  ) {
    for (const sibling of Array.from(node.parentElement?.children ?? [])) {
      if (sibling !== node && !(sibling as HTMLElement).inert && sibling.tagName !== "SCRIPT") {
        (sibling as HTMLElement).inert = true;
        made.push(sibling);
      }
    }
  }
  return () => made.forEach((element) => ((element as HTMLElement).inert = false));
}

export function IntroOverlay({
  label,
  skipLabel,
  exit = "wipe",
  playWithReducedMotion = false,
  className = "bg-navy",
  children,
}: IntroOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"playing" | "leaving" | "gone">("playing");
  // The server always renders the overlay; the inline script below hides it before paint when it
  // shouldn't play, and React then drops it.
  const allowed = useSyncExternalStore(
    noSubscription,
    () => (decision ??= shouldPlay(playWithReducedMotion)),
    () => true,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

  const playing = phase === "leaving" || (phase === "playing" && allowed);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!playing || !overlay) return;
    return isolate(overlay);
  }, [playing]);

  const finish = useCallback(() => {
    decision = false;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Storage can be off; the intro then just plays again next time.
    }
    setPhase((current) => (current === "playing" ? "leaving" : current));
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    // Matches the exit transition below, with a margin in case transitionend never fires.
    const timer = window.setTimeout(() => setPhase("gone"), reducedMotion ? 450 : 1000);
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (!playing) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, finish]);

  if (!playing) return null;

  const leaving = phase === "leaving";
  const exitClassName =
    reducedMotion || exit === "dissolve"
      ? "transition-opacity duration-[400ms] ease-out"
      : "transition-[clip-path] duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)]";
  const leavingClassName =
    reducedMotion || exit === "dissolve"
      ? "pointer-events-none opacity-0"
      : "pointer-events-none [clip-path:inset(0_0_100%_0)]";

  return (
    <>
      {/* The page under the overlay doesn't scroll. A style element rather than the html's own
          style, which React owns; the inline script switches it off when the intro won't play. */}
      <style id={LOCK_ID} suppressHydrationWarning>
        {"html{overflow:hidden}"}
      </style>
      <div
        id={OVERLAY_ID}
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        suppressHydrationWarning
        onTransitionEnd={(event) => {
          if (leaving && event.target === event.currentTarget) setPhase("gone");
        }}
        className={`fixed inset-0 z-[100] overflow-hidden text-white [clip-path:inset(0)] ${className} ${exitClassName} ${leaving ? leavingClassName : ""}`}
      >
        {children({ finish, leaving, reducedMotion })}

        <button
          type="button"
          onClick={finish}
          className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-20 inline-flex h-11 items-center gap-[0.6rem] rounded-full border border-white/35 bg-navy/45 px-[1.1rem] text-xs font-bold tracking-[0.06em] text-white uppercase backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-navy/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:top-6 lg:right-6 lg:h-[2.1rem] lg:text-[0.62rem]"
        >
          {skipLabel}
          <ArrowRightIcon className="w-[0.9rem]" />
        </button>
      </div>
      <InlineScript html={decisionScript(playWithReducedMotion)} />
    </>
  );
}
