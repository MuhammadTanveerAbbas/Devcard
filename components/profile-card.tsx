"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ExternalLink, Linkedin, Github,
  Sun, Moon, Calendar, Mail, Copy, Check, ChevronUp, FileText,
} from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"

// ─── Profile Configuration ────────────────────────────────────────────────────

const PROFILE = {
  name: "Muhammad Tanveer Abbas",
  title: "SaaS Developer",
  status: "Available for Work",
  about: "I build your SaaS MVP in 14 days  auth, payments, and everything in between  so you can start getting users, not next quarter.",
  profileImage: "/Me.jfif",
  email: "themvpguy.contact@gmail.com",
  calUrl: "https://cal.com/muhammadtanveerabbas",
  portfolioUrl: "https://themvpguy.vercel.app/",
  twitterUrl: "https://x.com/m_tanveerabas",
  linkedinUrl: "https://linkedin.com/in/muhammadtanveerabbas",
  githubUrl: "https://github.com/muhammadtanveerabbas",
  blueskyUrl: "https://bsky.app/profile/mtanveerabbas-dev.bsky.social",
  devtoUrl: "https://dev.to/muhammadtanveerabbas",
  cvUrl: "/Resume.pdf",
  skills: ["Next.js","React","TypeScript","Node.js","Stripe","Auth","PostgreSQL","Vercel"],
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const XIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const BlueskyIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.299-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
  </svg>
)

const DevToIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.29zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z" />
  </svg>
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidUrl(v: string) {
  if (!v) return false
  try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:" }
  catch { return false }
}
function safeOpen(url: string) {
  if (isValidUrl(url)) window.open(url, "_blank", "noopener,noreferrer")
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProfileCard() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [tooltip, setTooltip] = useState<string | null>(null)
  const [angle, setAngle] = useState(0)
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const lastRef = useRef<number>(0)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const step = (ts: number) => {
      if (lastRef.current) setAngle(a => (a + (ts - lastRef.current) * 0.12) % 360)
      lastRef.current = ts
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const fn = () => setShowScrollTop(el.scrollTop > 100)
    el.addEventListener("scroll", fn)
    return () => el.removeEventListener("scroll", fn)
  }, [])

  const scrollToTop = useCallback(() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapperRef.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (e.clientX - left) / width  - 0.5  // -0.5 to 0.5
    const y = (e.clientY - top)  / height - 0.5
    setTiltY(x * 8)
    setTiltX(-y * 6)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTiltX(0)
    setTiltY(0)
  }, [])
  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText(PROFILE.email).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }, [])
  const showTip = useCallback((l: string) => setTooltip(l), [])
  const hideTip = useCallback(() => setTooltip(null), [])

  const isDark = mounted && theme === "dark"
  const shineColor = isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.3)"
  const baseBorder = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"
  const bgColor    = isDark ? "#000" : "#fff"

  const borderStyle: React.CSSProperties = {
    background: `linear-gradient(${bgColor},${bgColor}) padding-box,
      conic-gradient(from ${angle}deg,${baseBorder} 0deg,${baseBorder} 300deg,${shineColor} 340deg,${shineColor} 350deg,${baseBorder} 360deg) border-box`,
    border: "2px solid transparent",
    borderRadius: "1rem",
  }

  const socials = [
    { key: "linkedin", label: "LinkedIn",    url: PROFILE.linkedinUrl, icon: <Linkedin className="w-4 h-4" /> },
    { key: "github",   label: "GitHub",      url: PROFILE.githubUrl,   icon: <Github className="w-4 h-4" /> },
    { key: "bluesky",  label: "Bluesky",     url: PROFILE.blueskyUrl,  icon: <BlueskyIcon /> },
    { key: "devto",    label: "Dev.to",      url: PROFILE.devtoUrl,    icon: <DevToIcon /> },
    { key: "x",        label: "X (Twitter)", url: PROFILE.twitterUrl,  icon: <XIcon /> },
  ]

  return (
    <div
      ref={wrapperRef}
      className="w-full max-w-[360px] xs:max-w-sm mx-auto px-2 xs:px-0"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transition: tiltX === 0 && tiltY === 0 ? "transform 0.8s ease-out" : "transform 0.25s ease-out",
          willChange: "transform",
        }}
      >
      <div style={borderStyle} className="shadow-xl">
        <Card className="relative w-full overflow-hidden bg-white dark:bg-black rounded-[14px] shadow-none border-0">

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 pt-3">
            {/* Theme toggle */}
            <button
              aria-label="Toggle theme"
              className="flex items-center gap-1 px-2 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-xl hover:bg-white dark:hover:bg-black border border-black/8 dark:border-white/10 shadow-sm rounded-full text-[11px] font-medium text-black/70 dark:text-white/70 transition-all duration-300"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {mounted && (isDark
                ? <><Sun className="w-3 h-3 shrink-0" /><span>Light</span></>
                : <><Moon className="w-3 h-3 shrink-0" /><span>Dark</span></>
              )}
            </button>

            {/* Resume */}
            <button
              aria-label="View resume"
              className="flex items-center gap-1 px-2 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-xl hover:bg-white dark:hover:bg-black border border-black/8 dark:border-white/10 shadow-sm rounded-full text-[11px] font-medium text-black/70 dark:text-white/70 transition-all duration-300"
              onClick={() => window.open(PROFILE.cvUrl, "_blank", "noopener,noreferrer")}
            >
              <FileText className="w-3 h-3 shrink-0" />
              <span>Resume</span>
            </button>
          </div>

          {/* Scrollable body */}
          <div ref={scrollRef} className="overflow-y-auto" style={{ scrollbarWidth: "none", maxHeight: "92svh" }}>

            {/* Avatar */}
            <div className="pt-11 pb-1 flex flex-col items-center px-4">
              <div className="relative">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white dark:border-black shadow-[0_6px_24px_rgb(0,0,0,0.12)] overflow-hidden bg-gray-100 dark:bg-gray-900 ring-1 ring-black/5 dark:ring-white/5">
                  <Image
                    src={imageError ? "/placeholder-user.jpg" : PROFILE.profileImage}
                    alt={PROFILE.name} fill className="object-cover" priority
                    onError={() => setImageError(true)}
                  />
                </div>
                <div className="absolute bottom-0.5 right-0.5 bg-black dark:bg-white rounded-full p-[3px] shadow-md ring-2 ring-white dark:ring-black">
                  <svg className="w-3 h-3 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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
              <div className="flex flex-wrap justify-center gap-1">
                {PROFILE.skills.map(s => (
                  <span key={s} className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-md bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 border border-black/8 dark:border-white/10">
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
                <button onClick={copyEmail} aria-label="Copy email" className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                  {copied
                    ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                    : <Copy className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
                  }
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
                      className="group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 text-black/70 dark:text-white/70"
                      onClick={() => safeOpen(url)}
                      onMouseEnter={() => showTip(label)}
                      onMouseLeave={hideTip}
                      onFocus={() => showTip(label)}
                      onBlur={hideTip}
                    >
                      <span className="group-hover:scale-110 transition-transform">{icon}</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Scroll-to-top */}
          {showScrollTop && (
            <button onClick={scrollToTop} aria-label="Scroll to top"
              className="absolute bottom-3 right-3 z-20 p-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg hover:scale-110 transition-transform">
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
        </Card>
      </div>
      </div>
    </div>
  )
}
