# Volodymyr Salo Portfolio Site

Professional portfolio website built with Next.js, React, TypeScript, and lucide-react.

## Prerequisites

- Bun 1.3 or newer
- Node.js compatible with the installed Next.js version

## Install Dependencies

```powershell
bun install
```

## Launch Locally

```powershell
bun run dev
```

Open:

```text
http://127.0.0.1:3000
```

If port `3000` is already in use, run:

```powershell
bun run dev -- -p 3001
```

## Build For Production

```powershell
bun run build
```

## Run Production Build Locally

After building:

```powershell
bun run start
```

Open:

```text
http://127.0.0.1:3000
```

To use another port:

```powershell
bun run start -- -p 3001
```

## Main Files

- `src/app/page.tsx` - site entry page
- `src/components/portfolio/PortfolioPage.tsx` - portfolio UI
- `src/lib/profile.ts` - CV/profile content
- `src/app/globals.css` - global visual system and responsive styling
- `public/` - avatar, CV PDF, LinkedIn snapshot, favicon
