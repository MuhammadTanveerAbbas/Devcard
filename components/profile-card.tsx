"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Copy,
  FileDown,
  Layers,
  Mail,
  Moon,
  Sun,
  TriangleAlert,
  User,
} from "lucide-react";
import { SOCIALS } from "@/components/brand-marks";
import { useToggleSound } from "@/hooks/use-toggle-sound";

// ─── Profile ──────────────────────────────────────────────────────────────────

const PROFILE = {
  name: "Muhammad Tanveer Abbas",
  title: "AI Native Product Builder",
  status: "Available for work",
  statusDetail: "Booking new builds from next month",
  about:
    "I design and ship AI native products end to end. Interfaces, agents, and the plumbing behind them.",
  profileImage: "/Me.webp",
  email: "themvpguy.contact@gmail.com",
  calUrl: "https://cal.com/muhammadtanveerabbas",
  portfolioUrl: "https://muhammadtanveerabbas.vercel.app",
  studioUrl: "https://themvpguy.vercel.app",
  cvUrl: "/Resume.pdf",
};

const BUILDS = [
  "AI Agents",
  "SaaS Products",
  "MVPs",
  "Interfaces",
  "API Integrations",
  "Automations",
];

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
  if (isValidUrl(url)) window.open(url, "_blank", "noopener,noreferrer");
}

async function writeClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.top = "-1000px";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch { ok = false; }
  document.body.removeChild(ta);
  return ok;
}

// ─── Brand mark ───────────────────────────────────────────────────────────────

type BrandProps = { path: string; color: string; className?: string };

function BrandMark({ path, color, className = "h-[15px] w-[15px]" }: BrandProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill={color} d={path} />
    </svg>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

type CopyState = "idle" | "done" | "failed";

export function ProfileCard() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [tooltip, setTooltip] = useState<string | null>(null);
  const { play } = useToggleSound();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canHoverRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    canHoverRef.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  useEffect(() => {
    return () => { if (copyTimer.current) clearTimeout(copyTimer.current); };
  }, []);

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
    if (!canHoverRef.current) return;
    const el = wrapperRef.current;
    const tilt = tiltRef.current;
    if (!el || !tilt) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    tilt.style.transform = `rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
    tilt.style.transition = "transform 0.25s ease-out";
  }, []);

  const handleMouseLeave = useCallback(() => {
    const tilt = tiltRef.current;
    if (!tilt) return;
    tilt.style.transform = "rotateX(0deg) rotateY(0deg)";
    tilt.style.transition = "transform 0.8s ease-out";
  }, []);

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
      className="mx-auto w-full max-w-[340px] px-2 sm:max-w-[356px] sm:px-0"
      style={{ perspective: "1100px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={tiltRef} style={{ willChange: "transform" }}>
        <div
          style={frameStyle}
          className="spin-border-animate p-[3px] shadow-[0_20px_44px_-18px_rgb(0,0,0/0.45)] dark:shadow-[0_20px_44px_-16px_rgb(0,0,0/0.9)]"
        >
          <div className="card-surface card-body relative w-full overflow-hidden rounded-[1.05rem]">

            {/* ── Top bar ─────────────────────────────────────────────── */}
            <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-3 pt-2.5">
              <button
                type="button"
                aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Switch theme"}
                onClick={switchTheme}
                className="flex h-[var(--top-h)] items-center gap-1.5 rounded-full border border-black/10 bg-white/85 px-3 font-display text-[11px] font-medium text-black/70 backdrop-blur-xl transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/25 dark:border-white/15 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15 dark:focus-visible:ring-white/35"
              >
                {isDark ? <Sun className="size-3 shrink-0" /> : <Moon className="size-3 shrink-0" />}
                <span>{isDark ? "Light" : "Dark"}</span>
              </button>

              <button
                type="button"
                aria-label="Download resume"
                onClick={() => window.open(PROFILE.cvUrl, "_blank", "noopener,noreferrer")}
                className="flex h-[var(--top-h)] items-center gap-1.5 rounded-full border border-black/10 bg-white/85 px-3 font-display text-[11px] font-medium text-black/70 backdrop-blur-xl transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/25 dark:border-white/15 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15 dark:focus-visible:ring-white/35"
              >
                <FileDown className="size-3 shrink-0" />
                <span>Resume</span>
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
                <div className="relative h-[var(--avatar)] w-[var(--avatar)] overflow-hidden rounded-2xl border-[3px] border-white bg-neutral-200 shadow-[0_8px_22px_-10px_rgb(0,0,0/0.45)] ring-1 ring-black/10 dark:border-black dark:bg-neutral-800 dark:ring-white/15">
                  {imageError ? (
                    <div className="grid h-full w-full place-items-center font-display text-2xl font-semibold text-black/60 dark:text-white/70">
                      MT
                    </div>
                  ) : (
                    <Image
                      src={PROFILE.profileImage}
                      alt={PROFILE.name}
                      fill
                      sizes="(max-width: 730px) 66px, 82px"
                      className="object-cover"
                      priority
                      onError={() => setImageError(true)}
                    />
                  )}
                </div>

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
                  className="mx-auto mt-[var(--gap)] flex h-[var(--top-h)] max-w-full items-center gap-1.5 rounded-full border border-black/10 bg-white/85 px-3 font-display text-[11px] font-medium text-black/70 backdrop-blur-xl transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/25 dark:border-white/15 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15 dark:focus-visible:ring-white/35"
                >
                  <CalendarDays className="size-3 shrink-0" aria-hidden="true" />
                  <span className="truncate">{PROFILE.status}</span>
                  <ChevronRight className="size-3 shrink-0 opacity-60" aria-hidden="true" />
                </button>
              </div>

              {/* About */}
              <p className="mt-[var(--gap)] text-center text-[length:var(--body-text)] leading-[1.6] text-neutral-600 dark:text-neutral-300">
                {PROFILE.about}
              </p>

              {/* What I build */}
              <div className="mt-[var(--gap)]">
                <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
                  What I build
                </p>
                <ul className="flex flex-wrap justify-center gap-1.5">
                  {BUILDS.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-black/8 bg-black/[0.025] px-2.5 py-[3px] text-[10.5px] font-medium text-neutral-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Action grid 2x2 ─────────────────────────────────────
                  Every tile is the same height. Icon sits top-left inside
                  a small rounded box. Label sits bottom-left. Arrow sits
                  top-right on link tiles. The filled tile (Book a call) is
                  the visual anchor; the rest are ghost-outlined peers.
              ─────────────────────────────────────────────────────────── */}
              <div className="mt-[var(--gap)] grid grid-cols-2 gap-2">

                {/* Book a call — primary filled */}
                <button
                  type="button"
                  onClick={() => safeOpen(PROFILE.calUrl)}
                  className="group relative flex h-[var(--tile-h)] flex-col justify-between rounded-xl bg-neutral-900 p-2.5 text-left transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 dark:bg-white dark:hover:bg-neutral-100 dark:focus-visible:ring-white/35"
                >
                  <span className="flex items-start justify-between">
                    <span className="flex size-[var(--icon-btn)] items-center justify-center rounded-lg bg-white/15 dark:bg-black/10">
                      <CalendarDays className="size-[14px] shrink-0 text-white dark:text-neutral-900" aria-hidden="true" />
                    </span>
                    <ArrowUpRight className="size-3.5 shrink-0 text-white/50 dark:text-neutral-900/40" aria-hidden="true" />
                  </span>
                  <span className="block font-display text-[11.5px] font-semibold leading-tight text-white dark:text-neutral-900">
                    Book a call
                  </span>
                </button>

                {/* Portfolio — secondary outlined */}
                <button
                  type="button"
                  onClick={() => safeOpen(PROFILE.portfolioUrl)}
                  className="group relative flex h-[var(--tile-h)] flex-col justify-between rounded-xl border border-black/10 bg-black/[0.03] p-2.5 text-left transition-colors hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/25 dark:border-white/12 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:focus-visible:ring-white/35"
                >
                  <span className="flex items-start justify-between">
                    <span className="flex size-[var(--icon-btn)] items-center justify-center rounded-lg border border-black/8 bg-white/60 dark:border-white/10 dark:bg-white/[0.06]">
                      <User className="size-[14px] shrink-0 text-neutral-700 dark:text-neutral-200" aria-hidden="true" />
                    </span>
                    <ArrowUpRight className="size-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" aria-hidden="true" />
                  </span>
                  <span className="block font-display text-[11.5px] font-semibold leading-tight text-neutral-900 dark:text-neutral-50">
                    Portfolio
                  </span>
                </button>

                {/* Studio — secondary outlined */}
                <button
                  type="button"
                  onClick={() => safeOpen(PROFILE.studioUrl)}
                  className="group relative flex h-[var(--tile-h)] flex-col justify-between rounded-xl border border-black/10 bg-black/[0.03] p-2.5 text-left transition-colors hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/25 dark:border-white/12 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:focus-visible:ring-white/35"
                >
                  <span className="flex items-start justify-between">
                    <span className="flex size-[var(--icon-btn)] items-center justify-center rounded-lg border border-black/8 bg-white/60 dark:border-white/10 dark:bg-white/[0.06]">
                      <Layers className="size-[14px] shrink-0 text-neutral-700 dark:text-neutral-200" aria-hidden="true" />
                    </span>
                    <ArrowUpRight className="size-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" aria-hidden="true" />
                  </span>
                  <span className="block font-display text-[11.5px] font-semibold leading-tight text-neutral-900 dark:text-neutral-50">
                    Studio
                  </span>
                </button>

                {/* Copy email — interactive tile */}
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-live="polite"
                  className="group relative flex h-[var(--tile-h)] flex-col justify-between rounded-xl border border-black/10 bg-black/[0.03] p-2.5 text-left transition-colors hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/25 dark:border-white/12 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:focus-visible:ring-white/35"
                >
                  <span className="flex items-start justify-between">
                    <span className="flex size-[var(--icon-btn)] items-center justify-center rounded-lg border border-black/8 bg-white/60 dark:border-white/10 dark:bg-white/[0.06]">
                      {copyState === "done" ? (
                        <Check className="size-[14px] shrink-0 stroke-[2.5] text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      ) : copyState === "failed" ? (
                        <TriangleAlert className="size-[14px] shrink-0 text-red-500 dark:text-red-400" aria-hidden="true" />
                      ) : (
                        <Mail className="size-[14px] shrink-0 text-neutral-700 dark:text-neutral-200" aria-hidden="true" />
                      )}
                    </span>
                    <Copy className="size-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" aria-hidden="true" />
                  </span>
                  <span className="block font-display text-[11.5px] font-semibold leading-tight text-neutral-900 dark:text-neutral-50">
                    {copyState === "done"
                      ? "Copied!"
                      : copyState === "failed"
                        ? "Failed"
                        : "Copy email"}
                  </span>
                </button>

              </div>

              {/* ── Socials ─────────────────────────────────────────────── */}
              <div aria-hidden="true" className="mt-[var(--gap)] h-px w-full bg-black/[0.07] dark:bg-white/[0.08]" />
              <ul className="mt-[var(--gap)] flex items-center justify-center gap-1.5">
                {SOCIALS.map((social) => (
                  <li key={social.id} className="relative">
                    {tooltip === social.id && (
                      <span
                        role="tooltip"
                        className="pointer-events-none absolute -top-7 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-1.5 py-0.5 font-display text-[10px] font-medium text-white shadow-md dark:bg-white dark:text-neutral-900"
                      >
                        {social.label}
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label={social.label}
                      onClick={() => safeOpen(social.href)}
                      onMouseEnter={() => setTooltip(social.id)}
                      onMouseLeave={() => setTooltip(null)}
                      onFocus={() => setTooltip(social.id)}
                      onBlur={() => setTooltip(null)}
                      className="icon-button grid h-[var(--control-h)] w-[var(--control-h)] place-items-center rounded-lg border border-black/10 bg-white/70 transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 dark:border-white/12 dark:bg-white/6 dark:hover:bg-white/10 dark:focus-visible:ring-white/35"
                    >
                      <BrandMark path={social.path} color={social[markColor]} />
                    </button>
                  </li>
                ))}
              </ul>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
