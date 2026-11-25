/**
 * Single source of truth for the public facts about this card.
 *
 * Used by the metadata block in `app/layout.tsx`, the JSON-LD graph in
 * `app/page.tsx`, and the generated `robots.txt`, `sitemap.xml` and
 * `manifest.webmanifest` routes. Edit here and every crawler surface follows.
 *
 * The visible card content lives in `components/profile-card.tsx`.
 */

export const SITE_URL = "https://muhammadtanveerabbas.vercel.app";

export const SITE_NAME = "DevCard";

export const PROFILE = {
  name: "Muhammad Tanveer Abbas",
  /** Given name, used by the Open Graph profile tags. */
  firstName: "Muhammad",
  /** Family name, used by the Open Graph profile tags. */
  lastName: "Tanveer Abbas",
  /** Short handle, used by the Open Graph profile tags. */
  username: "muhammadtanveerabbas",
  jobTitle: "Software Developer | Technical Product Partner",
  email: "muhammadtanveerabbas.contact@gmail.com",
  photo: "/Me.jfif",
  resume: "/Resume.pdf",
  calUrl: "https://cal.com/muhammadtanveerabbas",
  availability: "Available for work",
  about:
    "I design, build, and deliver B2B SaaS products and internal tools for startup founders and SMEs.",
} as const;

/** Meta description, used by search engines and the manifest. 130 characters. */
export const DESCRIPTION =
  "Digital card of Muhammad Tanveer Abbas, software developer and technical product partner. Book a call or reach any social profile.";

/**
 * Open Graph and X description. 121 characters, so it survives the tighter
 * truncation on WhatsApp, Facebook and LinkedIn link previews.
 */
export const SOCIAL_DESCRIPTION =
  "Muhammad Tanveer Abbas, software developer and technical product partner. Book a call or reach any profile from one page.";

/** Search terms this page should rank for. */
export const KEYWORDS = [
  "Muhammad Tanveer Abbas",
  "software developer",
  "technical product partner",
  "full stack developer",
  "Next.js developer",
  "React developer",
  "freelance AI developer",
  "digital business card",
  "developer portfolio",
];

/** Stack badges, kept in sync with `components/brand-marks.tsx`. */
export const SKILLS = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Supabase",
  "Stripe",
  "Vercel",
];

/** Public profiles, kept in sync with the social row in `components/brand-marks.tsx`. */
export const SOCIALS = [
  { label: "LinkedIn", url: "https://linkedin.com/in/muhammadtanveerabbas" },
  { label: "GitHub", url: "https://github.com/muhammadtanveerabbas" },
  { label: "X", url: "https://x.com/m_tanveerabbas" },
  { label: "Bluesky", url: "https://bsky.app/profile/mtanveerabbas-dev.bsky.social" },
  { label: "Medium", url: "https://medium.com/@muhammadtanveerabbas" },
];

/** X handle, used by the Twitter card tags. */
export const X_HANDLE = "@m_tanveerabbas";
