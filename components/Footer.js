import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
        padding: "2rem 1.25rem",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.2rem",
                letterSpacing: "0.08em",
                color: "var(--accent)",
              }}
            >
              SP
            </span>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginTop: 6,
                letterSpacing: "0.05em",
                fontFamily: "var(--font-sans)",
              }}
            >
              / — Open to remote
            </p>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <Link href="/blog" style={footerLink}>
              Blog
            </Link>
            <a href="mailto:sushanthp.careers@gmail.com" style={footerLink}>
              Contact
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <p
          style={{
            fontSize: "0.72rem",
            color: "#333",
            fontFamily: "var(--font-sans)",
            borderTop: "1px solid var(--border)",
            paddingTop: 16,
          }}
        >
          © 2026 sushanthp.com
        </p>
      </div>
    </footer>
  );
}

const footerLink = {
  fontSize: "0.72rem",
  color: "#444",
  letterSpacing: "0.1em",
  textDecoration: "none",
  fontFamily: "var(--font-sans)",
  textTransform: "uppercase",
};
