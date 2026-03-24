# Architecture

## 1. Overview

This project is a content-driven personal brand website built with Next.js App Router.

Its current architecture is intentionally simple:

- content is stored in local files
- page rendering is driven by file-based data loaders in `lib/`
- TinaCMS is retained only as a local editing helper
- production deployment is handled by GitHub + Vercel

The architecture is optimized for maintainability, low operational overhead, and predictable publishing.

## 2. Frontend Information Architecture

The public site is fixed to the following route structure:

- `/`
- `/sections/[slug]`
- `/sections/[slug]/[articleSlug]`
- `/about`
- `/contact`

This is a deliberate long-term constraint.

The project should not drift back to:

- `/posts`
- `/notes`
- `/projects`

as public first-level content hubs.

## 3. Content Architecture

### 3.1 Section Content

Primary content lives under:

- `content/sections/ai-agent/`
- `content/sections/cybersecurity/`
- `content/sections/portfolio/`
- `content/sections/thoughts/`

Each `.mdx` file represents one content entry.

Entries can represent different internal content types:

- `post`
- `note`
- `project`

However, the frontend does not expose those types as top-level navigation groups.  
Instead, all entries are grouped by section in the UI.

### 3.2 Static Page Content

Static brand pages live under:

- `content/pages/home.json`
- `content/pages/about.json`
- `content/pages/contact.json`

These files are the canonical content source for the homepage, About page, and Contact page.

## 4. Data Flow

### Homepage

- route: `app/page.tsx`
- data source: `content/pages/home.json`
- data loader: `lib/pages.ts`
- UI: `components/home/HomeCubeGallery.tsx`

### About Page

- route: `app/about/page.tsx`
- data source: `content/pages/about.json`
- data loader: `lib/pages.ts`
- UI: `components/about/AboutIntroPage.tsx`

### Contact Page

- route: `app/contact/page.tsx`
- data source: `content/pages/contact.json`
- data loader: `lib/pages.ts`
- UI: `components/contact/ContactIntroPage.tsx`

### Section Listing Pages

- route: `app/sections/[slug]/page.tsx`
- loader: `lib/sections.ts`
- UI: `components/sections/SectionGalleryPage.tsx`

### Section Detail Pages

- route: `app/sections/[slug]/[articleSlug]/page.tsx`
- loaders:
  - `lib/sections.ts`
  - `lib/posts.ts`
- UI split:
  - `post` -> `components/posts/PostDetail.tsx`
  - `note` / `project` -> `components/sections/SectionEntryDetail.tsx`

## 5. Content Parsing Strategy

The content parsing layer is centered around:

- `lib/content.ts`
- `lib/entries.ts`

Responsibilities:

- parse MDX frontmatter
- derive slug from file path
- derive section from directory path
- normalize content into a stable internal record shape

Important rule:

- `section` ownership is derived from the file path, not trusted as a free-form user-controlled field

This constraint prevents mismatches between content location and routing behavior.

## 6. Routing and Static Generation

Static generation is used for section routes and section detail routes.

Relevant files:

- `app/sections/[slug]/page.tsx`
- `app/sections/[slug]/[articleSlug]/page.tsx`

Both rely on `generateStaticParams()`, which means:

- valid paths should come from the current content set
- missing content should fall back to `notFound()`

This keeps the production site deterministic and content-driven.

## 7. Draft Handling

Draft behavior is handled in `lib/sections.ts`.

Current rule:

- entries with `draft: true` are excluded from the public section views

This allows content to remain editable and versioned in the repository without being publicly exposed.

## 8. Theme and Visual Layer

The project contains custom visual behavior for:

- homepage
- section pages

Relevant files include:

- `app/globals.css`
- `components/home/HomeCubeGallery.tsx`
- `components/sections/SectionGalleryPage.tsx`

These areas are more interaction-heavy than the rest of the site and should be changed cautiously.

Recent theme behavior note:

- homepage first-visit default theme is currently set to `light`
- persisted preference still comes from `localStorage`

## 9. TinaCMS Role

Tina configuration lives in:

- `tina/config.ts`

Current role of Tina:

- local editing helper only
- optional authoring convenience
- not a required production runtime dependency

Production should not be redesigned around online Tina usage.

## 10. Production Safety Guard for `/admin`

Current protection:

- `middleware.ts` returns `404` for `/admin` in non-development environments

There is also still a rewrite in `next.config.ts` for `/admin`, so the middleware is an important safeguard.

The intended production behavior remains:

- `/admin` is not a public feature

## 11. Deployment Model

Deployment is based on:

1. local edits
2. git commit
3. push to GitHub
4. automatic Vercel deployment

Current build command:

```bash
npm run build
```

Current production build behavior intentionally avoids using Tina as an online CMS layer.

## 12. Architectural Constraints

The following constraints should be treated as stable unless there is an explicit product decision to change them:

- keep the public route structure centered on `/sections`
- keep content in `content/sections/*` and `content/pages/*`
- keep Tina local-only
- do not restore `/posts`, `/notes`, `/projects` as public primary navigation
- do not move content ownership back into component code
- avoid broad refactors for small maintenance tasks

## 13. Recommended Reading Order

For a new maintainer or AI assistant, the best reading order is:

1. `README.md`
2. `README_TO_AI.md`
3. `MAINTENANCE.md`
4. `DEPLOYMENT.md`
5. `docs/architecture.md`
6. `lib/content.ts`
7. `lib/entries.ts`
8. `lib/pages.ts`
9. `lib/sections.ts`

This sequence gives both the high-level intent and the actual implementation path.
