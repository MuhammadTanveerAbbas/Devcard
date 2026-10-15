import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { fontVariables } from "@/app/fonts";
import {
  DESCRIPTION,
  KEYWORDS,
  PROFILE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_DESCRIPTION,
  X_HANDLE,
} from "@/lib/site";
import "./globals.css";

const TITLE = `${PROFILE.name} | ${PROFILE.jobTitle}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${PROFILE.name}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js",
  authors: [{ name: PROFILE.name, url: SITE_URL }],
  creator: PROFILE.name,
  publisher: PROFILE.name,
  keywords: KEYWORDS,
  category: "technology",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
    // Points crawlers and answer engines at the plain text summary.
    types: {
      "text/plain": [{ url: "/llms.txt", title: "llms.txt" }],
      "text/markdown": [{ url: "/llms-full.txt", title: "llms-full.txt" }],
    },
  },
  openGraph: {
    type: "profile",
    firstName: PROFILE.firstName,
    lastName: PROFILE.lastName,
    username: PROFILE.username,
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    creator: X_HANDLE,
    site: X_HANDLE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    // `app/favicon.ico`, `app/icon.png` and `app/apple-icon.png` are added
    // automatically. These extra entries cover high density screens, Android
    // home screens and the WebP source artwork.
    icon: [
      { url: "/Fevicon.webp", type: "image/webp", sizes: "500x500" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Tanveer Abbas",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#050607" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontVariables} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
