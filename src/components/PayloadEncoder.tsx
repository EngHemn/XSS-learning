"use client";

import { useState } from "react";
import { Code, ArrowRightLeft, Copy, Check, Sparkles, RefreshCw } from "lucide-react";

export default function PayloadEncoder() {
  const [input, setInput] = useState<string>("<script>alert('XSS')</script>");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Transformations
  const urlEncoded = encodeURIComponent(input);
  const doubleUrlEncoded = encodeURIComponent(urlEncoded);
  const base64Encoded = typeof window !== "undefined" ? btoa(input) : "";
  const htmlEntities = input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  
  const hexEncoded = input
    .split("")
    .map((c) => "\\x" + c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");

  const charCodeEncoded = `String.fromCharCode(${input
    .split("")
    .map((c) => c.charCodeAt(0))
    .join(",")})`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const samplePayloads = [
    { label: "Classic Script Tag", val: "<script>alert(1)</script>" },
    { label: "Image OnError", val: "<img src=x onerror=alert('XSS')>" },
    { label: "SVG OnLoad", val: "<svg onload=alert(document.domain)>" },
    { label: "JavaScript URI", val: "javascript:alert(document.cookie)" },
    { label: "Body OnLoad", val: "<body onload=alert('Pwned')>" },
  ];

  return (
    <div className="glass-panel" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "rgba(6, 182, 212, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-cyan)"
          }}>
            <ArrowRightLeft size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem", margin: 0, color: "#fff" }}>Interactive Payload Encoder & Inspector</h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
              Convert, inspect, and understand how browsers and filters interpret encoded payloads.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.4rem" }}>
          {samplePayloads.map((p) => (
            <button
              key={p.label}
              onClick={() => setInput(p.val)}
              className="btn btn-outline btn-sm"
              style={{ fontSize: "0.72rem", padding: "0.25rem 0.5rem" }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontWeight: 600 }}>
          Raw Injection Input:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          className="input-field input-field-mono"
          placeholder="Type or paste an injection payload here..."
          style={{ width: "100%", resize: "vertical" }}
        />
      </div>

      {/* Grid of Encodings */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        {/* HTML Entities */}
        <div className="code-box">
          <div className="code-box-header">
            <span style={{ color: "var(--accent-emerald)", fontWeight: 600 }}>HTML Entity Encoded (Safe for Body)</span>
            <button
              onClick={() => copyToClipboard(htmlEntities, "html")}
              style={{ background: "none", border: "none", color: copiedKey === "html" ? "var(--accent-emerald)" : "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              {copiedKey === "html" ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedKey === "html" ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <div style={{ color: "#34d399", wordBreak: "break-all" }}>{htmlEntities}</div>
        </div>

        {/* URL Encoding */}
        <div className="code-box">
          <div className="code-box-header">
            <span style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>URL Encoded (Query Parameters)</span>
            <button
              onClick={() => copyToClipboard(urlEncoded, "url")}
              style={{ background: "none", border: "none", color: copiedKey === "url" ? "var(--accent-emerald)" : "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              {copiedKey === "url" ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedKey === "url" ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <div style={{ color: "#38bdf8", wordBreak: "break-all" }}>{urlEncoded}</div>
        </div>

        {/* Double URL Encoding */}
        <div className="code-box">
          <div className="code-box-header">
            <span style={{ color: "var(--accent-amber)", fontWeight: 600 }}>Double URL Encoded (Filter Bypasses)</span>
            <button
              onClick={() => copyToClipboard(doubleUrlEncoded, "double_url")}
              style={{ background: "none", border: "none", color: copiedKey === "double_url" ? "var(--accent-emerald)" : "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              {copiedKey === "double_url" ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedKey === "double_url" ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <div style={{ color: "#fbbf24", wordBreak: "break-all" }}>{doubleUrlEncoded}</div>
        </div>

        {/* Base64 */}
        <div className="code-box">
          <div className="code-box-header">
            <span style={{ color: "var(--accent-violet)", fontWeight: 600 }}>Base64 Encoded (eval(atob(...)))</span>
            <button
              onClick={() => copyToClipboard(base64Encoded, "base64")}
              style={{ background: "none", border: "none", color: copiedKey === "base64" ? "var(--accent-emerald)" : "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              {copiedKey === "base64" ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedKey === "base64" ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <div style={{ color: "#a78bfa", wordBreak: "break-all" }}>{base64Encoded || "N/A"}</div>
        </div>

        {/* Hex Escaped */}
        <div className="code-box">
          <div className="code-box-header">
            <span style={{ color: "#fb7185", fontWeight: 600 }}>Hex Escaped (JS Strings)</span>
            <button
              onClick={() => copyToClipboard(hexEncoded, "hex")}
              style={{ background: "none", border: "none", color: copiedKey === "hex" ? "var(--accent-emerald)" : "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              {copiedKey === "hex" ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedKey === "hex" ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <div style={{ color: "#fb7185", wordBreak: "break-all" }}>{hexEncoded}</div>
        </div>

        {/* String.fromCharCode */}
        <div className="code-box">
          <div className="code-box-header">
            <span style={{ color: "#60a5fa", fontWeight: 600 }}>String.fromCharCode (WAF Bypass)</span>
            <button
              onClick={() => copyToClipboard(charCodeEncoded, "char_code")}
              style={{ background: "none", border: "none", color: copiedKey === "char_code" ? "var(--accent-emerald)" : "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              {copiedKey === "char_code" ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedKey === "char_code" ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <div style={{ color: "#60a5fa", wordBreak: "break-all" }}>{charCodeEncoded}</div>
        </div>
      </div>
    </div>
  );
}
