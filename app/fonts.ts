import localFont from "next/font/local";
import { Familjen_Grotesk } from "next/font/google";

/**
 * Two fonts only.
 *
 * 1. Familjen Grotesk -> display. Name, job title, buttons, headings.
 *    A Swedish grotesk with a tall x-height and open apertures. Reads sharp
 *    at display sizes.
 * 2. LT Veritas -> body. Bio, labels, chips, secondary text.
 *    A geometric sans with a grotesque skeleton. Neutral and legible small.
 *
 * Pecita was removed. A third family was one accent too many for a card this
 * small, and the handwritten line pulled focus off the work.
 */

export const display = Familjen_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-familjen",
  display: "swap",
});

export const body = localFont({
  src: [
    { path: "./fonts/LTVeritas-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/LTVeritas-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/LTVeritas-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-veritas",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

export const fontVariables = [display.variable, body.variable].join(" ");