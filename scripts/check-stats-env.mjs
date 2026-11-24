// Prints which real-stats keys are set. Never prints a value.
// Run with: node scripts/check-stats-env.mjs

import { readFileSync } from "node:fs";

const KEYS = [
  "GITHUB_TOKEN",
  "GITHUB_USERNAME",
  "STATS_CACHE_MINUTES",
];

let text = "";
try {
  text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
} catch {
  console.log(".env.local not found. Copy .env.example to .env.local first.");
  process.exit(0);
}

const set = new Set(
  text
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("#") && line.includes("="))
    .map((line) => line.split("=")[0].trim()),
);

for (const key of KEYS) console.log(`${set.has(key) ? "set    " : "missing"} ${key}`);
