/**
 * Types and static identity for the stats side of the card.
 * Every figure comes from GitHub at request time. No samples.
 */

export type SourceState = "live" | "missing" | "error";

export type Kpi = { label: string; value: string; note: string };
export type Repo = {
  name: string;
  url: string;
  language: string;
  stars: string;
  updated: string;
};

export type DashboardData = {
  AVATAR: string;
  HANDLE: string;
  ROLE: string;
  KPIS: readonly Kpi[];
  GITHUB: {
    commits: string;
    repositories: string;
    pullRequests: string;
    stars: string;
    followers: string;
    weeks: number;
  };
  CONTRIBUTIONS: number[];
  REPOSITORIES: readonly Repo[];
  SOURCES: { github: SourceState };
  MESSAGES: { github?: string };
};

/* Identity is static copy, not a statistic. The handle is set from the
   configured GitHub username when the data is built. */
export const STATS_IDENTITY = {
  AVATAR: "/Me.webp",
  ROLE: "Software developer and technical product partner",
} as const;

/* Real project links. Shown in the Open Source tab of the stats side. */
export const PROJECTS = [
  { name: "Kanbi", icon: "/Project-icons/kanbi.png", url: "https://kanbi.vercel.app/" },
  { name: "Clario", icon: "/Project-icons/clario.png", url: "https://clario-hub.vercel.app/dashboard" },
  { name: "Subsight", icon: "/Project-icons/subsight.svg", url: "https://subsight-tracker.vercel.app/" },
  { name: "Loopr", icon: "/Project-icons/loopr.svg", url: "https://loopr-io.vercel.app/" },
  { name: "Keyping", icon: "/Project-icons/keyping.svg", url: "https://key-ping.vercel.app/" },
  { name: "Readlyn", icon: "/Project-icons/readlyn.svg", url: "https://readlyn.vercel.app/" },
  {
    name: "Minimalist Toolkit",
    icon: "/Project-icons/minimalist-toolkit.png",
    url: "https://minimalist-toolkit.vercel.app/",
  },
] as const;
