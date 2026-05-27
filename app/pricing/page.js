import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Pricing — Sushanth P",
  description: "Transparent pricing for marketing strategy and copywriting.",
};

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <section style={{ background: "var(--dark)", padding: "80px 32px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <p
              style={{
                fontSize: 11,
                color: "var(--amber)",
                letterSpacing: 3,
                textTransform: "uppercase",
                fontFamily: "var(--font-sans)",
                marginBottom: 20,
              }}
            >
              Pricing
            </p>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 400,
                color: "var(--text-light)",
                lineHeight: 1.15,
              }}
            >
              Straightforward.
              <br />
              <span style={{ color: "var(--amber)" }}>No surprises.</span>
            </h1>
          </div>
        </section>

        <section style={{ padding: "80px 32px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 1,
                background: "var(--border-light)",
              }}
            >
              {[
                {
                  name: "Marketing Audit",
                  price: "$299",
                  desc: "A full review of your current marketing. What's working, what's not, and exactly what to fix first.",
                  includes: [
                    "Full funnel review",
                    "Messaging analysis",
                    "Written report + recommendations",
                    "1 hour call",
                  ],
                },
                {
                  name: "Brand Messaging",
                  price: "$799",
                  desc: "Your complete messaging foundation — who you're for, what you say, and how you say it.",
                  includes: [
                    "Customer insight work",
                    "Core messaging document",
                    "Taglines + headline variants",
                    "Positioning statement",
                  ],
                },
                {
                  name: "Done-With-You Strategy",
                  price: "$1,499",
                  desc: "Monthly engagement. I work alongside you to build and refine your marketing strategy.",
                  includes: [
                    "Weekly 1:1 calls",
                    "Copy reviews",
                    "Campaign strategy",
                    "Ongoing messaging support",
                  ],
                },
              ].map((plan, i) => (
                <div
                  key={i}
                  style={{
                    background: i === 1 ? "var(--dark)" : "var(--cream-2)",
                    padding: "40px 28px",
                  }}
                >
                  {i === 1 && (
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--amber)",
                        letterSpacing: 2,
                        fontFamily: "var(--font-sans)",
                        marginBottom: 12,
                      }}
                    >
                      MOST POPULAR
                    </p>
                  )}
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 20,
                      color:
                        i === 1 ? "var(--text-light)" : "var(--text-primary)",
                      marginBottom: 8,
                    }}
                  >
                    {plan.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 36,
                      color: "var(--amber)",
                      marginBottom: 16,
                    }}
                  >
                    {plan.price}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color:
                        i === 1
                          ? "var(--text-light-muted)"
                          : "var(--text-muted)",
                      lineHeight: 1.7,
                      marginBottom: 24,
                    }}
                  >
                    {plan.desc}
                  </p>
                  <ul
                    style={{ listStyle: "none", padding: 0, marginBottom: 32 }}
                  >
                    {plan.includes.map((item, j) => (
                      <li
                        key={j}
                        style={{
                          fontSize: 13,
                          color:
                            i === 1
                              ? "var(--text-light-muted)"
                              : "var(--text-secondary)",
                          padding: "6px 0",
                          borderBottom: `1px solid ${i === 1 ? "#2A2A26" : "var(--border-light)"}`,
                          display: "flex",
                          gap: 10,
                        }}
                      >
                        <span style={{ color: "var(--amber)" }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="mailto:sushanthp.careers@gmail.com"
                    style={{
                      background: i === 1 ? "var(--amber)" : "transparent",
                      color: i === 1 ? "var(--dark)" : "var(--text-primary)",
                      border:
                        i === 1 ? "none" : "1px solid var(--border-light)",
                      padding: "12px 24px",
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      fontFamily: "var(--font-sans)",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    Get Started →
                  </a>
                </div>
              ))}
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                textAlign: "center",
                marginTop: 40,
                fontStyle: "italic",
                fontFamily: "var(--font-serif)",
              }}
            >
              Not sure which is right?{" "}
              <a
                href="mailto:sushanthp.careers@gmail.com"
                style={{ color: "var(--amber)", textDecoration: "none" }}
              >
                Send me a message
              </a>{" "}
              and we'll figure it out.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
