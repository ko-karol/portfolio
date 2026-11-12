import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: file('src/data/projects.json'),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['client', 'personal']),
    url: z.url(),
    description: z.string(),
    tags: z.array(z.string()),
  }),
});

const reads = defineCollection({
  loader: file('src/data/reads.json'),
  schema: z.object({
    title: z.string(),
    url: z.url(),
    author: z.string(),
    date: z.coerce.date(),
    commentary: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = { projects, reads };
