import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
        padding: "2rem 2.5rem",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            Bangalore / Kochi — Open to remote
          </p>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link href="/blog" style={footerLink}>
            Blog
          </Link>
          <a href="mailto:hello@sushanthp.com" style={footerLink}>
            Contact
          </a>
          <span
            style={{
              fontSize: "0.72rem",
              color: "#333",
              fontFamily: "var(--font-sans)",
            }}
          >
            © 2026 sushanthp.com
          </span>
        </div>
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
