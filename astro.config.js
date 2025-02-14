import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import pdf from 'astro-pdf';

// https://astro.build/config
export default defineConfig({
	integrations: [pdf({ pages: { cv: 'cv.pdf' } })],

	vite: {
		plugins: [tailwindcss()],
	},
});
