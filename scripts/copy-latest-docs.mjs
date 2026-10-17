/**
 * Copy latest version docs to /latest/ folder and rewrite internal links.
 * Runs before docs:dev and docs:build.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(__dirname, "../docs");
const versionFile = path.resolve(__dirname, "../docs/.vitepress/version.js");

// Stop the build. Without /latest/ the site would deploy with the Guide link, the version
// menu and the unversioned-URL redirects all leading to 404 pages; a failed build instead
// leaves the previous deploy in place.
function fail(message) {
  console.error(`[copy-latest] ERROR: ${message}`);
  console.error("[copy-latest] Not building /latest/, so stopping the build.");
  process.exit(1);
}

// Extract major version from full version string (e.g., "v15.0.1" -> "v15.0")
function extractMajorVersion(version) {
  const match = version.match(/^(v\d+\.\d+)/);
  return match ? match[1] : null;
}

// Read version from generated version.js file
async function readVersion() {
  try {
    const content = await fs.readFile(versionFile, "utf8");
    const match = content.match(/export const version = '([^']+)'/);
    return match ? match[1] : null;
  } catch (err) {
    console.warn(`[copy-latest] Warning: Could not read version.js: ${err.message}`);
    return null;
  }
}

// Recursively copy directory
async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

// Recursively rewrite links in markdown files
async function rewriteLinks(dir, oldVersion, newVersion) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await rewriteLinks(fullPath, oldVersion, newVersion);
    } else if (entry.name.endsWith(".md")) {
      let content = await fs.readFile(fullPath, "utf8");
      // Replace version-specific paths in link contexts only:
      // - Markdown links: ](/v15.0/...
      // - HTML href: href="/v15.0/...
      // - Reference links: ]: /v15.0/...
      const escapedVersion = oldVersion.replace(/\./g, "\\.");
      const regex = new RegExp(`(\\]\\(|href="|\\]:\\s*)/${escapedVersion}/`, "g");
      const newContent = content.replace(regex, `$1/${newVersion}/`);

      if (content !== newContent) {
        await fs.writeFile(fullPath, newContent, "utf8");
      }
    }
  }
}

async function main() {
  const version = await readVersion();
  if (!version) {
    fail(`No version found in ${versionFile}. Run "npm run pre:version" to generate it.`);
  }

  const majorVersion = extractMajorVersion(version);
  if (!majorVersion) {
    fail(`Could not extract a major version from "${version}" in ${versionFile}.`);
  }

  // Docs folders exist per major version (v14.0, v15.0). A minor release such as v15.1.0
  // has no folder of its own, so fall back to its major version's folder.
  const candidateFolders = [...new Set([majorVersion, `${majorVersion.split(".")[0]}.0`])];
  let sourceVersion = null;
  for (const candidate of candidateFolders) {
    try {
      await fs.access(path.join(docsDir, candidate));
      sourceVersion = candidate;
      break;
    } catch {
      // Try the next candidate
    }
  }

  if (!sourceVersion) {
    fail(
      `No docs folder for the latest Butler SOS release ${version} (looked for ` +
        `${candidateFolders.map((f) => `docs/${f}`).join(" and ")}). If this is a new major ` +
        `version, create its folder as described under "Adding a New Version" in README.md.`
    );
  }

  const sourceDir = path.join(docsDir, sourceVersion);
  const latestDir = path.join(docsDir, "latest");

  // Remove existing latest directory if it exists
  try {
    await fs.rm(latestDir, { recursive: true, force: true });
  } catch {
    // Ignore if it doesn't exist
  }

  console.log(`[copy-latest] Copying ${sourceVersion} to latest (latest release: ${version})`);
  await copyDir(sourceDir, latestDir);

  console.log(`[copy-latest] Rewriting links from /${sourceVersion}/ to /latest/`);
  await rewriteLinks(latestDir, sourceVersion, "latest");

  console.log("[copy-latest] Done");
}

main().catch((err) => fail(err.message));
