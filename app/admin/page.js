"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("@/components/RichEditor"), {
  ssr: false,
});

const tabs = ["Posts", "New Post", "Homepage", "Navigation", "Settings"];

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const defaultHomepage = {
  heroEyebrow: "For founders who are done guessing",
  heroHeadline: "You need sales.",
  heroAccent: "Period.",
  heroSub:
    "Not more content. Not a brand refresh. Not another agency retainer.\n\nJust customers who actually pay.",
  heroCta: "Let's talk →",
  doubtTitle: "You're putting time and money into marketing.",
  doubtSub:
    "Some of it is working. Enough to keep going. Not enough to stop wondering.",
  doubtQ1: "Is this really the best my marketing can do?",
  doubtQ2: "How much am I leaving on the table?",
  doubtQ3: "Should I spend more — or is the problem somewhere else entirely?",
  doubtClose:
    "Nobody around you has a straight answer. And that's the problem.",
  pathLabel: "Where are you right now?",
  path1Label: "I have someone handling my marketing",
  path2Label: "I'm doing it myself",
  path3Label: "I'm just getting started",
  whatIDoHeadline: "I ask the questions nobody is asking.",
  whatIDoBody:
    "Before any copy. Before any campaign. Before any content calendar — there's a conversation most founders have never had: Who exactly are you for? What do they feel? What do they need to hear before they buy? I answer those questions first. Then build everything else around them.",
  ctaHeadline: "That's a sign.",
  ctaBody:
    "The founders who reach out to me aren't looking for another vendor. They're looking for someone who will tell them the truth about why their marketing isn't working — and actually fix it.",
  ctaButton: "Work With Me →",
};

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Posts");
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [navSettings, setNavSettings] = useState({
    blog: true,
    pricing: false,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [homepage, setHomepage] = useState(defaultHomepage);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    tag: "",
    excerpt: "",
    content: "",
    published: false,
    cover_image: "",
  });

  useEffect(() => {
    fetchPosts();
    fetchNavSettings();
    fetchHomepage();
  }, []);

  async function fetchPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data || []);
  }

  async function fetchNavSettings() {
    const { data } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "nav");
    if (data && data[0]) {
      try {
        setNavSettings(JSON.parse(data[0].value));
      } catch {}
    }
  }

  async function fetchHomepage() {
    const { data } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "homepage");
    if (data && data[0]) {
      try {
        setHomepage({ ...defaultHomepage, ...JSON.parse(data[0].value) });
      } catch {}
    }
  }

  async function saveHomepage() {
    setSaving(true);
    const { data } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "homepage");
    if (data && data[0]) {
      await supabase
        .from("settings")
        .update({ value: JSON.stringify(homepage) })
        .eq("key", "homepage");
    } else {
      await supabase
        .from("settings")
        .insert([{ key: "homepage", value: JSON.stringify(homepage) }]);
    }
    setSaving(false);
    setMsg("Homepage saved!");
    setTimeout(() => setMsg(""), 2000);
  }

  function newPostForm() {
    setForm({
      title: "",
      slug: "",
      tag: "",
      excerpt: "",
      content: "",
      published: false,
      cover_image: "",
    });
    setEditingPost(null);
    setActiveTab("New Post");
  }

  function editPost(post) {
    setForm({
      title: post.title,
      slug: post.slug,
      tag: post.tag || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      published: post.published,
      cover_image: post.cover_image || "",
    });
    setEditingPost(post.id);
    setActiveTab("New Post");
  }

  async function savePost() {
    if (!form.title) {
      setMsg("Title is required.");
      return;
    }
    setSaving(true);
    const slug = form.slug || slugify(form.title);
    const payload = { ...form, slug };
    let error;
    if (editingPost) {
      const res = await supabase
        .from("posts")
        .update(payload)
        .eq("id", editingPost);
      error = res.error;
    } else {
      const res = await supabase.from("posts").insert([payload]);
      error = res.error;
    }
    setSaving(false);
    if (error) {
      setMsg("Error: " + error.message);
      return;
    }
    setMsg(editingPost ? "Post updated!" : "Post saved!");
    fetchPosts();
    setTimeout(() => {
      setMsg("");
      setActiveTab("Posts");
    }, 1500);
  }

  async function deletePost(id) {
    if (!confirm("Delete this post?")) return;
    await supabase.from("posts").delete().eq("id", id);
    fetchPosts();
  }

  async function togglePublish(post) {
    await supabase
      .from("posts")
      .update({ published: !post.published })
      .eq("id", post.id);
    fetchPosts();
  }

  async function saveNavSettings() {
    setSaving(true);
    const { data } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "nav");
    if (data && data[0]) {
      await supabase
        .from("settings")
        .update({ value: JSON.stringify(navSettings) })
        .eq("key", "nav");
    } else {
      await supabase
        .from("settings")
        .insert([{ key: "nav", value: JSON.stringify(navSettings) }]);
    }
    setSaving(false);
    setMsg("Navigation saved!");
    setTimeout(() => setMsg(""), 1500);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  // Styles
  const sideStyle = {
    width: 220,
    background: "var(--dark-2)",
    borderRight: "1px solid var(--border-dark)",
    minHeight: "100vh",
    padding: "24px 0",
    flexShrink: 0,
  };

  const tabStyle = (active) => ({
    display: "block",
    padding: "10px 24px",
    fontSize: 13,
    color: active ? "var(--amber)" : "var(--text-light-muted)",
    background: active ? "rgba(200,169,110,0.08)" : "transparent",
    borderTop: "none",
    borderRight: "none",
    borderBottom: "none",
    borderLeft: active ? "2px solid var(--amber)" : "2px solid transparent",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    letterSpacing: 0.5,
    width: "100%",
    textAlign: "left",
  });

  const inputStyle = {
    width: "100%",
    background: "#fff",
    border: "1px solid var(--border-light)",
    color: "var(--text-primary)",
    padding: "10px 14px",
    fontSize: 14,
    fontFamily: "var(--font-sans)",
    marginBottom: 16,
    outline: "none",
    borderRadius: 3,
  };

  const textareaStyle = { ...inputStyle, resize: "vertical", lineHeight: 1.6 };

  const labelStyle = {
    fontSize: 12,
    color: "var(--text-muted)",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: "var(--font-sans)",
    display: "block",
    marginBottom: 6,
  };

  const sectionHeadStyle = {
    fontSize: 11,
    color: "var(--amber)",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: "var(--font-sans)",
    marginBottom: 16,
    marginTop: 36,
    paddingBottom: 8,
    borderBottom: "1px solid var(--border-light)",
  };

  const hp = homepage;
  const setHp = (key, val) => setHomepage((h) => ({ ...h, [key]: val }));

  return (
    <div style={{ minHeight: "100vh", background: "#F0EDE6", display: "flex" }}>
      {/* Sidebar */}
      <div style={sideStyle}>
        <div
          style={{
            padding: "0 24px 24px",
            borderBottom: "1px solid var(--border-dark)",
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              color: "var(--text-light)",
            }}
          >
            Admin
          </p>
          <p
            style={{
              fontSize: 11,
              color: "#3A3830",
              fontFamily: "var(--font-sans)",
              marginTop: 4,
            }}
          >
            sushanthp.com
          </p>
        </div>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => {
              setActiveTab(t);
              if (t === "New Post") {
                setEditingPost(null);
                setForm({
                  title: "",
                  slug: "",
                  tag: "",
                  excerpt: "",
                  content: "",
                  published: false,
                  cover_image: "",
                });
              }
            }}
            style={tabStyle(activeTab === t)}
          >
            {t}
          </button>
        ))}
        <div
          style={{
            borderTop: "1px solid var(--border-dark)",
            marginTop: 24,
            paddingTop: 16,
          }}
        >
          <Link
            href="/"
            target="_blank"
            style={{
              display: "block",
              padding: "8px 24px",
              fontSize: 12,
              color: "#3A3830",
              fontFamily: "var(--font-sans)",
              textDecoration: "none",
              letterSpacing: 0.5,
            }}
          >
            View Site ↗
          </Link>
          <button
            onClick={logout}
            style={{
              display: "block",
              padding: "8px 24px",
              fontSize: 12,
              color: "#3A3830",
              fontFamily: "var(--font-sans)",
              background: "none",
              borderTop: "none",
              borderRight: "none",
              borderBottom: "none",
              borderLeft: "none",
              cursor: "pointer",
              letterSpacing: 0.5,
              width: "100%",
              textAlign: "left",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "40px 48px", overflowY: "auto" }}>
        {msg && (
          <div
            style={{
              background: "#E8F5E9",
              border: "1px solid #A5D6A7",
              color: "#2E7D32",
              padding: "10px 16px",
              borderRadius: 4,
              marginBottom: 24,
              fontSize: 14,
              fontFamily: "var(--font-sans)",
            }}
          >
            {msg}
          </div>
        )}

        {/* POSTS LIST */}
        {activeTab === "Posts" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 28,
                  color: "var(--text-primary)",
                  fontWeight: 400,
                }}
              >
                Posts
              </h1>
              <button
                onClick={newPostForm}
                style={{
                  background: "var(--dark)",
                  color: "var(--text-light)",
                  padding: "10px 24px",
                  fontSize: 12,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontFamily: "var(--font-sans)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                + New Post
              </button>
            </div>
            {posts.length === 0 ? (
              <p
                style={{
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                  fontFamily: "var(--font-serif)",
                  fontSize: 18,
                }}
              >
                No posts yet. Create your first one.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  background: "var(--border-light)",
                }}
              >
                {posts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      background: "#fff",
                      padding: "20px 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: 16,
                          color: "var(--text-primary)",
                          marginBottom: 4,
                        }}
                      >
                        {post.title}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        /{post.slug} ·{" "}
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <button
                        onClick={() => togglePublish(post)}
                        style={{
                          padding: "5px 14px",
                          fontSize: 11,
                          letterSpacing: 1,
                          fontFamily: "var(--font-sans)",
                          background: post.published ? "#E8F5E9" : "#FFF8E1",
                          color: post.published ? "#2E7D32" : "#F57F17",
                          border: `1px solid ${post.published ? "#A5D6A7" : "#FFE082"}`,
                          cursor: "pointer",
                          borderRadius: 20,
                        }}
                      >
                        {post.published ? "Published" : "Draft"}
                      </button>
                      <button
                        onClick={() => editPost(post)}
                        style={{
                          padding: "6px 16px",
                          fontSize: 12,
                          fontFamily: "var(--font-sans)",
                          background: "transparent",
                          border: "1px solid var(--border-light)",
                          cursor: "pointer",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        style={{
                          padding: "6px 16px",
                          fontSize: 12,
                          fontFamily: "var(--font-sans)",
                          background: "transparent",
                          border: "1px solid #FFCDD2",
                          cursor: "pointer",
                          color: "#E53935",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NEW / EDIT POST */}
        {activeTab === "New Post" && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                color: "var(--text-primary)",
                fontWeight: 400,
                marginBottom: 32,
              }}
            >
              {editingPost ? "Edit Post" : "New Post"}
            </h1>
            <div style={{ maxWidth: 860 }}>
              <label style={labelStyle}>Title *</label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    title: e.target.value,
                    slug: f.slug || slugify(e.target.value),
                  }))
                }
                placeholder="Post title"
                style={inputStyle}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <label style={labelStyle}>Slug (URL)</label>
                  <input
                    value={form.slug}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, slug: e.target.value }))
                    }
                    placeholder="auto-generated-from-title"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Tag / Category</label>
                  <input
                    value={form.tag}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, tag: e.target.value }))
                    }
                    placeholder="Strategy, Copywriting, etc."
                    style={inputStyle}
                  />
                </div>
              </div>
              <label style={labelStyle}>Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, excerpt: e.target.value }))
                }
                placeholder="A short summary shown on the blog listing..."
                rows={2}
                style={textareaStyle}
              />
              <label style={labelStyle}>Cover Image URL</label>
              <input
                value={form.cover_image}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cover_image: e.target.value }))
                }
                placeholder="https://images.unsplash.com/..."
                style={inputStyle}
              />
              {form.cover_image && (
                <img
                  src={form.cover_image}
                  alt="Cover preview"
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    marginBottom: 16,
                    borderRadius: 3,
                  }}
                />
              )}
              <label style={labelStyle}>Content *</label>
              <RichEditor
                content={form.content}
                onChange={(html) => setForm((f) => ({ ...f, content: html }))}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  marginTop: 24,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, published: e.target.checked }))
                    }
                    style={{
                      width: 16,
                      height: 16,
                      accentColor: "var(--amber)",
                    }}
                  />
                  Publish immediately
                </label>
                <button
                  onClick={savePost}
                  disabled={saving}
                  style={{
                    background: "var(--dark)",
                    color: "var(--text-light)",
                    padding: "12px 32px",
                    fontSize: 12,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    fontFamily: "var(--font-sans)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {saving
                    ? "Saving..."
                    : editingPost
                      ? "Update Post"
                      : "Save Post"}
                </button>
                <button
                  onClick={() => setActiveTab("Posts")}
                  style={{
                    background: "transparent",
                    color: "var(--text-muted)",
                    padding: "12px 24px",
                    fontSize: 12,
                    fontFamily: "var(--font-sans)",
                    border: "1px solid var(--border-light)",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HOMEPAGE EDITOR */}
        {activeTab === "Homepage" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 28,
                  color: "var(--text-primary)",
                  fontWeight: 400,
                }}
              >
                Homepage
              </h1>
              <button
                onClick={saveHomepage}
                disabled={saving}
                style={{
                  background: "var(--dark)",
                  color: "var(--text-light)",
                  padding: "10px 28px",
                  fontSize: 12,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontFamily: "var(--font-sans)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                marginBottom: 32,
                fontFamily: "var(--font-sans)",
              }}
            >
              Edit all copy on the landing page. Changes go live instantly after
              saving.
            </p>

            <div style={{ maxWidth: 760 }}>
              {/* HERO */}
              <p style={sectionHeadStyle}>Hero Section</p>
              <label style={labelStyle}>
                Eyebrow text (small line above headline)
              </label>
              <input
                value={hp.heroEyebrow}
                onChange={(e) => setHp("heroEyebrow", e.target.value)}
                style={inputStyle}
              />
              <label style={labelStyle}>Main Headline</label>
              <input
                value={hp.heroHeadline}
                onChange={(e) => setHp("heroHeadline", e.target.value)}
                style={inputStyle}
              />
              <label style={labelStyle}>Accent word (shown in gold)</label>
              <input
                value={hp.heroAccent}
                onChange={(e) => setHp("heroAccent", e.target.value)}
                style={inputStyle}
              />
              <label style={labelStyle}>Subtext</label>
              <textarea
                value={hp.heroSub}
                onChange={(e) => setHp("heroSub", e.target.value)}
                rows={3}
                style={textareaStyle}
              />
              <label style={labelStyle}>CTA Button Text</label>
              <input
                value={hp.heroCta}
                onChange={(e) => setHp("heroCta", e.target.value)}
                style={inputStyle}
              />

              {/* DOUBT SECTION */}
              <p style={sectionHeadStyle}>Doubt Section</p>
              <label style={labelStyle}>Section Headline</label>
              <input
                value={hp.doubtTitle}
                onChange={(e) => setHp("doubtTitle", e.target.value)}
                style={inputStyle}
              />
              <label style={labelStyle}>Opening line</label>
              <input
                value={hp.doubtSub}
                onChange={(e) => setHp("doubtSub", e.target.value)}
                style={inputStyle}
              />
              <label style={labelStyle}>Question 1</label>
              <input
                value={hp.doubtQ1}
                onChange={(e) => setHp("doubtQ1", e.target.value)}
                style={inputStyle}
              />
              <label style={labelStyle}>Question 2</label>
              <input
                value={hp.doubtQ2}
                onChange={(e) => setHp("doubtQ2", e.target.value)}
                style={inputStyle}
              />
              <label style={labelStyle}>Question 3</label>
              <input
                value={hp.doubtQ3}
                onChange={(e) => setHp("doubtQ3", e.target.value)}
                style={inputStyle}
              />
              <label style={labelStyle}>Closing line</label>
              <input
                value={hp.doubtClose}
                onChange={(e) => setHp("doubtClose", e.target.value)}
                style={inputStyle}
              />

              {/* PATH BUTTONS */}
              <p style={sectionHeadStyle}>Path Selector Buttons</p>
              <label style={labelStyle}>Label above buttons</label>
              <input
                value={hp.pathLabel}
                onChange={(e) => setHp("pathLabel", e.target.value)}
                style={inputStyle}
              />
              <label style={labelStyle}>Button 1 — Agency / Team</label>
              <input
                value={hp.path1Label}
                onChange={(e) => setHp("path1Label", e.target.value)}
                style={inputStyle}
              />
              <label style={labelStyle}>Button 2 — DIY</label>
              <input
                value={hp.path2Label}
                onChange={(e) => setHp("path2Label", e.target.value)}
                style={inputStyle}
              />
              <label style={labelStyle}>Button 3 — Just Starting</label>
              <input
                value={hp.path3Label}
                onChange={(e) => setHp("path3Label", e.target.value)}
                style={inputStyle}
              />

              {/* WHAT I DO */}
              <p style={sectionHeadStyle}>What I Do Section</p>
              <label style={labelStyle}>Headline</label>
              <input
                value={hp.whatIDoHeadline}
                onChange={(e) => setHp("whatIDoHeadline", e.target.value)}
                style={inputStyle}
              />
              <label style={labelStyle}>Body text</label>
              <textarea
                value={hp.whatIDoBody}
                onChange={(e) => setHp("whatIDoBody", e.target.value)}
                rows={4}
                style={textareaStyle}
              />

              {/* CTA */}
              <p style={sectionHeadStyle}>Final CTA Section</p>
              <label style={labelStyle}>Headline</label>
              <input
                value={hp.ctaHeadline}
                onChange={(e) => setHp("ctaHeadline", e.target.value)}
                style={inputStyle}
              />
              <label style={labelStyle}>Body text</label>
              <textarea
                value={hp.ctaBody}
                onChange={(e) => setHp("ctaBody", e.target.value)}
                rows={3}
                style={textareaStyle}
              />
              <label style={labelStyle}>Button text</label>
              <input
                value={hp.ctaButton}
                onChange={(e) => setHp("ctaButton", e.target.value)}
                style={inputStyle}
              />

              <div
                style={{
                  marginTop: 32,
                  paddingTop: 24,
                  borderTop: "1px solid var(--border-light)",
                }}
              >
                <button
                  onClick={saveHomepage}
                  disabled={saving}
                  style={{
                    background: "var(--dark)",
                    color: "var(--text-light)",
                    padding: "14px 36px",
                    fontSize: 12,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    fontFamily: "var(--font-sans)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {saving ? "Saving..." : "Save All Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        {activeTab === "Navigation" && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                color: "var(--text-primary)",
                fontWeight: 400,
                marginBottom: 8,
              }}
            >
              Navigation
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                marginBottom: 32,
                fontFamily: "var(--font-sans)",
              }}
            >
              Control which pages appear in the navigation bar.
            </p>
            <div
              style={{
                maxWidth: 480,
                background: "#fff",
                border: "1px solid var(--border-light)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              {[
                {
                  key: "blog",
                  label: "Blog",
                  desc: "Show the Blog link in navigation",
                },
                {
                  key: "pricing",
                  label: "Pricing",
                  desc: "Show the Pricing link in navigation",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid var(--border-light)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 15,
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-sans)",
                        marginBottom: 2,
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                  <label
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: 44,
                      height: 24,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={navSettings[item.key]}
                      onChange={(e) =>
                        setNavSettings((n) => ({
                          ...n,
                          [item.key]: e.target.checked,
                        }))
                      }
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: navSettings[item.key]
                          ? "var(--amber)"
                          : "#ccc",
                        borderRadius: 24,
                        transition: "0.2s",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: navSettings[item.key] ? 22 : 2,
                          top: 2,
                          width: 20,
                          height: 20,
                          background: "#fff",
                          borderRadius: "50%",
                          transition: "0.2s",
                        }}
                      />
                    </span>
                  </label>
                </div>
              ))}
            </div>
            <button
              onClick={saveNavSettings}
              disabled={saving}
              style={{
                marginTop: 24,
                background: "var(--dark)",
                color: "var(--text-light)",
                padding: "12px 32px",
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontFamily: "var(--font-sans)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {saving ? "Saving..." : "Save Navigation"}
            </button>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "Settings" && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                color: "var(--text-primary)",
                fontWeight: 400,
                marginBottom: 8,
              }}
            >
              Settings
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                marginBottom: 32,
                fontFamily: "var(--font-sans)",
              }}
            >
              Site configuration.
            </p>
            <div
              style={{
                maxWidth: 480,
                background: "#fff",
                border: "1px solid var(--border-light)",
                borderRadius: 4,
                padding: "24px",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-sans)",
                  lineHeight: 1.7,
                }}
              >
                To change your admin password, update the{" "}
                <code
                  style={{
                    background: "#f4f4f4",
                    padding: "2px 6px",
                    borderRadius: 3,
                  }}
                >
                  ADMIN_PASSWORD
                </code>{" "}
                value in your{" "}
                <code
                  style={{
                    background: "#f4f4f4",
                    padding: "2px 6px",
                    borderRadius: 3,
                  }}
                >
                  .env.local
                </code>{" "}
                file and restart.
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-sans)",
                  lineHeight: 1.7,
                  marginTop: 16,
                }}
              >
                Supabase keys: update{" "}
                <code
                  style={{
                    background: "#f4f4f4",
                    padding: "2px 6px",
                    borderRadius: 3,
                  }}
                >
                  NEXT_PUBLIC_SUPABASE_URL
                </code>{" "}
                and{" "}
                <code
                  style={{
                    background: "#f4f4f4",
                    padding: "2px 6px",
                    borderRadius: 3,
                  }}
                >
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code>{" "}
                in{" "}
                <code
                  style={{
                    background: "#f4f4f4",
                    padding: "2px 6px",
                    borderRadius: 3,
                  }}
                >
                  .env.local
                </code>
                .
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
