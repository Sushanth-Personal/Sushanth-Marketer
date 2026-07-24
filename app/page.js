// app/page.js
"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

/* ── Scroll-reveal wrapper (restrained, not cinematic) ── */
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

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

const proofPoints = [
  { num: "100", label: "SEO Score", sub: "TMCI website rebuild" },
  { num: "59→95", label: "Performance", sub: "Lighthouse score jump" },
  { num: "75%", label: "Page weight cut", sub: "7,989 KiB → 1,974 KiB" },
  { num: "₹0", label: "Paid spend", sub: "Eversweet, first sale day 1" },
];

// Reels are now fetched from Supabase (see ReelCard + fetchReels below)

function ReelCard({ reel, delay, onOpen }) {
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (inView) {
      node.play().catch(() => {});
    } else {
      node.pause();
    }
  }, [inView]);

  return (
    <Reveal delay={delay}>
      <div
        onClick={() => onOpen(reel)}
        style={{
          position: "relative",
          aspectRatio: "9/16",
          borderRadius: 6,
          overflow: "hidden",
          border: "1px solid var(--border)",
          background: "#0a0a0a",
          cursor: "pointer",
        }}
      >
        <video
          ref={videoRef}
          src={reel.video_url}
          poster={reel.thumb_url || undefined}
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(14,14,14,0) 45%, rgba(14,14,14,0.9) 100%)",
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(14,14,14,0.7)",
            borderRadius: "50%",
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.7rem",
          }}
        >
          🔇
        </span>
        {reel.views && (
          <span
            style={{ ...statBadge, position: "absolute", top: 10, left: 10 }}
          >
            {reel.views} views
          </span>
        )}
        <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
          {reel.hook && (
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--white)",
                lineHeight: 1.4,
                marginBottom: reel.likes ? 4 : 0,
              }}
            >
              {reel.hook}
            </p>
          )}
          {reel.likes && (
            <p style={{ fontSize: "0.7rem", color: "var(--accent)" }}>
              ♥ {reel.likes}
            </p>
          )}
        </div>
      </div>
    </Reveal>
  );
}

function ReelModal({ reel, onClose }) {
  if (!reel) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(400px, 92vw)",
          aspectRatio: "9/16",
          borderRadius: 8,
          overflow: "hidden",
          background: "#0a0a0a",
        }}
      >
        <video
          src={reel.video_url}
          poster={reel.thumb_url || undefined}
          autoPlay
          controls
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(14,14,14,0.8)",
            color: "var(--white)",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
        {reel.instagram_url && (
          <a
            href={reel.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              right: 12,
              textAlign: "center",
              background: "rgba(14,14,14,0.75)",
              color: "var(--accent)",
              fontSize: "0.75rem",
              padding: "8px",
              borderRadius: 4,
              textDecoration: "none",
            }}
          >
            View on Instagram ↗
          </a>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const isMobile = useIsMobile();
  const px = isMobile ? "1.25rem" : "2.5rem";
  const sectionPy = isMobile ? "3.5rem" : "6rem";
  const [reels, setReels] = useState([]);
  const [activeReel, setActiveReel] = useState(null);

  useEffect(() => {
    async function fetchReels() {
      const { data } = await supabase
        .from("reels")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (data) setReels(data);
    }
    fetchReels();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* ============ HERO ============ */}
      <section
        style={{
          position: "relative",
          minHeight: isMobile ? "auto" : "92vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          paddingTop: 100,
          paddingBottom: isMobile ? "3rem" : 0,
          overflow: "hidden",
        }}
      >
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
            zIndex: 1,
          }}
        >
          SUSHANTH
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 5,
            maxWidth: 1100,
            margin: "0 auto",
            padding: `0 ${px}`,
            width: "100%",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr",
            gap: isMobile ? "2rem" : "3rem",
            alignItems: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "1.25rem",
                fontFamily: "var(--font-sans)",
              }}
            >
              Digital Marketing, open to full-time roles
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                lineHeight: 1.05,
                color: "var(--white)",
                marginBottom: "1.5rem",
                letterSpacing: "-0.01em",
              }}
            >
              SEO, paid ads, and content.{" "}
              <span style={{ color: "var(--accent)" }}>
                I run all three myself, end to end.
              </span>
            </h1>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "#b5b0a8",
                fontWeight: 300,
                maxWidth: 480,
                marginBottom: "2.25rem",
              }}
            >
              Currently running SEO, paid ads, and content strategy for TMCI
              Technology's dealer channel, and building the Instagram content
              system for a D2C brand from scratch. Live sites, real reels, and
              ad breakdowns below, not just a list of skills.
            </p>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="/Sushanth_P_Resume_BusinessDevelopment.pdf"
                download
                style={btnPrimary}
              >
                Download Resume ↓
              </a>
              <Link href="/teardowns" style={btnGhost}>
                See a teardown →
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "relative",
              height: isMobile ? 320 : 460,
            }}
          >
            <Image
              src="/photos/sushanth.png"
              alt="Sushanth P"
              fill
              style={{ objectFit: "contain", objectPosition: "center" }}
              priority
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at center, rgba(14,14,14,0) 55%, rgba(14,14,14,0.9) 100%)",
                pointerEvents: "none",
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* ============ PROOF STRIP ============ */}
      <section
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: `${isMobile ? "2rem" : "2.5rem"} ${px}`,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: isMobile ? "1.5rem" : "2rem",
          }}
        >
          {proofPoints.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.06}>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                    color: "var(--accent)",
                    letterSpacing: "0.02em",
                    lineHeight: 1,
                  }}
                >
                  {p.num}
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--white)",
                    marginTop: 6,
                    fontWeight: 500,
                  }}
                >
                  {p.label}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  {p.sub}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ WHAT I DO ============ */}
      <section
        style={{ padding: `${sectionPy} ${px}`, background: "var(--bg)" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <p style={eyebrow}>What I actually do</p>
            <h2 style={sectionTitle(isMobile)}>
              Strategy, copy, SEO, and the build itself.{" "}
              <em style={{ fontStyle: "normal", color: "var(--accent)" }}>
                One person, one accountable chain.
              </em>
            </h2>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: "1.5rem",
              marginTop: "2.5rem",
            }}
          >
            {[
              {
                title: "SEO & Website Builds",
                desc: "Next.js sites built from scratch, technical SEO, Core Web Vitals, schema markup.",
              },
              {
                title: "Conversion Copywriting",
                desc: "Buyer-awareness-driven copy for landing pages, ads, and email, grounded in the Schwartz framework.",
              },
              {
                title: "Paid & Organic Growth",
                desc: "Meta/Google Ads, organic content systems, and full-funnel strategy for B2B and D2C alike.",
              },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderTop: "2px solid var(--accent)",
                    borderRadius: 4,
                    padding: "1.75rem",
                    height: "100%",
                  }}
                >
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "var(--white)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {s.title}
                  </p>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.65,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PROOF: TMCI + EVERSWEET ============ */}
      <section
        style={{
          padding: `${sectionPy} ${px}`,
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <p style={eyebrow}>Proof, not claims</p>
            <h2 style={sectionTitle(isMobile)}>
              Two brands. Built solo, start to finish.
            </h2>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "2rem",
              marginTop: "2.5rem",
            }}
          >
            <Reveal delay={0.05}>
              <div
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div style={{ height: 200, position: "relative" }}>
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1779869522/Screenshot_2026-05-27_at_1.39.11_PM_nvzshk.png"
                    alt="TMCI website"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                    }}
                  />
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: "var(--white)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    TMCI Technology, website rebuild
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                      marginBottom: "1rem",
                    }}
                  >
                    Rebuilt from scratch in Next.js. SEO score to 100,
                    performance 59 → 95, page weight cut 75%. Came in under a
                    Rs.1 lakh agency quote.
                  </p>
                  <a
                    href="https://tmcitechnology.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--accent)",
                      textDecoration: "none",
                    }}
                  >
                    Visit live site ↗
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: 200,
                    position: "relative",
                    background: "#0e0a05",
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1779869637/Screenshot_2026-05-27_at_1.43.31_PM_ryupmc.png"
                    alt="Eversweet"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                    }}
                  />
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: "var(--white)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Eversweet, D2C content & ads
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                      marginBottom: "1rem",
                    }}
                  >
                    Reels, brand identity, and ad copy for a bootstrapped Kochi
                    mochi brand. Schwartz-framework Instagram ads at Rs.3.2
                    cost-per-message.
                  </p>
                  <a
                    href="https://instagram.com/eversweet.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--accent)",
                      textDecoration: "none",
                    }}
                  >
                    See the reels ↗
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ REELS ============ */}
      <section
        style={{ padding: `${sectionPy} ${px}`, background: "var(--bg)" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <p style={eyebrow}>Content, live</p>
            <h2 style={sectionTitle(isMobile)}>
              Reels I write, shoot, and post for Eversweet.
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                marginTop: "0.75rem",
                maxWidth: 560,
              }}
            >
              No agency, no editor, no ad spend. Concept, hook, shoot, and
              caption, all mine.
            </p>
          </Reveal>

          {reels.length === 0 ? (
            <p
              style={{
                marginTop: "2rem",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                fontStyle: "italic",
              }}
            >
              Reels loading, or none published yet in the admin panel.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2, 1fr)"
                  : "repeat(4, 1fr)",
                gap: isMobile ? "0.75rem" : "1.25rem",
                marginTop: "2.5rem",
              }}
            >
              {reels.map((r, i) => (
                <ReelCard
                  key={r.id}
                  reel={r}
                  delay={i * 0.06}
                  onOpen={setActiveReel}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <a
              href="https://instagram.com/eversweet.in"
              target="_blank"
              rel="noopener noreferrer"
              style={btnGhost}
            >
              See all reels on Instagram →
            </a>
          </div>
        </div>
      </section>

      {/* ============ TEARDOWNS TEASER ============ */}
      <section
        style={{ padding: `${sectionPy} ${px}`, background: "var(--bg)" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "center",
                gap: "1.5rem",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: "3px solid var(--accent)",
                borderRadius: 4,
                padding: isMobile ? "1.75rem" : "2.5rem",
              }}
            >
              <div>
                <p style={eyebrow}>Teardowns</p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.3rem",
                    color: "var(--white)",
                    marginBottom: "0.5rem",
                  }}
                >
                  I break down real ads, line by line.
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    maxWidth: 480,
                  }}
                >
                  See exactly how I think about hooks, copy, and conversion,
                  applied to real Instagram ads.
                </p>
              </div>
              <Link href="/teardowns" style={btnPrimary}>
                View Teardowns →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section
        style={{
          background: "var(--surface)",
          padding: isMobile ? "4rem 1.25rem" : "6rem 2.5rem",
          textAlign: "center",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <Reveal>
            <p style={eyebrow}>Let's talk</p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: isMobile
                  ? "clamp(2rem, 9vw, 3rem)"
                  : "clamp(2.5rem, 5vw, 3.5rem)",
                lineHeight: 1.05,
                color: "var(--white)",
                marginBottom: "1.5rem",
              }}
            >
              Looking for a marketing hire
              <br />
              <span style={{ color: "var(--accent)" }}>
                who ships, not just strategizes?
              </span>
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--text-muted)",
                marginBottom: "2.5rem",
              }}
            >
              Resume, portfolio, and a direct line, no forms.
            </p>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="/Sushanth_P_Resume_BusinessDevelopment.pdf"
                download
                style={btnPrimary}
              >
                Download Resume ↓
              </a>
              <a href="mailto:sushanthp.careers@gmail.com" style={btnGhost}>
                sushanthp.careers@gmail.com
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <ReelModal reel={activeReel} onClose={() => setActiveReel(null)} />
      <Footer />
    </div>
  );
}

const eyebrow = {
  fontSize: "0.72rem",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "var(--accent)",
  marginBottom: "1.2rem",
  fontFamily: "var(--font-sans)",
};

function sectionTitle(isMobile) {
  return {
    fontFamily: "var(--font-serif)",
    fontSize: isMobile
      ? "clamp(1.6rem, 7vw, 2.2rem)"
      : "clamp(1.8rem, 3.5vw, 2.6rem)",
    lineHeight: 1.2,
    color: "var(--white)",
    fontWeight: 400,
    maxWidth: 640,
  };
}

const btnPrimary = {
  background: "var(--accent)",
  color: "#0e0e0e",
  padding: "0.9rem 2rem",
  borderRadius: 4,
  fontWeight: 500,
  fontSize: "0.88rem",
  textDecoration: "none",
  letterSpacing: "0.04em",
  display: "inline-block",
  whiteSpace: "nowrap",
};

const btnGhost = {
  color: "var(--text-muted)",
  fontSize: "0.88rem",
  textDecoration: "none",
  letterSpacing: "0.04em",
  borderBottom: "1px solid var(--border)",
  paddingBottom: 2,
  whiteSpace: "nowrap",
};

const statBadge = {
  background: "rgba(14,14,14,0.75)",
  color: "var(--accent)",
  fontSize: "0.62rem",
  fontWeight: 500,
  padding: "2px 8px",
  borderRadius: 20,
  letterSpacing: "0.02em",
};
