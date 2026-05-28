import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Script from "next/script";
import "@/app/blog/blog-content.css";
import { renderContent } from "./BlogRenderer";
import IframeContent from "./IframeContent";
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data } = await supabase
    .from("posts")
    .select(
      "title, meta_title, excerpt, meta_description, keywords, cover_image, created_at, date_modified, canonical_url, slug",
    )
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Post not found" };

  const canonical =
    data.canonical_url || `https://sushanthp.com/blog/${data.slug}`;
  const title = data.meta_title || data.title;
  const description = data.meta_description || data.excerpt;

  return {
    title,
    description,
    ...(data.keywords && { keywords: data.keywords }),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      publishedTime: data.created_at,
      modifiedTime: data.date_modified || data.created_at,
      authors: ["Sushanth P"],
      images: data.cover_image
        ? [{ url: data.cover_image, width: 1200, height: 630 }]
        : [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: data.cover_image ? [data.cover_image] : ["/og-image.jpg"],
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  const canonical =
    post.canonical_url || `https://sushanthp.com/blog/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    datePublished: post.created_at,
    dateModified: post.date_modified || post.created_at,
    author: {
      "@type": "Person",
      name: "Sushanth P",
      url: "https://sushanthp.com",
      sameAs: ["https://www.linkedin.com/in/sushanth-p"],
    },
    publisher: {
      "@type": "Person",
      name: "Sushanth P",
      url: "https://sushanthp.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    url: canonical,
    ...(post.cover_image && { image: post.cover_image }),
    ...(post.keywords && { keywords: post.keywords }),
  };

  const faqSchema =
    post.faq_schema && post.faq_schema.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq_schema.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }
      : null;

  const rendered = renderContent(post.content);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <Script
        id="schema-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <Script
          id="schema-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Navbar />
      <div style={{ paddingTop: 68 }}>
        {/* ── Post header — always shown from DB fields ── */}
        <section style={{ background: "#1a1814", padding: "80px 32px 64px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <Link
              href="/blog"
              style={{
                fontSize: 12,
                color: "var(--text-light-muted)",
                fontFamily: "var(--font-sans)",
                letterSpacing: 1,
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-block",
                marginBottom: 32,
              }}
            >
              ← All posts
            </Link>

            {post.tag && (
              <p
                style={{
                  fontSize: 11,
                  color: "var(--amber)",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  fontFamily: "var(--font-sans)",
                  marginBottom: 20,
                }}
              >
                {post.tag}
              </p>
            )}

            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 400,
                color: "var(--text-light)",
                lineHeight: 1.2,
                marginBottom: 24,
              }}
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p
                style={{
                  fontSize: 17,
                  color: "rgba(232,228,220,0.65)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  maxWidth: 580,
                  marginBottom: 28,
                  fontFamily: "var(--font-sans)",
                }}
              >
                {post.excerpt}
              </p>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 13,
                color: "var(--text-light-muted)",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span>
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {post.reading_time && (
                <>
                  <span style={{ opacity: 0.3 }}>·</span>
                  <span>{post.reading_time} min read</span>
                </>
              )}
              {post.date_modified && (
                <>
                  <span style={{ opacity: 0.3 }}>·</span>
                  <span style={{ opacity: 0.5 }}>
                    Updated{" "}
                    {new Date(post.date_modified).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Post content ── */}
        {rendered.type === "fullpage" ? (
          <IframeContent content={rendered.content} title={post.title} />
        ) : (
          <section style={{ padding: "72px 32px 96px", background: "#f9f7f4" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              {post.cover_image && (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  style={{
                    width: "100%",
                    height: 380,
                    objectFit: "cover",
                    marginBottom: 56,
                    borderRadius: 2,
                  }}
                />
              )}
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: rendered.content }}
              />
              <div
                style={{
                  marginTop: 72,
                  paddingTop: 40,
                  borderTop: "1px solid var(--border-light)",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 22,
                    color: "var(--text-primary)",
                    marginBottom: 16,
                  }}
                >
                  Found this useful?
                </p>
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--text-muted)",
                    marginBottom: 28,
                  }}
                >
                  Let's talk about what this means for your marketing.
                </p>
                <a
                  href="mailto:sushanthp.careers@gmail.com"
                  style={{
                    background: "var(--dark)",
                    color: "var(--text-light)",
                    padding: "13px 28px",
                    fontSize: 12,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    fontFamily: "var(--font-sans)",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Work With Me →
                </a>
              </div>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
