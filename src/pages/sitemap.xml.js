import { getCollection } from 'astro:content';

// Top-level standalone pages. Add a path here when a new section is created.
const STATIC_PATHS = ['', 'posts/', 'tags/'];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function GET(context) {
  const posts = (await getCollection('posts')).filter((post) => !post.data.draft);
  const tags = [...new Set(posts.flatMap((post) => post.data.tags))];

  const entries = [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...posts.map((post) => ({
      path: `posts/${post.id}/`,
      lastmod: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
    })),
    ...tags.map((tag) => ({ path: `tags/${tag}/` })),
  ];

  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = escapeXml(new URL(path, context.site).href);
      const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
      return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
