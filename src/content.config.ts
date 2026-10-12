import { defineCollection, z, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';

// Content imported from the old WordPress site by scripts/scrape.py.
// Each page is a folder with index.md + its images; the folder path is the URL path.
const schema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    description: z.string().optional(),
    order: z.number().default(0),
    wpId: z.number().optional(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
  });

const folder = (base: string) =>
  glob({
    pattern: '**/index.md',
    base,
    generateId: ({ entry }) => entry.replace(/\/?index\.md$/, ''),
  });

export const collections = {
  produkti: defineCollection({ loader: folder('./src/content/produkti'), schema }),
  lapas: defineCollection({ loader: folder('./src/content/lapas'), schema }),
};
