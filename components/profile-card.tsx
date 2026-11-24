"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  CalendarDays,
  Check,
  Mail,
  TriangleAlert,
  ChevronRight,
  Layers,
  LayoutDashboard,
  Moon,
  Sun,
  Share2,
  User,
} from "lucide-react";
import { SOCIALS } from "@/components/brand-marks";
import { IhDashboard } from "@/components/ih-dashboard";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToggleSound } from "@/hooks/use-toggle-sound";
import { type DashboardData } from "@/lib/dashboard-data";

type CopyState = "idle" | "done" | "failed";

// ─── Profile ──────────────────────────────────────────────────────────────────

const PROFILE = {
  name: "Muhammad Tanveer Abbas",
  title: "AI Native Product Builder",
  status: "Available for work",
  statusDetail: "Booking new builds from next month",
  about:
    "I design and ship AI native products end to end interfaces, agents, and the plumbing behind them.",
  profileImage: "/Me.jfif",
  email: "muhammadtanveerabbas.contact@gmail.com",
  calUrl: "https://cal.com/muhammadtanveerabbas",
  portfolioUrl: "https://muhammadtanveerabbas.vercel.app",
  studioUrl: "https://muhammadtanveerabbas.vercel.app",
  resumeUrl: "/Resume.pdf",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function safeOpen(url: string) {
  const localFile = url.startsWith("/") && !url.startsWith("//");
  if (isValidUrl(url) || localFile) window.open(url, "_blank", "noopener,noreferrer");
}


async function writeClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission was denied. Fall through to the textarea path.
    }
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.top = "-1000px";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

// ─── Control system ──────────────────────────────────────────────────────────
//
// One border weight (1px), one pill height, one primary action. The card keeps
// its black and white identity; the controls drop the heavy 2px outline that
// made every button shout at the same volume.

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/45 dark:focus-visible:ring-white/55";

const PILL = `flex h-[var(--top-h)] items-center justify-center gap-1.5 rounded-full border border-black/10 bg-white/70 px-2.5 font-display text-[10px] font-medium text-neutral-600 backdrop-blur-xl transition-colors disabled:pointer-events-none disabled:opacity-45 dark:border-white/15 dark:bg-white/[0.05] dark:text-white/70 sm:text-[11px] ${FOCUS_RING}`;

const TILE_BASE = `flex min-h-[var(--tile-h)] items-center gap-2.5 rounded-xl border p-2.5 text-left transition-colors disabled:pointer-events-none disabled:opacity-45 ${FOCUS_RING}`;

const TILE_SECONDARY = `${TILE_BASE} border-black/10 bg-black/[0.02] text-neutral-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-neutral-50`;

const ICON_PRIMARY =
  "flex size-[var(--icon-btn)] shrink-0 items-center justify-center rounded-lg bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white";

const ICON_SECONDARY =
  "flex size-[var(--icon-btn)] shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white/70 text-neutral-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/80";

const TILE_LABEL = "font-display text-[11px] font-semibold leading-tight sm:text-[11.5px]";
// ─── Brand mark ───────────────────────────────────────────────────────────────

type BrandProps = { path: string; color: string; className?: string };

function BrandMark({ path, color, className = "h-[15px] w-[15px]" }: BrandProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill={color} d={path} />
    </svg>
  );
}

// A store that never changes: only used to read "are we on the client yet".
const subscribeToNothing = () => () => {};

// ─── Card ─────────────────────────────────────────────────────────────────────

export function ProfileCard({ data }: { data: DashboardData }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [imageError, setImageError] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const { play } = useToggleSound();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const flipTriggerRef = useRef<HTMLButtonElement>(null);
  const backFaceRef = useRef<HTMLDivElement>(null);
  const canHoverRef = useRef<boolean | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydration flag without setState inside an effect: the server snapshot is
  // false, the client snapshot is true.
  const mounted = useSyncExternalStore(subscribeToNothing, () => true, () => false);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const canHover = () => {
    if (canHoverRef.current === null) {
      canHoverRef.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    }
    return canHoverRef.current;
  };

  const isDark = mounted && resolvedTheme === "dark";
  const markColor = isDark ? "dark" : "light";

  const switchTheme = useCallback(() => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    play(next);
  }, [isDark, setTheme, play]);

  const copyEmail = useCallback(async () => {
    const ok = await writeClipboard(PROFILE.email).catch(() => false);
    setCopyState(ok ? "done" : "failed");
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyState("idle"), 2200);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover() || flipped) return;
    const el = wrapperRef.current;
    const tilt = tiltRef.current;
    if (!el || !tilt) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    tilt.style.transform = `rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
    tilt.style.transition = "transform 0.25s ease-out";
  }, [flipped]);

  const handleMouseLeave = useCallback(() => {
    const tilt = tiltRef.current;
    if (!tilt) return;
    tilt.style.transform = "rotateX(0deg) rotateY(0deg)";
    tilt.style.transition = "transform 0.8s ease-out";
  }, []);

  const flipToBack = useCallback(() => {
    const tilt = tiltRef.current;
    if (tilt) {
      tilt.style.transform = "rotateX(0deg) rotateY(0deg)";
      tilt.style.transition = "transform 0.3s ease-out";
    }
    setFlipped(true);
    // Move focus to the new face, so the keyboard does not stay on a button
    // that is now inert. The face itself takes no ring.
    window.requestAnimationFrame(() => backFaceRef.current?.focus({ preventScroll: true }));
  }, []);

  const flipToFront = useCallback(() => {
    setFlipped(false);
    window.requestAnimationFrame(() => flipTriggerRef.current?.focus({ preventScroll: true }));
  }, []);

  // Escape is the keyboard way back, the same as closing a dialog.
  useEffect(() => {
    if (!flipped) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setFlipped(false);
      window.requestAnimationFrame(() => flipTriggerRef.current?.focus({ preventScroll: true }));
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [flipped]);

  const ink = isDark ? "rgb(255 255 255 / 0.22)" : "rgb(13 18 24 / 0.9)";
  const shine = "rgb(255 255 255)";
  // Light mode keeps the sweep monochrome. A blue tip reads as a stain on a
  // white canvas, so the halo is a soft ink instead of a colour.
  const halo = isDark ? "rgb(255 255 255)" : "rgb(13 18 24 / 0.55)";

  const frameStyle: React.CSSProperties & Record<`--${string}`, string> = {
    "--ink": ink,
    "--shine": shine,
    "--halo": halo,
    backgroundColor: ink,
    backgroundImage:
      `conic-gradient(from var(--spin-angle, 0deg),` +
      ` ${ink} 0deg, ${ink} 319deg,` +
      ` ${halo} 326deg, ${shine} 331deg,` +
      ` ${ink} 337deg, ${ink} 360deg)`,
    borderRadius: "1.24rem",
  };

  return (
    <div
      ref={wrapperRef}
      className="flip-scene mx-auto w-full max-w-[340px] px-2 sm:max-w-[356px] sm:px-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={tiltRef} className="flip-3d" style={{ willChange: "transform" }}>
        <div
          style={frameStyle}
          className={`flip-inner spin-border-animate relative p-[3px] shadow-[0_20px_44px_-18px_rgb(0,0,0/0.45)] dark:shadow-[0_20px_44px_-16px_rgb(0,0,0/0.9)] ${flipped ? "is-flipped" : ""}`}
        >
          <div
            className="flip-face card-surface card-body relative w-full overflow-hidden rounded-[1.05rem]"
            inert={flipped}
            aria-hidden={flipped || undefined}
          >

            {/* ── Top bar ─────────────────────────────────────────────── */}
            <div className="absolute inset-x-0 top-0 z-20 grid grid-cols-2 items-center px-3 pt-2.5">
              <button
                type="button"
                aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Switch theme"}
                onClick={switchTheme}
                className={`${PILL} justify-self-start`}
              >
                {isDark ? (
                  <Sun className="size-4 shrink-0" aria-hidden="true" />
                ) : (
                  <Moon className="size-4 shrink-0" aria-hidden="true" />
                )}
                <span>{isDark ? "Light" : "Dark"}</span>
              </button>

              <button
                ref={flipTriggerRef}
                type="button"
                aria-label="Open the stats side of the card"
                title="GitHub stats and open source projects"
                onClick={flipToBack}
                className={`${PILL} justify-self-end`}
              >
                <LayoutDashboard className="size-3.5 shrink-0" aria-hidden="true" />
                <span>Stats</span>
              </button>
            </div>

            {/* ── Body ────────────────────────────────────────────────── */}
            <div
              style={{
                paddingLeft: "var(--pad-x)",
                paddingRight: "var(--pad-x)",
                paddingTop: "var(--pad-t)",
                paddingBottom: "var(--pad-b)",
              }}
            >
              {/* Identity */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  aria-label="Show my photo"
                  aria-pressed={showPhoto}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") setShowPhoto(true);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === "mouse") setShowPhoto(false);
                  }}
                  onPointerUp={(e) => {
                    if (e.pointerType !== "mouse") setShowPhoto((v) => !v);
                  }}
                  onClick={(e) => {
                    // Keyboard activation only. Mouse and touch are handled above.
                    if (e.detail === 0) setShowPhoto((v) => !v);
                  }}
                  data-show={showPhoto}
                  className={`avatar-box relative h-[var(--avatar)] w-[var(--avatar)] shrink-0 overflow-hidden rounded-2xl border-[3px] border-black bg-neutral-200 shadow-[0_8px_22px_-10px_rgb(0,0,0/0.45)] ring-1 ring-black/10 ${FOCUS_RING} dark:border-[3px] dark:border-white dark:bg-neutral-800 dark:ring-white/15`}
                >
                  {imageError ? (
                    <div className="grid h-full w-full place-items-center font-display text-2xl font-semibold text-black/60 dark:text-white/70">
                      MT
                    </div>
                  ) : (
                    <>
                      <Image
                        src={PROFILE.profileImage}
                        alt={PROFILE.name}
                        fill
                        sizes="(max-width: 730px) 68px, 84px"
                        className="avatar-main absolute inset-0 object-contain"
                        priority
                        onError={() => setImageError(true)}
                      />
                      <Image
                        src="/PFP.png"
                        alt={`${PROFILE.name} photo`}
                        fill
                        sizes="(max-width: 730px) 68px, 84px"
                        className="avatar-swap absolute inset-0 object-contain"
                      />
                    </>
                  )}
                </button>

                <h1 className="mt-2.5 text-center font-display text-[length:var(--name)] font-semibold leading-[1.12] tracking-[-0.02em] text-neutral-900 dark:text-neutral-50">
                  {PROFILE.name}
                </h1>

                <p className="mt-1 text-center font-display text-[length:var(--title)] font-medium leading-snug tracking-[-0.01em] text-neutral-500 dark:text-neutral-400">
                  {PROFILE.title}
                </p>

                {/* Availability. Same pill language as the top bar buttons, so
                    it reads as part of the chrome and not as a separate alert. */}
                <button
                  type="button"
                  title={PROFILE.statusDetail}
                  onClick={() => safeOpen(PROFILE.calUrl)}
                  className={`${PILL} mx-auto mt-[var(--gap)] max-w-full px-3`}
                >
                  <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{PROFILE.status}</span>
                  <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
                </button>
              </div>

              {/* About text */}
              <p className="my-[var(--gap)] text-center text-[length:var(--body-text)] leading-[1.7] font-medium text-neutral-500 dark:text-neutral-400 max-w-[300px] mx-auto">
                {PROFILE.about}
              </p>

              {/* Three actions: two peers, then one white full-width button. */}
              <div className="mt-[var(--gap)] grid grid-cols-2 gap-2">
                <button type="button" aria-label="My portfolio" onClick={() => safeOpen(PROFILE.portfolioUrl)} className={TILE_SECONDARY}>
                  <span className={ICON_SECONDARY}>
                    <User className="size-[14px] shrink-0" aria-hidden="true" />
                  </span>
                  <span className={TILE_LABEL}>My Portfolio</span>
                </button>

                <button type="button" aria-label="My studio" onClick={() => safeOpen(PROFILE.studioUrl)} className={TILE_SECONDARY}>
                  <span className={ICON_SECONDARY}>
                    <Layers className="size-[14px] shrink-0" aria-hidden="true" />
                  </span>
                  <span className={TILE_LABEL}>My Studio</span>
                </button>

                <button
                  type="button"
                  aria-label="Copy email"
                  onClick={copyEmail}
                  aria-live="polite"
                  className={`col-span-2 flex h-[var(--tile-h)] items-center justify-center gap-2 rounded-xl border border-black/10 bg-white font-display text-[11px] font-semibold text-neutral-900 ${FOCUS_RING} dark:border-white/15 dark:bg-white dark:text-neutral-900`}
                >
                  {copyState === "done" ? (
                    <Check className="size-[15px] shrink-0 stroke-[2.5] text-emerald-600" aria-hidden="true" />
                  ) : copyState === "failed" ? (
                    <TriangleAlert className="size-[15px] shrink-0 text-red-500" aria-hidden="true" />
                  ) : (
                    <Mail className="size-[15px] shrink-0" aria-hidden="true" />
                  )}
                  {copyState === "done" ? "Copied!" : copyState === "failed" ? "Failed" : "Copy Email"}
                </button>
              </div>

              {/* Social profiles. OS projects now live on the stats side. */}
              <section className="mt-[var(--gap)]" aria-label="Social profiles">
                <div>
                  <div className="mb-2 flex items-center justify-center gap-1.5">
                    <span className="grid size-5 place-items-center rounded-md border border-black/10 bg-black/[0.03] text-neutral-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-400">
                      <Share2 className="size-3" aria-hidden="true" />
                    </span>
                    <h2
                      id="find-me-elsewhere"
                      className="font-display text-[10px] font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Find me elsewhere
                    </h2>
                  </div>
                  <ul aria-labelledby="find-me-elsewhere" className="flex items-center justify-center gap-2">
                    {SOCIALS.map((social) => (
                      <li key={social.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              aria-label={social.label}
                              onClick={() => safeOpen(social.href)}
                              className={`icon-button grid size-9 place-items-center rounded-lg border border-black/10 bg-white/70 transition-colors active:bg-white disabled:pointer-events-none disabled:opacity-45 dark:border-white/10 dark:bg-white/[0.04] dark:active:bg-white/15 ${FOCUS_RING}`}
                            >
                              <BrandMark path={social.path} color={social[markColor]} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            sideOffset={6}
                            className="rounded-full px-2 py-1 font-display text-[10px] font-medium"
                          >
                            {social.label}
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

            </div>
          </div>

          <div
            ref={backFaceRef}
            role="group"
            aria-label="Command center"
            tabIndex={-1}
            className="flip-back flip-face absolute inset-0 outline-none"
            inert={!flipped}
            aria-hidden={!flipped || undefined}
          >
            <IhDashboard data={data} onFlipBack={flipToFront} />
          </div>
        </div>
      </div>
    </div>
  );
}
