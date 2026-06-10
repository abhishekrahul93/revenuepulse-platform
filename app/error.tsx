"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Something went wrong!</h2>
        <button
          onClick={() => reset()}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
