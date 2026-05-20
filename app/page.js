"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PathInfographic from "@/components/PathInfographic";
import { supabase } from "@/lib/supabase";

/* ================================================================
   SECTION 0 — DATA & CONSTANTS
   (paths, stats, blogTeasers, services, defaultHp)
================================================================ */

const paths = {
  searching: {
    label:
      "I know marketing matters — I am looking for the right person to handle it",
    sublabel: "You understand the value. You just need to know who to trust.",
    inocTitle:
      "The hardest part isn't finding a marketer. It's knowing if they're actually good.",
    inocBody:
      "Most marketers show you a portfolio, talk strategy, and sound convincing. But one thing separates someone who gets results from someone who just gets busy:",
    inocQuestion:
      '"Do they start by asking who your customer is — or by talking about what they can do?"',
    inocClose:
      "Anyone who jumps to execution before understanding your customer is guessing. Confidently. Expensively. The right person asks uncomfortable questions before touching anything.",
    inocEnd: "Has anyone asked you those questions yet?",
    inocBlog: {
      text: "How to evaluate a marketer before you hire them →",
      slug: "how-to-evaluate-a-marketer",
    },
  },
  delegated: {
    label:
      "I have handed it to an agency or marketer — sitting back waiting for results",
    sublabel:
      "Things are running. But you are not entirely sure you picked the right one.",
    inocTitle:
      "Your agency might be doing everything they promised. That might be the problem.",
    inocBody:
      "Agencies deliver what they agreed to — content, ads, reports, reach. But there is one question most were never asked before they started:",
    inocQuestion:
      '"Who exactly is the one person we are talking to — and what are they feeling before they see this ad?"',
    inocClose:
      "If that question was never asked, everything that followed — however professional it looks — was built on a guess. And you are paying for that guess every month.",
    inocEnd: "When was the last time your agency asked you that?",
    inocBlog: {
      text: "What to ask your agency in the next review meeting →",
      slug: "what-to-ask-your-marketing-team",
    },
  },
  sales: {
    label:
      "My sales are not where I want them — I am not sure what the problem is",
    sublabel:
      "You know the number is wrong. You just haven't found the leak yet.",
    inocTitle: "Most sales problems are not sales problems.",
    inocBody:
      "When revenue is flat, the instinct is to look at pricing, the product, the sales team. Rarely does anyone look at what happens before all of that:",
    inocQuestion:
      '"Does the right person even feel like this was made for them — before they ever talk to you?"',
    inocClose:
      "If your marketing is talking to everyone, it is resonating with no one. Your sales team is working hard to close people who were never properly warmed up. The leak is upstream.",
    inocEnd:
      "What if the problem isn't your product or your sales — but who you're speaking to and what you're saying?",
    inocBlog: {
      text: "Why your sales problem might actually be a marketing problem →",
      slug: "why-sales-problem-is-marketing-problem",
    },
  },
};

const stats = [
  {
    stat: "95%",
    desc: "of buying decisions are emotionally driven",
    source: "Harvard Business Review",
    url: "https://hbr.org/2015/11/the-new-science-of-customer-emotions",
  },
  {
    stat: "64%",
    desc: "of consumers cite shared values as the main reason they have a relationship with a brand",
    source: "Harvard Business Review",
    url: "https://hbr.org/2012/05/three-myths-about-what-customers-want",
  },
  {
    stat: "71%",
    desc: "of consumers who have had a good social media experience with a brand are likely to recommend it",
    source: "Ambassador",
    url: "https://www.ambassador.com/blog/word-of-mouth-statistics",
  },
];

const blogTeasers = [
  {
    tag: "Agency",
    title: "Your agency made a beautiful ad. Did they ask who it was for?",
    slug: "agency-beautiful-ad-who-is-it-for",
  },
  {
    tag: "Strategy",
    title: "What to ask your marketing team before the next campaign",
    slug: "what-to-ask-your-marketing-team",
  },
  {
    tag: "Psychology",
    title: "Why the best product doesn't always win",
    slug: "why-best-product-doesnt-always-win",
  },
  {
    tag: "Fundamentals",
    title:
      "You don't need to learn marketing. You need to understand one thing.",
    slug: "you-dont-need-to-learn-marketing",
  },
  {
    tag: "Insight",
    title: "What your customer feels the moment before they find you",
    slug: "what-customer-feels-before-finding-you",
  },
];

const services = [
  {
    num: "01",
    title: "Brand Messaging",
    desc: 'The words that make your right customer say "this is exactly for me."',
    detail:
      "2–3 week engagement. Positioning, tone, and a messaging doc your whole team can use.",
  },
  {
    num: "02",
    title: "Ad Strategy & Copy",
    desc: "Campaigns built on psychology, not best practices from 2019.",
    detail:
      "Starts with audience research. Ends with ad copy you can run the same week.",
  },
  {
    num: "03",
    title: "Marketing Audit",
    desc: "Find exactly where your marketing is leaking before spending another dollar.",
    detail:
      "One focused session. You leave with a ranked list of what to fix first.",
  },
];

const defaultHp = {
  heroEyebrow: "Marketing strategist — for founders",
  ctaHeadline: "That's a sign.",
  ctaBody:
    "The founders who reach out to me aren't looking for another vendor. They're looking for someone who will tell them the truth about why their marketing isn't working — and actually fix it.",
};

/* ================================================================
   SECTION 1 — ROOT COMPONENT & STATE
   (component setup, supabase fetch, scroll trigger logic)
================================================================ */

export default function Home() {
  const [activePath, setActivePath] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayTriggered, setOverlayTriggered] = useState(false);
  const [hp, setHpState] = useState(defaultHp);

  useEffect(() => {
    async function fetchHp() {
      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "homepage");
      if (data && data[0]) {
        try {
          setHpState((h) => ({ ...h, ...JSON.parse(data[0].value) }));
        } catch {}
      }
    }
    fetchHp();
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (overlayTriggered) return;
      const trigger = document.getElementById("path-trigger");
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.6) {
        setShowOverlay(true);
        setOverlayTriggered(true);
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [overlayTriggered]);

  const path = activePath ? paths[activePath] : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* ============================================================
          SECTION 2 — PATH SELECTION OVERLAY
          (full-screen modal triggered on scroll, 3 path buttons)
      ============================================================ */}
      {showOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(10,10,8,0.97)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            backdropFilter: "blur(4px)",
          }}
        >
          <div style={{ maxWidth: 560, width: "100%" }}>
            <p style={eyebrow({ center: true })}>Before you read further</p>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(24px, 3.5vw, 36px)",
                fontWeight: 400,
                color: "var(--text-light)",
                lineHeight: 1.25,
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              This matters. Tell me where you are.
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "rgba(232,228,220,0.5)",
                fontFamily: "var(--font-sans)",
                lineHeight: 1.7,
                textAlign: "center",
                marginBottom: 40,
                fontWeight: 300,
              }}
            >
              What you read next will be different depending on your situation.
              <br />
              Pick the one that is closest to where you are right now.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries(paths).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => {
                    setActivePath(key);
                    setShowOverlay(false);
                  }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "var(--text-light)",
                    padding: "20px 24px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    borderRadius: 0,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(184,240,60,0.05)";
                    e.currentTarget.style.borderColor = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                  }}
                >
                  <p
                    style={{
                      fontSize: 15,
                      color: "var(--text-light)",
                      marginBottom: 4,
                      lineHeight: 1.5,
                    }}
                  >
                    {p.label}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "rgba(232,228,220,0.4)",
                      fontWeight: 300,
                    }}
                  >
                    {p.sublabel}
                  </p>
                </button>
              ))}
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#2a2a2a",
                textAlign: "center",
                marginTop: 24,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
              onClick={() => setShowOverlay(false)}
            >
              Skip for now →
            </p>
          </div>
        </div>
      )}
      {/* ============================================================
          SECTION 3 — HERO
          (full-height, photo right, headline left, skill pills, stats row)
      ============================================================ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "var(--bg)",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          paddingTop: 120,
        }}
      >
        {/* Ghost watermark name */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(6rem, 14vw, 13rem)",
            color: "rgba(255,255,255,0.02)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            letterSpacing: "-0.02em",
            userSelect: "none",
            zIndex: 1,
          }}
        >
          SUSHANTH
        </div>

        {/* Photo — right half */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "55%",
            zIndex: 2,
          }}
        >
          <Image
            src="/photos/sushanth.png"
            alt="Sushanth P"
            fill
            style={{ objectFit: "cover", objectPosition: "top center" }}
            priority
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, #0e0e0e 0%, rgba(14,14,14,0.65) 40%, rgba(14,14,14,0.05) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 240,
              background: "linear-gradient(to top, #0e0e0e, transparent)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "var(--accent)",
            }}
          />
          <p
            style={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%) rotate(90deg)",
              fontSize: 9,
              letterSpacing: "4px",
              color: "rgba(232,228,220,0.1)",
              textTransform: "uppercase",
              fontFamily: "var(--font-sans)",
              zIndex: 3,
              whiteSpace: "nowrap",
            }}
          >
            Marketing Strategist
          </p>
        </div>

        {/* Hero text content */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            maxWidth: 1100,
            margin: "0 auto",
            padding: "6rem 2.5rem 5rem",
            width: "100%",
          }}
        >
          <p style={eyebrow({})}>
            {hp.heroEyebrow || "Sushanth P — Marketing Strategist, Bangalore"}
          </p>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: "var(--white)",
              marginBottom: "1.5rem",
              maxWidth: 700,
            }}
          >
            You've seen enough average.{" "}
            <span style={{ color: "var(--accent)" }}>
              Welcome to the other side of it.
            </span>
          </h1>

          {/* ── SKILL PILLS — what I do, unmissable ── */}
          <div
            style={{
              display: "flex",
              gap: "0.6rem",
              flexWrap: "wrap",
              marginBottom: "2rem",
            }}
          >
            {[
              { label: "Brand Messaging", icon: "◈" },
              { label: "Ad Strategy & Copy", icon: "◎" },
              { label: "SEO & Web", icon: "⬡" },
            ].map((skill) => (
              <div
                key={skill.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(184,240,60,0.06)",
                  border: "1px solid rgba(184,240,60,0.2)",
                  padding: "0.45rem 1rem",
                  borderRadius: "2px",
                  fontSize: "0.78rem",
                  color: "var(--accent)",
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ fontSize: "0.65rem", opacity: 0.7 }}>
                  {skill.icon}
                </span>
                {skill.label}
              </div>
            ))}
          </div>

          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.65,
              color: "#b5b0a8",
              maxWidth: 480,
              marginBottom: "2.5rem",
              fontWeight: 300,
            }}
          >
            One person. All of it connected.{" "}
            <strong style={{ color: "var(--text)", fontWeight: 400 }}>
              Strategy, copy, and execution that works as a system — not a stack
              of separate deliverables.
            </strong>
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "3rem",
            }}
          >
            <a href="mailto:hello@sushanthp.com" style={btnPrimary}>
              Let's talk →
            </a>
            <Link href="/blog" style={btnGhost}>
              Read how I think
            </Link>
          </div>

          {/* Mini stats row */}
          <div
            style={{
              display: "flex",
              gap: "3rem",
              paddingTop: "2rem",
              borderTop: "1px solid var(--border)",
              flexWrap: "wrap",
            }}
          >
            {[
              { num: "2", label: "Brands Built End-to-End" },
              { num: "3X", label: "Organic Growth, TMCI" },
              { num: "₹0", label: "Ad Spend to First Sales, Ever Sweet" },
            ].map((s, i) => (
              <div key={i}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2.4rem",
                    color: "var(--accent)",
                    letterSpacing: "0.02em",
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginTop: "0.3rem",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            right: "2.5rem",
            bottom: "4rem",
            writingMode: "vertical-rl",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            zIndex: 5,
          }}
        >
          <span
            style={{
              width: 1,
              height: 60,
              background:
                "linear-gradient(to bottom, transparent, var(--text-muted))",
              display: "block",
            }}
          />
          Scroll
        </div>
      </section>

      {/* ============================================================
          SECTION 4 — PROBLEM
          Three StoryBrand layers:
          LEFT  — External problem (the world is broken)
          RIGHT — Internal problem (what it makes you feel)
                  + Philosophical problem (the injustice)
          BOTTOM — Research stats + hook line
      ============================================================ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "6rem 2.5rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "start",
          }}
        >
          {/* LEFT — External problem */}
          <div>
            <p style={eyebrow({})}>The external problem</p>
            <h2 style={sectionTitle}>
              You're putting time and money
              <br />
              <em style={{ fontStyle: "normal", color: "var(--accent)" }}>
                into marketing.
              </em>
            </h2>
            <div
              style={{
                fontSize: "1rem",
                color: "#b5b0a8",
                fontWeight: 300,
                lineHeight: 1.8,
              }}
            >
              <p style={{ marginBottom: "1.5rem" }}>
                Some of it is working. Enough to keep going. Not enough to stop
                wondering.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                The agency is producing. The content is going out. The ads are
                running. But nobody owns the whole picture — and that gap is
                where your budget disappears.
              </p>
              <p
                style={{ color: "rgba(232,228,220,0.7)", fontSize: "0.92rem" }}
              >
                Marketing today is sold in pieces. Strategy from one person.
                Copy from another. Ads from a third. Each doing their part.
                Nobody responsible for whether it actually works together.
              </p>
            </div>
          </div>

          {/* RIGHT — Internal + Philosophical problem */}
          <div
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--accent)",
              padding: "2.5rem",
              borderRadius: "4px",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            {/* Internal problem */}
            <div>
              <p
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  fontFamily: "var(--font-sans)",
                  marginBottom: "1rem",
                  opacity: 0.7,
                }}
              >
                What it makes you feel
              </p>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.15rem",
                  lineHeight: 1.65,
                  color: "var(--white)",
                  marginBottom: "0.75rem",
                }}
              >
                You built something real. You're smart enough to run a business.
                So why can't you figure out why the marketing isn't working?
              </p>
              <p
                style={{
                  fontSize: "0.92rem",
                  color: "rgba(232,228,220,0.75)",
                  lineHeight: 1.75,
                  fontWeight: 300,
                }}
              >
                That question sits quietly. In the review meeting. In the
                monthly report. In the gap between what you're spending and what
                you're seeing. Most founders I talk to aren't failing — they're
                succeeding just enough to keep second-guessing everything.
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "var(--border)" }} />

            {/* Philosophical problem */}
            <div>
              <p
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  fontFamily: "var(--font-sans)",
                  marginBottom: "1rem",
                  opacity: 0.7,
                }}
              >
                Why it's wrong
              </p>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.15rem",
                  lineHeight: 1.65,
                  color: "var(--white)",
                  marginBottom: "0.75rem",
                }}
              >
                The best product shouldn't lose because someone else told a
                better story.
              </p>
              <p
                style={{
                  fontSize: "0.92rem",
                  color: "rgba(232,228,220,0.75)",
                  lineHeight: 1.75,
                  fontWeight: 300,
                }}
              >
                But right now, it does. Every day. Founders who built something
                genuinely better are being out-marketed by people who simply
                understood their customer more clearly. That's not a marketing
                problem. That's an injustice. And it's fixable.
              </p>
            </div>
          </div>
        </div>

        {/* Research stats row */}
        <div
          style={{
            maxWidth: 1100,
            margin: "4rem auto 0",
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            borderTop: "1px solid var(--border)",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                padding: "2rem",
                paddingLeft: i > 0 ? "2rem" : 0,
                borderRight: i < 2 ? "1px solid var(--border)" : "none",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "3rem",
                  color: "var(--accent)",
                  fontWeight: 400,
                  lineHeight: 1,
                  marginBottom: "0.75rem",
                  letterSpacing: "0.02em",
                }}
              >
                {s.stat}
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  marginBottom: "0.75rem",
                  fontWeight: 300,
                }}
              >
                {s.desc}
              </p>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "var(--font-sans)",
                  textDecoration: "none",
                  letterSpacing: "0.5px",
                }}
              >
                {s.source} ↗
              </a>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 1100, margin: "3rem auto 0" }}>
          <p style={hookLine}>
            Here's what working with me actually looks like
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 5 — SCROLL TRIGGER + PATH INDICATOR
          (invisible div that fires overlay; active-path banner)
      ============================================================ */}
      <div id="path-trigger" />

      {activePath && (
        <section
          style={{
            background: "var(--dark-2)",
            padding: "1rem 2.5rem",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(232,228,220,0.4)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Showing content for:{" "}
                <strong
                  style={{ color: "rgba(232,228,220,0.7)", fontWeight: 400 }}
                >
                  {paths[activePath]?.label}
                </strong>
              </p>
            </div>
            <button
              onClick={() => setShowOverlay(true)}
              style={{
                fontSize: "0.7rem",
                color: "var(--accent)",
                fontFamily: "var(--font-sans)",
                background: "none",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Change →
            </button>
          </div>
        </section>
      )}

      {/* ============================================================
          SECTION 6 — INOCULATION / PATH-AWARE CONTENT
          (shows personalised copy if path selected, else generic 2-card grid)
      ============================================================ */}
      <section
        style={{
          background: "var(--bg)",
          padding: "6rem 2.5rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {path ? (
            <>
              <h2 style={sectionTitle}>{path.inocTitle}</h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "rgba(232,228,220,0.6)",
                  lineHeight: 1.85,
                  marginBottom: "1.75rem",
                  fontWeight: 300,
                }}
              >
                {path.inocBody}
              </p>
              <blockquote
                style={{
                  borderLeft: "2px solid var(--accent)",
                  paddingLeft: "1.75rem",
                  margin: "2rem 0",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.35rem",
                    fontStyle: "italic",
                    color: "var(--text-light)",
                    lineHeight: 1.6,
                  }}
                >
                  {path.inocQuestion}
                </p>
              </blockquote>
              <p
                style={{
                  fontSize: "1rem",
                  color: "rgba(232,228,220,0.6)",
                  lineHeight: 1.85,
                  marginBottom: "1.25rem",
                  fontWeight: 300,
                }}
              >
                {path.inocClose}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.15rem",
                  color: "var(--accent)",
                  fontStyle: "italic",
                  marginBottom: "2rem",
                }}
              >
                {path.inocEnd}
              </p>
              <Link
                href={`/blog/${path.inocBlog.slug}`}
                style={{
                  color: "var(--accent)",
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.5px",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(184,240,60,0.3)",
                  paddingBottom: 2,
                }}
              >
                {path.inocBlog.text}
              </Link>
            </>
          ) : (
            <>
              <p style={eyebrow({})}>The real reason</p>
              <h2 style={sectionTitle}>Most marketing fails for one reason.</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1,
                  background: "rgba(255,255,255,0.04)",
                  marginTop: "3rem",
                }}
              >
                {[
                  {
                    icon: "◉",
                    title: "It talks to everyone",
                    body: "When you write for everyone, you resonate with no one. A message built for a 28-year-old SaaS founder and a 52-year-old operations director lands with neither.",
                  },
                  {
                    icon: "◈",
                    title: "Humans don't buy logically",
                    body: "Your customer doesn't compare features in a spreadsheet. They feel something — or they don't. The brand that wins is rarely the best product. It's the one that made the right person feel understood.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: "var(--surface)",
                      padding: "2.5rem 2rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1.2rem",
                        color: "var(--accent)",
                        marginBottom: "1rem",
                      }}
                    >
                      {item.icon}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.1rem",
                        color: "var(--text-light)",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        fontSize: "0.88rem",
                        color: "rgba(232,228,220,0.5)",
                        lineHeight: 1.85,
                        fontWeight: 300,
                      }}
                    >
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ============================================================
          SECTION 7 — PATH INFOGRAPHIC
          (tabbed interactive component — see components/PathInfographic.js)
      ============================================================ */}
      <PathInfographic activePath={activePath} />

      {/* ============================================================
          SECTION 8 — WHAT I DO / SERVICES
          (3-card services grid)
      ============================================================ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "6rem 2.5rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={eyebrow({})}>What I bring</p>
          <h2 style={{ ...sectionTitle, marginBottom: "0.75rem" }}>
            Three things. One person.{" "}
            <em style={{ fontStyle: "normal", color: "var(--accent)" }}>
              Zero handoff friction.
            </em>
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(232,228,220,0.4)",
              lineHeight: 1.85,
              marginBottom: "3rem",
              fontWeight: 300,
              maxWidth: 560,
            }}
          >
            Before any copy. Before any campaign. Before any content calendar —
            there's a conversation most founders have never had:{" "}
            <em style={{ color: "rgba(232,228,220,0.6)" }}>
              Who exactly are you for? What do they feel? What do they need to
              hear before they buy?
            </em>
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
          >
            {services.map((s, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  padding: "2rem",
                  borderRadius: "4px",
                  borderTop:
                    i === 0
                      ? "2px solid var(--accent)"
                      : "2px solid rgba(184,240,60,0.2)",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = "#3a3a3a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "3.5rem",
                    color: "rgba(184,240,60,0.08)",
                    lineHeight: 1,
                    marginBottom: "0.5rem",
                  }}
                >
                  {s.num}
                </div>
                <p
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "var(--white)",
                    marginBottom: "0.8rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {s.title}
                </p>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.65,
                    marginBottom: "1.2rem",
                  }}
                >
                  {s.desc}
                </p>
                <div
                  style={{
                    marginTop: "1.2rem",
                    paddingTop: "1.2rem",
                    borderTop: "1px solid var(--border)",
                    fontSize: "0.75rem",
                    color: "var(--accent)",
                    letterSpacing: "0.06em",
                  }}
                >
                  → {s.detail}
                </div>
              </div>
            ))}
          </div>

          <p style={{ ...hookLine, marginTop: "4rem" }}>
            The work isn't theory
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 9 — CASE STUDIES
          (2-col cards: TMCI and Ever Sweet)
      ============================================================ */}
      <section
        style={{
          background: "var(--bg)",
          padding: "6rem 2.5rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={eyebrow({})}>Case studies</p>
          <h2 style={sectionTitle}>
            Two brands. Built from zero.{" "}
            <em style={{ fontStyle: "normal", color: "var(--accent)" }}>
              Different worlds, same approach.
            </em>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              marginTop: "3rem",
            }}
          >
            {/* TMCI card */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                overflow: "hidden",
                transition: "transform 0.25s, border-color 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#3a3a3a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div
                style={{
                  height: 200,
                  background: "#0a0e1a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "5rem",
                    letterSpacing: "0.05em",
                    opacity: 0.1,
                    color: "#4a9eff",
                    position: "absolute",
                  }}
                >
                  TMCI
                </div>
                <div
                  style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    padding: "0.4rem 1rem",
                    borderRadius: "2px",
                    fontSize: "0.72rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#4a9eff",
                    zIndex: 1,
                  }}
                >
                  B2B Industrial
                </div>
              </div>
              <div style={{ padding: "1.8rem" }}>
                <p
                  style={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "var(--white)",
                    marginBottom: "0.6rem",
                  }}
                >
                  TMCI — Bangalore-Based Manufacturer
                </p>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.65,
                    marginBottom: "1.2rem",
                  }}
                >
                  An industrial brand that marketed like it was still 2010. I
                  built the site in Next.js from scratch, rewrote every word,
                  ran SEO campaigns, and set up a Google Ads funnel targeting
                  engineers, not just procurement teams. The site now works
                  harder than the sales team used to.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    paddingTop: "1.2rem",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  {[
                    ["3X", "Organic Sessions"],
                    ["Full", "SEO + Ads Ownership"],
                    ["Next.js", "Built & Maintained"],
                  ].map(([v, l], i) => (
                    <div key={i}>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.6rem",
                          color: "var(--accent)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {v}
                      </div>
                      <div
                        style={{
                          fontSize: "0.68rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                        }}
                      >
                        {l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ever Sweet card */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                overflow: "hidden",
                transition: "transform 0.25s, border-color 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#3a3a3a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div
                style={{
                  height: 200,
                  background: "#0e0a05",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "5rem",
                    letterSpacing: "0.05em",
                    opacity: 0.1,
                    color: "#f5a623",
                    position: "absolute",
                  }}
                >
                  ES
                </div>
                <div
                  style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    padding: "0.4rem 1rem",
                    borderRadius: "2px",
                    fontSize: "0.72rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#f5a623",
                    zIndex: 1,
                  }}
                >
                  D2C Artisan Food
                </div>
              </div>
              <div style={{ padding: "1.8rem" }}>
                <p
                  style={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "var(--white)",
                    marginBottom: "0.6rem",
                  }}
                >
                  Ever Sweet — Artisan Mochi & Pastry, Kochi
                </p>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.65,
                    marginBottom: "1.2rem",
                  }}
                >
                  Started with one product, my mother's hands, and zero
                  marketing budget. I built the brand identity, the Instagram
                  content system, the pricing strategy, and the first sales
                  funnel entirely on organic reach. Daily revenue from month
                  one. Nothing we post looks like every other pastry brand.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    paddingTop: "1.2rem",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  {[
                    ["₹0", "Paid Spend at Launch"],
                    ["Day 1", "First Revenue"],
                    ["Organic", "100% Growth Channel"],
                  ].map(([v, l], i) => (
                    <div key={i}>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.6rem",
                          color: "var(--accent)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {v}
                      </div>
                      <div
                        style={{
                          fontSize: "0.68rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                        }}
                      >
                        {l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p style={{ ...hookLine, marginTop: "4rem" }}>
            None of this happened by accident
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 10 — BACKGROUND / ABOUT
          (2-col: timeline left, statement paragraphs + books right)
      ============================================================ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "6rem 2.5rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "5rem",
            alignItems: "start",
          }}
        >
          {/* Timeline */}
          <div>
            <p style={eyebrow({})}>The person behind it</p>
            <h2 style={sectionTitle}>
              I didn't start in marketing.{" "}
              <em style={{ fontStyle: "normal", color: "var(--accent)" }}>
                That's the point.
              </em>
            </h2>
            <div style={{ position: "relative", marginTop: "2rem" }}>
              {[
                {
                  year: "Where it started",
                  title: "Mechanical Engineering + Robotics",
                  body: "Trained to think in systems, not just tasks. That habit never left. It's why I can't just 'run ads' without asking what happens after the click.",
                },
                {
                  year: "Then",
                  title: "Fitness Training + Coaching",
                  body: "Sold with nothing but trust and results. Taught me that the product is never the hard part — the conversation is. That's half of what copywriting is.",
                },
                {
                  year: "Then",
                  title: "Web Development + UI/UX",
                  body: "Learned to build what I was imagining, not describe it to someone else. That closed the loop between strategy and execution permanently.",
                },
                {
                  year: "Now",
                  title: "Strategist, Builder, Writer",
                  body: "At TMCI and Ever Sweet — doing all of it at once. SEO, paid ads, copy, design, development. Not as a generalist who knows a bit of everything. As someone who sees how everything connects.",
                },
              ].map((item, i, arr) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    paddingBottom: "2rem",
                    position: "relative",
                  }}
                >
                  {i < arr.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        left: 11,
                        top: 24,
                        bottom: 0,
                        width: 1,
                        background: "var(--border)",
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      borderRadius: "50%",
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 2,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--accent)",
                      }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {item.year}
                    </div>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: "var(--white)",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statement paragraphs + books */}
          <div>
            <div
              style={{
                borderLeft: "2px solid var(--accent)",
                paddingLeft: "2rem",
              }}
            >
              {[
                "Most specialists protect their corner. They do the thing they're good at and hand off everything else. You end up with a beautiful website that nobody visits, or an ad campaign driving traffic to a landing page that doesn't convert.",
                "I think in loops. The ad brings them in. The site earns their attention. The copy closes them. If any part of that chain is weak, the whole thing leaks money. I fix the chain, not just one link in it.",
                "I've built a pastry brand from scratch with my mother and a manufacturer's website from a blank Next.js file. I've read Breakthrough Advertising the way some people read scripture. I play chess. I think two moves ahead by default.",
                "That's not a brag. It's a warning — if you hire me, I will question your funnel, challenge your assumptions, and care more about the outcome than the invoice.",
              ].map((p, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "1rem",
                    color: "#b5b0a8",
                    fontWeight: 300,
                    lineHeight: 1.75,
                    marginBottom: "1.4rem",
                  }}
                >
                  {i === 1 ? (
                    <>
                      The ad brings them in.{" "}
                      <strong style={{ color: "var(--text)", fontWeight: 400 }}>
                        The site earns their attention. The copy closes them.
                      </strong>{" "}
                      If any part of that chain is weak, the whole thing leaks
                      money. I fix the chain, not just one link in it.
                    </>
                  ) : (
                    p
                  )}
                </p>
              ))}
            </div>

            <div style={{ marginTop: "3rem" }}>
              <p style={eyebrow({})}>Currently reading</p>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  marginTop: "1rem",
                }}
              >
                {[
                  "Breakthrough Advertising",
                  "Cashvertising",
                  "They Ask You Answer",
                  "Product-Led SEO",
                ].map((book) => (
                  <div
                    key={book}
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      padding: "0.4rem 1rem",
                      borderRadius: "2px",
                      fontSize: "0.78rem",
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                    }}
                  >
                    {book}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 11 — BLOG GATEWAY
          (5-card blog teaser grid + see all link)
      ============================================================ */}
      <section
        style={{
          background: "var(--bg)",
          padding: "6rem 2.5rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={eyebrow({})}>From the blog</p>
          <h2 style={{ ...sectionTitle, marginBottom: "0.5rem" }}>
            Still forming your question?
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--text-muted)",
              marginBottom: "3rem",
              fontWeight: 300,
            }}
          >
            Read how I think. If it resonates, we'll talk.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 1,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {blogTeasers.map((b, i) => (
              <Link
                key={i}
                href={`/blog/${b.slug}`}
                style={{
                  background: "var(--surface)",
                  padding: "1.75rem 1.5rem",
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
                <p
                  style={{
                    fontSize: "0.68rem",
                    color: "var(--accent)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-sans)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {b.tag}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1rem",
                    color: "var(--text-light)",
                    lineHeight: 1.6,
                    marginBottom: "1.5rem",
                  }}
                >
                  {b.title}
                </p>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--accent)",
                    fontFamily: "var(--font-sans)",
                    letterSpacing: "0.5px",
                  }}
                >
                  Read →
                </p>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link
              href="/blog"
              style={{
                fontSize: "0.78rem",
                color: "rgba(232,228,220,0.25)",
                fontFamily: "var(--font-sans)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: 2,
              }}
            >
              See all posts →
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 12 — FINAL CTA
          (centred headline, email link)
      ============================================================ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "8rem 2.5rem",
          textAlign: "center",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <p style={eyebrow({ center: true })}>Let's build something</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              lineHeight: 0.95,
              color: "var(--white)",
              marginBottom: "1.5rem",
              letterSpacing: "-0.01em",
            }}
          >
            {hp.ctaHeadline || "Your marketing should"}
            <br />
            feel like your{" "}
            <span style={{ color: "var(--accent)" }}>product does.</span>
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-muted)",
              maxWidth: 480,
              margin: "0 auto 3rem",
              lineHeight: 1.65,
              fontWeight: 300,
            }}
          >
            {hp.ctaBody ||
              "If you've read this far, you already know whether this is the right fit. No forms, no discovery call decks. Just send me an email and we'll figure out the rest."}
          </p>
          <a
            href="mailto:hello@sushanthp.com"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              letterSpacing: "0.06em",
              color: "var(--accent)",
              textDecoration: "none",
              borderBottom: "2px solid var(--accent)",
              paddingBottom: "4px",
            }}
          >
            hello@sushanthp.com
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ================================================================
   SECTION 13 — SHARED STYLE HELPERS
   (eyebrow, sectionTitle, hookLine, btnPrimary, btnGhost)
================================================================ */

function eyebrow({ center } = {}) {
  return {
    fontSize: "0.72rem",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "var(--accent)",
    marginBottom: "1.2rem",
    fontFamily: "var(--font-sans)",
    textAlign: center ? "center" : "left",
  };
}

const sectionTitle = {
  fontFamily: "var(--font-serif)",
  fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
  lineHeight: 1.15,
  color: "var(--white)",
  marginBottom: "1.5rem",
  fontWeight: 400,
};

const hookLine = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.1rem",
  fontStyle: "italic",
  color: "var(--text-muted)",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const btnPrimary = {
  background: "var(--accent)",
  color: "#0e0e0e",
  padding: "0.9rem 2rem",
  borderRadius: "4px",
  fontWeight: 500,
  fontSize: "0.88rem",
  textDecoration: "none",
  letterSpacing: "0.04em",
  display: "inline-block",
};

const btnGhost = {
  color: "var(--text-muted)",
  fontSize: "0.85rem",
  textDecoration: "none",
  letterSpacing: "0.04em",
  borderBottom: "1px solid var(--border)",
  paddingBottom: "2px",
};
