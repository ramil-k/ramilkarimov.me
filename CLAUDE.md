# CLAUDE.md - Repository Guidelines

## Build/Development Commands
- `pnpm dev` or `pnpm start` - Start development server
- `pnpm build` - Build for production (runs type check and build)
- `pnpm preview` - Preview production build
- `pnpm lint:fix` - Fix linting and formatting issues
- `pnpm astro check` - Run TypeScript type checking

## Code Style Guidelines
- **Formatting**: Uses Prettier with trailing commas (ES5), single quotes, tabs
- **TypeScript**: Follows Astro's strict TypeScript configuration
- **Component Props**: Use TypeScript interfaces with optional properties marked with `?`
- **Imports**: Import components with relative paths, use absolute paths for deeper imports
- **CSS**: Use Tailwind CSS with class strings in backticks for multi-line classes
- **Naming**: PascalCase for components, camelCase for variables and functions
- **Error Handling**: Prefer optional chaining (`?.`) and nullish coalescing (`??`)
- **File Structure**: Group related components in subdirectories
- **Component Templates**: Keep logic in frontmatter section, template in component body
- **Responsiveness**: Use mobile-first approach with Tailwind breakpoints (`md:`, etc.)

## Project Structure
- `/src/components` - Reusable UI components
- `/src/layout` - Layout templates
- `/src/pages` - Page components and routes
- `/src/content` - Content collections (experience, portfolio)
- `/src/styles` - Global styles and fonts

## Mermaid Diagrams
- Two components available:
  - `<Mermaid>` - Server-side rendered diagrams (no JavaScript required)
  - `<MermaidClient>` - Client-side rendered fallback
- In Markdown content, use code blocks with language `mermaid` for auto-rendering
- IMPORTANT: When using node labels with curly braces (e.g., diamond shapes):
  - In Astro components: Use `String.raw` and escape curly braces with quotes: `B{"Decision"}`
  - In Markdown: Use quotes around text: `B["Decision"]`
- See complete examples at `/mermaid-example` and `/mermaid-markdown-test`
- Server-side rendering using `@mermaid-js/mermaid-cli` (no Puppeteer)