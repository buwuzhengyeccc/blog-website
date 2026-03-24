# Blog Website

Personal brand site and content-driven blog built with Next.js App Router.

This repository is maintained as a production-ready content site with:

- fixed frontend information architecture
- local file-based content
- TinaCMS for local editing only
- GitHub as the source of truth
- Vercel for automatic production deployment

## Project Purpose

- Present a personal technical brand site
- Organize public content by section, not by content type hub
- Keep maintenance simple and predictable
- Publish by editing locally, committing to Git, and letting Vercel deploy

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- TinaCMS (local editing helper only)
- Three.js
- npm
- Vercel

## Environment Requirements

### Recommended runtime

- Node.js: `20.x`
- npm: `10.x`

The repository now declares this in:

- `package.json` -> `engines`
- `.nvmrc`

### Operating systems

The project is expected to work on:

- Windows
- macOS
- Linux

Windows is already verified in the current maintenance history.

### Local development address

Use this address consistently during development:

- `http://localhost:3000`

Prefer `localhost` over `127.0.0.1` to reduce unnecessary local warnings and environment ambiguity.

## Public Routes

The public site is intentionally fixed to:

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

## Content Sources

- Section content: `content/sections/*`
- Static page content: `content/pages/*`

Notes:

- Each `content/sections/**/*.mdx` file is one entry
- Entries use frontmatter `contentType` to distinguish `post`, `note`, and `project`
- Public routing still stays under `/sections/...`
- Entries with `draft: true` are excluded from public section views

## Directory Overview

- `app/` - routes
- `components/` - page components and reusable UI
- `lib/` - content loaders, mapping logic, page data assembly
- `content/pages/` - homepage, About, Contact content
- `content/sections/` - MDX content entries
- `tina/` - Tina config and generated files
- `public/` - static assets
- `docs/` - supporting architecture notes

## Local Setup

### Quick self-check

Run these commands in order in a fresh environment:

```bash
node -v
npm -v
npm install
npm run dev
```

Expected results:

- `node -v` shows `20.x`
- `npm -v` shows `10.x`
- `npm install` completes without blocking errors
- `npm run dev` starts a local server on `http://localhost:3000`

### Normal frontend development

```bash
npm run dev
```

Open:

- `http://localhost:3000`

### Local editing with Tina

```bash
npm run dev:cms
```

Use this only for local content editing workflows.  
It is not the production publishing path.

### Production-like local verification

```bash
npm run build
npm run start
```

Use this when you need to distinguish development-only issues from production-relevant issues.

## Content Update Workflow

### Update section content

1. Edit or add `.mdx` files in `content/sections/<section>/`
2. Verify frontmatter
3. Run local checks
4. Commit and push
5. Let Vercel deploy automatically

### Update homepage / About / Contact

Edit:

- `content/pages/home.json`
- `content/pages/about.json`
- `content/pages/contact.json`

Or use Tina locally if needed.

## Deployment

Production publishing flow:

1. Edit locally
2. Commit to Git
3. Push to GitHub
4. Vercel deploys automatically

Primary production build command:

```bash
npm run build
```

See `DEPLOYMENT.md` for:

- dev vs prod differences
- deployment checks
- rollback guidance

## Common Maintenance Entry Points

- Homepage content: `content/pages/home.json`
- About content: `content/pages/about.json`
- Contact content: `content/pages/contact.json`
- Section aggregation logic: `lib/sections.ts`
- Section content reading: `lib/entries.ts`
- Static page reading: `lib/pages.ts`
- Tina schema: `tina/config.ts`
- Production `/admin` guard: `middleware.ts`

## Notes and Constraints

- Do not restore `/posts`, `/notes`, `/projects` as formal public navigation
- Do not evolve Tina into an online production CMS
- Production `/admin` should not become a public feature
- Section ownership should continue to come from file paths
- Prefer changing `content/` before changing components
- Keep homepage and section visual behavior stable unless there is a deliberate design decision

## Suggested Reading Order

For a new maintainer:

1. `README.md`
2. `README_TO_AI.md`
3. `MAINTENANCE.md`
4. `DEPLOYMENT.md`
5. `docs/architecture.md`
