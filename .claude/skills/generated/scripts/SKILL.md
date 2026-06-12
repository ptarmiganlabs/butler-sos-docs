---
name: scripts
description: "Skill for the Scripts area of butler-sos-docs. 13 symbols across 3 files."
---

# Scripts

13 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `scripts/`
- Understanding how extractMajorVersion, readVersion, copyDir work
- Modifying scripts-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `scripts/copy-latest-docs.mjs` | extractMajorVersion, readVersion, copyDir, rewriteLinks, main |
| `scripts/convert-images.js` | convertImages, processFile, findMarkdownFiles, main |
| `scripts/fetch-butler-sos-version.mjs` | ensureDirExists, writeVersionFile, isValidTag, main |

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `extractMajorVersion` | Function | `scripts/copy-latest-docs.mjs` | 14 |
| `readVersion` | Function | `scripts/copy-latest-docs.mjs` | 20 |
| `copyDir` | Function | `scripts/copy-latest-docs.mjs` | 32 |
| `rewriteLinks` | Function | `scripts/copy-latest-docs.mjs` | 49 |
| `main` | Function | `scripts/copy-latest-docs.mjs` | 74 |
| `convertImages` | Function | `scripts/convert-images.js` | 32 |
| `processFile` | Function | `scripts/convert-images.js` | 153 |
| `findMarkdownFiles` | Function | `scripts/convert-images.js` | 186 |
| `main` | Function | `scripts/convert-images.js` | 214 |
| `ensureDirExists` | Function | `scripts/fetch-butler-sos-version.mjs` | 14 |
| `writeVersionFile` | Function | `scripts/fetch-butler-sos-version.mjs` | 19 |
| `isValidTag` | Function | `scripts/fetch-butler-sos-version.mjs` | 25 |
| `main` | Function | `scripts/fetch-butler-sos-version.mjs` | 29 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Main → ConvertImages` | intra_community | 3 |
| `Main → EnsureDirExists` | intra_community | 3 |

## How to Explore

1. `gitnexus_context({name: "extractMajorVersion"})` — see callers and callees
2. `gitnexus_query({query: "scripts"})` — find related execution flows
3. Read key files listed above for implementation details
