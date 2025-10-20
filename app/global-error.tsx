"use client";

import React from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  return (
    <html>
      <body>
        <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Something went wrong</h2>
          {process.env.NODE_ENV !== "production" && (
            <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8, whiteSpace: "pre-wrap" }}>
              {error?.message || "Unknown error"}
            </pre>
          )}
          <button
            onClick={() => reset()}
            style={{
              marginTop: 12,
              padding: "8px 12px",
              borderRadius: 8,
              background: "#111827",
              color: "white",
              border: "1px solid #1f2937",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}


