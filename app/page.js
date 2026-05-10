"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PathInfographic from "@/components/PathInfographic";
import { supabase } from "@/lib/supabase";

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

const defaultHp = {
  heroEyebrow: "For founders who are done guessing",
  heroHeadline: "You need sales.",
  heroAccent: "Period.",
  heroSub:
    "Not more content. Not a brand refresh. Not another agency retainer. Just customers who actually pay.",
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
  whatIDoHeadline: "I ask the questions nobody is asking.",
  whatIDoBody:
    "Before any copy. Before any campaign. Before any content calendar.",
  ctaHeadline: "That's a sign.",
  ctaBody:
    "The founders who reach out to me aren't looking for another vendor.",
  ctaButton: "Work With Me →",
};

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
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* PATH SELECTION OVERLAY */}
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
            <p
              style={{
                fontSize: 11,
                color: "var(--amber)",
                letterSpacing: 3,
                textTransform: "uppercase",
                fontFamily: "var(--font-sans)",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
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
                color: "rgba(247,244,238,0.75)",
                fontFamily: "var(--font-sans)",
                lineHeight: 1.7,
                textAlign: "center",
                marginBottom: 40,
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
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--text-light)",
                    padding: "20px 24px",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "var(--font-sans)",
                    borderRadius: 2,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(200,169,110,0.1)";
                    e.currentTarget.style.borderColor = "var(--amber)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
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
                      color: "rgba(247,244,238,0.55)",
                      fontFamily: "var(--font-sans)",
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
                color: "#3A3830",
                textAlign: "center",
                marginTop: 24,
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
              }}
              onClick={() => setShowOverlay(false)}
            >
              Skip for now →
            </p>
          </div>
        </div>
      )}

      {/* HERO */}
      <section
        style={{
          background: "var(--dark)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "flex-end",
          paddingTop: 68,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(ellipse at 70% 50%, rgba(200,169,110,0.04) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "80px 32px 0",
            display: "flex",
            alignItems: "flex-end",
            gap: 0,
            width: "100%",
          }}
        >
          <div style={{ flex: 1, paddingBottom: 80 }}>
            <p
              style={{
                fontSize: 11,
                color: "var(--amber)",
                letterSpacing: 3,
                textTransform: "uppercase",
                fontFamily: "var(--font-sans)",
                marginBottom: 28,
              }}
            >
              {hp.heroEyebrow}
            </p>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(42px, 5vw, 64px)",
                fontWeight: 400,
                lineHeight: 1.08,
                color: "var(--text-light)",
                marginBottom: 28,
              }}
            >
              {hp.heroHeadline}
              <br />
              <span style={{ color: "var(--amber)" }}>{hp.heroAccent}</span>
            </h1>
            <p
              style={{
                fontSize: 17,
                color: "rgba(247,244,238,0.85)",
                lineHeight: 1.9,
                maxWidth: 420,
                marginBottom: 44,
                fontWeight: 300,
              }}
            >
              {hp.heroSub}
            </p>
            <div
              style={{
                display: "flex",
                gap: 24,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="mailto:hello@sushanthp.com"
                style={{
                  background: "var(--amber)",
                  color: "var(--dark)",
                  padding: "14px 32px",
                  fontSize: 12,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Let's talk →
              </a>
              <Link
                href="/blog"
                style={{
                  color: "rgba(247,244,238,0.55)",
                  fontSize: 13,
                  fontFamily: "var(--font-sans)",
                  borderBottom: "1px solid #3A3830",
                  paddingBottom: 2,
                  textDecoration: "none",
                }}
              >
                Read how I think
              </Link>
            </div>
          </div>
          <div
            style={{
              flexShrink: 0,
              width: 340,
              alignSelf: "stretch",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              position: "relative",
            }}
          >
            <div style={{ position: "relative", lineHeight: 0 }}>
              <Image
                src="/photos/sushanth.png"
                alt="Sushanth P"
                width={320}
                height={460}
                style={{
                  objectFit: "contain",
                  objectPosition: "bottom center",
                  display: "block",
                  verticalAlign: "bottom",
                }}
                priority
              />
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
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 — THE DOUBT */}
      <section
        style={{ background: "var(--cream)", padding: "96px 32px 80px" }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              color: "var(--amber)",
              letterSpacing: 3,
              textTransform: "uppercase",
              fontFamily: "var(--font-sans)",
              marginBottom: 24,
            }}
          >
            Be honest for a second
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 400,
              color: "var(--text-primary)",
              lineHeight: 1.25,
              marginBottom: 28,
            }}
          >
            {hp.doubtTitle}
          </h2>

          <div
            style={{
              width: "100%",
              height: 340,
              background: "#E8E4DC",
              marginBottom: 36,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80"
              alt="Founder at desk"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.7,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(247,244,238,0.6) 0%, transparent 60%)",
              }}
            />
          </div>

          <p
            style={{
              fontSize: 17,
              color: "var(--text-secondary)",
              lineHeight: 1.85,
              marginBottom: 20,
            }}
          >
            {hp.doubtSub}
          </p>

          <div
            style={{
              borderLeft: "2px solid var(--amber)",
              paddingLeft: 28,
              margin: "40px 0",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {[hp.doubtQ1, hp.doubtQ2, hp.doubtQ3].map((q, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 20,
                  fontStyle: "italic",
                  color: "var(--text-primary)",
                  lineHeight: 1.5,
                }}
              >
                {q}
              </p>
            ))}
          </div>

          <p
            style={{
              fontSize: 16,
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              marginBottom: 8,
            }}
          >
            {hp.doubtClose}
          </p>
        </div>
      </section>

      {/* SCROLL TRIGGER — overlay fires when this comes into view */}
      <div id="path-trigger" />

      {/* PATH INDICATOR + CHANGE OPTION */}
      {activePath && (
        <section
          style={{
            background: "var(--cream-3)",
            padding: "20px 32px",
            borderTop: "1px solid var(--border-light)",
            borderBottom: "1px solid var(--border-light)",
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
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--amber)",
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Showing content for:{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {paths[activePath]?.label}
                </strong>
              </p>
            </div>
            <button
              onClick={() => setShowOverlay(true)}
              style={{
                fontSize: 12,
                color: "var(--amber)",
                fontFamily: "var(--font-sans)",
                background: "none",
                border: "none",
                cursor: "pointer",
                letterSpacing: 0.5,
                textDecoration: "underline",
              }}
            >
              Change →
            </button>
          </div>
        </section>
      )}

      {/* INOCULATION SECTION — changes based on path */}
      <section style={{ background: "var(--dark)", padding: "96px 32px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {activePath ? (
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
                {paths[activePath].inocTitle}
              </h2>
              <p
                style={{
                  fontSize: 17,
                  color: "rgba(247,244,238,0.85)",
                  lineHeight: 1.85,
                  marginBottom: 28,
                  fontFamily: "var(--font-sans)",
                }}
              >
                {paths[activePath].inocBody}
              </p>
              <blockquote
                style={{
                  borderLeft: "3px solid var(--amber)",
                  paddingLeft: 28,
                  margin: "32px 0",
                }}
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
                  {paths[activePath].inocQuestion}
                </p>
              </blockquote>
              <p
                style={{
                  fontSize: 17,
                  color: "rgba(247,244,238,0.85)",
                  lineHeight: 1.85,
                  marginBottom: 20,
                  fontFamily: "var(--font-sans)",
                }}
              >
                {paths[activePath].inocClose}
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
                {paths[activePath].inocEnd}
              </p>
              <Link
                href={`/blog/${paths[activePath].inocBlog.slug}`}
                style={{
                  color: "var(--amber)",
                  fontSize: 13,
                  fontFamily: "var(--font-sans)",
                  letterSpacing: 0.5,
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(200,169,110,0.3)",
                  paddingBottom: 2,
                }}
              >
                {paths[activePath].inocBlog.text}
              </Link>
            </>
          ) : (
            <>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--amber)",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  fontFamily: "var(--font-sans)",
                  marginBottom: 24,
                }}
              >
                The real reason
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(26px, 3.5vw, 40px)",
                  fontWeight: 400,
                  color: "var(--text-light)",
                  lineHeight: 1.25,
                  marginBottom: 32,
                }}
              >
                Most marketing fails for one reason.
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1,
                  background: "#1A1A16",
                  marginBottom: 48,
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
                      background: "var(--dark-2)",
                      padding: "36px 28px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 20,
                        color: "var(--amber)",
                        marginBottom: 14,
                      }}
                    >
                      {item.icon}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: 17,
                        color: "var(--text-light)",
                        marginBottom: 12,
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        fontSize: 15,
                        color: "rgba(247,244,238,0.8)",
                        lineHeight: 1.8,
                      }}
                    >
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
              gap: 24,
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                style={{ borderTop: "1px solid #2A2A26", paddingTop: 24 }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 36,
                    color: "var(--amber)",
                    fontWeight: 400,
                    marginBottom: 10,
                  }}
                >
                  {s.stat}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(247,244,238,0.8)",
                    lineHeight: 1.7,
                    marginBottom: 10,
                  }}
                >
                  {s.desc}
                </p>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 11,
                    color: "#3A3830",
                    fontFamily: "var(--font-sans)",
                    textDecoration: "none",
                    letterSpacing: 0.5,
                  }}
                >
                  {s.source} ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PATH INFOGRAPHIC — replaces the old 5-step emotional journey ── */}
      <PathInfographic activePath={activePath} />

      {/* WHAT I DO */}
      <section
        style={{
          background: "var(--cream-2)",
          padding: "96px 32px",
          borderTop: "1px solid var(--border-light)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              color: "var(--amber)",
              letterSpacing: 3,
              textTransform: "uppercase",
              fontFamily: "var(--font-sans)",
              marginBottom: 24,
            }}
          >
            What I do
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(26px, 3vw, 38px)",
              fontWeight: 400,
              color: "var(--text-primary)",
              lineHeight: 1.25,
              marginBottom: 28,
            }}
          >
            I ask the questions nobody is asking.
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "var(--text-secondary)",
              lineHeight: 1.85,
              marginBottom: 24,
            }}
          >
            Before any copy. Before any campaign. Before any content calendar.
          </p>
          <p
            style={{
              fontSize: 17,
              color: "var(--text-secondary)",
              lineHeight: 1.85,
              marginBottom: 24,
            }}
          >
            There's a conversation that most founders have never had with
            anyone:{" "}
            <em>
              Who exactly are you for? What do they feel? What do they need to
              hear before they buy?
            </em>
          </p>
          <p
            style={{
              fontSize: 17,
              color: "var(--text-secondary)",
              lineHeight: 1.85,
              marginBottom: 48,
            }}
          >
            I work with startup founders to answer those questions — then build
            the messaging, copy, and content strategy that follows. No
            templates. No AI-generated content dressed as strategy. No beautiful
            decks that avoid the hard questions.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              background: "var(--border-light)",
            }}
          >
            {[
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
            ].map((s, i) => (
              <div
                key={i}
                style={{ background: "var(--cream)", padding: "32px 24px" }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--amber)",
                    letterSpacing: 2,
                    fontFamily: "var(--font-sans)",
                    marginBottom: 14,
                  }}
                >
                  {s.num}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 16,
                    color: "var(--text-primary)",
                    marginBottom: 10,
                  }}
                >
                  {s.title}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    marginBottom: 16,
                  }}
                >
                  {s.desc}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    paddingTop: 14,
                    borderTop: "1px solid var(--border-light)",
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

      {/* BLOG GATEWAY */}
      <section
        style={{
          background: "var(--cream)",
          padding: "96px 32px",
          borderTop: "1px solid var(--border-light)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              color: "var(--amber)",
              letterSpacing: 3,
              textTransform: "uppercase",
              fontFamily: "var(--font-sans)",
              marginBottom: 16,
            }}
          >
            From the blog
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 400,
              color: "var(--text-primary)",
              marginBottom: 8,
              maxWidth: 440,
            }}
          >
            Still forming your question?
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "var(--text-muted)",
              marginBottom: 48,
            }}
          >
            Read how I think. If it resonates, we'll talk.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 1,
              background: "var(--border-light)",
            }}
          >
            {blogTeasers.map((b, i) => (
              <Link
                key={i}
                href={`/blog/${b.slug}`}
                style={{
                  background: "var(--cream-2)",
                  padding: "28px 24px",
                  textDecoration: "none",
                  display: "block",
                  transition: "background 0.2s",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--amber)",
                    letterSpacing: 2,
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
                    fontSize: 15,
                    color: "var(--text-primary)",
                    lineHeight: 1.6,
                    marginBottom: 20,
                  }}
                >
                  {b.title}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--amber)",
                    fontFamily: "var(--font-sans)",
                    letterSpacing: 0.5,
                  }}
                >
                  Read →
                </p>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link
              href="/blog"
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                fontFamily: "var(--font-sans)",
                textDecoration: "none",
                borderBottom: "1px solid var(--border-light)",
                paddingBottom: 2,
              }}
            >
              See all posts →
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        style={{
          background: "var(--dark)",
          padding: "96px 32px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              color: "var(--amber)",
              letterSpacing: 3,
              textTransform: "uppercase",
              fontFamily: "var(--font-sans)",
              marginBottom: 24,
            }}
          >
            Still reading?
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 400,
              color: "var(--text-light)",
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            {hp.ctaHeadline}
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "rgba(247,244,238,0.85)",
              lineHeight: 1.85,
              marginBottom: 40,
            }}
          >
            The founders who reach out to me aren't looking for another vendor.
            <br />
            They're looking for someone who will tell them the truth about why
            their marketing isn't working — and actually fix it.
          </p>
          <a
            href="mailto:hello@sushanthp.com"
            style={{
              background: "var(--amber)",
              color: "var(--dark)",
              padding: "16px 40px",
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Work With Me →
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}