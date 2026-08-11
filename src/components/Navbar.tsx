"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, BookOpen, Terminal, Flame, Zap, CheckCircle2 } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Overview", icon: Zap },
    { href: "/docs", label: "Documentation & Defenses", icon: BookOpen },
    { href: "/test", label: "Vulnerability Lab (Interactive)", icon: Terminal, highlight: true },
  ];

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      backgroundColor: "rgba(6, 9, 17, 0.8)",
      borderBottom: "1px solid var(--border-subtle)",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "70px" }}>
        {/* Brand */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #10b981, #06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)"
          }}>
            <Shield size={22} color="#060911" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em", color: "#fff" }}>
                XSS<span style={{ color: "var(--accent-emerald)" }}>.ACADEMY</span>
              </span>
              <span className="badge badge-cyan" style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem" }}>
                LAB V2.0
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0, lineHeight: 1 }}>
              Cross-Site Scripting & Defense Engine
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.95rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  backgroundColor: isActive
                    ? "rgba(16, 185, 129, 0.12)"
                    : link.highlight
                    ? "rgba(6, 182, 212, 0.08)"
                    : "transparent",
                  color: isActive
                    ? "var(--accent-emerald)"
                    : link.highlight
                    ? "var(--text-accent)"
                    : "var(--text-secondary)",
                  border: isActive
                    ? "1px solid rgba(16, 185, 129, 0.3)"
                    : link.highlight
                    ? "1px solid rgba(6, 182, 212, 0.25)"
                    : "1px solid transparent",
                }}
              >
                <Icon size={16} />
                <span>{link.label}</span>
                {link.highlight && !isActive && (
                  <span style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "var(--accent-rose)",
                    boxShadow: "0 0 8px var(--accent-rose)"
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Shield Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.35rem 0.75rem",
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "var(--radius-full)",
            fontSize: "0.75rem",
            color: "var(--accent-emerald)"
          }}>
            <span style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: "var(--accent-emerald)",
              boxShadow: "0 0 6px var(--accent-emerald)",
              display: "inline-block"
            }} />
            <span>Sandbox Guard Active</span>
          </div>

          <Link href="/test" className="btn btn-primary btn-sm">
            <Flame size={14} />
            <span>Open Lab</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
