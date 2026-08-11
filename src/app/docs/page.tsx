"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Shield,
  ShieldCheck,
  Code2,
  Terminal,
  AlertTriangle,
  Layers,
  FileCode,
  Lock,
  Zap,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Server,
  RefreshCw,
} from "lucide-react";
import PayloadEncoder from "@/components/PayloadEncoder";

export default function DocsPage() {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const topics = [
    { id: "what-is-xss", title: "1. What is Cross-Site Scripting (XSS)?" },
    { id: "reflected-xss", title: "2. Reflected XSS (Type 1)" },
    { id: "stored-xss", title: "3. Stored XSS (Type 2 / Persistent)" },
    { id: "dom-xss", title: "4. DOM-Based XSS (Type 0)" },
    { id: "mutation-xss", title: "5. Mutation & Advanced XSS" },
    { id: "contexts", title: "6. Injection Contexts & Breaking Rules" },
    { id: "encoder-tool", title: "7. Interactive Payload Encoder & Tool" },
    { id: "defenses", title: "8. Modern Defenses & Mitigation" },
    { id: "csp-guide", title: "9. Content Security Policy (CSP) Blueprint" },
  ];

  return (
    <div className="container" style={{ padding: "3rem 1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "2.5rem", alignItems: "start" }}>
        {/* Sticky Table of Contents Sidebar */}
        <aside style={{
          position: "sticky",
          top: "90px",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}>
          <div className="glass-panel" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <BookOpen size={16} color="var(--accent-emerald)" />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Doc Modules
              </span>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.82rem" }}>
              {topics.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  style={{
                    color: "var(--text-secondary)",
                    padding: "0.35rem 0.5rem",
                    borderRadius: "4px",
                    transition: "all 0.2s ease",
                    display: "block",
                  }}
                  className="hover:bg-slate-800 hover:text-white"
                >
                  {t.title}
                </a>
              ))}
            </nav>
          </div>

          <div className="glass-panel" style={{ padding: "1.25rem", textAlign: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
              Ready to test hands-on?
            </span>
            <Link href="/test" className="btn btn-primary btn-sm" style={{ width: "100%" }}>
              <Terminal size={14} />
              <span>Launch Test Lab</span>
            </Link>
          </div>
        </aside>

        {/* Documentation Content Area */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {/* Header */}
          <div>
            <div className="badge badge-emerald" style={{ marginBottom: "0.75rem" }}>
              Comprehensive Security Reference
            </div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Cross-Site Scripting (XSS) Handbook</h1>
            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)" }}>
              The authoritative guide to understanding, identifying, executing in sandboxes, and completely mitigating XSS vulnerabilities in modern web applications.
            </p>
          </div>

          {/* 1. What is XSS? */}
          <section id="what-is-xss" className="glass-panel" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.6rem", marginBottom: "1rem", color: "#fff" }}>
              1. What is Cross-Site Scripting (XSS)?
            </h2>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Cross-Site Scripting (XSS)</strong> is a code injection vulnerability where an attacker injects malicious client-side scripts (typically JavaScript) into web pages viewed by other users.
            </p>
            <p style={{ marginBottom: "1.25rem" }}>
              When a web application takes untrusted data from an HTTP request or client source and renders it into the Document Object Model (DOM) without proper contextual encoding or sanitization, the browser cannot distinguish between legitimate application code and injected malicious payload.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              margin: "1.5rem 0"
            }}>
              <div style={{ background: "rgba(2, 6, 23, 0.7)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <h4 style={{ color: "var(--accent-rose)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Session Hijacking</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                  Stealing unhardened authentication cookies via <code>document.cookie</code> or JWT tokens in <code>localStorage</code>.
                </p>
              </div>

              <div style={{ background: "rgba(2, 6, 23, 0.7)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <h4 style={{ color: "var(--accent-amber)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Virtual Defacement</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                  Injecting fake login forms, manipulating DOM content, or displaying fraudulent financial alerts to users.
                </p>
              </div>

              <div style={{ background: "rgba(2, 6, 23, 0.7)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <h4 style={{ color: "var(--accent-cyan)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Keystroke Logging</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                  Hooking input event listeners on password fields and credit card forms to exfiltrate keystrokes in real time.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Reflected XSS */}
          <section id="reflected-xss" className="glass-panel" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.6rem", color: "#fff", margin: 0 }}>2. Reflected XSS (Non-Persistent)</h2>
              <span className="badge badge-amber">Type 1 Vulnerability</span>
            </div>
            <p style={{ marginBottom: "1rem" }}>
              Reflected XSS occurs when user input provided in an HTTP request (such as URL search parameters, form inputs, or HTTP headers) is immediately returned and embedded in the server&apos;s HTML response without escaping.
            </p>

            <div style={{ margin: "1.5rem 0" }}>
              <h4 style={{ fontSize: "0.95rem", marginBottom: "0.5rem", color: "var(--accent-amber)" }}>Vulnerable Code Pattern (Node/Express):</h4>
              <div className="code-box">
                <div className="code-box-header">
                  <span>server.js (Vulnerable Reflected Pattern)</span>
                  <button onClick={() => copyCode(`app.get('/search', (req, res) => {\n  const query = req.query.q;\n  res.send('<h1>Search Results for: ' + query + '</h1>');\n});`, "ref_vuln")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                    {copiedSnippet === "ref_vuln" ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
                  </button>
                </div>
                <code>{`app.get('/search', (req, res) => {
  const query = req.query.q;
  // VULNERABLE: Direct concatenation into HTML response!
  res.send('<h1>Search Results for: ' + query + '</h1>');
});`}</code>
              </div>
            </div>

            <div style={{ margin: "1.5rem 0" }}>
              <h4 style={{ fontSize: "0.95rem", marginBottom: "0.5rem", color: "var(--accent-emerald)" }}>Secure Remediation (HTML Escaping):</h4>
              <div className="code-box">
                <div className="code-box-header">
                  <span>server.js (Secure Pattern)</span>
                  <button onClick={() => copyCode(`const he = require('he');\napp.get('/search', (req, res) => {\n  const query = he.encode(req.query.q || '');\n  res.send('<h1>Search Results for: ' + query + '</h1>');\n});`, "ref_sec")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                    {copiedSnippet === "ref_sec" ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
                  </button>
                </div>
                <code style={{ color: "#34d399" }}>{`const he = require('he'); // or modern template engine with auto-escaping

app.get('/search', (req, res) => {
  const query = he.encode(req.query.q || '');
  // SECURE: Encoded entities prevent browser from parsing <script> as HTML
  res.send('<h1>Search Results for: ' + query + '</h1>');
});`}</code>
              </div>
            </div>
          </section>

          {/* 3. Stored XSS */}
          <section id="stored-xss" className="glass-panel" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.6rem", color: "#fff", margin: 0 }}>3. Stored XSS (Persistent)</h2>
              <span className="badge badge-rose">High Severity / Mass Impact</span>
            </div>
            <p style={{ marginBottom: "1rem" }}>
              Stored XSS (Persistent XSS) is the most destructive form. An attacker submits a malicious script into an application&apos;s storage backend (database, file storage, user profiles, comments, forum posts). Whenever any other user visits that resource, the payload is retrieved from the database and executed inside their authenticated session.
            </p>

            <div style={{ background: "rgba(244, 63, 94, 0.08)", border: "1px solid rgba(244, 63, 94, 0.25)", borderRadius: "var(--radius-md)", padding: "1.25rem", margin: "1rem 0" }}>
              <h4 style={{ color: "var(--accent-rose)", fontSize: "0.95rem", marginBottom: "0.4rem" }}>
                Famous Case Study: The Samy Worm (MySpace, 2005)
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                Samy Kamkar injected a payload into his MySpace profile bio that extracted the viewer&apos;s session token, added Samy as a friend, appended <em>&ldquo;but most of all, Samy is my hero&rdquo;</em> to the victim&apos;s profile, and re-infected anyone who visited them. The worm infected over 1 million users in under 20 hours.
              </p>
            </div>
          </section>

          {/* 4. DOM-based XSS */}
          <section id="dom-xss" className="glass-panel" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.6rem", color: "#fff", margin: 0 }}>4. DOM-Based XSS (Client-Side Sinks)</h2>
              <span className="badge badge-cyan">Client-Side Architecture</span>
            </div>
            <p style={{ marginBottom: "1rem" }}>
              In DOM-based XSS, the vulnerability exists entirely in the browser client script. The server response never changes; instead, JavaScript reads from an untrusted <strong>Source</strong> and writes it into an execution <strong>Sink</strong>.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", margin: "1.5rem 0" }}>
              {/* Sources */}
              <div style={{ background: "rgba(2, 6, 23, 0.7)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <h4 style={{ color: "var(--accent-cyan)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Dangerous Sources (Inputs):</h4>
                <ul style={{ listStyle: "none", fontSize: "0.8rem", fontFamily: "var(--font-mono)", display: "flex", flexDirection: "column", gap: "0.3rem", color: "var(--text-secondary)" }}>
                  <li>• location.hash</li>
                  <li>• location.search</li>
                  <li>• location.pathname</li>
                  <li>• document.referrer</li>
                  <li>• window.name</li>
                  <li>• postMessage (event.data)</li>
                </ul>
              </div>

              {/* Sinks */}
              <div style={{ background: "rgba(2, 6, 23, 0.7)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <h4 style={{ color: "var(--accent-rose)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Dangerous Sinks (Execution):</h4>
                <ul style={{ listStyle: "none", fontSize: "0.8rem", fontFamily: "var(--font-mono)", display: "flex", flexDirection: "column", gap: "0.3rem", color: "var(--text-secondary)" }}>
                  <li>• element.innerHTML</li>
                  <li>• element.outerHTML</li>
                  <li>• document.write()</li>
                  <li>• eval()</li>
                  <li>• setTimeout(string, delay)</li>
                  <li>• location.href = &quot;javascript:...&quot;</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Mutation XSS */}
          <section id="mutation-xss" className="glass-panel" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.6rem", marginBottom: "1rem", color: "#fff" }}>5. Mutation XSS (mXSS)</h2>
            <p style={{ marginBottom: "1rem" }}>
              Mutation XSS occurs when a browser mutates seemingly benign HTML markup during DOM parsing and normalization. A sanitizer library might deem a payload safe in raw form, but when assigned to <code>innerHTML</code>, the browser reorganizes nested tags, closing quotes, or foreign namespaces (e.g. SVG/MathML), causing hidden scripts to spring to life.
            </p>
            <div className="code-box">
              <div className="code-box-header">
                <span>mXSS Concept (Namespace Mutation)</span>
              </div>
              <code style={{ color: "#fb7185" }}>{`<form><math><mtext></form><form><mglyph><style></math><img src=x onerror=alert(1)>`}</code>
            </div>
          </section>

          {/* 6. Contexts & Rules */}
          <section id="contexts" className="glass-panel" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.6rem", marginBottom: "1rem", color: "#fff" }}>6. Context-Aware Output Rules</h2>
            <p style={{ marginBottom: "1rem" }}>
              Standard HTML entity encoding is <strong>not sufficient</strong> in all parts of a webpage. The encoding rule must match the exact execution context:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
              <div style={{ background: "rgba(2, 6, 23, 0.7)", padding: "0.85rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <strong style={{ color: "var(--accent-emerald)" }}>1. HTML Body Context:</strong> <code>&lt;div&gt;UNTRUSTED&lt;/div&gt;</code> → Encode <code>&amp;, &lt;, &gt;, &quot;, &apos;</code>.
              </div>
              <div style={{ background: "rgba(2, 6, 23, 0.7)", padding: "0.85rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <strong style={{ color: "var(--accent-cyan)" }}>2. Attribute Context:</strong> <code>&lt;input value=&quot;UNTRUSTED&quot;&gt;</code> → Encode quotes and alphanumeric control characters to prevent breaking out of attribute quotes.
              </div>
              <div style={{ background: "rgba(2, 6, 23, 0.7)", padding: "0.85rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <strong style={{ color: "var(--accent-amber)" }}>3. URI Context:</strong> <code>&lt;a href=&quot;UNTRUSTED&quot;&gt;</code> → Validate scheme against whitelist (<code>http:</code>, <code>https:</code>) to prevent <code>javascript:</code> or <code>data:</code> URI attacks.
              </div>
              <div style={{ background: "rgba(2, 6, 23, 0.7)", padding: "0.85rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <strong style={{ color: "var(--accent-rose)" }}>4. JavaScript Variable Context:</strong> <code>&lt;script&gt;var name = &quot;UNTRUSTED&quot;;&lt;/script&gt;</code> → Unicode/Hex escape or serialize safely with JSON stringify; never raw format.
              </div>
            </div>
          </section>

          {/* 7. Live Encoder Tool */}
          <section id="encoder-tool">
            <PayloadEncoder />
          </section>

          {/* 8. Modern Defenses */}
          <section id="defenses" className="glass-panel" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.6rem", marginBottom: "1rem", color: "#fff" }}>8. Comprehensive Defense Blueprint</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", margin: "1.5rem 0" }}>
              {/* Defense 1: React auto-escaping */}
              <div style={{ background: "rgba(2, 6, 23, 0.7)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <h4 style={{ color: "var(--accent-emerald)", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                  1. Framework Escaping (React / Next.js)
                </h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                  React automatically escapes strings embedded in JSX (e.g. <code>{`<div>{userInput}</div>`}</code>). Avoid <code>dangerouslySetInnerHTML</code> unless paired with DOMPurify.
                </p>
                <div className="code-box" style={{ fontSize: "0.75rem" }}>
                  <code style={{ color: "#34d399" }}>{`// SECURE in Next.js/React:
<h1>{userQuery}</h1>

// VULNERABLE (Avoid unless sanitized):
<div dangerouslySetInnerHTML={{ __html: userQuery }} />`}</code>
                </div>
              </div>

              {/* Defense 2: Cookie Hardening */}
              <div style={{ background: "rgba(2, 6, 23, 0.7)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <h4 style={{ color: "var(--accent-cyan)", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                  2. Cookie Hardening (HttpOnly & SameSite)
                </h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                  Mark sensitive authentication session cookies with <code>HttpOnly</code>. This prevents JavaScript from reading <code>document.cookie</code> even if XSS occurs.
                </p>
                <div className="code-box" style={{ fontSize: "0.75rem" }}>
                  <code style={{ color: "#38bdf8" }}>{`Set-Cookie: session=xyz123; 
  Secure; 
  HttpOnly; 
  SameSite=Strict;`}</code>
                </div>
              </div>
            </div>
          </section>

          {/* 9. CSP Blueprint */}
          <section id="csp-guide" className="glass-panel" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.6rem", marginBottom: "1rem", color: "#fff" }}>9. Content Security Policy (CSP) Blueprint</h2>
            <p style={{ marginBottom: "1rem" }}>
              Content Security Policy (CSP) is an HTTP response header that restricts the resources (scripts, images, stylesheets) that the browser is allowed to load or execute for a given page.
            </p>

            <div className="code-box" style={{ marginBottom: "1.25rem" }}>
              <div className="code-box-header">
                <span>Production-Ready Strict Nonce CSP Header</span>
                <button onClick={() => copyCode(`Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-rAnd0m123' 'strict-dynamic'; object-src 'none'; base-uri 'none';`, "csp_head")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  {copiedSnippet === "csp_head" ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
                </button>
              </div>
              <code style={{ color: "#38bdf8" }}>{`Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'nonce-rAnd0m123' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';`}</code>
            </div>

            <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "var(--radius-md)", padding: "1rem", fontSize: "0.85rem" }}>
              <strong style={{ color: "var(--accent-emerald)" }}>Why &apos;strict-dynamic&apos; and Nonces?</strong>
              <p style={{ margin: "0.25rem 0 0 0", color: "var(--text-secondary)" }}>
                By requiring an unpredictable cryptographic nonce (<code>nonce-xyz</code>) generated per-request, inline attacker scripts without the correct nonce will be blocked by the browser with zero execution.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
