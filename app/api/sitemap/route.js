import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, created_at, date_modified")
    .eq("published", true);

  const baseUrl = "https://sushanthp.com";

  const staticPages = [
    { url: baseUrl, priority: "1.0", changefreq: "weekly" },
    { url: `${baseUrl}/blog`, priority: "0.8", changefreq: "daily" },
  ];

  const postPages = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastmod: post.date_modified || post.created_at,
    priority: "0.7",
    changefreq: "monthly",
  }));

  const allPages = [...staticPages, ...postPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString().split("T")[0]}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
