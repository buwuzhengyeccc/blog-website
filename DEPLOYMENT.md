# DEPLOYMENT

## 1. Current Deployment Model

- Source control: GitHub
- Main branch: `main`
- Hosting: Vercel
- Trigger: push to GitHub

The repository is deployed as a standard Next.js project.

## 2. Build Commands

Current production build path:

```bash
npm run build
```

From `package.json`:

- `build` -> `next build`
- `start` -> `next start`

## 3. Development vs Production

### Development

Command:

```bash
npm run dev
```

Characteristics:

- best for quick iteration
- may show warnings or behavior that does not matter in production
- should not be the only verification step for deployment-sensitive changes

### Production-like local check

Commands:

```bash
npm run build
npm run start
```

Characteristics:

- closest local match to Vercel behavior
- should be used before calling something a production issue
- better for route generation, bundling, and deployment parity

### Rule

If a problem may affect Vercel or production behavior, verify it with:

```bash
npm run build
npm run start
```

not only with `npm run dev`.

## 4. Vercel Project Settings

For a normal import:

- Framework Preset: `Next.js`
- Root Directory: repository root
- Build Command: default
- Output Directory: default
- Install Command: default

## 5. Environment Variables

### Currently confirmed

The public production site typically does not need extra environment variables to render.

Tina config contains references to:

- `GITHUB_BRANCH`
- `VERCEL_GIT_COMMIT_REF`
- `NEXT_PUBLIC_TINA_CLIENT_ID`
- `TINA_TOKEN`

But production deployment is intentionally not centered on `tinacms build`.

### Rule

- do not preconfigure variables unless a concrete build/runtime need appears
- if Vercel build logs complain about missing variables, fix based on the logs

## 6. `/admin` Production Rule

Production intent:

- `/admin` is not a public feature

Protection:

- `middleware.ts` blocks `/admin` outside development

There is still an `/admin` rewrite in `next.config.ts`, so this should remain part of deployment validation.

## 7. Release Workflow

Normal release path:

1. make local changes
2. run local checks
3. commit to Git
4. push to GitHub
5. wait for Vercel to deploy

## 8. Validation After Deployment

Check at minimum:

- `/`
- `/sections/ai-agent`
- `/sections/cybersecurity`
- `/sections/portfolio`
- `/sections/thoughts`
- one detail page
- `/about`
- `/contact`
- `/admin` should not be publicly usable
- `/posts` should not be a valid public hub
- `/notes` should not be a valid public hub
- `/projects` should not be a valid public hub

## 9. Rollback Strategy

Preferred rollback path:

### Option A: Git-based rollback

1. identify the last known good commit
2. create a rollback commit or revert commit
3. push to GitHub
4. let Vercel redeploy

### Option B: Vercel deployment rollback

Use the platform rollback only as a temporary operational measure.  
The repository should still be brought back to a correct Git state afterward.

## 10. Deployment Troubleshooting

### Build fails on Vercel

Check:

- local `npm run build`
- Vercel build logs
- Node/npm versions
- deployment-sensitive code paths

### Local works, production fails

Check:

- `npm run build`
- `npm run start`
- route generation
- middleware behavior
- environment-variable assumptions

### Page differs between local and production

Check:

- latest commit actually deployed
- Vercel deployment status
- browser cache / localStorage / theme state

### Tina-related confusion in production

Remember:

- Tina is local-only in the intended production workflow
- do not convert a deployment issue into an online CMS expansion task
