#!/usr/bin/env node
/**
 * Fails the build when the source references a static file that /public does not ship.
 *
 * Why: an episode is wired into the portal days before its embargo lifts, so a
 * mistyped thumbnail path stays invisible until release day and then shows up as a
 * broken image on the home page (EP10's cover did exactly that in Nov 2026).
 *
 * What it checks: every root-relative string literal in src/ that ends in a static
 * file extension and whose first folder exists in /public (so app routes such as
 * /sitemap.xml or /opengraph-image are left alone). Matching is case-sensitive, like
 * the Linux servers in production, and a file that exists on disk but is not tracked
 * by git counts as missing because it would never reach the deploy.
 *
 * Runs automatically before `next build`; run it alone with `npm run check:assets`.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const SRC_DIR = path.join(ROOT, "src");

const EXTENSIONS =
  "png|jpe?g|webp|gif|svg|avif|ico|mp4|webm|mov|mp3|wav|ogg|woff2?|ttf|otf|pdf|zip|json|html?|css|js|txt|xml|vtt|srt|glb|gltf";
// A quote, a root-relative path with no spaces or template holes, an extension, then
// the closing quote or the start of a query/hash.
const REFERENCE = new RegExp(
  "[\"'`](/[A-Za-z0-9_@.~+%()\\-/]+\\.(?:" + EXTENSIONS + "))(?=[\"'`?#])",
  "g"
);

function walk(dir, visit) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, visit);
    else if (entry.isFile()) visit(full);
  }
}

/** Exact, case-sensitive paths of everything inside /public, as the browser asks for them. */
function publicFilesOnDisk() {
  const files = new Set();
  walk(PUBLIC_DIR, (full) => files.add("/" + path.relative(PUBLIC_DIR, full).split(path.sep).join("/")));
  return files;
}

/** Same list, limited to what git tracks. Null when git is not available (e.g. on the build server). */
function publicFilesInGit() {
  try {
    const out = execFileSync("git", ["ls-files", "-z", "--", "public"], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 256 * 1024 * 1024,
    });
    const tracked = out.split("\0").filter(Boolean);
    if (tracked.length === 0) return null;
    return new Set(tracked.map((p) => "/" + p.slice("public/".length)));
  } catch {
    return null;
  }
}

function decode(p) {
  try {
    return decodeURIComponent(p);
  } catch {
    return p;
  }
}

const onDisk = publicFilesOnDisk();
const inGit = publicFilesInGit();
const publicFolders = new Set(
  fs
    .readdirSync(PUBLIC_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
);

const references = new Map(); // path -> ["src/file.tsx:12", ...]
walk(SRC_DIR, (full) => {
  if (!/\.(tsx?|jsx?|mjs|css|mdx?|json)$/.test(full)) return;
  const lines = fs.readFileSync(full, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const match of line.matchAll(REFERENCE)) {
      const ref = decode(match[1]);
      if (!publicFolders.has(ref.split("/")[1])) continue;
      const where = `${path.relative(ROOT, full)}:${i + 1}`;
      references.set(ref, [...(references.get(ref) ?? []), where]);
    }
  });
});

const problems = [];
for (const [ref, where] of [...references].sort(([a], [b]) => a.localeCompare(b))) {
  if (!onDisk.has(ref)) {
    problems.push(`missing in public/: ${ref}\n      referenced from ${where.join(", ")}`);
  } else if (inGit && !inGit.has(ref)) {
    problems.push(`not tracked by git (would 404 in production): ${ref}\n      referenced from ${where.join(", ")}`);
  }
}

if (problems.length > 0) {
  console.error(`[check:assets] ${problems.length} broken static reference(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(
  `[check:assets] ${references.size} static references in src/ -> all present in public/` +
    (inGit ? " and tracked by git" : "")
);
