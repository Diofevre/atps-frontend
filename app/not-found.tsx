import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Page not found</h2>
      <p style={{ color: "#6b7280", marginBottom: 12 }}>The page you are looking for does not exist.</p>
      <Link href="/" style={{ color: "#111827", textDecoration: "underline" }}>Go back home</Link>
    </div>
  );
}