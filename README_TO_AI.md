# README_TO_AI

## 1. Mission

This file is the fast handoff context for AI maintenance work.

Read this repository as a production content site with strong structural constraints, not as a playground for broad refactors.

Primary goals:

- preserve the fixed public architecture
- keep content file-based
- keep Tina local-only
- keep publishing predictable through GitHub + Vercel

## 2. Mandatory Reading Order

When taking over this project, read in this order:

1. `README.md`
2. `README_TO_AI.md`
3. `MAINTENANCE.md`
4. `DEPLOYMENT.md`
5. `docs/architecture.md`

Then inspect implementation files only as needed.

## 3. Project Shape

### Public information architecture

The public site is fixed to:

- `/`
- `/sections/[slug]`
- `/sections/[slug]/[articleSlug]`
- `/about`
- `/contact`

Current section slugs:

- `ai-agent`
- `cybersecurity`
- `portfolio`
- `thoughts`

### Content sources

- `content/sections/*`
- `content/pages/*`

### Production model

- local editing
- git commit
- push to GitHub
- automatic Vercel deployment

## 4. Key Architectural Rules

- Do not restore `/posts`, `/notes`, `/projects` as primary public routes
- Do not redesign production around Tina online usage
- Do not move content back into hardcoded components
- Do not change section ownership from path-derived to manually trusted input
- Do not over-refactor for small maintenance tasks

If a task can be solved in content files or a single mapping layer, do not spread it across unrelated modules.

## 5. Runtime and Environment Assumptions

- Recommended Node.js: `20.x`
- Recommended npm: `10.x`
- Local dev URL: `http://localhost:3000`
- Prefer `localhost` over `127.0.0.1`

### Why this matters

- environment drift can look like code regressions
- build success on Vercel does not guarantee local parity
- local issues should be checked against `build + start` before being called production bugs

## 6. High-Value Files

### Top-level docs

- `README.md`
- `README_TO_AI.md`
- `MAINTENANCE.md`
- `DEPLOYMENT.md`
- `docs/architecture.md`

### Routing

- `app/page.tsx`
- `app/about/page.tsx`
- `app/contact/page.tsx`
- `app/sections/[slug]/page.tsx`
- `app/sections/[slug]/[articleSlug]/page.tsx`

### Data loading

- `lib/content.ts`
- `lib/entries.ts`
- `lib/pages.ts`
- `lib/sections.ts`
- `lib/posts.ts`

### Platform and editing

- `middleware.ts`
- `next.config.ts`
- `tina/config.ts`

## 7. Content Model Summary

### Section entries

Each MDX entry under `content/sections/**` is normalized through:

- `lib/content.ts`
- `lib/entries.ts`

Important frontmatter fields:

- `title`
- `date`
- `summary`
- `contentType`
- `tags`

Optional fields include:

- `draft`
- `featured`
- `kicker`
- `category`
- `tag`
- `author`
- `readTime`
- `coverImage`
- `stack`
- `status`
- `repo`
- `demo`
- `highlights`

### Static pages

These are JSON-driven:

- `content/pages/home.json`
- `content/pages/about.json`
- `content/pages/contact.json`

## 8. Known Constraints Around Tina

- Tina is retained for local editing support
- production build should not depend on online Tina workflow
- production `/admin` is not meant to be public
- `middleware.ts` is part of the safety boundary

If a future task touches Tina, first ask whether the work is genuinely local-editing support or whether it risks reopening the online CMS path.

## 9. Development vs Production Differences

### Development

Command:

```bash
npm run dev
```

Characteristics:

- fast feedback
- more local warnings
- React / Next development behavior
- not sufficient by itself to prove production safety

### Production-like local verification

Commands:

```bash
npm run build
npm run start
```

Characteristics:

- closest local match to Vercel behavior
- required when debugging deployment-like issues
- better signal for route generation, bundling, and runtime compatibility

### Rule

If a bug might affect deployment or production behavior, verify it with `build + start`, not only `next dev`.

## 10. Validation Order for Maintenance Work

When content or code changes are made, validate in this order:

### Local development validation

Check:

- `/`
- `/sections/ai-agent`
- `/sections/cybersecurity`
- `/sections/portfolio`
- `/sections/thoughts`
- one detail page
- `/about`
- `/contact`

### Production-like validation

Run:

```bash
npm run build
npm run start
```

Then re-check:

- `/`
- section pages
- one detail page
- `/about`
- `/contact`

If production behavior matters, also check:

- `/admin` should not be usable in production

## 11. Fault Triage Map

### Content issue

Examples:

- article missing
- wrong summary
- page text outdated

First inspect:

- `content/sections/*`
- `content/pages/*`
- `lib/entries.ts`
- `lib/pages.ts`

### Route issue

Examples:

- section 404
- detail route missing
- wrong slug

First inspect:

- `app/sections/[slug]/page.tsx`
- `app/sections/[slug]/[articleSlug]/page.tsx`
- `lib/sections.ts`
- `lib/posts.ts`

### Three.js / WebGL issue

Examples:

- section gallery renders incorrectly
- black canvas
- visual failure only in some browsers

First inspect:

- `components/sections/SectionGalleryPage.tsx`
- `components/home/HomeCubeGallery.tsx`
- `app/globals.css`

Important note:

- section and homepage visuals depend on browser WebGL support and GPU/browser compatibility
- not every rendering failure is a business-logic failure
- confirm browser, GPU, and WebGL capability before concluding code regression

### Tina local editing issue

Examples:

- local Tina editor not loading
- schema mismatch

First inspect:

- `tina/config.ts`
- `tina/__generated__/`
- `npm run dev:cms`

### Build / deployment issue

Examples:

- Vercel build failure
- route generation mismatch
- production-only breakage

First inspect:

- `npm run build`
- `DEPLOYMENT.md`
- Vercel build logs
- `middleware.ts`
- `next.config.ts`

### Node version issue

Examples:

- local install mismatch
- dependency behavior differs across machines

First inspect:

- `.nvmrc`
- `package.json` engines
- `node -v`
- `npm -v`

## 12. Dependency Safety Rule

If `npm audit` reports warnings:

- do not run `npm audit fix --force` blindly
- first determine whether the issue affects production runtime, local tooling, or only dev dependencies
- prefer minimal, verified dependency changes
- preserve build stability over aggressive auto-upgrades

## 13. Standard Self-Check Commands

Use these in a new environment:

```bash
node -v
npm -v
npm install
npm run dev
npm run build
npm run start
```

Expected:

- Node is `20.x`
- npm is `10.x`
- install completes
- dev server runs at `http://localhost:3000`
- build succeeds
- start serves the production build

## 14. Do Not Do This

- Do not reopen the old route architecture
- Do not use Tina as justification for online CMS expansion
- Do not rewrite homepage or section visuals unless explicitly asked
- Do not “clean up” by moving content into code
- Do not treat WebGL rendering issues as plain route/content bugs without checking environment
- Do not use `npm audit fix --force` casually
- Do not assume `next dev` behavior equals production behavior

## 15. Default Working Style

- inspect first
- prefer minimal edits
- document assumptions
- distinguish confirmed facts from inference
- validate with the narrowest useful check before broad changes
