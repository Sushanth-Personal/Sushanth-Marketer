"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PathInfographic from "@/components/PathInfographic";
import { supabase } from "@/lib/supabase";

/* ─── DATA ─────────────────────────────────────────────────────────── */

const paths = {
  searching: {
    label: "I know marketing matters — I am looking for the right person to handle it",
    sublabel: "You understand the value. You just need to know who to trust.",
    inocTitle: "The hardest part isn't finding a marketer. It's knowing if they're actually good.",
    inocBody: "Most marketers show you a portfolio, talk strategy, and sound convincing. But one thing separates someone who gets results from someone who just gets busy:",
    inocQuestion: '"Do they start by asking who your customer is — or by talking about what they can do?"',
    inocClose: "Anyone who jumps to execution before understanding your customer is guessing. Confidently. Expensively. The right person asks uncomfortable questions before touching anything.",
    inocEnd: "Has anyone asked you those questions yet?",
    inocBlog: { text: "How to evaluate a marketer before you hire them →", slug: "how-to-evaluate-a-marketer" },
  },
  delegated: {
    label: "I have handed it to an agency or marketer — sitting back waiting for results",
    sublabel: "Things are running. But you are not entirely sure you picked the right one.",
    inocTitle: "Your agency might be doing everything they promised. That might be the problem.",
    inocBody: "Agencies deliver what they agreed to — content, ads, reports, reach. But there is one question most were never asked before they started:",
    inocQuestion: '"Who exactly is the one person we are talking to — and what are they feeling before they see this ad?"',
    inocClose: "If that question was never asked, everything that followed — however professional it looks — was built on a guess. And you are paying for that guess every month.",
    inocEnd: "When was the last time your agency asked you that?",
    inocBlog: { text: "What to ask your agency in the next review meeting →", slug: "what-to-ask-your-marketing-team" },
  },
  sales: {
    label: "My sales are not where I want them — I am not sure what the problem is",
    sublabel: "You know the number is wrong. You just haven't found the leak yet.",
    inocTitle: "Most sales problems are not sales problems.",
    inocBody: "When revenue is flat, the instinct is to look at pricing, the product, the sales team. Rarely does anyone look at what happens before all of that:",
    inocQuestion: '"Does the right person even feel like this was made for them — before they ever talk to you?"',
    inocClose: "If your marketing is talking to everyone, it is resonating with no one. Your sales team is working hard to close people who were never properly warmed up. The leak is upstream.",
    inocEnd: "What if the problem isn't your product or your sales — but who you're speaking to and what you're saying?",
    inocBlog: { text: "Why your sales problem might actually be a marketing problem →", slug: "why-sales-problem-is-marketing-problem" },
  },
};

const stats = [
  { stat: "95%", desc: "of buying decisions are emotionally driven", source: "Harvard Business Review", url: "https://hbr.org/2015/11/the-new-science-of-customer-emotions" },
  { stat: "64%", desc: "of consumers cite shared values as the main reason they have a relationship with a brand", source: "Harvard Business Review", url: "https://hbr.org/2012/05/three-myths-about-what-customers-want" },
  { stat: "71%", desc: "of consumers who have had a good social media experience with a brand are likely to recommend it", source: "Ambassador", url: "https://www.ambassador.com/blog/word-of-mouth-statistics" },
];

const blogTeasers = [
  { tag: "Agency", title: "Your agency made a beautiful ad. Did they ask who it was for?", slug: "agency-beautiful-ad-who-is-it-for" },
  { tag: "Strategy", title: "What to ask your marketing team before the next campaign", slug: "what-to-ask-your-marketing-team" },
  { tag: "Psychology", title: "Why the best product doesn't always win", slug: "why-best-product-doesnt-always-win" },
  { tag: "Fundamentals", title: "You don't need to learn marketing. You need to understand one thing.", slug: "you-dont-need-to-learn-marketing" },
  { tag: "Insight", title: "What your customer feels the moment before they find you", slug: "what-customer-feels-before-finding-you" },
];

const services = [
  {
    num: "01",
    title: "Brand Messaging",
    desc: 'The words that make your right customer say "this is exactly for me."',
    detail: "2–3 week engagement. Positioning, tone, and a messaging doc your whole team can use.",
    accent: true,
  },
  {
    num: "02",
    title: "Ad Strategy & Copy",
    desc: "Campaigns built on psychology, not best practices from 2019.",
    detail: "Starts with audience research. Ends with ad copy you can run the same week.",
    accent: false,
  },
  {
    num: "03",
    title: "Marketing Audit",
    desc: "Find exactly where your marketing is leaking before spending another dollar.",
    detail: "One focused session. You leave with a ranked list of what to fix first.",
    accent: false,
  },
];

const defaultHp = {
  heroEyebrow: "Marketing strategist — for founders",
  ctaHeadline: "That's a sign.",
  ctaBody: "The founders who reach out to me aren't looking for another vendor. They're looking for someone who will tell them the truth about why their marketing isn't working — and actually fix it.",
};

/* ─── STYLES (CSS-in-JS objects) ────────────────────────────────────── */

const S = {
  // Typography
  eyebrow: {
    fontSize: 10,
    letterSpacing: "3.5px",
    textTransform: "uppercase",
    color: "var(--amber)",
    fontFamily: "var(--font-sans)",
    marginBottom: 20,
    fontWeight: 400,
  },

  // Buttons
  btnPrimary: {
    background: "var(--amber)",
    color: "var(--dark)",
    padding: "14px 32px",
    fontSize: 11,
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: "var(--font-sans)",
    fontWeight: 500,
    textDecoration: "none",
    display: "inline-block",
    cursor: "pointer",
    border: "none",
  },
  btnGhost: {
    fontSize: 13,
    color: "rgba(247,244,238,0.35)",
    fontFamily: "var(--font-sans)",
    borderBottom: "1px solid rgba(247,244,238,0.15)",
    paddingBottom: 2,
    textDecoration: "none",
    letterSpacing: "0.5px",
  },

  // Section wrappers
  sectionDark: {
    background: "var(--dark)",
    padding: "96px 48px",
  },
  sectionMid: {
    background: "var(--dark-2)",
    padding: "96px 48px",
  },
  inner: {
    maxWidth: 760,
    margin: "0 auto",
  },
  innerWide: {
    maxWidth: 900,
    margin: "0 auto",
  },
};

/* ─── COMPONENT ─────────────────────────────────────────────────────── */

export default function Home() {
  const [activePath, setActivePath] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayTriggered, setOverlayTriggered] = useState(false);
  const [hp, setHpState] = useState(defaultHp);

  useEffect(() => {
    async function fetchHp() {
      const { data } = await supabase.from("settings").select("*").eq("key", "homepage");
      if (data && data[0]) {
        try { setHpState((h) => ({ ...h, ...JSON.parse(data[0].value) })); } catch {}
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

  const path = activePath ? paths[activePath ] : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--dark)" }}>
      <Navbar />

      {/* ── PATH SELECTION OVERLAY ─────────────────────────────────── */}
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
            <p style={{ ...S.eyebrow, textAlign: "center", marginBottom: 20 }}>
              Before you read further
            </p>
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
                color: "rgba(247,244,238,0.6)",
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
                  onClick={() => { setActivePath(key); setShowOverlay(false); }}
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
                    e.currentTarget.style.background = "rgba(200,169,110,0.08)";
                    e.currentTarget.style.borderColor = "var(--amber)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <p style={{ fontSize: 15, color: "var(--text-light)", marginBottom: 4, lineHeight: 1.5 }}>
                    {p.label}
                  </p>
                  <p style={{ fontSize: 12, color: "rgba(247,244,238,0.4)", fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                    {p.sublabel}
                  </p>
                </button>
              ))}
            </div>
            <p
              style={{ fontSize: 12, color: "#2A2A26", textAlign: "center", marginTop: 24, cursor: "pointer", fontFamily: "var(--font-sans)" }}
              onClick={() => setShowOverlay(false)}
            >
              Skip for now →
            </p>
          </div>
        </div>
      )}

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "var(--dark)",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          paddingTop: 68,
        }}
      >
        {/* Full-bleed photo — right half */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "58%",
            zIndex: 1,
          }}
        >
          <Image
            src="/photos/sushanth.png"
            alt="Sushanth P"
            fill
            style={{ objectFit: "cover", objectPosition: "top center" }}
            priority
          />
          {/* Gradient: left fade so text reads over it */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, var(--dark) 0%, rgba(12,11,9,0.55) 45%, rgba(12,11,9,0.05) 100%)",
            }}
          />
          {/* Bottom fade */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 220,
              background: "linear-gradient(to top, var(--dark), transparent)",
            }}
          />
          {/* Amber anchor line */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "var(--amber)",
            }}
          />
          {/* Vertical label */}
          <p
            style={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%) rotate(90deg)",
              fontSize: 9,
              letterSpacing: "4px",
              color: "rgba(247,244,238,0.12)",
              textTransform: "uppercase",
              fontFamily: "var(--font-sans)",
              zIndex: 2,
              whiteSpace: "nowrap",
            }}
          >
            Marketing Strategist
          </p>
        </div>

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 48px 88px",
            width: "100%",
          }}
        >
          <p style={S.eyebrow}>{hp.heroEyebrow}</p>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(48px, 5.5vw, 76px)",
              fontWeight: 300,
              lineHeight: 1.05,
              color: "var(--text-light)",
              letterSpacing: "-0.5px",
              marginBottom: 0,
              maxWidth: 620,
            }}
          >
            Most founders come
            <br />
            to me at one of
            <br />
            <em style={{ fontStyle: "italic", color: "var(--amber)" }}>two moments.</em>
          </h1>

          <div
            style={{
              width: 40,
              height: 1,
              background: "var(--amber)",
              margin: "28px 0",
            }}
          />

          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 20,
              fontStyle: "italic",
              color: "rgba(247,244,238,0.5)",
              lineHeight: 1.6,
              maxWidth: 500,
              marginBottom: 20,
              fontWeight: 300,
            }}
          >
            One wants to build it right from the beginning — no wrong turns,
            no wasted money, no learning the hard way. The other has tried
            everything — the agency, the ads, the content — watched the budget
            disappear, and still has nothing to show for it.
          </p>

          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 22,
              fontStyle: "italic",
              color: "var(--amber)",
              marginBottom: 40,
              fontWeight: 300,
            }}
          >
            Either way, you're in the right place.
          </p>

          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <a href="mailto:hello@sushanthp.com" style={S.btnPrimary}>
              Let's talk →
            </a>
            <Link href="/blog" style={S.btnGhost}>
              Read how I think
            </Link>
          </div>
        </div>
      </section>

      {/* ── DOUBT SECTION ──────────────────────────────────────────── */}
      <section style={{ ...S.sectionDark, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={S.inner}>
          <p style={S.eyebrow}>Be honest for a second</p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 400,
              color: "var(--text-light)",
              lineHeight: 1.2,
              marginBottom: 32,
            }}
          >
            You're putting time and money
            <br />
            into marketing.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(247,244,238,0.5)",
              lineHeight: 1.9,
              marginBottom: 40,
              fontWeight: 300,
              maxWidth: 580,
            }}
          >
            Some of it is working. Enough to keep going. Not enough to stop wondering.
          </p>

          <div
            style={{
              borderLeft: "2px solid var(--amber)",
              paddingLeft: 32,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {[
              "Is this really the best my marketing can do?",
              "How much am I leaving on the table?",
              "Should I spend more — or is the problem somewhere else entirely?",
            ].map((q, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 21,
                  fontStyle: "italic",
                  color: "rgba(247,244,238,0.7)",
                  lineHeight: 1.5,
                  padding: "20px 0",
                  borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                {q}
              </p>
            ))}
          </div>

          <p
            style={{
              fontSize: 15,
              color: "rgba(247,244,238,0.25)",
              lineHeight: 1.8,
              marginTop: 36,
              fontWeight: 300,
            }}
          >
            Nobody around you has a straight answer. And that's the problem.
          </p>
        </div>
      </section>

      {/* ── SCROLL TRIGGER — overlay fires when this enters view ──── */}
      <div id="path-trigger" />

      {/* ── PATH INDICATOR ─────────────────────────────────────────── */}
      {activePath && (
        <section
          style={{
            background: "var(--dark-2)",
            padding: "16px 48px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              maxWidth: 760,
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
                  background: "var(--amber)",
                  flexShrink: 0,
                }}
              />
              <p style={{ fontSize: 12, color: "rgba(247,244,238,0.4)", fontFamily: "var(--font-sans)" }}>
                Showing content for:{" "}
                <strong style={{ color: "rgba(247,244,238,0.7)", fontWeight: 400 }}>
                  {paths[activePath ]?.label}
                </strong>
              </p>
            </div>
            <button
              onClick={() => setShowOverlay(true)}
              style={{
                fontSize: 11,
                color: "var(--amber)",
                fontFamily: "var(--font-sans)",
                background: "none",
                border: "none",
                cursor: "pointer",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Change →
            </button>
          </div>
        </section>
      )}

      {/* ── INOCULATION SECTION ────────────────────────────────────── */}
      <section style={{ ...S.sectionMid }}>
        <div style={S.inner}>
          {path ? (
            <>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(26px, 3.5vw, 40px)",
                  fontWeight: 400,
                  color: "var(--text-light)",
                  lineHeight: 1.25,
                  marginBottom: 24,
                }}
              >
                {path.inocTitle}
              </h2>
              <p style={{ fontSize: 16, color: "rgba(247,244,238,0.6)", lineHeight: 1.85, marginBottom: 28, fontWeight: 300 }}>
                {path.inocBody}
              </p>
              <blockquote
                style={{ borderLeft: "2px solid var(--amber)", paddingLeft: 28, margin: "32px 0" }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 22,
                    fontStyle: "italic",
                    color: "var(--text-light)",
                    lineHeight: 1.6,
                  }}
                >
                  {path.inocQuestion}
                </p>
              </blockquote>
              <p style={{ fontSize: 16, color: "rgba(247,244,238,0.6)", lineHeight: 1.85, marginBottom: 20, fontWeight: 300 }}>
                {path.inocClose}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 19,
                  color: "var(--amber)",
                  fontStyle: "italic",
                  marginBottom: 32,
                }}
              >
                {path.inocEnd}
              </p>
              <Link
                href={`/blog/${path.inocBlog.slug}`}
                style={{
                  color: "var(--amber)",
                  fontSize: 13,
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.5px",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(200,169,110,0.3)",
                  paddingBottom: 2,
                }}
              >
                {path.inocBlog.text}
              </Link>
            </>
          ) : (
            <>
              <p style={S.eyebrow}>The real reason</p>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(28px, 3.5vw, 42px)",
                  fontWeight: 400,
                  color: "var(--text-light)",
                  lineHeight: 1.2,
                  marginBottom: 48,
                }}
              >
                Most marketing fails for one reason.
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1,
                  background: "rgba(255,255,255,0.04)",
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
                  <div key={i} style={{ background: "var(--dark)", padding: "40px 32px" }}>
                    <p style={{ fontSize: 20, color: "var(--amber)", marginBottom: 16 }}>{item.icon}</p>
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: 18,
                        color: "var(--text-light)",
                        marginBottom: 14,
                      }}
                    >
                      {item.title}
                    </p>
                    <p style={{ fontSize: 14, color: "rgba(247,244,238,0.5)", lineHeight: 1.85, fontWeight: 300 }}>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              marginTop: 64,
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "32px 32px 32px 0",
                  paddingLeft: i > 0 ? 32 : 0,
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 48,
                    color: "var(--amber)",
                    fontWeight: 300,
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  {s.stat}
                </p>
                <p style={{ fontSize: 13, color: "rgba(247,244,238,0.5)", lineHeight: 1.75, marginBottom: 12, fontWeight: 300 }}>
                  {s.desc}
                </p>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.15)",
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
        </div>
      </section>

      {/* ── PATH INFOGRAPHIC ───────────────────────────────────────── */}
      <PathInfographic activePath={activePath} />

      {/* ── WHAT I DO ──────────────────────────────────────────────── */}
      <section style={{ ...S.sectionDark, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={S.inner}>
          <p style={S.eyebrow}>What I do</p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 400,
              color: "var(--text-light)",
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            I ask the questions nobody is asking.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(247,244,238,0.4)",
              lineHeight: 1.85,
              marginBottom: 16,
              fontWeight: 300,
            }}
          >
            Before any copy. Before any campaign. Before any content calendar.
          </p>
          <p
            style={{
              fontSize: 16,
              color: "rgba(247,244,238,0.4)",
              lineHeight: 1.85,
              marginBottom: 48,
              fontWeight: 300,
              maxWidth: 560,
            }}
          >
            There's a conversation that most founders have never had with anyone:{" "}
            <em style={{ color: "rgba(247,244,238,0.6)" }}>
              Who exactly are you for? What do they feel? What do they need to hear before they buy?
            </em>
          </p>

          {/* Service cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {services.map((s, i) => (
              <div
                key={i}
                style={{
                  background: "var(--dark)",
                  padding: "36px 28px",
                  borderTop: `2px solid ${s.accent ? "var(--amber)" : "rgba(200,169,110,0.25)"}`,
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--amber)",
                    letterSpacing: "2px",
                    fontFamily: "var(--font-sans)",
                    marginBottom: 20,
                  }}
                >
                  {s.num}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 18,
                    color: "var(--text-light)",
                    marginBottom: 12,
                  }}
                >
                  {s.title}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(247,244,238,0.5)",
                    lineHeight: 1.8,
                    marginBottom: 20,
                    fontWeight: 300,
                  }}
                >
                  {s.desc}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(200,169,110,0.45)",
                    lineHeight: 1.6,
                    paddingTop: 16,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    fontStyle: "italic",
                  }}
                >
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG GATEWAY ───────────────────────────────────────────── */}
      <section style={{ ...S.sectionMid, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={S.innerWide}>
          <p style={S.eyebrow}>From the blog</p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 400,
              color: "var(--text-light)",
              marginBottom: 8,
              maxWidth: 360,
            }}
          >
            Still forming your question?
          </h2>
          <p style={{ fontSize: 14, color: "rgba(247,244,238,0.3)", marginBottom: 48, fontWeight: 300 }}>
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
                  background: "var(--dark)",
                  padding: "28px 24px",
                  textDecoration: "none",
                  display: "block",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget ).style.background = "var(--dark-2)"; }}
                onMouseLeave={(e) => { (e.currentTarget ).style.background = "var(--dark)"; }}
              >
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--amber)",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-sans)",
                    marginBottom: 12,
                  }}
                >
                  {b.tag}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 16,
                    color: "var(--text-light)",
                    lineHeight: 1.6,
                    marginBottom: 24,
                  }}
                >
                  {b.title}
                </p>
                <p style={{ fontSize: 11, color: "var(--amber)", fontFamily: "var(--font-sans)", letterSpacing: "0.5px" }}>
                  Read →
                </p>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link
              href="/blog"
              style={{
                fontSize: 12,
                color: "rgba(247,244,238,0.25)",
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

      {/* ── FINAL CTA ──────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--dark)",
          padding: "120px 48px",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <p style={{ ...S.eyebrow, textAlign: "center" }}>Still reading?</p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(32px, 4.5vw, 52px)",
              fontWeight: 400,
              color: "var(--text-light)",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            {hp.ctaHeadline}
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(247,244,238,0.45)",
              lineHeight: 1.9,
              marginBottom: 44,
              fontWeight: 300,
            }}
          >
            {hp.ctaBody}
          </p>
          <a href="mailto:hello@sushanthp.com" style={{ ...S.btnPrimary, padding: "16px 44px" }}>
            Work with me →
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}