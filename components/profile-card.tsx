"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Sun,
  Moon,
  Calendar,
  Mail,
  Copy,
  Check,
  ChevronUp,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

// ─── Profile Configuration ────────────────────────────────────────────────────

const PROFILE = {
  name: "Muhammad Tanveer Abbas",
  title: "SaaS Developer",
  status: "Available for Work",
  about: "I build your SaaS MVP in 14 days. Auth, payments, and everything in between. Ship and start getting users.",
  profileImage: "/Me.webp",
  email: "themvpguy.contact@gmail.com",
  calUrl: "https://cal.com/muhammadtanveerabbas",
  portfolioUrl: "https://themvpguy.vercel.app/",
  twitterUrl: "https://x.com/m_tanveerabbas",
  linkedinUrl: "https://linkedin.com/in/muhammadtanveerabbas",
  githubUrl: "https://github.com/muhammadtanveerabbas",
  blueskyUrl: "https://bsky.app/profile/mtanveerabbas-dev.bsky.social",
  devtoUrl: "https://dev.to/muhammadtanveerabbas",
  cvUrl: "/Resume.pdf",
  skills: [
    "Next.js",
    "Tailwind CSS",
    "TypeScript",
    "Node.js",
    "Stripe",
    "Auth",
    "Supabase",
    "Vercel",
  ],
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const DARK_ICON_COLOR = "#9CA3AF";

function iconColor(isDark: boolean, brandColor: string) {
  return isDark ? DARK_ICON_COLOR : brandColor;
}

type BrandIconProps = {
  className?: string;
  color: string;
};

const LinkedInIcon = ({ className = "w-4 h-4", color }: BrandIconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill={color} aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
  </svg>
);

const GitHubIcon = ({ className = "w-4 h-4", color }: BrandIconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill={color} aria-hidden="true">
    <path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.382 1.235-3.222-.135-.303-.54-1.523.105-3.177 0 0 1.005-.322 3.3 1.23a11.51 11.51 0 0 1 3.005-.404c1.02.005 2.045.138 3.005.404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.654.24 2.874.12 3.177.765.84 1.23 1.912 1.23 3.222 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const XIcon = ({ isDark }: { isDark: boolean }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={iconColor(isDark, "#000000")} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const BlueskyIcon = ({ isDark }: { isDark: boolean }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={iconColor(isDark, "#0085FF")} aria-hidden="true">
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.299-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
  </svg>
);

const DevToIcon = ({ isDark }: { isDark: boolean }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={iconColor(isDark, "#0A0A0A")} aria-hidden="true">
    <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.29zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z" />
  </svg>
);

// ─── Skill Icons (Simple Icons SVGs) ────────────────────────────────────────

function SkillIcon({ name, isDark }: { name: string; isDark: boolean }) {
  const cls = "w-4 h-4 shrink-0";
  switch (name) {
    case "Next.js":
      return (
        <svg className={cls} viewBox="0 0 24 24" aria-hidden="true" fill={iconColor(isDark, "#000000")}>
          <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.499-.054z" />
        </svg>
      );
    case "Tailwind CSS":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill={iconColor(isDark, "#06B6D4")} aria-hidden="true">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
        </svg>
      );
    case "TypeScript":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill={iconColor(isDark, "#3178C6")} aria-hidden="true">
          <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
        </svg>
      );
    case "Node.js":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill={iconColor(isDark, "#339933")} aria-hidden="true">
          <path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.605.065-.037.151-.023.218.017l2.256 1.339c.082.045.198.045.275 0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.053-.19-.137-.242l-8.791-5.072c-.081-.047-.189-.047-.271 0L3.075 6.68c-.084.053-.139.146-.139.241v10.15c0 .097.055.189.137.236l2.409 1.392c1.307.654 2.108-.116 2.108-.891V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.111.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L2.28 18.675a1.85 1.85 0 0 1-.919-1.604V6.921c0-.661.353-1.278.919-1.608l8.795-5.082c.552-.315 1.285-.315 1.833 0l8.794 5.082c.566.33.92.947.92 1.608v10.15c0 .661-.354 1.275-.92 1.604l-8.794 5.076c-.281.163-.6.247-.91.247zm2.718-6.993c-3.852 0-4.659-1.769-4.659-3.252 0-.142.114-.253.256-.253h1.138c.127 0 .233.092.252.217.172 1.161.684 1.747 3.013 1.747 1.854 0 2.644-.42 2.644-1.405 0-.568-.225-.99-3.116-1.273-2.416-.238-3.909-.773-3.909-2.706 0-1.782 1.502-2.845 4.019-2.845 2.825 0 4.224.981 4.402 3.088a.256.256 0 0 1-.065.196.255.255 0 0 1-.189.083h-1.143a.253.253 0 0 1-.248-.199c-.276-1.224-.944-1.616-2.757-1.616-2.031 0-2.268.707-2.268 1.237 0 .642.279.829 3.021 1.191 2.715.36 4.001.869 4.001 2.776-.003 1.93-1.609 3.013-4.412 3.013z" />
        </svg>
      );
    case "Stripe":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill={iconColor(isDark, "#635BFF")} aria-hidden="true">
          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
        </svg>
      );
    case "Auth":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill={iconColor(isDark, "#7C3AED")} aria-hidden="true">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 8c2 0 6 1 6 3v1H6v-1c0-2 4-3 6-3z" />
        </svg>
      );
    case "Supabase":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill={iconColor(isDark, "#3ECF8E")} aria-hidden="true">
          <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.015.985 1.259 1.408 1.874.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.58z" />
        </svg>
      );
    case "Vercel":
      return (
        <svg className={cls} viewBox="0 0 24 24" aria-hidden="true" fill={iconColor(isDark, "#000000")}>
          <path d="M24 22.525H0l12-21.05 12 21.05z" />
        </svg>
      );
    default:
      return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidUrl(v: string) {
  if (!v) return false;
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

// ─── Component ────────────────────────────────────────────────────────────────

export function ProfileCard() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const fn = () => setShowScrollTop(el.scrollTop > 100);
    el.addEventListener("scroll", fn);
    return () => el.removeEventListener("scroll", fn);
  }, []);

  const scrollToTop = useCallback(
    () => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }),
    [],
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapperRef.current;
    const tilt = tiltRef.current;
    if (!el || !tilt) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    tilt.style.transform = `rotateX(${-y * 6}deg) rotateY(${x * 8}deg)`;
    tilt.style.transition = "transform 0.25s ease-out";
  }, []);

  const handleMouseLeave = useCallback(() => {
    const tilt = tiltRef.current;
    if (!tilt) return;
    tilt.style.transform = "rotateX(0deg) rotateY(0deg)";
    tilt.style.transition = "transform 0.8s ease-out";
  }, []);
  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText(PROFILE.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);
  const showTip = useCallback((l: string) => setTooltip(l), []);
  const hideTip = useCallback(() => setTooltip(null), []);

  const isDark = mounted && resolvedTheme === "dark";
  const shineColor = isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.3)";
  const baseBorder = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
  const bgColor = isDark ? "#000" : "#fff";

  const borderStyle: React.CSSProperties = {
    "--shine": shineColor,
    "--base": baseBorder,
    "--bg": bgColor,
    background: `linear-gradient(${bgColor},${bgColor}) padding-box,
      conic-gradient(from var(--spin-angle,0deg),${baseBorder} 0deg,${baseBorder} 300deg,${shineColor} 340deg,${shineColor} 350deg,${baseBorder} 360deg) border-box`,
    border: "2px solid transparent",
    borderRadius: "1rem",
  } as React.CSSProperties;

  const socials = [
    {
      key: "linkedin",
      label: "LinkedIn",
      url: PROFILE.linkedinUrl,
      icon: <LinkedInIcon color={iconColor(isDark, "#0A66C2")} />,
    },
    {
      key: "github",
      label: "GitHub",
      url: PROFILE.githubUrl,
      icon: <GitHubIcon color={iconColor(isDark, "#181717")} />,
    },
    {
      key: "bluesky",
      label: "Bluesky",
      url: PROFILE.blueskyUrl,
      icon: <BlueskyIcon isDark={isDark} />,
    },
    {
      key: "devto",
      label: "Dev.to",
      url: PROFILE.devtoUrl,
      icon: <DevToIcon isDark={isDark} />,
    },
    {
      key: "x",
      label: "X (Twitter)",
      url: PROFILE.twitterUrl,
      icon: <XIcon isDark={isDark} />,
    },
  ];

  return (
    <div
      ref={wrapperRef}
      className="w-full max-w-[360px] xs:max-w-sm mx-auto px-2 xs:px-0"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={tiltRef} style={{ willChange: "transform" }}>
        <div style={borderStyle} className="shadow-xl spin-border-animate">
          <Card className="relative w-full overflow-hidden bg-white dark:bg-black rounded-[14px] shadow-none border-0">
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 pt-3">
              {/* Theme toggle */}
              <button
                aria-label="Toggle theme"
                className="flex items-center gap-1 px-2 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-xl hover:bg-white dark:hover:bg-black border border-black/8 dark:border-white/10 shadow-sm rounded-full text-[11px] font-medium text-black/70 dark:text-white/70 transition-all duration-300"
                onClick={() => setTheme(isDark ? "light" : "dark")}
              >
                {mounted &&
                  (isDark ? (
                    <>
                      <Sun className="w-3 h-3 shrink-0" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3 h-3 shrink-0" />
                      <span>Dark</span>
                    </>
                  ))}
              </button>

              {/* Resume */}
              <button
                aria-label="View resume"
                className="flex items-center gap-1 px-2 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-xl hover:bg-white dark:hover:bg-black border border-black/8 dark:border-white/10 shadow-sm rounded-full text-[11px] font-medium text-black/70 dark:text-white/70 transition-all duration-300"
                onClick={() =>
                  window.open(PROFILE.cvUrl, "_blank", "noopener,noreferrer")
                }
              >
                <FileText className="w-3 h-3 shrink-0" />
                <span>Resume</span>
              </button>
            </div>

            {/* Scrollable body */}
            <div
              ref={scrollRef}
              className="overflow-y-auto"
              style={{ scrollbarWidth: "none", maxHeight: "92svh" }}
            >
              {/* Avatar */}
              <div className="pt-11 pb-1 flex flex-col items-center px-4">
                <div className="relative">
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white dark:border-black shadow-[0_6px_24px_rgb(0,0,0,0.12)] overflow-hidden bg-gray-100 dark:bg-gray-900 ring-1 ring-black/5 dark:ring-white/5">
                    <Image
                      src={
                        imageError
                          ? "/placeholder-user.jpg"
                          : PROFILE.profileImage
                      }
                      alt={PROFILE.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                      priority
                      onError={() => setImageError(true)}
                    />
                  </div>
                  <div className="absolute bottom-0.5 right-0.5 bg-black dark:bg-white rounded-full p-[3px] shadow-md ring-2 ring-white dark:ring-black">
                    <svg
                      className="w-3 h-3 text-white dark:text-black"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                <div className="mt-3 text-center space-y-1">
                  <h1 className="text-lg sm:text-xl font-semibold text-black dark:text-white tracking-tight leading-tight">
                    {PROFILE.name}
                  </h1>
                  <div className="inline-block px-3 py-0.5 border border-black/20 dark:border-white/20 rounded-full text-[11px] sm:text-xs font-medium text-black/70 dark:text-white/70">
                    {PROFILE.title}
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  {PROFILE.status}
                </div>
              </div>

              {/* Content */}
              <div className="px-4 sm:px-5 pb-5 pt-3 space-y-3.5">
                {/* Bio */}
                <p className="text-center text-black/60 dark:text-white/60 text-[11px] sm:text-xs leading-relaxed">
                  {PROFILE.about}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap justify-center gap-1.5">
                  {PROFILE.skills.map((s) => (
                    <span
                      key={s}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-medium rounded-lg bg-white dark:bg-black text-black/80 dark:text-white/80 border-2 border-black/10 dark:border-white/15 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <SkillIcon name={s} isDark={isDark} />
                      {s}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="w-full group bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 border-0 shadow-sm rounded-xl font-medium text-[11px] sm:text-xs h-8 sm:h-9 transition-all duration-300"
                    onClick={() => safeOpen(PROFILE.calUrl)}
                  >
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 group-hover:scale-110 transition-transform shrink-0" />
                    Book a Call
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full group bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl font-medium text-[11px] sm:text-xs h-8 sm:h-9 transition-all duration-300"
                    onClick={() => safeOpen(PROFILE.portfolioUrl)}
                  >
                    <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 group-hover:scale-110 transition-transform shrink-0" />
                    Portfolio
                  </Button>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/2 dark:bg-white/5">
                  <Mail className="w-3.5 h-3.5 text-black/40 dark:text-white/40 shrink-0" />
                  <span className="text-[10px] sm:text-xs text-black/60 dark:text-white/60 truncate flex-1 select-all">
                    {PROFILE.email}
                  </span>
                  <button
                    onClick={copyEmail}
                    aria-label="Copy email"
                    className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
                    )}
                  </button>
                </div>

                {/* Social icons */}
                <div className="flex gap-2 justify-center flex-wrap">
                  {socials.map(({ key, label, icon, url }) => (
                    <div key={key} className="relative">
                      {tooltip === label && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] bg-black dark:bg-white text-white dark:text-black rounded-lg whitespace-nowrap pointer-events-none z-30 shadow-md">
                          {label}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black dark:border-t-white" />
                        </div>
                      )}
                      <button
                        aria-label={label}
                        className="group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-black/10 dark:border-white/12 bg-white/70 dark:bg-white/4 hover:bg-black/4 dark:hover:bg-white/8 hover:border-black/20 dark:hover:border-white/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/15 dark:focus-visible:ring-white/20 transition-all duration-200"
                        onClick={() => safeOpen(url)}
                        onMouseEnter={() => showTip(label)}
                        onMouseLeave={hideTip}
                        onFocus={() => showTip(label)}
                        onBlur={hideTip}
                      >
                        <span className="opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all">
                          {icon}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scroll-to-top */}
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="absolute bottom-3 right-3 z-20 p-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg hover:scale-110 transition-transform"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
