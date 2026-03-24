# MAINTENANCE

## Purpose

This file is the day-to-day operating guide for maintainers.

It focuses on:

- how to update content
- how to validate changes
- how to distinguish environment problems from code problems
- how to troubleshoot without guessing

## 1. Environment Baseline

- Node.js: `20.x`
- npm: `10.x`
- Local dev URL: `http://localhost:3000`

Before debugging anything, confirm:

```bash
node -v
npm -v
```

If versions differ materially from the baseline, fix the environment first.

## 2. Standard Self-Check

Run these in order in a fresh checkout:

```bash
node -v
npm -v
npm install
npm run dev
npm run build
npm run start
```

Expected results:

- `node -v` -> `20.x`
- `npm -v` -> `10.x`
- `npm install` succeeds
- `npm run dev` serves `http://localhost:3000`
- `npm run build` succeeds
- `npm run start` serves the production build

## 3. Common Maintenance Tasks

### Update section content

Edit files under:

- `content/sections/<section>/*.mdx`

Typical edits:

- title
- summary
- body
- metadata such as repo/demo/status

### Add new content entry

1. Choose the correct section directory
2. Create a new `.mdx`
3. Fill frontmatter
4. Validate locally

### Remove content entry

1. Delete the target `.mdx`
2. Verify the entry disappears from the section page
3. Commit and push

### Update homepage / About / Contact

Prefer editing:

- `content/pages/home.json`
- `content/pages/about.json`
- `content/pages/contact.json`

Only change components if the content shape is insufficient.

## 4. What to Edit First

Use this order:

1. `content/`
2. `lib/`
3. `components/`
4. `app/`
5. config files

Principle:

- content problem -> fix content first
- mapping problem -> fix `lib/`
- rendering problem -> fix component
- avoid route-level changes unless absolutely necessary

## 5. Local Validation Checklist

### 5.1 Development validation

Run:

```bash
npm run dev
```

Open:

- `http://localhost:3000/`
- `http://localhost:3000/sections/ai-agent`
- `http://localhost:3000/sections/cybersecurity`
- `http://localhost:3000/sections/portfolio`
- `http://localhost:3000/sections/thoughts`
- one detail page, for example:
  - `http://localhost:3000/sections/ai-agent/agent-collaboration`
- `http://localhost:3000/about`
- `http://localhost:3000/contact`

### 5.2 Production-like validation

Run:

```bash
npm run build
npm run start
```

Re-check the same routes.

Also verify:

- production `/admin` should not be a usable public entry

## 6. Development vs Production Rule

### Development mode

`npm run dev`

Use for:

- quick iteration
- UI checks
- local authoring work

Do not treat development mode alone as proof that production is safe.

### Production-like mode

`npm run build` + `npm run start`

Use for:

- deployment-like failures
- route generation issues
- build-only regressions
- runtime differences between local dev and Vercel

If something looks suspicious in Vercel, reproduce with `build + start` before making larger changes.

## 7. Fault Triage Table

### A. Content problem

Symptoms:

- article missing
- stale copy
- wrong text on homepage/about/contact

Check first:

- `content/sections/*`
- `content/pages/*`
- `lib/entries.ts`
- `lib/pages.ts`

Useful commands:

```bash
npm run dev
```

### B. Route problem

Symptoms:

- section page 404
- detail route 404
- wrong slug resolution

Check first:

- `app/sections/[slug]/page.tsx`
- `app/sections/[slug]/[articleSlug]/page.tsx`
- `lib/sections.ts`
- `lib/posts.ts`

Useful commands:

```bash
npm run build
npm run start
```

### C. Three.js / WebGL rendering problem

Symptoms:

- blank section canvas
- broken homepage visual layer
- environment-specific rendering issues

Check first:

- `components/sections/SectionGalleryPage.tsx`
- `components/home/HomeCubeGallery.tsx`
- `app/globals.css`

Important:

- these pages depend on browser WebGL capability
- GPU / browser / driver differences can look like application bugs
- verify in another browser before concluding code regression

### D. Tina local editing problem

Symptoms:

- local CMS does not start
- Tina schema mismatch

Check first:

- `tina/config.ts`
- `tina/__generated__/`

Useful command:

```bash
npm run dev:cms
```

### E. Build / deployment problem

Symptoms:

- Vercel build failure
- local build failure
- production-only route issue

Check first:

- `npm run build`
- `DEPLOYMENT.md`
- Vercel build logs
- `middleware.ts`
- `next.config.ts`

### F. Node / npm environment problem

Symptoms:

- local install mismatch
- dependencies behave differently by machine

Check first:

- `.nvmrc`
- `package.json` engines
- `node -v`
- `npm -v`

## 8. Dependency Safety Notes

If `npm audit` reports vulnerabilities:

- do not run `npm audit fix --force` blindly
- first identify whether the issue affects:
  - production runtime
  - local tooling
  - only dev dependencies
- prefer minimal and verified dependency updates

## 9. Operational Notes

- Use `http://localhost:3000` consistently
- Prefer narrow changes over cleanup refactors
- Keep content in `content/`, not in components
- Do not reintroduce old public hubs like `/posts`, `/notes`, `/projects`
- Keep Tina local-only
