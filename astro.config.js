import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import pdf from 'astro-pdf';

// https://astro.build/config
export default defineConfig({
	integrations: [pdf({ pages: { cv: 'Ramil_Karimov.CV.pdf' } })],
	markdown: {
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
