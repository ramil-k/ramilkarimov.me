import { defineCollection, z } from "astro:content";

const portfolio = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    draft: z.boolean(),
    featured: z.boolean().optional(),
  }),
});

export const collections = {
  portfolio,
};
