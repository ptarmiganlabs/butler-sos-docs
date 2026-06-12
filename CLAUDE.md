# Butler SOS Docs - Agent Guide

VitePress documentation site for Butler SOS. Hosted on Cloudflare Pages with auto-deploy on `master` commits.

## Commands

```bash
npm run dev      # Start dev server (runs pre-scripts automatically)
npm run build    # Build production site (runs pre-scripts automatically)
npm run serve    # Preview production build (runs pre-scripts automatically)
```

**Pre-scripts run automatically** before dev/build/serve:
- `pre:version` - Fetches latest Butler SOS version from GitHub API
- `pre:latest` - Generates `/docs/latest/` from latest version folder

## Content Structure

```
docs/
├── v14.0/           # Versioned docs (source)
├── v15.0/           # Versioned docs (source)
├── latest/          # Auto-generated (do not edit)
└── .vitepress/
    └── config.ts    # Sidebar uses createSidebar() helper
```

## Key Conventions

**Sidebar**: Defined once via `createSidebar(prefix)` in `config.ts`. All versioned sidebars (`/v14.0/`, `/v15.0/`, `/latest/`) call this function with their path prefix. Don't duplicate sidebar structure.

**Images**: Use `<ResponsiveImage>` component for images with captions:
```markdown
<ResponsiveImage src="./image.png" alt="Description" caption="Caption" maxWidth="450px" />
```

**Versioned links**: When editing docs in `v14.0/` or `v15.0/`, use version-specific paths like `/v15.0/about/`. The `/latest/` folder is regenerated on each build with links rewritten automatically.

## Gotchas

- `/docs/latest/` is generated at build time - don't edit directly
- Version is fetched from GitHub releases API - update `docs/.vitepress/version.js` after new Butler SOS releases
- Nav "Guide" link and homepage "Learn More" both point to `/latest/about/`

---

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **butler-sos-docs** (2723 symbols, 2745 relationships, 2 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/butler-sos-docs/context` | Codebase overview, check index freshness |
| `gitnexus://repo/butler-sos-docs/clusters` | All functional areas |
| `gitnexus://repo/butler-sos-docs/processes` | All execution flows |
| `gitnexus://repo/butler-sos-docs/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |
| Work in the Scripts area (13 symbols) | `.claude/skills/generated/scripts/SKILL.md` |

<!-- gitnexus:end -->
