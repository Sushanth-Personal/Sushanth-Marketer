// app/admin/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("@/components/RichEditor"), {
  ssr: false,
});

const tabs = [
  "Posts",
  "New Post",
  "Reels",
  "Homepage",
  "Navigation",
  "Settings",
];

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

const emptyPost = {
  title: "",
  slug: "",
  tag: "",
  excerpt: "",
  content: "",
  published: false,
  cover_image: "",
  meta_title: "",
  meta_description: "",
  keywords: "",
  canonical_url: "",
  reading_time: "",
  date_modified: "",
  faq_schema: "",
};

const emptyReelForm = {
  hook: "",
  instagram_url: "",
  views: "",
  likes: "",
  sort_order: 0,
};

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Posts");
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [navSettings, setNavSettings] = useState({
    blog: true,
    pricing: false,
    teardowns: true,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [homepage, setHomepage] = useState(defaultHomepage);
  const [form, setForm] = useState(emptyPost);

  const [reels, setReels] = useState([]);
  const [reelForm, setReelForm] = useState(emptyReelForm);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchNavSettings();
    fetchHomepage();
    fetchReels();
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
        setNavSettings((n) => ({ ...n, ...JSON.parse(data[0].value) }));
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
    setForm(emptyPost);
    setEditingPost(null);
    setActiveTab("New Post");
  }

  function editPost(post) {
    setForm({
      title: post.title || "",
      slug: post.slug || "",
      tag: post.tag || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      published: post.published || false,
      cover_image: post.cover_image || "",
      meta_title: post.meta_title || "",
      meta_description: post.meta_description || "",
      keywords: post.keywords || "",
      canonical_url: post.canonical_url || "",
      reading_time: post.reading_time ? String(post.reading_time) : "",
      date_modified: post.date_modified || "",
      faq_schema: post.faq_schema
        ? JSON.stringify(post.faq_schema, null, 2)
        : "",
    });
    setEditingPost(post.id);
    setActiveTab("New Post");
  }

  function parseFaqSchema(str) {
    if (!str || !str.trim()) return null;
    try {
      return JSON.parse(str);
    } catch {
      return false;
    }
  }

  async function savePost() {
    if (!form.title) {
      setMsg("Title is required.");
      return;
    }

    const faqParsed = parseFaqSchema(form.faq_schema);
    if (faqParsed === false) {
      setMsg("FAQ Schema has invalid JSON. Fix it before saving.");
      return;
    }

    setSaving(true);
    const slug = form.slug || slugify(form.title);
    const payload = {
      title: form.title,
      slug,
      tag: form.tag || null,
      excerpt: form.excerpt || null,
      content: form.content || null,
      published: form.published,
      cover_image: form.cover_image || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      keywords: form.keywords || null,
      canonical_url: form.canonical_url || null,
      reading_time: form.reading_time ? parseInt(form.reading_time, 10) : null,
      date_modified: form.date_modified || null,
      faq_schema: faqParsed || null,
    };

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

  async function fetchReels() {
    const { data } = await supabase
      .from("reels")
      .select("*")
      .order("sort_order", { ascending: true });
    setReels(data || []);
  }

  async function uploadReel() {
    if (!videoFile) {
      setMsg("Select a video file first.");
      return;
    }
    setUploading(true);

    const videoPath = `${Date.now()}-${videoFile.name}`;
    const { error: videoError } = await supabase.storage
      .from("reels")
      .upload(videoPath, videoFile);

    if (videoError) {
      setMsg("Video upload failed: " + videoError.message);
      setUploading(false);
      return;
    }

    const { data: videoUrlData } = supabase.storage
      .from("reels")
      .getPublicUrl(videoPath);

    let thumbUrl = null;
    if (thumbFile) {
      const thumbPath = `${Date.now()}-thumb-${thumbFile.name}`;
      const { error: thumbError } = await supabase.storage
        .from("reels")
        .upload(thumbPath, thumbFile);
      if (!thumbError) {
        const { data: thumbUrlData } = supabase.storage
          .from("reels")
          .getPublicUrl(thumbPath);
        thumbUrl = thumbUrlData.publicUrl;
      }
    }

    const { error: insertError } = await supabase.from("reels").insert([
      {
        video_url: videoUrlData.publicUrl,
        thumb_url: thumbUrl,
        hook: reelForm.hook || null,
        instagram_url: reelForm.instagram_url || null,
        views: reelForm.views || null,
        likes: reelForm.likes || null,
        sort_order: parseInt(reelForm.sort_order, 10) || 0,
        published: true,
      },
    ]);

    setUploading(false);

    if (insertError) {
      setMsg("Save failed: " + insertError.message);
      return;
    }

    setMsg("Reel uploaded!");
    setReelForm(emptyReelForm);
    setVideoFile(null);
    setThumbFile(null);
    fetchReels();
    setTimeout(() => setMsg(""), 2000);
  }

  async function deleteReel(id) {
    if (!confirm("Delete this reel?")) return;
    await supabase.from("reels").delete().eq("id", id);
    fetchReels();
  }

  async function toggleReelPublish(reel) {
    await supabase
      .from("reels")
      .update({ published: !reel.published })
      .eq("id", reel.id);
    fetchReels();
  }

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
    color: active ? "var(--amber)" : "#9a9690",
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
    border: "1px solid #d0cbc4",
    color: "#1a1814",
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

  const charHint = (val, max) => {
    const len = (val || "").length;
    const over = len > max;
    return (
      <span
        style={{
          fontSize: 11,
          color: over ? "#E53935" : "#9a9690",
          float: "right",
          fontFamily: "var(--font-sans)",
        }}
      >
        {len}/{max}
      </span>
    );
  };

  const faqStatus = parseFaqSchema(form.faq_schema);

  const hp = homepage;
  const setHp = (key, val) => setHomepage((h) => ({ ...h, [key]: val }));

  return (
    <div style={{ minHeight: "100vh", background: "#F0EDE6", display: "flex" }}>
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
              color: "#c8c4bc",
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
                setForm(emptyPost);
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
              color: "#c8c4bc",
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
              color: "#c8c4bc",
              fontFamily: "var(--font-sans)",
              background: "none",
              border: "none",
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

      <div style={{ flex: 1, padding: "40px 48px", overflowY: "auto" }}>
        {msg && (
          <div
            style={{
              background: msg.startsWith("Error") ? "#FFEBEE" : "#E8F5E9",
              border: `1px solid ${msg.startsWith("Error") ? "#FFCDD2" : "#A5D6A7"}`,
              color: msg.startsWith("Error") ? "#C62828" : "#2E7D32",
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
                  color: "#1a1814",
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
                          fontSize: 18,
                          color: "#1a1814",
                          marginBottom: 6,
                        }}
                      >
                        {post.title}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#6b6560",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        /{post.slug} ·{" "}
                        {new Date(post.created_at).toLocaleDateString()}
                        {post.reading_time &&
                          ` · ${post.reading_time} min read`}
                      </p>
                    </div>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: "6px 14px",
                          fontSize: 12,
                          fontFamily: "var(--font-sans)",
                          background: "transparent",
                          border: "1px solid var(--border-light)",
                          cursor: "pointer",
                          color: "#6b6560",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        View ↗
                      </a>
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
                          color: "#6b6560",
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

        {activeTab === "New Post" && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                color: "#1a1814",
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

              <label style={labelStyle}>
                Excerpt{" "}
                <span
                  style={{
                    color: "var(--text-muted)",
                    fontWeight: 400,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  (shown on blog listing — used as meta description if meta
                  description field is empty)
                </span>
              </label>
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
                onMetaExtracted={(meta) => {
                  setForm((f) => ({
                    ...f,
                    title: meta.metaTitle || f.title,
                    slug: meta.slug || f.slug,
                    tag: meta.tag || f.tag,
                    excerpt: meta.metaDescription || f.excerpt,
                    meta_title: meta.metaTitle || f.meta_title,
                    meta_description:
                      meta.metaDescription || f.meta_description,
                    keywords: meta.keywords || f.keywords,
                    canonical_url: meta.canonicalUrl || f.canonical_url,
                    reading_time: meta.readingTime || f.reading_time,
                    date_modified: meta.dateModified || f.date_modified,
                    faq_schema: meta.faqSchema || f.faq_schema,
                  }));
                  setMsg("✓ Meta fields auto-populated from HTML file");
                  setTimeout(() => setMsg(""), 3000);
                }}
              />

              <p style={sectionHeadStyle}>SEO & Metadata</p>

              <label style={labelStyle}>
                Meta Title {charHint(form.meta_title, 60)}
              </label>
              <p
                style={{
                  fontSize: 11,
                  color: "#6b6560",
                  marginBottom: 8,
                  fontFamily: "var(--font-sans)",
                }}
              >
                Overrides the browser tab title. Leave blank to use the post
                title. Keep under 60 chars.
              </p>
              <input
                value={form.meta_title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, meta_title: e.target.value }))
                }
                placeholder="How to Choose a Marketing Consultant (Without Getting Burned)"
                style={inputStyle}
                maxLength={80}
              />

              <label style={labelStyle}>
                Meta Description {charHint(form.meta_description, 160)}
              </label>
              <p
                style={{
                  fontSize: 11,
                  color: "#6b6560",
                  marginBottom: 8,
                  fontFamily: "var(--font-sans)",
                }}
              >
                Overrides the excerpt in Google search results. Leave blank to
                use the excerpt. Keep under 160 chars.
              </p>
              <textarea
                value={form.meta_description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, meta_description: e.target.value }))
                }
                placeholder="Most small businesses hire a marketing consultant and end up with decks, reports, and the same revenue. Here's how to find one who actually moves the needle."
                rows={2}
                style={textareaStyle}
                maxLength={200}
              />

              <label style={labelStyle}>Keywords</label>
              <p
                style={{
                  fontSize: 11,
                  color: "#6b6560",
                  marginBottom: 8,
                  fontFamily: "var(--font-sans)",
                }}
              >
                Comma-separated. Use the exact phrases your customer would
                search.
              </p>
              <input
                value={form.keywords}
                onChange={(e) =>
                  setForm((f) => ({ ...f, keywords: e.target.value }))
                }
                placeholder="how to choose a marketing consultant, marketing consultant small business"
                style={inputStyle}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <label style={labelStyle}>Reading Time (mins)</label>
                  <input
                    type="number"
                    value={form.reading_time}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, reading_time: e.target.value }))
                    }
                    placeholder="8"
                    style={inputStyle}
                    min={1}
                    max={60}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Date Modified</label>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#6b6560",
                      marginBottom: 8,
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    Set when you update an existing post.
                  </p>
                  <input
                    type="date"
                    value={form.date_modified}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date_modified: e.target.value }))
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Canonical URL</label>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#6b6560",
                      marginBottom: 8,
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    Leave blank — auto-set to /blog/slug.
                  </p>
                  <input
                    value={form.canonical_url}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, canonical_url: e.target.value }))
                    }
                    placeholder="Only fill if syndicating elsewhere"
                    style={inputStyle}
                  />
                </div>
              </div>

              <label style={labelStyle}>FAQ Schema</label>
              <p
                style={{
                  fontSize: 11,
                  color: "#6b6560",
                  marginBottom: 8,
                  fontFamily: "var(--font-sans)",
                }}
              >
                JSON array of {`{"q": "...", "a": "..."}`} objects. Google may
                show these as expandable results. Leave blank if the post has no
                FAQ section.
              </p>
              <textarea
                value={form.faq_schema}
                onChange={(e) =>
                  setForm((f) => ({ ...f, faq_schema: e.target.value }))
                }
                placeholder={`[\n  {"q": "What does a marketing consultant do?", "a": "They find the gap between..."},\n  {"q": "How do I know if a consultant is good?", "a": "They ask about your customer first..."}\n]`}
                rows={7}
                style={{
                  ...textareaStyle,
                  fontFamily: "monospace",
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              />
              {form.faq_schema && form.faq_schema.trim() && (
                <p
                  style={{
                    fontSize: 11,
                    marginTop: -12,
                    marginBottom: 16,
                    fontFamily: "var(--font-sans)",
                    color: faqStatus !== false ? "#2E7D32" : "#E53935",
                  }}
                >
                  {faqStatus !== false
                    ? "✓ Valid JSON — FAQ schema will be injected"
                    : "✗ Invalid JSON — fix before saving"}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  marginTop: 32,
                  paddingTop: 24,
                  borderTop: "1px solid var(--border-light)",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    fontSize: 14,
                    color: "#6b6560",
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

        {activeTab === "Reels" && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                color: "#1a1814",
                fontWeight: 400,
                marginBottom: 24,
              }}
            >
              Reels
            </h1>

            <div
              style={{
                maxWidth: 560,
                background: "#fff",
                border: "1px solid var(--border-light)",
                borderRadius: 4,
                padding: 24,
                marginBottom: 32,
              }}
            >
              <label style={labelStyle}>Video file *</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                style={{ marginBottom: 16, display: "block" }}
              />

              <label style={labelStyle}>
                Thumbnail image (optional, shown before video loads)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbFile(e.target.files[0])}
                style={{ marginBottom: 16, display: "block" }}
              />

              <label style={labelStyle}>Hook / caption text</label>
              <input
                value={reelForm.hook}
                onChange={(e) =>
                  setReelForm((f) => ({ ...f, hook: e.target.value }))
                }
                placeholder="The mochi hook nobody expects"
                style={inputStyle}
              />

              <label style={labelStyle}>
                Instagram post URL (for click-through)
              </label>
              <input
                value={reelForm.instagram_url}
                onChange={(e) =>
                  setReelForm((f) => ({
                    ...f,
                    instagram_url: e.target.value,
                  }))
                }
                placeholder="https://www.instagram.com/reel/..."
                style={inputStyle}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <label style={labelStyle}>Views</label>
                  <input
                    value={reelForm.views}
                    onChange={(e) =>
                      setReelForm((f) => ({ ...f, views: e.target.value }))
                    }
                    placeholder="12.4K"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Likes</label>
                  <input
                    value={reelForm.likes}
                    onChange={(e) =>
                      setReelForm((f) => ({ ...f, likes: e.target.value }))
                    }
                    placeholder="890"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Sort order</label>
                  <input
                    type="number"
                    value={reelForm.sort_order}
                    onChange={(e) =>
                      setReelForm((f) => ({
                        ...f,
                        sort_order: e.target.value,
                      }))
                    }
                    style={inputStyle}
                  />
                </div>
              </div>

              <button
                onClick={uploadReel}
                disabled={uploading}
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
                {uploading ? "Uploading..." : "Upload Reel"}
              </button>
            </div>

            {reels.length === 0 ? (
              <p
                style={{
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                  fontFamily: "var(--font-serif)",
                  fontSize: 18,
                }}
              >
                No reels yet. Upload your first one above.
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
                {reels.map((reel) => (
                  <div
                    key={reel.id}
                    style={{
                      background: "#fff",
                      padding: "16px 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: 14,
                          color: "#1a1814",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {reel.hook || "(no hook text)"}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#6b6560",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {reel.views ? `${reel.views} views` : ""}
                        {reel.likes ? ` · ${reel.likes} likes` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleReelPublish(reel)}
                      style={{
                        padding: "5px 14px",
                        fontSize: 11,
                        letterSpacing: 1,
                        fontFamily: "var(--font-sans)",
                        background: reel.published ? "#E8F5E9" : "#FFF8E1",
                        color: reel.published ? "#2E7D32" : "#F57F17",
                        border: `1px solid ${reel.published ? "#A5D6A7" : "#FFE082"}`,
                        cursor: "pointer",
                        borderRadius: 20,
                      }}
                    >
                      {reel.published ? "Published" : "Draft"}
                    </button>
                    <button
                      onClick={() => deleteReel(reel.id)}
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
                ))}
              </div>
            )}
          </div>
        )}

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
                  color: "#1a1814",
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

        {activeTab === "Navigation" && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                color: "#1a1814",
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
                {
                  key: "teardowns",
                  label: "Teardowns",
                  desc: "Show the Teardowns link in navigation",
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
                        color: "#1a1814",
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

        {activeTab === "Settings" && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                color: "#1a1814",
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
                  color: "#6b6560",
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
                  color: "#6b6560",
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
