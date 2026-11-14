#!/usr/bin/env node
/**
 * Light covers for the home monitor and the blog cards.
 *
 * Why: a cover used to be served as the original 1920x1080 PNG or JPG (up to 1.8 MB
 * each, 9.9 MB for the 15 of them), and the monitor's cover is the first image a
 * phone downloads. An AVIF twin at 1600px weighs about a tenth and looks the same.
 *
 *   npm run covers              generate the twins that are missing or out of date
 *   npm run covers -- --force   regenerate every twin
 *   npm run check:covers        no writes; fails when a cover has no fresh twin or a
 *                               twin is over the weight budget (runs before the build)
 *
 * The list of covers is src/data/covers.ts. The result is one .avif beside each
 * original plus src/data/coverManifest.json (original -> twin, with a hash of the
 * original so that a replaced image cannot keep its old twin). Commit both.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const COVERS_FILE = path.join(ROOT, "src", "data", "covers.ts");
const MANIFEST_FILE = path.join(ROOT, "src", "data", "coverManifest.json");

// 1600px: the widest a cover is drawn is 848 CSS px (blog card on a 900px tablet),
// which a 2x screen fills with 1696 device px. Quality 60 at 4:4:4 keeps the small
// coloured text of the covers sharp; WebP (always 4:2:0) needed twice the bytes to
// look as close to the original.
const SETTINGS = { format: "avif", maxWidth: 1600, quality: 60, effort: 6, chromaSubsampling: "4:4:4" };
// Weight budget of one twin. The e2e suite applies the same limit to what the
// browser actually downloads (e2e/home-covers.spec.ts).
const MAX_BYTES = 250 * 1024;

const CHECK_ONLY = process.argv.includes("--check");
const FORCE = process.argv.includes("--force");
const TAG = CHECK_ONLY ? "[check:covers]" : "[covers]";

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;
const mb = (bytes) => `${(bytes / 1048576).toFixed(2)} MB`;
const abs = (publicPath) => path.join(PUBLIC_DIR, ...publicPath.split("/").filter(Boolean));
const twinOf = (publicPath) => publicPath.replace(/\.(?:png|jpe?g)$/i, ".avif");
const hashOf = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 16);

/** Every quoted root-relative PNG/JPG path in covers.ts, in file order, without repeats. */
function readCoverList() {
  const source = fs.readFileSync(COVERS_FILE, "utf8");
  const found = [...source.matchAll(/["'`](\/[A-Za-z0-9_@.~+%()\-/]+\.(?:png|jpe?g))["'`]/gi)].map((m) => m[1]);
  return [...new Set(found)];
}

function readManifest() {
  try {
    const parsed = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
    return { settings: parsed.settings ?? {}, covers: parsed.covers ?? {} };
  } catch {
    return { settings: {}, covers: {} };
  }
}

const sameSettings = (other) => JSON.stringify(other) === JSON.stringify(SETTINGS);

const covers = readCoverList();
const manifest = readManifest();

if (covers.length === 0) {
  console.error(`${TAG} no cover found in ${path.relative(ROOT, COVERS_FILE)}`);
  process.exit(1);
}
const twins = new Map(); // twin path -> original
for (const original of covers) {
  const twin = twinOf(original);
  if (twins.has(twin)) {
    console.error(`${TAG} ${original} and ${twins.get(twin)} would share the twin ${twin}: rename one of them`);
    process.exit(1);
  }
  twins.set(twin, original);
}

if (CHECK_ONLY) {
  const problems = [];
  let total = 0;
  let heaviest = 0;
  if (!sameSettings(manifest.settings)) problems.push("the encoder settings changed since the twins were generated");
  for (const original of covers) {
    if (!fs.existsSync(abs(original))) {
      problems.push(`${original}: the original is missing in public/`);
      continue;
    }
    const entry = manifest.covers[original];
    if (!entry) {
      problems.push(`${original}: no light twin yet`);
      continue;
    }
    if (!fs.existsSync(abs(entry.avif))) {
      problems.push(`${original}: its twin ${entry.avif} is missing in public/`);
      continue;
    }
    if (entry.sourceSha256 !== hashOf(fs.readFileSync(abs(original)))) {
      problems.push(`${original}: the image changed after its twin was generated`);
    }
    const bytes = fs.statSync(abs(entry.avif)).size;
    total += bytes;
    heaviest = Math.max(heaviest, bytes);
    if (bytes > MAX_BYTES) problems.push(`${entry.avif}: ${kb(bytes)}, over the ${kb(MAX_BYTES)} budget of a cover`);
  }
  for (const listed of Object.keys(manifest.covers)) {
    if (!covers.includes(listed)) problems.push(`${listed}: in the manifest but no longer in covers.ts`);
  }
  if (problems.length > 0) {
    console.error(`${TAG} ${problems.length} problem(s) with the light covers:`);
    for (const p of problems) console.error(`  - ${p}`);
    console.error(`  Fix: run \`npm run covers\` and commit the .avif files and src/data/coverManifest.json`);
    process.exit(1);
  }
  console.log(`${TAG} ${covers.length} covers -> light AVIF twins up to date (${mb(total)} in total, heaviest ${kb(heaviest)})`);
  process.exit(0);
}

// sharp is not a dependency of its own here: it arrives with Next.js, which installs
// it for its image optimizer. Only generating needs it; --check above does not.
let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error(`${TAG} the image encoder (sharp, installed with Next.js) could not be loaded: run \`npm install\` first`);
  process.exit(1);
}

const settingsChanged = !sameSettings(manifest.settings);
const next = {};
const overBudget = [];
let totalOriginal = 0;
let totalTwin = 0;
let generated = 0;

for (const original of covers) {
  if (!fs.existsSync(abs(original))) {
    console.error(`${TAG} ${original} is listed in covers.ts but missing in public/`);
    process.exit(1);
  }
  const input = fs.readFileSync(abs(original));
  const sourceSha256 = hashOf(input);
  const avif = twinOf(original);
  const previous = manifest.covers[original];
  const fresh =
    !FORCE &&
    !settingsChanged &&
    previous?.avif === avif &&
    previous.sourceSha256 === sourceSha256 &&
    fs.existsSync(abs(avif));

  if (!fresh) {
    let image = sharp(input).rotate().resize({ width: SETTINGS.maxWidth, withoutEnlargement: true });
    // A fully opaque alpha channel would only add an empty alpha plane to the file.
    if ((await sharp(input).stats()).isOpaque) image = image.removeAlpha();
    const output = await image
      .avif({ quality: SETTINGS.quality, effort: SETTINGS.effort, chromaSubsampling: SETTINGS.chromaSubsampling })
      .toBuffer();
    fs.writeFileSync(abs(avif), output);
    generated += 1;
  }

  const twinBytes = fs.statSync(abs(avif)).size;
  totalOriginal += input.length;
  totalTwin += twinBytes;
  if (twinBytes > MAX_BYTES) overBudget.push(`${avif}: ${kb(twinBytes)}`);
  next[original] = { avif, sourceSha256 };
  console.log(`  ${fresh ? "ok " : "new"}  ${kb(input.length).padStart(8)} -> ${kb(twinBytes).padStart(7)}  ${avif}`);
}

// A cover removed from covers.ts takes its twin with it.
for (const [listed, entry] of Object.entries(manifest.covers)) {
  if (next[listed] || twins.has(entry.avif)) continue;
  if (fs.existsSync(abs(entry.avif))) fs.rmSync(abs(entry.avif));
  console.log(`  del  ${entry.avif} (its cover left covers.ts)`);
}

const sorted = Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b)));
const content =
  JSON.stringify(
    {
      generatedBy: "npm run covers (scripts/build-covers.mjs). Do not edit by hand.",
      settings: SETTINGS,
      covers: sorted,
    },
    null,
    2
  ) + "\n";
const before = fs.existsSync(MANIFEST_FILE) ? fs.readFileSync(MANIFEST_FILE, "utf8") : "";
if (content !== before) fs.writeFileSync(MANIFEST_FILE, content);

console.log(
  `${TAG} ${covers.length} covers: ${mb(totalOriginal)} of originals -> ${mb(totalTwin)} of AVIF twins` +
    ` (${generated} generated, ${covers.length - generated} already up to date)`
);
if (overBudget.length > 0) {
  console.error(`${TAG} over the ${kb(MAX_BYTES)} budget of a cover (pick a simpler image or lower SETTINGS.quality):`);
  for (const line of overBudget) console.error(`  - ${line}`);
  process.exit(1);
}
