"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Blocks,
  Code2,
  Eye,
  Flame,
  FolderGit2,
  Github,
  GitCommitHorizontal,
  Lightbulb,
  Smile,
  Star,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROJECTS, type DashboardData, type SourceState } from "@/lib/dashboard-data";

/* ─── Chart primitives ─────────────────────────────────────────────────────
   Inline SVG, drawn for this card. No chart library: at 280px a hand written
   path is sharper, lighter and easier to keep on the accent token.
   ------------------------------------------------------------------------- */

const CELL = [
  "fill-ih-cell-0",
  "fill-ih-cell-1",
  "fill-ih-cell-2",
  "fill-ih-cell-3",
  "fill-ih-cell-4",
] as const;

function Heatmap({ contributions, weeks }: { contributions: number[]; weeks: number }) {
  const size = 6;
  const gap = 2;
  const width = weeks * (size + gap) - gap;
  const height = 7 * (size + gap) - gap;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={`Contribution grid for the last ${weeks} weeks`}
      className="mx-auto block h-auto w-full max-w-[238px]"
    >
      {contributions.map((level, i) => (
        <rect
          key={i}
          x={Math.floor(i / 7) * (size + gap)}
          y={(i % 7) * (size + gap)}
          width={size}
          height={size}
          rx={1.5}
          className={CELL[level]}
        />
      ))}
    </svg>
  );
}

/* ─── Layout helpers ─────────────────────────────────────────────────────── */

function Block({
  title,
  meta,
  icon,
  children,
  centered = false,
}: {
  title: string;
  meta?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <section className="py-2.5 first:pt-0 last:pb-0">
      <header
        className={
          centered
            ? "mb-3 flex flex-col items-center gap-0.5 text-center"
            : "mb-2 flex items-baseline justify-between gap-2"
        }
      >
        <span className="flex items-center gap-1.5">
          {icon ? <span className="text-ih-faint">{icon}</span> : null}
          <h3 className="text-[10px] font-semibold text-ih-text">{title}</h3>
        </span>
        {meta ? <span className="text-[9px] text-ih-faint">{meta}</span> : null}
      </header>
      {children}
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-ih-raised px-2 py-1.5">
      <p className="text-[8px] leading-none text-ih-faint">{label}</p>
      <p className="mt-1 font-display text-[13px] font-semibold leading-none tabular-nums text-ih-text">
        {value}
      </p>
    </div>
  );
}

function SourceNotice({ state, message }: { state: SourceState; message?: string }) {
  if (state === "live") return null;
  const text =
    state === "missing"
      ? "GitHub key is not set"
      : (message ?? "GitHub data could not be loaded");
  return (
    <p
      role={state === "error" ? "alert" : "status"}
      className="mb-2 rounded-md border border-ih-line bg-ih-raised px-2 py-1.5 text-[9px] leading-snug text-ih-dim"
    >
      {text}
    </p>
  );
}

/* ─── Panels ─────────────────────────────────────────────────────────────── */

function CodePanel({
  github,
  repositories,
  contributions,
  source,
  message,
}: {
  github: DashboardData["GITHUB"];
  repositories: DashboardData["REPOSITORIES"];
  contributions: number[];
  source: SourceState;
  message?: string;
}) {
  return (
    <div className="divide-y divide-ih-line">
      <Block title="GitHub" meta={contributions.length ? `${github.weeks} weeks` : undefined}>
        <SourceNotice state={source} message={message} />
        {contributions.length ? (
          <Heatmap contributions={contributions} weeks={github.weeks} />
        ) : (
          <p className="py-3 text-center text-[9px] text-ih-faint">No contribution data</p>
        )}
        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          <MiniStat label="Commits" value={github.commits} />
          <MiniStat label="Repos" value={github.repositories} />
          <MiniStat label="Merged PRs" value={github.pullRequests} />
        </div>
      </Block>

      <Block title="Repositories" meta="recent">
        {repositories.length ? (
          <ul className="space-y-1">
            {repositories.map((repo) => (
              <li key={repo.name} className="flex items-center gap-2 rounded-md px-1 py-1">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate font-display text-[10px] font-semibold text-ih-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ih-text"
                >
                  {repo.name}
                </a>
                <span className="text-[8px] text-ih-faint">{repo.language}</span>
                <span className="ml-auto text-[9px] tabular-nums text-ih-dim">{repo.stars} stars</span>
                <span className="w-6 text-right text-[8px] tabular-nums text-ih-faint">{repo.updated}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-2 text-[9px] text-ih-faint">No repositories to show</p>
        )}
      </Block>
    </div>
  );
}

function ProjectGrid() {
  return (
    <ul className="flex flex-wrap justify-center gap-2">
      {PROJECTS.map((project, index) => (
        <li
          key={project.name}
          className="ih-project relative w-[calc(25%-0.375rem)]"
          style={{ "--i": index } as React.CSSProperties}
        >
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.name}`}
            title={project.name}
            className="flex flex-col items-center gap-1 rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ih-accent/70"
          >
            <span className="grid size-8 place-items-center rounded-md border border-ih-line bg-ih-raised p-1">
              <Image
                src={project.icon}
                alt=""
                width={28}
                height={28}
                className="size-full object-contain"
              />
            </span>
            <span className="w-full truncate text-center text-[8px] leading-none text-ih-dim">
              {project.name}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function OpenSourcePanel({
  github,
  source,
  message,
}: {
  github: DashboardData["GITHUB"];
  source: SourceState;
  message?: string;
}) {
  return (
    <div className="divide-y divide-ih-line">
      <Block title="Open Source | Github" centered icon={<Github className="size-3" aria-hidden="true" />}>
        <SourceNotice state={source} message={message} />
        <div className="grid grid-cols-2 divide-x divide-ih-line py-0.5">
          <div className="flex items-center justify-center gap-1.5">
            <Star className="size-3.5 shrink-0 text-ih-accent" aria-hidden="true" />
            <span className="font-display text-[14px] font-semibold leading-none tabular-nums text-ih-text">
              {github.stars}
            </span>
            <span className="text-[9px] leading-none text-ih-faint">stars</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <FolderGit2 className="size-3.5 shrink-0 text-ih-faint" aria-hidden="true" />
            <span className="font-display text-[14px] font-semibold leading-none tabular-nums text-ih-text">
              {github.repositories}
            </span>
            <span className="text-[9px] leading-none text-ih-faint">repos</span>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <MiniStat label="Commits" value={github.commits} />
          <MiniStat label="Merged PRs" value={github.pullRequests} />
          <MiniStat label="Followers" value={github.followers} />
        </div>
      </Block>

      <Block title="My OS Project" centered icon={<Blocks className="size-3" aria-hidden="true" />}>
        <ProjectGrid />
      </Block>
    </div>
  );
}

/* ─── Quote ticker ─────────────────────────────────────────────────────────
   Fills the space under the tabs. The first quote is also the server render,
   so hydration sees the same text. The timer starts after mount and stops for
   reduced motion. No author is claimed: these are original one-liners.
   ------------------------------------------------------------------------- */

const KPI_ICONS = {
  Contributions: GitCommitHorizontal,
  Streak: Flame,
  Stars: Star,
} as const;

const QUOTE_ICONS = {
  Fun: Smile,
  Reality: Eye,
  Tip: Lightbulb,
} as const;

const QUOTES = [
  { kind: "Fun", text: "Works on my machine. Ship it." },
  { kind: "Reality", text: "The shortcut is the design now." },
  { kind: "Tip", text: "Read the error first." },
  { kind: "Fun", text: "Temp became production again." },
  { kind: "Reality", text: "Every todo has a birthday." },
  { kind: "Tip", text: "Small commits save bad days." },
  { kind: "Fun", text: "Deleting code is a feature." },
  { kind: "Reality", text: "Refactoring needs a better name." },
  { kind: "Tip", text: "Fix the test before the code." },
] as const;

function QuoteTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), 5000);
    return () => window.clearInterval(id);
  }, []);

  const quote = QUOTES[index];
  const Icon = QUOTE_ICONS[quote.kind];

  return (
    <div className="w-full border-t border-ih-line pt-2">
      <div className="flex items-center justify-center gap-2 text-center">
        <span className="grid size-5 shrink-0 place-items-center rounded-md border border-ih-line bg-ih-raised text-ih-accent">
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
        <span
          key={index}
          className="ih-quote-change flex min-h-[1.25rem] min-w-0 items-center text-[11px] leading-snug text-ih-dim"
        >
          {quote.text}
        </span>
      </div>
    </div>
  );
}

/* ─── Back face ──────────────────────────────────────────────────────────── */

export function IhDashboard({
  data,
  onFlipBack,
}: {
  data: DashboardData;
  onFlipBack: () => void;
}) {
  const { AVATAR, CONTRIBUTIONS, GITHUB, HANDLE, KPIS, MESSAGES, REPOSITORIES, SOURCES } = data;

  return (
    <div className="ih-surface flex h-full flex-col overflow-hidden rounded-[1.05rem]">
      <div className="flex items-center gap-2 px-3 pb-2 pt-2.5">
        <span className="relative size-6 shrink-0 overflow-hidden rounded-md border border-ih-line">
          <Image src={AVATAR} alt="" fill sizes="24px" className="object-cover" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-[11px] font-semibold leading-tight text-ih-text">
            Muhammad Tanveer Abbas
          </span>
          <span className="block truncate text-[8px] leading-tight text-ih-faint">
            {HANDLE}
          </span>
        </span>
        <button
          type="button"
          onClick={onFlipBack}
          className="ih-flip-btn flex h-8 items-center gap-1.5 rounded-full border border-ih-line bg-ih-raised px-3 font-display text-[10px] font-medium text-ih-text transition-colors hover:border-ih-accent/50 hover:bg-ih-raised/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ih-accent/70"
        >
          <ArrowLeft className="size-3" aria-hidden="true" />
          Back to card
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 px-3 pb-3">
        <div className="grid grid-cols-3 divide-x divide-ih-line rounded-lg border border-ih-line bg-ih-panel">
          {KPIS.map((kpi) => {
            const Icon = KPI_ICONS[kpi.label as keyof typeof KPI_ICONS];
            return (
              <div key={kpi.label} className="px-2 py-1.5">
                <span className="flex items-center gap-1">
                  {Icon ? <Icon className="size-3 shrink-0 text-ih-faint" aria-hidden="true" /> : null}
                  <span className="text-[8px] leading-none text-ih-faint">{kpi.label}</span>
                </span>
                <p className="mt-1 font-display text-[14px] font-semibold leading-none tabular-nums text-ih-text">
                  {kpi.value}
                </p>
                <p className="mt-1 text-[8px] leading-none text-ih-faint">{kpi.note}</p>
              </div>
            );
          })}
        </div>

        <Tabs defaultValue="code" className="ih-tabs flex min-h-0 flex-1 flex-col gap-2">
          <TabsList className="grid h-8 w-full grid-cols-2 gap-0.5 rounded-lg border border-ih-line bg-ih-panel p-0.5">
            <TabsTrigger value="code">
              <Code2 className="size-3.5" aria-hidden="true" />
              Code
            </TabsTrigger>
            <TabsTrigger value="open-source">
              <Github className="size-3.5" aria-hidden="true" />
              Open Source
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="ih-tab-panel">
            <CodePanel
              github={GITHUB}
              repositories={REPOSITORIES}
              contributions={CONTRIBUTIONS}
              source={SOURCES.github}
              message={MESSAGES.github}
            />
          </TabsContent>
          <TabsContent value="open-source" className="ih-tab-panel flex flex-col">
            <OpenSourcePanel
              github={GITHUB}
              source={SOURCES.github}
              message={MESSAGES.github}
            />
            <div className="flex w-full flex-1 items-center justify-center">
              <QuoteTicker />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
