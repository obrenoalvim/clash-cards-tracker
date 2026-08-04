// Resolves real Supercell/wiki icon images for every card in src/data/cards.ts
// by querying the Fandom MediaWiki API (no scraping, no guessing filenames).
//
// Strategy per card (uses the card's own wikiUrl as source of truth):
//   1. List every File: used on the card's wiki page (prop=images).
//   2. Prefer "Avatar <Name>.png" (square in-game-style icon).
//   3. Fall back to "<Name> info.png" (infobox art).
//   4. Fall back to the page's inferred main image (prop=pageimages).
//   5. HEAD-validate the resolved URL actually returns image/*.
//
// Usage: node scripts/fetch-card-images.mjs [--dry-run]

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CARDS_FILE = path.join(__dirname, "..", "src", "data", "cards.ts");
const API = "https://clashofclans.fandom.com/api.php";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const DRY_RUN = process.argv.includes("--dry-run");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: "json", ...params })}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`API ${res.status} for ${url}`);
  return res.json();
}

function pageTitleFromWikiUrl(wikiUrl) {
  const slug = wikiUrl.split("/wiki/")[1];
  return decodeURIComponent(slug).replace(/_/g, " ");
}

async function listPageImages(title) {
  const data = await api({ action: "query", titles: title, prop: "images", imlimit: "200" });
  const page = Object.values(data.query.pages)[0];
  if (!page || page.missing !== undefined || !page.images) return [];
  return page.images.map((i) => i.title); // "File:Avatar Barbarian.png"
}

async function pageOriginalImage(title) {
  const data = await api({ action: "query", titles: title, prop: "pageimages", piprop: "original" });
  const page = Object.values(data.query.pages)[0];
  return page?.original?.source ?? null;
}

async function imageInfoUrl(fileTitle) {
  const data = await api({ action: "query", titles: fileTitle, prop: "imageinfo", iiprop: "url|size|mime" });
  const page = Object.values(data.query.pages)[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  return { url: info.url, width: info.width, height: info.height, mime: info.mime };
}

async function headOk(url) {
  try {
    const res = await fetch(url, { method: "HEAD", headers: { "User-Agent": UA } });
    const type = res.headers.get("content-type") || "";
    return res.ok && type.startsWith("image/");
  } catch {
    return false;
  }
}

async function resolveCardImage(card) {
  const title = pageTitleFromWikiUrl(card.wikiUrl);
  const images = await listPageImages(title);

  const avatar = images.find((t) => /^File:Avatar /i.test(t));
  const info = images.find((t) => /\sinfo\.png$/i.test(t));
  const candidates = [avatar, info].filter(Boolean);

  for (const fileTitle of candidates) {
    const info2 = await imageInfoUrl(fileTitle);
    if (info2 && (await headOk(info2.url))) {
      return { ...info2, source: fileTitle };
    }
  }

  // last resort: whatever Fandom infers as the page's main image
  const original = await pageOriginalImage(title);
  if (original && (await headOk(original))) {
    return { url: original, source: "pageimages:original" };
  }

  return null;
}

async function main() {
  const src = readFileSync(CARDS_FILE, "utf8");

  const cardRegex =
    /\{ id: "([^"]+)", name: "[^"]*"[^}]*?wikiUrl: (wiki\("[^"]*"\)), imageUrl: img\("[^"]*"\) \}/g;

  const cards = [];
  let m;
  while ((m = cardRegex.exec(src))) {
    const wikiCall = m[2];
    const pageArg = wikiCall.match(/wiki\("([^"]*)"\)/)[1];
    cards.push({ id: m[1], wikiUrl: `https://clashofclans.fandom.com/wiki/${pageArg.replace(/ /g, "_")}` });
  }

  console.log(`Found ${cards.length} cards to resolve.\n`);

  const results = {};
  const failures = [];

  for (const [i, card] of cards.entries()) {
    process.stdout.write(`[${i + 1}/${cards.length}] ${card.id}... `);
    try {
      const resolved = await resolveCardImage(card);
      if (resolved) {
        results[card.id] = resolved.url;
        console.log(`OK  (${resolved.source})`);
      } else {
        failures.push(card.id);
        console.log("FAIL (no candidate resolved)");
      }
    } catch (err) {
      failures.push(card.id);
      console.log(`FAIL (${err.message})`);
    }
    await sleep(120); // be polite to the API
  }

  console.log(`\nResolved ${Object.keys(results).length}/${cards.length}. Failures: ${failures.join(", ") || "none"}`);

  if (DRY_RUN) {
    console.log("\n--dry-run: not writing cards.ts");
    writeFileSync(path.join(__dirname, "image-results.json"), JSON.stringify(results, null, 2));
    return;
  }

  let out = src;
  for (const [id, url] of Object.entries(results)) {
    const re = new RegExp(`(\\{ id: "${id}",[^\\n]*?)imageUrl: img\\("[^"]*"\\) \\}`);
    if (!re.test(out)) {
      console.warn(`Could not splice url for ${id} (regex miss)`);
      continue;
    }
    out = out.replace(re, `$1imageUrl: "${url}" }`);
  }
  writeFileSync(CARDS_FILE, out, "utf8");
  console.log(`\nWrote ${CARDS_FILE}`);

  if (failures.length) {
    writeFileSync(path.join(__dirname, "image-failures.json"), JSON.stringify(failures, null, 2));
    process.exitCode = 1;
  }
}

main();
