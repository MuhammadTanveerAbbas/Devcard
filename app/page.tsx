import Script from "next/script";
import { PixelBlastBackground } from "@/components/pixel-blast/pixel-blast-background";
import { ProfileCard } from "@/components/profile-card";
import {
  DESCRIPTION,
  PROFILE,
  SITE_URL,
  SKILLS,
  SOCIALS,
} from "@/lib/site";

const TITLE = `${PROFILE.name} | ${PROFILE.jobTitle}`;

/**
 * Structured data for search engines and answer engines.
 * Person describes who the page is about, ProfilePage describes the page.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#page`,
      url: `${SITE_URL}/`,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
      mainEntity: { "@id": `${SITE_URL}/#person` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: PROFILE.name,
      givenName: PROFILE.firstName,
      familyName: PROFILE.lastName,
      jobTitle: PROFILE.jobTitle,
      description: PROFILE.about,
      url: `${SITE_URL}/`,
      image: `${SITE_URL}${PROFILE.photo}`,
      email: `mailto:${PROFILE.email}`,
      sameAs: SOCIALS.map((social) => social.url),
      knowsAbout: SKILLS,
    },
  ],
};

export default function Home() {
  return (
    <>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <PixelBlastBackground />
      <main className="relative z-10 flex min-h-svh items-center justify-center px-3 py-3 sm:py-6">
        <ProfileCard />
      </main>
    </>
  );
}
