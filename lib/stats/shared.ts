/** Shared helpers for server-side stats. No secrets leave this folder. */

import type { SourceState } from "@/lib/dashboard-data";

const cache = new Map<string, { at: number; value: unknown }>();

export type SourceResult<T> = {
  state: SourceState;
  data: T | null;
  message?: string;
};

export class HttpError extends Error {
  readonly status: number;
  readonly pathname: string;

  constructor(status: number, pathname: string) {
    super(`HTTP ${status} for ${pathname}`);
    this.name = "HttpError";
    this.status = status;
    this.pathname = pathname;
  }
}

export async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const minutes = Number(process.env.STATS_CACHE_MINUTES ?? 60);
  const ttl = (Number.isFinite(minutes) ? minutes : 60) * 60_000;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttl) return hit.value as T;
  const value = await fn();
  cache.set(key, { at: Date.now(), value });
  return value;
}

export function formatCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return String(value);
}

export function relativeDate(iso: string): string {
  const days = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000));
  if (days === 0) return "today";
  if (days === 1) return "1d";
  if (days < 30) return `${days}d`;
  return `${Math.floor(days / 30)}mo`;
}

export async function getJson<T>(url: string, headers: HeadersInit): Promise<T> {
  const response = await fetch(url, {
    headers,
    next: { revalidate: 0 },
  });
  if (!response.ok) throw new HttpError(response.status, new URL(url).pathname);
  return (await response.json()) as T;
}
