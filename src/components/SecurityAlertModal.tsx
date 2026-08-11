"use client";

import { useEffect, useState } from "react";
import { AlertCircle, X, ShieldAlert, Check, Copy, Terminal } from "lucide-react";

export interface SimulatedAlert {
  id: string;
  message: string;
  source: string;
  timestamp: string;
  payload: string;
  context: string;
}

interface SecurityAlertModalProps {
  alert: SimulatedAlert | null;
  onClose: () => void;
}

export default function SecurityAlertModal({ alert, onClose }: SecurityAlertModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!alert) return null;

  const copyPayload = () => {
    navigator.clipboard.writeText(alert.payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 100,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "540px",
        background: "#090d16",
        border: "1px solid rgba(244, 63, 94, 0.4)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 0 40px rgba(244, 63, 94, 0.35)",
        overflow: "hidden",
        animation: "fadeIn 0.2s ease-out"
      }}>
        {/* Header */}
        <div style={{
          padding: "1rem 1.25rem",
          background: "linear-gradient(90deg, rgba(244, 63, 94, 0.2), rgba(244, 63, 94, 0.05))",
          borderBottom: "1px solid rgba(244, 63, 94, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(244, 63, 94, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-rose)"
            }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", color: "#fff", margin: 0 }}>
                XSS Execution Intercepted!
              </h3>
              <span style={{ fontSize: "0.72rem", color: "var(--accent-rose)", fontWeight: 600 }}>
                CRITICAL · SCRIPT EXECUTION TRIGGERED
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "0.25rem",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Alert Message Box */}
          <div style={{
            padding: "1rem",
            background: "rgba(2, 6, 23, 0.8)",
            border: "1px solid var(--border-medium)",
            borderRadius: "var(--radius-md)",
            borderLeft: "4px solid var(--accent-rose)"
          }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
              Simulated Window Alert Message:
            </div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "1rem",
              fontWeight: 700,
              color: "#fff",
              wordBreak: "break-all"
            }}>
              alert(&ldquo;{alert.message}&rdquo;)
            </div>
          </div>

          {/* Details Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            fontSize: "0.8rem"
          }}>
            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginBottom: "0.2rem" }}>Trigger Vector</div>
              <div style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>{alert.source}</div>
            </div>
            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginBottom: "0.2rem" }}>Injection Sink / Context</div>
              <div style={{ color: "var(--accent-amber)", fontWeight: 600 }}>{alert.context}</div>
            </div>
          </div>

          {/* Triggered Payload Snippet */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Triggered Injection Payload:</span>
              <button
                onClick={copyPayload}
                style={{
                  background: "transparent",
                  border: "none",
                  color: copied ? "var(--accent-emerald)" : "var(--text-accent)",
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem"
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy Payload"}
              </button>
            </div>
            <div className="code-box" style={{ padding: "0.65rem 0.85rem", fontSize: "0.8rem", color: "#fb7185", wordBreak: "break-all" }}>
              {alert.payload}
            </div>
          </div>

          {/* Educational Note */}
          <div style={{
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            background: "rgba(16, 185, 129, 0.08)",
            padding: "0.65rem 0.85rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.5rem"
          }}>
            <Terminal size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong>Why did this execute?</strong> The user input was parsed as executable HTML/JavaScript code by the client sink without proper contextual encoding or sanitization.
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{
          padding: "0.85rem 1.25rem",
          background: "rgba(2, 6, 23, 0.9)",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.5rem"
        }}>
          <button
            onClick={onClose}
            className="btn btn-primary btn-sm"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
