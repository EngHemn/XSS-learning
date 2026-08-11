import Link from "next/link";
import { ShieldCheck, Terminal, BookOpen, AlertTriangle, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border-subtle)",
      background: "rgba(6, 9, 17, 0.95)",
      padding: "3.5rem 0 2rem 0",
      marginTop: "4rem"
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "2.5rem",
          marginBottom: "3rem"
        }}>
          {/* Brand & Purpose */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #10b981, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Lock size={16} color="#060911" />
              </div>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.1rem" }}>
                XSS<span style={{ color: "var(--accent-emerald)" }}>.ACADEMY</span>
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              An educational playground & interactive documentation resource created to help software developers, security champions, and AppSec engineers understand and eliminate Cross-Site Scripting vulnerabilities.
            </p>
          </div>

          {/* Quick Learning Paths */}
          <div>
            <h4 style={{ fontSize: "0.95rem", marginBottom: "1rem", color: "#fff" }}>Learning Modules</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <li><Link href="/docs#what-is-xss" style={{ transition: "color 0.2s" }} className="hover:text-emerald">→ Understanding XSS Anatomy</Link></li>
              <li><Link href="/docs#reflected-xss">→ Reflected XSS (Type 1)</Link></li>
              <li><Link href="/docs#stored-xss">→ Stored XSS (Type 2 / Persistent)</Link></li>
              <li><Link href="/docs#dom-xss">→ DOM-based XSS (Client Sinks)</Link></li>
              <li><Link href="/docs#defenses">→ Context-Aware Defenses & CSP</Link></li>
            </ul>
          </div>

          {/* Testing Sandboxes */}
          <div>
            <h4 style={{ fontSize: "0.95rem", marginBottom: "1rem", color: "#fff" }}>Interactive Labs</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <li><Link href="/test?tab=reflected">→ Reflected Search Lab</Link></li>
              <li><Link href="/test?tab=stored">→ Stored Guestbook Sandbox</Link></li>
              <li><Link href="/test?tab=dom">→ DOM Sinks & Sources Lab</Link></li>
              <li><Link href="/test?tab=contexts">→ Injection Context Matrix</Link></li>
              <li><Link href="/test?tab=ctf">→ 5-Level Hands-on CTF Arena</Link></li>
            </ul>
          </div>

          {/* Security Disclaimer */}
          <div>
            <div style={{
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              background: "rgba(245, 158, 11, 0.08)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--accent-amber)", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                <AlertTriangle size={16} />
                <span>Safe Sandbox Environment</span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                All payloads executed on this testing lab are isolated and monitored via client-side synthetic sandboxes for educational instruction only.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          fontSize: "0.8rem",
          color: "var(--text-muted)"
        }}>
          <div>
            © {new Date().getFullYear()} XSS Academy. Open Security Education Platform.
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/docs" style={{ color: "var(--text-secondary)" }}>Docs</Link>
            <Link href="/test" style={{ color: "var(--text-secondary)" }}>Test Lab</Link>
            <span style={{ color: "var(--accent-emerald)" }}>Protected with CSP & Modern Frameworks</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
