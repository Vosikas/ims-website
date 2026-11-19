"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { InlineScript } from "@/components/inline-script";

const OVERLAY_ID = "ims-cinematic-intro";
const LOCK_ID = "ims-cinematic-intro-lock";
// Once per browser session.
const SEEN_KEY = "ims-intro-seen";
// "?intro=1" plays it every time, for showing it to someone.
const FORCE_PATTERN = "[?&]intro=1(&|$)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
// With no progress for this long (a failed or stalled video), the page is shown anyway.
const SAFETY_MS = 9000;
const EXIT_MS = 800;

function shouldPlay() {
  if (new RegExp(FORCE_PATTERN).test(window.location.search)) return true;
  if (window.matchMedia(REDUCED_MOTION).matches) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) === null;
  } catch {
    return true;
  }
}

// The same decision as shouldPlay, made before the first paint on a full page load: a visitor who
// won't see the intro never sees the black screen, and their browser doesn't download the video.
const decisionScript = `(function(){var o=document.getElementById("${OVERLAY_ID}");if(!o)return;var play;if(new RegExp("${FORCE_PATTERN}").test(location.search)){play=true}else if(matchMedia("${REDUCED_MOTION}").matches){play=false}else{try{play=sessionStorage.getItem("${SEEN_KEY}")===null}catch(e){play=true}}if(play)return;o.hidden=true;var l=document.getElementById("${LOCK_ID}");if(l)l.media="not all";var v=o.querySelector("video");if(v){v.pause();v.removeAttribute("src");v.load()}})()`;

// Decided once per page load; false once the intro ends, so coming back to the home
// page through the site's own links doesn't play it again.
let decision: boolean | undefined;
const noSubscription = () => () => {};

/** Makes everything but the intro unreachable while it plays, and returns how to undo it. */
function isolate(overlay: HTMLElement) {
  const made: HTMLElement[] = [];
  for (
    let node: HTMLElement | null = overlay;
    node && node !== document.body;
    node = node.parentElement
  ) {
    for (const sibling of Array.from(node.parentElement?.children ?? [])) {
      const element = sibling as HTMLElement;
      if (
        element !== node &&
        !element.inert &&
        element.tagName !== "SCRIPT" &&
        element.tagName !== "STYLE"
      ) {
        element.inert = true;
        made.push(element);
      }
    }
  }
  return () => made.forEach((element) => (element.inert = false));
}

type CinematicIntroProps = {
  src: string;
  /** What a screen reader announces for the intro. */
  label: string;
  skipLabel: string;
  /** Crops and frames the video: hides letterboxing, watermarks, keeps the subject in view. */
  videoClassName: string;
  /** The progress bar's colour. */
  barClassName: string;
  /** A line shown over the last seconds of the video, if any. */
  title?: string;
  /** How long before the end the title fades in. */
  titleLeadSeconds?: number;
};

export function CinematicIntro({
  src,
  label,
  skipLabel,
  videoClassName,
  barClassName,
  title,
  titleLeadSeconds = 1.2,
}: CinematicIntroProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"playing" | "leaving" | "gone">("playing");
  const [titleShown, setTitleShown] = useState(false);
  // The server always renders the intro; the inline script below takes it away before paint when
  // it shouldn't play, and React then drops it.
  const allowed = useSyncExternalStore(
    noSubscription,
    () => (decision ??= shouldPlay()),
    () => true,
  );

  const visible = phase === "leaving" || (phase === "playing" && allowed);
  const playing = phase === "playing" && allowed;

  const finish = useCallback(() => {
    // From here on the home page shows without the intro, also through the site's own links.
    // Not earlier: the decision is read on every render, and would hide the intro mid-play.
    decision = false;
    setPhase((current) => (current === "playing" ? "leaving" : current));
  }, []);

  // While it plays: remember it was seen, keep the page unreachable, and drive the video.
  useEffect(() => {
    const overlay = overlayRef.current;
    const video = videoRef.current;
    // Hydration first renders with the server's answer ("play"); the browser's own answer decides
    // whether anything actually starts.
    if (!playing || !overlay || !video || !(decision ??= shouldPlay())) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Storage can be off; the intro then just plays again next time.
    }
    const restore = isolate(overlay);

    // The muted property is what lets a browser autoplay; make sure it is set before playing.
    video.muted = true;
    video.play().catch(() => finish());

    let watchdog = window.setTimeout(finish, SAFETY_MS);
    const progressed = () => {
      window.clearTimeout(watchdog);
      watchdog = window.setTimeout(finish, SAFETY_MS);
    };
    video.addEventListener("timeupdate", progressed);

    let frame = 0;
    let titleUp = false;
    const tick = () => {
      const { currentTime, duration } = video;
      if (duration > 0 && Number.isFinite(duration)) {
        if (barRef.current)
          barRef.current.style.transform = `scaleX(${Math.min(1, currentTime / duration)})`;
        if (title && !titleUp && duration - currentTime <= titleLeadSeconds) {
          titleUp = true;
          setTitleShown(true);
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      restore();
      window.clearTimeout(watchdog);
      cancelAnimationFrame(frame);
      video.removeEventListener("timeupdate", progressed);
      window.removeEventListener("keydown", onKey);
    };
  }, [playing, finish, title, titleLeadSeconds]);

  // The fade-out reveals the page, then the intro leaves the DOM.
  useEffect(() => {
    if (phase !== "leaving") return;
    videoRef.current?.pause();
    const timer = window.setTimeout(() => setPhase("gone"), EXIT_MS + 60);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (!visible) return null;

  const leaving = phase === "leaving";
  const barStyle: CSSProperties = { transform: "scaleX(0)" };

  return (
    <>
      {/* The page under the intro doesn't scroll. A style element rather than the body's own
          style, which React owns; the inline script switches it off when the intro won't play. */}
      <style id={LOCK_ID} suppressHydrationWarning>
        {"body{overflow:hidden}"}
      </style>
      <div
        id={OVERLAY_ID}
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        suppressHydrationWarning
        className={`fixed inset-0 z-[100] overflow-hidden bg-black transition-[opacity,scale] duration-[800ms] ease-in-out ${
          leaving ? "pointer-events-none scale-105 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          suppressHydrationWarning
          onEnded={finish}
          onError={finish}
          className={`h-full w-full object-cover ${videoClassName}`}
        />

        {title && (
          <div
            aria-hidden={!titleShown}
            className={`pointer-events-none absolute inset-0 grid place-items-center px-6 transition-[opacity,filter,translate] duration-[900ms] ease-out ${
              titleShown ? "translate-y-0 opacity-100 blur-none" : "translate-y-2 opacity-0 blur-sm"
            }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_48%_at_50%_50%,rgb(0_0_0/0.62)_0%,rgb(0_0_0/0.32)_45%,transparent_78%)]" />
            <p className="relative text-center font-brand text-[1.05rem] leading-[1.6] font-light tracking-[0.28em] text-white uppercase [text-shadow:0_1px_18px_rgb(0_0_0/0.45)] sm:text-[1.5rem] lg:text-[1.75rem]">
              <span className="mx-auto mb-[0.9rem] block h-px w-12 bg-gold" />
              {title}
              <span className="mx-auto mt-[0.9rem] block h-px w-12 bg-gold" />
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={finish}
          className="absolute right-4 bottom-[max(1.4rem,calc(env(safe-area-inset-bottom)+0.75rem))] z-10 inline-flex h-10 items-center rounded-full border border-white/25 bg-white/10 px-5 text-sm font-medium tracking-[0.04em] text-white backdrop-blur-md transition-[background-color,border-color,scale] duration-200 hover:border-white/50 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 active:scale-[0.97] sm:right-6 sm:bottom-7"
        >
          {skipLabel}
        </button>

        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
          <div ref={barRef} className={`h-full origin-left ${barClassName}`} style={barStyle} />
        </div>
      </div>
      <InlineScript html={decisionScript} />
    </>
  );
}
