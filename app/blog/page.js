import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const revalidate = 60;

export const metadata = {
  title: "Marketing Strategy Blog — Sushanth P",
  description:
    "Practical writing on brand messaging, SEO, ad strategy, and consumer psychology. For founders who want to understand what's actually driving their marketing results.",
};

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div style={{ minHeight: "100vh", background: "#e8e4db" }}>
      <Navbar />

      {/* ── Header — dark, absorbs the 68px navbar offset ── */}
      <section
        style={{
          background: "#0e0e0e",
          padding: "calc(68px + 4rem) 2.5rem 4rem",
          borderBottom: "1px solid #1e1e1e",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontFamily: "var(--font-sans)",
              marginBottom: "1.5rem",
            }}
          >
            Writing
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 400,
              color: "#f5f2ec",
              lineHeight: 1.2,
              maxWidth: 640,
              marginBottom: "1.5rem",
            }}
          >
            Marketing explained clearly.
            <br />
            <span style={{ color: "var(--accent)" }}>
              No frameworks. No fluff.
            </span>
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(232,228,220,0.5)",
              lineHeight: 1.7,
              fontWeight: 300,
              maxWidth: 520,
              fontFamily: "var(--font-sans)",
            }}
          >
            Practical writing on brand messaging, consumer psychology, SEO, and
            ad strategy for founders who want to understand what's actually
            driving results.
          </p>
        </div>
      </section>

      {/* ── Posts — light ── */}
      <section style={{ padding: "4rem 2.5rem 6rem", background: "#e8e4db" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {!posts || posts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "#6b6560",
                fontFamily: "var(--font-serif)",
                fontSize: "1.2rem",
                fontStyle: "italic",
              }}
            >
              Posts coming soon.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1px",
                background: "#c8c4bb",
              }}
            >
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="blog-card"
                  style={{
                    background: "#ffffff",
                    padding: "2rem 2.5rem",
                    textDecoration: "none",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "1.5rem",
                    alignItems: "center",
                  }}
                >
                  {/* Left — content */}
                  <div>
                    {post.tag && (
                      <p
                        style={{
                          fontSize: "0.62rem",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "#9a9690",
                          fontFamily: "var(--font-sans)",
                          marginBottom: "0.6rem",
                        }}
                      >
                        {post.tag}
                      </p>
                    )}
                    <h2
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "clamp(1rem, 2vw, 1.25rem)",
                        fontWeight: 400,
                        color: "#1a1814",
                        lineHeight: 1.4,
                        marginBottom: post.excerpt ? "0.75rem" : 0,
                      }}
                    >
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p
                        style={{
                          fontSize: "0.88rem",
                          color: "#6b6560",
                          lineHeight: 1.65,
                          maxWidth: 580,
                        }}
                      >
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Right — meta + arrow */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "0.5rem",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.1rem",
                        color: "var(--accent)",
                        fontFamily: "var(--font-sans)",
                        lineHeight: 1,
                      }}
                    >
                      →
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "#b0aba4",
                        fontFamily: "var(--font-sans)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {post.reading_time && (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          color: "#c0bbb4",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {post.reading_time} min read
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {posts && posts.length > 0 && (
            <p
              style={{
                marginTop: "2.5rem",
                fontSize: "0.8rem",
                color: "#b0aba4",
                fontFamily: "var(--font-sans)",
                textAlign: "center",
              }}
            >
              {posts.length} {posts.length === 1 ? "article" : "articles"}{" "}
              published
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
