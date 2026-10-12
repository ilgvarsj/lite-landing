import { getCollection, type CollectionEntry } from 'astro:content';
import { categoryOrder } from '../data/site';

export type Product = CollectionEntry<'produkti'>;

export const OVERVIEW_ID = '_index';

export const productHref = (id: string) => (id === OVERVIEW_ID ? '/produkti/' : `/produkti/${id}/`);

export const parentId = (id: string) => (id.includes('/') ? id.slice(0, id.lastIndexOf('/')) : null);

const byOrder = (a: Product, b: Product) =>
  a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'lv');

let cache: Product[] | undefined;
export async function allProducts() {
  cache ??= await getCollection('produkti');
  return cache;
}

/** Top-level product groups in the configured order. */
export async function categories() {
  const all = await allProducts();
  const top = all.filter((p) => p.id !== OVERVIEW_ID && !p.id.includes('/'));
  const rank = (id: string) => {
    const i = categoryOrder.indexOf(id);
    return i === -1 ? 99 : i;
  };
  return top.sort((a, b) => rank(a.id) - rank(b.id));
}

export async function childrenOf(id: string) {
  const all = await allProducts();
  return all.filter((p) => parentId(p.id) === id).sort(byOrder);
}

export async function breadcrumbTrail(id: string) {
  const all = await allProducts();
  const trail: { title: string; href: string }[] = [];
  let cur: string | null = parentId(id);
  while (cur) {
    const entry = all.find((p) => p.id === cur);
    if (entry) trail.unshift({ title: entry.data.title, href: productHref(entry.id) });
    cur = parentId(cur);
  }
  return trail;
}

/** Product tree for navigation: categories with their direct children. */
export async function navTree() {
  const cats = await categories();
  return Promise.all(
    cats.map(async (c) => ({
      id: c.id,
      title: c.data.title,
      href: productHref(c.id),
      children: (await childrenOf(c.id)).map((ch) => ({ title: ch.data.title, href: productHref(ch.id) })),
    })),
  );
}
