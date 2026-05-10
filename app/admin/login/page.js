"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = "/admin";
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--dark)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 360,
          background: "var(--dark-2)",
          border: "1px solid var(--border-dark)",
          padding: "48px 40px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 22,
            color: "var(--text-light)",
            marginBottom: 8,
          }}
        >
          Admin
        </p>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-light-muted)",
            marginBottom: 36,
            fontFamily: "var(--font-sans)",
          }}
        >
          sushanthp.com
        </p>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              background: "var(--dark)",
              border: "1px solid var(--border-dark)",
              color: "var(--text-light)",
              padding: "12px 16px",
              fontSize: 15,
              fontFamily: "var(--font-sans)",
              marginBottom: 16,
              outline: "none",
            }}
          />
          {error && (
            <p
              style={{
                fontSize: 13,
                color: "#E05555",
                marginBottom: 12,
                fontFamily: "var(--font-sans)",
              }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "var(--amber)",
              color: "var(--dark)",
              padding: "12px",
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Checking..." : "Enter →"}
          </button>
        </form>
      </div>
    </div>
  );
}
