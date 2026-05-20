import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const revalidate = 60;

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        {/* Header */}
        <section
          style={{
            background: "var(--surface)",
            padding: "6rem 2.5rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <p
              style={{
                fontSize: 11,
                color: "var(--accent)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontFamily: "var(--font-sans)",
                marginBottom: 20,
              }}
            >
              From the blog
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 7vw, 6rem)",
                lineHeight: 0.95,
                color: "var(--white)",
                letterSpacing: "-0.01em",
              }}
            >
              Read how I think.
              <br />
              <span style={{ color: "var(--accent)" }}>
                If it resonates, we'll talk.
              </span>
            </h1>
          </div>
        </section>

        {/* Posts */}
        <section style={{ padding: "5rem 2.5rem" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {!posts || posts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 24,
                    color: "var(--text-muted)",
                    fontStyle: "italic",
                  }}
                >
                  Posts coming soon.
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-muted)",
                    marginTop: 12,
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Check back — something worth reading is on its way.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 1,
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    style={{
                      background: "var(--surface)",
                      padding: "2.25rem 1.75rem",
                      textDecoration: "none",
                      display: "block",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--surface2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--surface)";
                    }}
                  >
                    {post.tag && (
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--accent)",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          fontFamily: "var(--font-sans)",
                          marginBottom: 14,
                        }}
                      >
                        {post.tag}
                      </p>
                    )}
                    <h2
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: 19,
                        fontWeight: 400,
                        color: "var(--text)",
                        lineHeight: 1.5,
                        marginBottom: 16,
                      }}
                    >
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--text-muted)",
                          lineHeight: 1.7,
                          marginBottom: 20,
                        }}
                      >
                        {post.excerpt}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--accent)",
                          fontFamily: "var(--font-sans)",
                          letterSpacing: 0.5,
                        }}
                      >
                        Read →
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
