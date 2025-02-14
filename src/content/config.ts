import { defineCollection, z } from 'astro:content';

const portfolio = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		tags: z.array(z.string()),
		image: z.string().optional(),
		draft: z.boolean(),
		featured: z.boolean().optional(),
	}),
});

const expirience = defineCollection({

})

export const collections = {
	portfolio,
	expirience
};
