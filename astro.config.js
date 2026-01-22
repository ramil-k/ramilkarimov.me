import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import pdf from 'astro-pdf';
import rehypeMermaid from 'rehype-mermaid';
import rehypeExternalLinks from 'rehype-external-links';

// https://astro.build/config
export default defineConfig({
	integrations: [pdf({ pages: { cv: 'Ramil_Karimov.CV.pdf' } })],
	markdown: {
		syntaxHighlight: {
			type: 'shiki',
			excludeLangs: ['mermaid'],
		},
		rehypePlugins: [
			[rehypeMermaid, { strategy: 'img-svg' }],
			[rehypeExternalLinks, {
				target: '_blank',
				rel: ['nofollow', 'noopener', 'noreferrer']
			}],
		],
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
