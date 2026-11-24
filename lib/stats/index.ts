import { STATS_IDENTITY, type DashboardData } from "@/lib/dashboard-data";
import { fetchGitHub } from "./github";
import { formatCount } from "./shared";

const EMPTY_GITHUB: DashboardData["GITHUB"] = {
  commits: "—",
  repositories: "—",
  pullRequests: "—",
  stars: "—",
  followers: "—",
  weeks: 30,
};

/**
 * Server-only. Called once by the page and passed to the card as plain data.
 * GitHub is the only stats source. No source falls back to invented values.
 * A failed request reports its state so the card can show an honest message.
 */
export async function getDashboardData(): Promise<DashboardData> {
  const github = await fetchGitHub();
  const username = process.env.GITHUB_USERNAME || "muhammadtanveerabbas";

  return {
    ...STATS_IDENTITY,
    HANDLE: `@${username}`,
    KPIS: [
      {
        label: "Contributions",
        value: github.data?.contributionsTotal != null ? formatCount(github.data.contributionsTotal) : "—",
        note: "past year",
      },
      {
        label: "Streak",
        value: github.data ? `${github.data.streak}d` : "—",
        note: "current",
      },
      {
        label: "Stars",
        value: github.data?.GITHUB.stars ?? "—",
        note: "across repos",
      },
    ],
    GITHUB: github.data?.GITHUB ?? EMPTY_GITHUB,
    CONTRIBUTIONS: github.data?.CONTRIBUTIONS ?? [],
    REPOSITORIES: github.data?.REPOSITORIES ?? [],
    SOURCES: { github: github.state },
    MESSAGES: { github: github.message },
  };
}
