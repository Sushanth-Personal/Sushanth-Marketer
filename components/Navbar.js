"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [navSettings, setNavSettings] = useState({
    blog: true,
    pricing: false,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(14,14,14,0.95)" : "rgba(14,14,14,0.7)",
        borderBottom: "1px solid #2a2a2a",
        backdropFilter: "blur(12px)",
        transition: "background 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
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

        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <div style={{ display: "flex", gap: 32 }}>
            <Link href="/" style={navLink}>
              Home
            </Link>
            {navSettings.blog && (
              <Link href="/blog" style={navLink}>
                Blog
              </Link>
            )}
            {navSettings.pricing && (
              <Link href="/pricing" style={navLink}>
                Pricing
              </Link>
            )}
          </div>
          <a href="mailto:hello@sushanthp.com" style={ctaStyle}>
            Let's Talk
          </a>
        </div>
      </div>
    </nav>
  );
}

const navLink = {
  color: "#7a7570",
  fontSize: "0.8rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  textDecoration: "none",
  fontFamily: "var(--font-sans)",
  transition: "color 0.2s",
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
