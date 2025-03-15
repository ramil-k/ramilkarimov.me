import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import pdf from 'astro-pdf';
import remarkMermaid from 'remark-mermaidjs';
import rehypeExternalLinks from 'rehype-external-links';
import path from 'path';

// Get absolute path to mmdc binary
const mmdcPath = path.join(process.cwd(), 'node_modules', '.bin', 'mmdc');

// https://astro.build/config
export default defineConfig({
	integrations: [pdf({ pages: { cv: 'Ramil_Karimov.CV.pdf' } })],
	markdown: {
		remarkPlugins: [
			[remarkMermaid, {
				// Server-side rendering configuration
				mermaidOptions: {
					theme: 'default',
				},
				// Use absolute path to mermaid CLI
				mmdcPath,
				// Simple output - no fancy features
				simple: true
			}]
		],
		rehypePlugins: [
			[rehypeExternalLinks, { 
				target: '_blank',
				rel: ['nofollow', 'noopener', 'noreferrer']
			}],
		],
		shikiConfig: {
			//themes: {
			//	light: 'github-light',
			//	dark: 'github-dark',
			//},
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
