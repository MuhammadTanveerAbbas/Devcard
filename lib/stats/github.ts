import type { DashboardData } from "@/lib/dashboard-data";
import { cached, formatCount, getJson, HttpError, relativeDate, type SourceResult } from "./shared";

type GitHubUser = { followers: number; public_repos: number };
type GitHubRepo = {
  name: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
};
type SearchResult = { total_count: number };
type Level = "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";
type GraphQL = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: Level }[] }[];
        };
      };
    };
  };
};

const LEVEL: Record<Level, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const WEEKS = 30;

export type GitHubStats = {
  GITHUB: DashboardData["GITHUB"];
  CONTRIBUTIONS: number[];
  REPOSITORIES: DashboardData["REPOSITORIES"];
  contributionsTotal: number | null;
  /** Null when the calendar request failed: an unknown streak is not zero. */
  streak: number | null;
};

export async function fetchGitHub(): Promise<SourceResult<GitHubStats>> {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME || "muhammadtanveerabbas";
  if (!token) return { state: "missing", data: null, message: "GITHUB_TOKEN is not set" };

  try {
    const data = await cached("github", async () => {
      const headers = {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      };
      const base = "https://api.github.com";

      const [user, repos, commits, pulls, calendar] = await Promise.all([
        getJson<GitHubUser>(`${base}/users/${username}`, headers),
        getJson<GitHubRepo[]>(`${base}/users/${username}/repos?per_page=100&sort=updated`, headers),
        getJson<SearchResult>(`${base}/search/commits?q=author:${username}&per_page=1`, headers).catch(() => null),
        getJson<SearchResult>(
          `${base}/search/issues?q=is:pr+author:${username}+is:merged&per_page=1`,
          headers,
        ).catch(() => null),
        fetchCalendar(username, headers).catch(() => null),
      ]);

      const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      // "Best" means most starred. The date breaks ties between equally
      // starred repos so the list stays stable across fetches.
      const best = [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count || b.updated_at.localeCompare(a.updated_at))
        .slice(0, 5);

      const calendarData = calendar?.data?.user?.contributionsCollection?.contributionCalendar;
      const weeks = calendarData?.weeks ?? [];
      const hasCalendar = Boolean(calendarData);

      // GitHub returns the current week with future days still empty. Count the
      // streak from the last day that has actually happened. Without a calendar
      // the streak is unknown, so it stays null instead of becoming "0d".
      const today = new Date().toISOString().slice(0, 10);
      const contributionDays = weeks.flatMap((week) => week.contributionDays);
      const pastDays = contributionDays.filter((day) => day.date <= today);
      let streak = 0;
      for (let i = pastDays.length - 1; i >= 0; i--) {
        if (pastDays[i].contributionCount > 0) streak++;
        else break;
      }

      const contributions = hasCalendar
        ? weeks
            .slice(-WEEKS)
            .flatMap((week) => week.contributionDays.map((day) => LEVEL[day.contributionLevel]))
        : [];

      return {
        GITHUB: {
          commits: commits ? formatCount(commits.total_count) : "—",
          repositories: String(user.public_repos),
          pullRequests: pulls ? formatCount(pulls.total_count) : "—",
          stars: formatCount(stars),
          followers: formatCount(user.followers),
          weeks: WEEKS,
        },
        CONTRIBUTIONS: contributions.slice(-WEEKS * 7),
        REPOSITORIES: best.map((repo) => ({
          name: repo.name,
          url: repo.html_url,
          language: repo.language ?? "Other",
          stars: formatCount(repo.stargazers_count),
          updated: relativeDate(repo.updated_at),
        })),
        contributionsTotal: calendarData?.totalContributions ?? null,
        streak: hasCalendar ? streak : null,
      } satisfies GitHubStats;
    });

    return { state: "live", data };
  } catch (error) {
    const status = error instanceof HttpError ? ` (${error.status})` : "";
    return { state: "error", data: null, message: `GitHub request failed${status}` };
  }
}

async function fetchCalendar(username: string, headers: HeadersInit): Promise<GraphQL> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: `query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks { contributionDays { date contributionCount contributionLevel } }
            }
          }
        }
      }`,
      variables: { login: username },
    }),
  });
  if (!response.ok) throw new HttpError(response.status, "/graphql");
  return (await response.json()) as GraphQL;
}
