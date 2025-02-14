/** @type {import("prettier").Config} */
export default {
	plugins: ['prettier-plugin-astro'],
	trailingComma: 'es5',
	singleQuote: true,
	useTabs: true,
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
};
