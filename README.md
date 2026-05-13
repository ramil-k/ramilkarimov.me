# Ramil Karimov - Personal Website

A personal portfolio website built with Astro, TailwindCSS and Mermaid.js.

## 🚀 Tech Stack

- [Astro](https://astro.build/) - Static site generator with excellent performance
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Mermaid.js](https://mermaid.js.org/) - Diagramming and charting tool
- TypeScript - Type safety for JavaScript
- Content Collections - For managing experience and portfolio data

## 🧩 Project Structure

```text
/
├── public/           # Static assets (fonts, images)
├── src/
│   ├── components/   # Reusable UI components
│   ├── content/      # Content collections (experience, portfolio)
│   ├── layout/       # Layout templates
│   ├── pages/        # Page components and routes
│   └── styles/       # Global styles and fonts
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command            | Action                                       |
| :----------------- | :------------------------------------------- |
| `pnpm install`     | Installs dependencies                        |
| `pnpm dev`         | Starts local dev server at `localhost:4321`  |
| `pnpm build`       | Build your production site to `./dist/`      |
| `pnpm preview`     | Preview your build locally, before deploying |
| `pnpm lint:fix`    | Fix linting and formatting issues            |
| `pnpm astro check` | Run TypeScript type checking                 |

## 📊 Mermaid Diagrams

This site includes two components for rendering Mermaid diagrams:

- `<Mermaid>` - Server-side rendered diagrams (no JavaScript required)
- `<MermaidClient>` - Client-side rendered fallback

In Markdown content, use code blocks with language `mermaid` for auto-rendering.

See examples at `/mermaid-example` and `/mermaid-markdown-test`.
