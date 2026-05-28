"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

/* ================================================================
   MOBILE HOOK — SSR-safe, re-checks on resize
================================================================ */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

/* ================================================================
   SECTION 0 — DATA & CONSTANTS
================================================================ */

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
  heroEyebrow: "",
  ctaHeadline: "That's a sign.",
  ctaBody:
    "The founders who reach out to me aren't looking for another vendor. They're looking for someone who will tell them the truth about why their marketing isn't working — and actually fix it.",
};

/* ================================================================
   SECTION 1 — ROOT COMPONENT
================================================================ */

export default function Home() {
  const [hp, setHpState] = useState(defaultHp);
  const [posts, setPosts] = useState([]);
  const isMobile = useIsMobile();

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
    async function fetchData() {
      const { data: hpData } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "homepage");
      if (hpData && hpData[0]) {
        try {
          setHpState((h) => ({ ...h, ...JSON.parse(hpData[0].value) }));
        } catch {}
      }

      const { data: postsData } = await supabase
        .from("posts")
        .select("id, title, slug, tag, excerpt")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(5);
      if (postsData) setPosts(postsData);
    }
    fetchData();
  }, []);

  const px = isMobile ? "1.25rem" : "2.5rem";
  const sectionPy = isMobile ? "3.5rem" : "6rem";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* ============================================================
          SECTION 2 — HERO
          Mobile: photo as top banner, text stacked below
          Desktop: photo absolute right-half, text left
      ============================================================ */}
      {isMobile ? (
        <section style={{ background: "var(--bg)" }}>
          {/* ZONE 1 — Headline */}
          <div
            style={{
              padding: "86px 18px 24px",
              borderBottom: "1px solid #1a1a1a",
            }}
          >
            <p
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "1rem",
                fontFamily: "var(--font-sans)",
              }}
            >
              Marketing Strategist — For Founders
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.8rem, 13vw, 4rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.01em",
                color: "var(--white)",
                marginBottom: "1.25rem",
              }}
            >
              The business is alive.{" "}
              <span style={{ color: "var(--accent)" }}>But every month</span>{" "}
              feels like square one.
            </h1>
            <p
              style={{
                fontSize: "0.88rem",
                lineHeight: 1.65,
                color: "#b5b0a8",
                fontWeight: 300,
                fontFamily: "var(--font-sans)",
              }}
            >
              You're starting to wonder if the product was ever good enough.{" "}
              <strong style={{ color: "var(--text)", fontWeight: 400 }}>
                It was. The marketing just never caught up.
              </strong>
            </p>
          </div>

          {/* ZONE 4 — CTAs */}
          <div
            style={{
              padding: "14px 16px 28px",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
          >
            <a
              href="mailto:sushanthp.careers@gmail.com"
              style={{
                background: "var(--accent)",
                color: "#0e0e0e",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px",
                textAlign: "center",
                borderRadius: "3px",
                textDecoration: "none",
                display: "block",
              }}
            >
              Let's Talk →
            </a>
            <Link
              href="#problem"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("problem");
                if (el)
                  window.scrollTo({
                    top: el.offsetTop - 68,
                    behavior: "smooth",
                  });
              }}
              style={{
                border: "1px solid #222",
                color: "var(--text-muted)",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "13px",
                textAlign: "center",
                borderRadius: "3px",
                textDecoration: "none",
                display: "block",
              }}
            >
              Read How I Think
            </Link>
          </div>

          {/* ZONE 2 — Photo */}
          <div
            style={{
              height: 320,
              position: "relative",
              overflow: "hidden",
              background: "#0a0a0a",
            }}
          >
            <Image
              src="/photos/sushanth.png"
              alt="Sushanth P"
              fill
              style={{ objectFit: "cover", objectPosition: "center 25%" }}
              priority
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 100,
                background:
                  "linear-gradient(to bottom, transparent, var(--bg))",
                zIndex: 2,
              }}
            />
          </div>
        </section>
      ) : (
        /* ── DESKTOP HERO ── */
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
          {/* Ghost watermark */}
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
                  "linear-gradient(to right, #0e0e0e 0%, rgba(14,14,14,0.45) 30%, rgba(14,14,14,0.0) 100%)",
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

          {/* Hero text */}
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
            <p style={eyebrow({})}>Marketing Strategist — For Founders</p>
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
              The business is alive.{" "}
              <span style={{ color: "var(--accent)" }}>But every month</span>{" "}
              feels like square one.
            </h1>

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
              You're starting to wonder if the product was ever good enough.{" "}
              <strong style={{ color: "var(--text)", fontWeight: 400 }}>
                It was. The marketing just never caught up.
              </strong>
            </p>

            <div
              style={{
                display: "flex",
                gap: 24,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: "3rem",
              }}
            >
              <a href="mailto:sushanthp.careers@gmail.com" style={btnPrimary}>
                Let's Talk →
              </a>
              <Link
                href="#problem"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("problem");
                  if (el)
                    window.scrollTo({
                      top: el.offsetTop - 68,
                      behavior: "smooth",
                    });
                }}
                style={btnGhost}
              >
                Read how I think
              </Link>
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
      )}
      {/* ============================================================
    BRIDGE SECTION — It's not the product
============================================================ */}
      <section
        style={{
          background: "var(--bg)",
          padding: `${sectionPy} ${px}`,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div style={{ maxWidth: 580 }}>
            <p style={eyebrow({})}>Before we go further</p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: isMobile
                  ? "clamp(1.6rem, 7vw, 2.2rem)"
                  : "clamp(1.8rem, 3.5vw, 3rem)",
                lineHeight: 1.15,
                color: "var(--white)",
                marginBottom: "1.5rem",
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              It&apos;s not the product.
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "#b5b0a8",
                fontWeight: 300,
                lineHeight: 1.8,
                marginBottom: "1.5rem",
              }}
            >
              The people who find you love what you made. The product works.
              What isn&apos;t working is how it reaches them — and that&apos;s a
              completely different problem with a completely different fix.
            </p>
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(232,228,220,0.5)",
                fontWeight: 300,
                lineHeight: 1.8,
              }}
            >
              The doubt you feel about your product is real. But it&apos;s
              borrowed — it came from marketing that isn&apos;t doing its job,
              not from anything wrong with what you built.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
    SECTION 3 — THE PROBLEM
============================================================ */}
      <section
        id="problem"
        style={{
          background: "var(--surface)",
          padding: `${sectionPy} ${px}`,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "2.5rem" : "5rem",
            alignItems: "start",
          }}
        >
          <div>
            <p style={eyebrow({})}>The problem</p>
            <h2 style={sectionTitle(isMobile)}>
              You're putting time and money{" "}
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

          <div
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--accent)",
              padding: isMobile ? "1.75rem" : "2.5rem",
              borderRadius: "4px",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
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
                  fontSize: "1.1rem",
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
            <div style={{ height: 1, background: "var(--border)" }} />
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
                  fontSize: "1.1rem",
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
      </section>

      {/* ============================================================
    SECTION 4A — WHY IT HAPPENS (PSYCHOLOGY)
============================================================ */}
      <section
        style={{
          background: "var(--bg)",
          padding: `${sectionPy} ${px}`,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={eyebrow({})}>Why it happens</p>
          <h2 style={sectionTitle(isMobile)}>
            Your customer doesn't buy with their brain.
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#b5b0a8",
              fontWeight: 300,
              lineHeight: 1.8,
              marginBottom: "3rem",
              maxWidth: 620,
            }}
          >
            Most marketing is built for the logical mind — features,
            comparisons, price points. But buying decisions don't happen there.
            They happen faster, deeper, and mostly without the customer
            realising it. The marketing that wins isn't the most informative.
            It's the most felt.
          </p>

          {/* Single stat pull quote */}
          <div
            style={{
              borderLeft: "3px solid var(--accent)",
              paddingLeft: "2rem",
              marginBottom: "3rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.5rem, 8vw, 6rem)",
                color: "var(--accent)",
                lineHeight: 1,
                letterSpacing: "0.02em",
                marginBottom: "1rem",
              }}
            >
              95%
            </p>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--white)",
                lineHeight: 1.6,
                marginBottom: "0.75rem",
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                maxWidth: 480,
              }}
            >
              of purchase decisions happen before your customer consciously
              knows why.
            </p>
            <p
              style={{
                fontSize: "0.88rem",
                color: "var(--accent)",
                fontWeight: 400,
                lineHeight: 1.6,
                marginBottom: "1rem",
                maxWidth: 480,
                fontFamily: "var(--font-sans)",
              }}
            >
              Your ad copy is arguing with the wrong part of their brain.
            </p>
            <a
              href="https://www.library.hbs.edu/working-knowledge/the-subconscious-mind-of-the-consumer-and-how-to-reach-it"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.68rem",
                color: "rgba(255,255,255,0.25)",
                fontFamily: "var(--font-sans)",
                textDecoration: "none",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "2px",
              }}
            >
              Harvard Business School ↗
            </a>
          </div>

          <p style={{ ...hookLine }}>
            So the fix is a great copywriter, right?
          </p>
        </div>
      </section>

      {/* ============================================================
    SECTION 4B — PARTIAL SOLUTION 1: COPYWRITER
============================================================ */}
      <section
        style={{
          background: "var(--surface)",
          padding: `${sectionPy} ${px}`,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={eyebrow({})}>Partial solution — and why it's partial</p>
          <h2 style={sectionTitle(isMobile)}>
            A great copywriter changes everything.{" "}
            <em style={{ fontStyle: "normal", color: "var(--accent)" }}>
              For the people already on your site.
            </em>
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#b5b0a8",
              fontWeight: 300,
              lineHeight: 1.8,
              marginBottom: "2rem",
              maxWidth: 620,
            }}
          >
            A copywriter who truly understands consumer psychology — awareness
            levels, emotional state, what the customer was thinking before they
            landed — can turn a page that gets ignored into one that converts.
            That's real. That matters.
          </p>
          <p
            style={{
              fontSize: "1rem",
              color: "#b5b0a8",
              fontWeight: 300,
              lineHeight: 1.8,
              marginBottom: "3rem",
              maxWidth: 620,
            }}
          >
            But here's the problem nobody says out loud: a copywriter optimises
            for the person who's already there. They don't get people there in
            the first place. If nobody is finding your website, the best copy in
            the world converts zero visitors into zero customers. Beautifully.
          </p>

          <div
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--accent)",
              padding: isMobile ? "1.75rem" : "2.5rem",
              borderRadius: "4px",
              marginBottom: "3rem",
            }}
          >
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
              The real question
            </p>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.1rem",
                lineHeight: 1.65,
                color: "var(--white)",
                marginBottom: "0.75rem",
              }}
            >
              How does your customer find you in the first place?
            </p>
            <p
              style={{
                fontSize: "0.92rem",
                color: "rgba(232,228,220,0.65)",
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              They either stumble on you through social media — a post, a share,
              a recommendation. Or they go looking for something on Google and
              you show up. Or you don't. One of those two paths brought every
              customer you've ever had. And only one of them scales without you
              personally posting every day.
            </p>
          </div>

          <p style={{ ...hookLine }}>That's where SEO comes in</p>
        </div>
      </section>

      {/* ============================================================
    SECTION 4C — THE SEO PROBLEM
============================================================ */}
      <section
        style={{
          background: "var(--bg)",
          padding: `${sectionPy} ${px}`,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={eyebrow({})}>The traffic problem</p>
          <h2 style={sectionTitle(isMobile)}>
            SEO gets people to your site.{" "}
            <em style={{ fontStyle: "normal", color: "var(--accent)" }}>
              It doesn't make them stay.
            </em>
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#b5b0a8",
              fontWeight: 300,
              lineHeight: 1.8,
              marginBottom: "2rem",
              maxWidth: 620,
            }}
          >
            An SEO specialist knows how to make Google understand your website.
            Keywords, structure, backlinks, technical signals — the language of
            algorithms. Get this right and you show up when your customer is
            searching. That's not nothing. That's actually everything for
            sustainable growth.
          </p>
          <p
            style={{
              fontSize: "1rem",
              color: "#b5b0a8",
              fontWeight: 300,
              lineHeight: 1.8,
              marginBottom: "3rem",
              maxWidth: 620,
            }}
          >
            But an SEO specialist speaks the language of Google. Not the
            language of your customer. They'll optimise your page for search
            terms that rank. They won't optimise it for the person who just
            arrived carrying a specific frustration, a specific hope, and about
            eight seconds of patience. That's a copywriter's job. And most SEO
            people will tell you that themselves.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 1,
              background: "rgba(255,255,255,0.04)",
              marginBottom: "3rem",
            }}
          >
            {[
              {
                label: "What SEO optimises for",
                who: "Google",
                points: [
                  "Search volume and keyword intent",
                  "Page structure and technical signals",
                  "Backlinks and domain authority",
                  "Rankings on terms people search",
                  "Crawlability and site speed",
                ],
              },
              {
                label: "What copywriting optimises for",
                who: "Your customer",
                points: [
                  "The emotion the visitor arrives with",
                  "Their awareness of the problem",
                  "The exact words that make them feel seen",
                  "Trust built sentence by sentence",
                  "The moment they decide to act",
                ],
              },
            ].map((col, i) => (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  padding: isMobile ? "1.75rem 1.5rem" : "2rem",
                  borderTop: `2px solid ${i === 0 ? "rgba(184,240,60,0.4)" : "rgba(184,240,60,0.15)"}`,
                }}
              >
                <p
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    fontFamily: "var(--font-sans)",
                    marginBottom: "0.4rem",
                    opacity: 0.8,
                  }}
                >
                  {col.label}
                </p>
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-sans)",
                    marginBottom: "1.25rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  Speaks to:{" "}
                  <span style={{ color: "var(--accent)", opacity: 0.9 }}>
                    {col.who}
                  </span>
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {col.points.map((point, j) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--accent)",
                          fontSize: "0.65rem",
                          marginTop: "0.25rem",
                          opacity: 0.5,
                          flexShrink: 0,
                        }}
                      >
                        ◆
                      </span>
                      <p
                        style={{
                          fontSize: "0.88rem",
                          color: "var(--text-muted)",
                          lineHeight: 1.6,
                        }}
                      >
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p style={{ ...hookLine }}>So just hire both, right?</p>
        </div>
      </section>

      {/* ============================================================
    SECTION 4D — WHY HIRING ALL THREE IS YES AND NO
============================================================ */}
      <section
        style={{
          background: "var(--surface)",
          padding: `${sectionPy} ${px}`,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={eyebrow({})}>The obvious answer</p>
          <h2 style={sectionTitle(isMobile)}>
            Hire a strategist, a copywriter, and an SEO.{" "}
            <em style={{ fontStyle: "normal", color: "var(--accent)" }}>
              Yes. And no.
            </em>
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#b5b0a8",
              fontWeight: 300,
              lineHeight: 1.8,
              marginBottom: "3rem",
              maxWidth: 620,
            }}
          >
            Yes — because you do need all three things to happen. Strategy,
            copy, and search visibility are not optional. A business that has
            all three working well is genuinely hard to compete with. So hiring
            for all three is the right instinct.
          </p>

          {/* Single stat pull quote */}
          <div
            style={{
              borderLeft: "3px solid var(--accent)",
              paddingLeft: "2rem",
              marginBottom: "3rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.5rem, 8vw, 6rem)",
                color: "var(--accent)",
                lineHeight: 1,
                letterSpacing: "0.02em",
                marginBottom: "1rem",
              }}
            >
              85%
            </p>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--white)",
                lineHeight: 1.6,
                marginBottom: "0.75rem",
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                maxWidth: 480,
              }}
            >
              of businesses with separate marketing, sales, and strategy teams
              report regularly working toward different goals — even when they
              think they're aligned.
            </p>
            <p
              style={{
                fontSize: "0.88rem",
                color: "var(--accent)",
                fontWeight: 400,
                lineHeight: 1.6,
                marginBottom: "1rem",
                maxWidth: 480,
                fontFamily: "var(--font-sans)",
              }}
            >
              Three vendors. Three definitions of success. One budget taking the
              hit.
            </p>
            <a
              href="https://www.carriermanagement.com/news/2025/05/28/275682.htm"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.68rem",
                color: "rgba(255,255,255,0.25)",
                fontFamily: "var(--font-sans)",
                textDecoration: "none",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "2px",
              }}
            >
              Mural / The Martec Group, 2025 ↗
            </a>
          </div>

          <p
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontFamily: "var(--font-sans)",
              marginBottom: "1.5rem",
              opacity: 0.8,
            }}
          >
            But here's what actually happens
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              background: "rgba(255,255,255,0.04)",
              marginBottom: "3rem",
            }}
          >
            {[
              {
                problem: "Nobody owns the outcome",
                detail:
                  "When results don't come, the SEO says the copy isn't converting. The copywriter says the traffic is unqualified. Everyone is doing their job. Nobody is responsible for whether it works together.",
              },
              {
                problem: "SEO and copy pulling in opposite directions",
                detail:
                  "The SEO wants the headline to contain the keyword. The copywriter wants the headline to land emotionally. Without someone who understands both deeply, you compromise both. You rank adequately and convert poorly.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg)",
                  padding: isMobile ? "1.75rem 1.5rem" : "2rem 2.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.92rem",
                    fontWeight: 500,
                    color: "var(--white)",
                    marginBottom: "0.6rem",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {item.problem}
                </p>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "rgba(232,228,220,0.55)",
                    lineHeight: 1.75,
                    fontWeight: 300,
                  }}
                >
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <p style={{ ...hookLine }}>There is a better way</p>
        </div>
      </section>

      {/* ============================================================
    SECTION 4E — THE FOURTH WALL / PROOF CALLOUT
============================================================ */}
      <section
        style={{
          background: "var(--bg)",
          padding: isMobile ? "4rem 1.25rem" : "6rem 2.5rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontFamily: "var(--font-sans)",
              marginBottom: "2rem",
              opacity: 0.7,
            }}
          >
            A small observation
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: isMobile ? "1.3rem" : "1.7rem",
              lineHeight: 1.55,
              color: "var(--white)",
              marginBottom: "1.5rem",
            }}
          >
            If you've read this far, you didn't stumble here by accident.
          </p>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(232,228,220,0.55)",
              lineHeight: 1.8,
              fontWeight: 300,
              marginBottom: "1.5rem",
            }}
          >
            The copy on this page made you keep reading. That's not an accident
            — that's consumer psychology applied deliberately. Every section was
            written to speak to a specific feeling you already had before you
            arrived.
          </p>

          <div
            style={{
              display: "inline-block",
              border: "1px solid rgba(184,240,60,0.25)",
              borderLeft: "3px solid var(--accent)",
              padding: "1.25rem 2rem",
              borderRadius: "4px",
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontSize: "0.88rem",
                color: "rgba(232,228,220,0.6)",
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              The balance between SEO and copywriting — writing for Google and
              writing for humans at the same time — is something very few people
              know how to do well. I may not be the best in the world at it yet.{" "}
              <span style={{ color: "var(--text)", fontWeight: 400 }}>
                But I'm working towards it. And this page is the current
                evidence.
              </span>
            </p>
          </div>
        </div>
      </section>
      {/* ============================================================
          SECTION 5 — SERVICES
      ============================================================ */}

      <section
        style={{
          background: "var(--surface)",
          padding: `${sectionPy} ${px}`,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={eyebrow({})}>The solution</p>
          <h2 style={{ ...sectionTitle(isMobile), marginBottom: "0.75rem" }}>
            Stop buying pieces.{" "}
            <em style={{ fontStyle: "normal", color: "var(--accent)" }}>
              Own the whole system.
            </em>
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(232,228,220,0.5)",
              lineHeight: 1.85,
              marginBottom: "1.5rem",
              fontWeight: 300,
              maxWidth: 600,
            }}
          >
            The reason your marketing feels disconnected is because it is. You
            hired separate people for strategy, copy, and ads — and nobody is
            responsible for how it all fits together.
          </p>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(232,228,220,0.6)",
              lineHeight: 1.85,
              marginBottom: "3rem",
              fontWeight: 300,
              maxWidth: 600,
            }}
          >
            The fix isn't another vendor. It's one person who starts with who
            your customer actually is, what they feel, and what they need to
            hear — then builds everything from that foundation.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: "1.5rem",
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
                  e.currentTarget.style.borderTopColor = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderTopColor =
                    i === 0 ? "var(--accent)" : "rgba(184,240,60,0.2)";
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
            But why should you trust me to do this?
          </p>
        </div>
      </section>

      {/* ============================================================
    SECTION 6 — CASE STUDIES
============================================================ */}
      <section
        style={{
          background: "var(--bg)",
          padding: `${sectionPy} ${px}`,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={eyebrow({})}>Case studies</p>
          <h2 style={sectionTitle(isMobile)}>
            Two brands. Built from zero.{" "}
            <em style={{ fontStyle: "normal", color: "var(--accent)" }}>
              Different worlds, same approach.
            </em>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "2rem",
              marginTop: "3rem",
            }}
          >
            {/* TMCI */}
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
              {/* Screenshot */}
              <div
                style={{
                  height: 200,
                  overflow: "hidden",
                  position: "relative",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <img
                  src="https://res.cloudinary.com/dtu64orvo/image/upload/v1779869522/Screenshot_2026-05-27_at_1.39.11_PM_nvzshk.png"
                  alt="TMCI website — built and maintained by Sushanth P"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    display: "block",
                  }}
                />
                {/* Tag overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: "rgba(14,14,14,0.85)",
                    border: "1px solid var(--border)",
                    padding: "0.3rem 0.75rem",
                    borderRadius: "2px",
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#4a9eff",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  B2B Industrial
                </div>
                {/* Live site link */}
                <a
                  href="https://tmcitechnology.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    background: "rgba(14,14,14,0.85)",
                    border: "1px solid var(--border)",
                    padding: "0.3rem 0.75rem",
                    borderRadius: "2px",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(232,228,220,0.5)",
                    fontFamily: "var(--font-sans)",
                    textDecoration: "none",
                  }}
                >
                  Visit site ↗
                </a>
              </div>

              <div style={{ padding: "1.75rem" }}>
                <p
                  style={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "var(--white)",
                    marginBottom: "0.6rem",
                  }}
                >
                  TMCI — Bangalore - Based Manufacturer
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
                  engineers, not just procurement teams.
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
                    ["Full", "SEO + Ads"],
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
                          fontSize: "0.65rem",
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

            {/* EVER SWEET */}
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
              {/* Screenshot — portrait app, so we show it differently */}
              <div
                style={{
                  height: 200,
                  overflow: "hidden",
                  position: "relative",
                  borderBottom: "1px solid var(--border)",
                  background: "#0e0a05",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                {/* Phone mockup feel — centered portrait */}
                <div
                  style={{
                    height: 180,
                    width: 90,
                    border: "1.5px solid #2a2a2a",
                    borderRadius: "12px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1779869637/Screenshot_2026-05-27_at_1.43.31_PM_ryupmc.png"
                    alt="Ever Sweet ordering app — built by Sushanth P"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                      display: "block",
                    }}
                  />
                </div>
                {/* Second instance slightly offset for depth */}
                <div
                  style={{
                    height: 160,
                    width: 82,
                    border: "1.5px solid #1e1e1e",
                    borderRadius: "12px",
                    overflow: "hidden",
                    flexShrink: 0,
                    opacity: 0.5,
                    marginTop: 20,
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1779869637/Screenshot_2026-05-27_at_1.43.31_PM_ryupmc.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                      display: "block",
                    }}
                  />
                </div>
                {/* Tag overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: "rgba(14,14,14,0.85)",
                    border: "1px solid var(--border)",
                    padding: "0.3rem 0.75rem",
                    borderRadius: "2px",
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#f5a623",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  D2C Artisan Food
                </div>
              </div>

              <div style={{ padding: "1.75rem" }}>
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
                  one.
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
                    ["₹0", "Paid Spend"],
                    ["Day 1", "First Revenue"],
                    ["Organic", "100% Growth"],
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
                          fontSize: "0.65rem",
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
          SECTION 7 — ABOUT
      ============================================================ */}
      <section
        style={{
          background: "var(--surface)",
          padding: `${sectionPy} ${px}`,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1.5fr",
            gap: isMobile ? "3rem" : "5rem",
            alignItems: "start",
          }}
        >
          {/* Timeline */}
          <div>
            <p style={eyebrow({})}>The person behind it</p>
            <h2 style={sectionTitle(isMobile)}>
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
                  body: "At TMCI and Ever Sweet — doing all of it at once. SEO, paid ads, copy, design, development. Not as a generalist. As someone who sees how everything connects.",
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

          {/* Statement paragraphs */}
          <div>
            <div
              style={{
                borderLeft: "2px solid var(--accent)",
                paddingLeft: "2rem",
              }}
            >
              {[
                "Most specialists protect their corner. They do the thing they're good at and hand off everything else. You end up with a beautiful website that nobody visits, or an ad campaign driving traffic to a landing page that doesn't convert.",
                "loop",
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
    SECTION 8 — BLOG GATEWAY
============================================================ */}
      <section
        style={{
          background: "var(--bg)",
          padding: `${sectionPy} ${px}`,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={eyebrow({})}>From the blog</p>
          <h2 style={{ ...sectionTitle(isMobile), marginBottom: "0.5rem" }}>
            Marketing explained clearly.
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              color: "rgba(232,228,220,0.55)",
              marginBottom: "3rem",
              fontWeight: 300,
            }}
          >
            No frameworks. No fluff. Practical writing on brand messaging,
            consumer psychology, SEO, and ad strategy.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 1,
              background: "#2a2a2a",
            }}
          >
            {posts.map((b, i) => (
              <Link
                key={b.id}
                href={`/blog/${b.slug}`}
                style={{
                  background: "#1e1e1e",
                  padding: "1.75rem 1.5rem",
                  textDecoration: "none",
                  display: "block",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#252525";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1e1e1e";
                }}
              >
                {b.tag && (
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
                )}
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
          SECTION 9 — FINAL CTA
      ============================================================ */}
      <section
        style={{
          background: "var(--surface)",
          padding: isMobile ? "5rem 1.25rem" : "8rem 2.5rem",
          textAlign: "center",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <p style={eyebrow({ center: true })}>Let's build something</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: isMobile
                ? "clamp(2.8rem, 12vw, 4.5rem)"
                : "clamp(3rem, 7vw, 6rem)",
              lineHeight: 0.95,
              color: "var(--white)",
              marginBottom: "1.5rem",
              letterSpacing: "-0.01em",
            }}
          >
            The business is alive. <br />
            <span style={{ color: "var(--accent)" }}>
              Let's make it unstoppable.
            </span>
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
            href="mailto:sushanthp.careers@gmail.com"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: isMobile ? "1.1rem" : "1.4rem",
              letterSpacing: "0.06em",
              color: "var(--accent)",
              textDecoration: "none",
              borderBottom: "2px solid var(--accent)",
              paddingBottom: "4px",
              wordBreak: "break-all",
            }}
          >
            sushanthp.careers@gmail.com
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ================================================================
   SHARED STYLE HELPERS
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

// sectionTitle is now a function to support mobile font scaling
function sectionTitle(isMobile) {
  return {
    fontFamily: "var(--font-serif)",
    fontSize: isMobile
      ? "clamp(1.6rem, 7vw, 2.2rem)"
      : "clamp(1.8rem, 3.5vw, 3rem)",
    lineHeight: 1.15,
    color: "var(--white)",
    marginBottom: "1.5rem",
    fontWeight: 400,
  };
}

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
