# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Development Commands
- `pnpm dev` or `pnpm start` - Start development server at localhost:4321
- `pnpm build` - Build for production (runs type check, installs Playwright/Puppeteer browsers, builds)
- `pnpm preview` - Preview production build
- `pnpm lint:fix` - Fix linting and formatting issues
- `pnpm astro check` - Run TypeScript type checking

## Code Style Guidelines
- **Formatting**: Prettier with trailing commas (ES5), single quotes, tabs
- **TypeScript**: Astro's strict configuration
- **Imports**: Use `#components/Foo` alias (maps to `./src/components/Foo`)
- **CSS**: Tailwind CSS v4 with mobile-first approach (`md:`, etc.)
- **Error Handling**: Prefer optional chaining (`?.`) and nullish coalescing (`??`)

## Content Collections
Two collections defined in `src/content/config.ts`:
- **portfolio**: Projects with `title`, `tags[]`, `image?`, `draft`, `featured?`
- **experience**: Work history with `title`, `start` (date), `end?` (date)

Files are named with numeric prefix for ordering (e.g., `0050-quickBPM.md`, `2024-03-01_kyt.md`).

## Mermaid Diagrams
- `<Mermaid chart={...}>` - Server-side rendered using `@mermaid-js/mermaid-cli`
- In Markdown: use fenced code blocks with `mermaid` language (auto-rendered via rehype-mermaid)
- Curly braces in node labels need quotes: `B["Decision"]` in Markdown, `B{"Decision"}` with `String.raw` in Astro

## Key Integrations
- **astro-pdf**: Generates PDF from `/cv` page as `Ramil_Karimov.CV.pdf`
- **rehype-external-links**: External links open in new tab with nofollow/noopener
