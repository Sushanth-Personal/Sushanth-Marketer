import { supabase } from "@/lib/supabase";

export default async function sitemap() {
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, created_at, date_modified")
    .eq("published", true);

  const baseUrl = "https://sushanthp.com";

  const postUrls = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date_modified || post.created_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...postUrls,
  ];
}
