// app/teardowns/page.js
"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata_note = "Set real metadata in a server layout if needed";

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const VERDICT_COLORS = {
  works: "#4a9eff",
  fix: "#e05555",
  neutral: "#9a9690",
};

function Tag({ type, children }) {
  const color = VERDICT_COLORS[type] || VERDICT_COLORS.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: "0.68rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color,
        border: `1px solid ${color}`,
        borderRadius: 20,
        padding: "3px 10px",
        fontFamily: "var(--font-sans)",
      }}
    >
      {children}
    </span>
  );
}

const sampleTeardown = {
  tag: "Instagram Ad",
  title: "A D2C skincare ad that hooks well, then loses the sale on slide 3",
  brand: "Sample teardown, brand anonymised",
  summary:
    "This carousel ad gets the scroll-stopping hook right, but the offer gets buried under feature-speak exactly when the viewer is deciding whether to tap through.",
  rows: [
    {
      part: "Slide 1, the hook",
      verdict: "works",
      note: "Opens with a specific before/after claim tied to a felt frustration (\"dull skin by 2pm\"), not a generic product shot. This earns the second slide.",
    },
    {
      part: "Slide 2, the mechanism",
      verdict: "works",
      note: "Explains why it works in one line instead of a full ingredient lecture. Respects the 3-second attention budget.",
    },
    {
      part: "Slide 3, the offer",
      verdict: "fix",
      note: "Switches to listing five ingredients and a certification badge. This is where awareness-stage mismatch kills it: the viewer was feeling something, now they're being asked to evaluate a spec sheet.",
    },
    {
      part: "CTA copy",
      verdict: "fix",
      note: "\"Learn More\" is a low-commitment, low-clarity CTA. It doesn't tell the viewer what happens next or why now.",
    },
    {
      part: "Social proof placement",
      verdict: "neutral",
      note: "A review quote appears on slide 4, after the offer. Moving it to slide 3, replacing the ingredient list, would carry more persuasive weight at that exact decision point.",
    },
  ],
  fix: "Keep slides 1 and 2 as-is. Replace slide 3's ingredient list with the review quote from slide 4, and change the CTA to something that names the specific outcome: \"See your first week's results\" instead of \"Learn More.\"",
};

export default function TeardownsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <section style={{ padding: "5rem 2.5rem 3rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
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
              Teardowns
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                lineHeight: 1.1,
                color: "var(--white)",
                marginBottom: "1rem",
              }}
            >
              Real ads. Line by line.
            </h1>
            <p style={{ fontSize: "1rem", color: "var(--text-muted)", maxWidth: 560, lineHeight: 1.7 }}>
              No frameworks recited, no vague "great copy!" praise. Just what's
              actually working in a real ad, what isn't, and the specific fix.
            </p>
          </div>
        </section>

        <section style={{ padding: "3rem 2.5rem 6rem" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <Reveal>
              <article
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div style={{ padding: "2rem 2rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {sampleTeardown.tag}
                  </p>
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.5rem",
                      color: "var(--white)",
                      lineHeight: 1.35,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {sampleTeardown.title}
                  </h2>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {sampleTeardown.brand}
                  </p>
                </div>

                {/* Summary */}
                <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--border)" }}>
                  <p style={{ fontSize: "0.95rem", color: "#b5b0a8", lineHeight: 1.75, fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
                    {sampleTeardown.summary}
                  </p>
                </div>

                {/* Row-by-row breakdown */}
                <div>
                  {sampleTeardown.rows.map((row, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "1.5rem 2rem",
                        borderBottom: i < sampleTeardown.rows.length - 1 ? "1px solid var(--border)" : "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <p style={{ fontSize: "0.92rem", fontWeight: 500, color: "var(--white)" }}>
                          {row.part}
                        </p>
                        <Tag type={row.verdict}>
                          {row.verdict === "works" ? "Works" : row.verdict === "fix" ? "Fix this" : "Worth testing"}
                        </Tag>
                      </div>
                      <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
                        {row.note}
                      </p>
                    </div>
                  ))}
                </div>

                {/* The fix */}
                <div
                  style={{
                    padding: "1.75rem 2rem",
                    background: "rgba(184,240,60,0.04)",
                    borderTop: "2px solid var(--accent)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    The specific fix
                  </p>
                  <p style={{ fontSize: "0.92rem", color: "#e8e4dc", lineHeight: 1.75 }}>
                    {sampleTeardown.fix}
                  </p>
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.1}>
              <div style={{ textAlign: "center", marginTop: "3rem" }}>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                  Want your own ad or landing page torn down like this?
                </p>
                <a
                  href="mailto:sushanthp.careers@gmail.com"
                  style={{
                    background: "var(--accent)",
                    color: "#0e0e0e",
                    padding: "0.9rem 2rem",
                    borderRadius: 4,
                    fontWeight: 500,
                    fontSize: "0.88rem",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Send me a link →
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}