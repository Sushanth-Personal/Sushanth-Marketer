"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navSettings, setNavSettings] = useState({
    blog: true,
    pricing: false,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "nav");
      if (data && data[0]) {
        try {
          setNavSettings(JSON.parse(data[0].value));
        } catch {}
      }
    }
    fetchSettings();
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    ...(navSettings.blog ? [{ href: "/blog", label: "Blog" }] : []),
    ...(navSettings.pricing ? [{ href: "/pricing", label: "Pricing" }] : []),
  ];

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          background:
            scrolled || menuOpen ? "rgba(14,14,14,0.98)" : "rgba(14,14,14,0.7)",
          borderBottom: "1px solid #2a2a2a",
          backdropFilter: "blur(12px)",
          transition: "background 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{ textDecoration: "none" }}
            onClick={() => setMenuOpen(false)}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.4rem",
                letterSpacing: "0.08em",
                color: "var(--accent)",
              }}
            >
              SP
            </span>
          </Link>

          {/* Desktop nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 36,
            }}
            className="desktop-nav"
          >
            <div style={{ display: "flex", gap: 32 }}>
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} style={navLink}>
                  {l.label}
                </Link>
              ))}
            </div>
            <a href="mailto:hello@sushanthp.com" style={ctaStyle}>
              Let's Talk
            </a>
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              color: "var(--text)",
            }}
            className="hamburger-btn"
          >
            {menuOpen ? (
              /* X */
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <line
                  x1="4"
                  y1="4"
                  x2="18"
                  y2="18"
                  stroke="var(--text)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="18"
                  y1="4"
                  x2="4"
                  y2="18"
                  stroke="var(--text)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              /* Hamburger */
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <line
                  x1="3"
                  y1="6"
                  x2="19"
                  y2="6"
                  stroke="var(--text)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="3"
                  y1="11"
                  x2="19"
                  y2="11"
                  stroke="var(--text)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="3"
                  y1="16"
                  x2="19"
                  y2="16"
                  stroke="var(--text)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div
            style={{
              borderTop: "1px solid var(--border)",
              padding: "1.5rem 1.25rem 2rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: "var(--text)",
                  fontSize: "1.15rem",
                  fontFamily: "var(--font-sans)",
                  textDecoration: "none",
                  padding: "0.85rem 0",
                  borderBottom: "1px solid var(--border)",
                  letterSpacing: "0.02em",
                  display: "block",
                }}
              >
                {l.label}
              </Link>
            ))}
            <a
              href="mailto:hello@sushanthp.com"
              onClick={() => setMenuOpen(false)}
              style={{
                marginTop: "1.25rem",
                background: "var(--accent)",
                color: "#0e0e0e",
                padding: "1rem",
                borderRadius: "4px",
                fontSize: "0.88rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                textAlign: "center",
                display: "block",
              }}
            >
              Let's Talk →
            </a>
          </div>
        )}
      </nav>

      {/* Responsive styles injected as a style tag */}
      <style>{`
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}

const navLink = {
  color: "#7a7570",
  fontSize: "0.8rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  textDecoration: "none",
  fontFamily: "var(--font-sans)",
};

const ctaStyle = {
  background: "var(--accent)",
  color: "#0e0e0e",
  padding: "0.5rem 1.2rem",
  borderRadius: "4px",
  fontSize: "0.78rem",
  fontWeight: 500,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  textDecoration: "none",
  fontFamily: "var(--font-sans)",
};
