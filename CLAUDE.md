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

### Adding a Portfolio Project

Create a new `.md` file in `src/content/portfolio/` with numeric prefix for ordering (lower = higher priority):

```md
---
title: Project Name
tags: [Tech1, Tech2]
draft: false
featured: true # optional, shows on homepage
image: /path/to/image.png # optional
---

# Project content in markdown...
```

### Adding Work Experience

Create a new `.md` file in `src/content/experience/` named `YYYY-MM-DD_company.md`:

```md
---
title: Role at Company, Location
start: 'YYYY-MM-DD'
end: 'YYYY-MM-DD' # optional, omit for current position
---

**Role:** Description

**Tasks and Accomplishments:**

- Task 1
- Task 2
```

## Mermaid Diagrams

- `<Mermaid chart={...}>` - Server-side rendered using `@mermaid-js/mermaid-cli`
- In Markdown: use fenced code blocks with `mermaid` language (auto-rendered via rehype-mermaid)
- Curly braces in node labels need quotes: `B["Decision"]` in Markdown, `B{"Decision"}` with `String.raw` in Astro

## Key Integrations

- **astro-pdf**: Generates PDF from `/cv` page as `Ramil_Karimov.CV.pdf`
- **rehype-external-links**: External links open in new tab with nofollow/noopener
