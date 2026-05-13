import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const portfolio = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
	schema: z.object({
		title: z.string(),
		tags: z.array(z.string()),
		image: z.string().optional(),
		draft: z.boolean(),
		featured: z.boolean().optional(),
	}),
});

const experience = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/experience" }),
	schema: z.object({
		title: z.string(),
		start: z.string().date(),
		end: z.string().date().optional(),
	})
})

export const collections = {
	portfolio,
	experience
};
