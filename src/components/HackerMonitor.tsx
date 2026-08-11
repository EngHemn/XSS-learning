"use client";

import { useState } from "react";
import { Terminal, Shield, Trash2, Key, Globe, Eye, Zap, CheckCircle2, AlertOctagon } from "lucide-react";

export interface SecurityLogEvent {
  id: string;
  time: string;
  type: "CRITICAL_XSS" | "DEFENSE_BLOCKED" | "COOKIE_STEAL" | "DOM_MUTATION" | "INFO";
  title: string;
  details: string;
  payload?: string;
  stolenData?: {
    cookie?: string;
    token?: string;
    localStorage?: string;
    url?: string;
  };
}

interface HackerMonitorProps {
  events: SecurityLogEvent[];
  onClear: () => void;
  mockCookies: Record<string, string>;
  mockStorage: Record<string, string>;
}

export default function HackerMonitor({
  events,
  onClear,
  mockCookies,
  mockStorage,
}: HackerMonitorProps) {
  const [activeTab, setActiveTab] = useState<"logs" | "stolen" | "defense">("logs");

  return (
    <div className="glass-panel" style={{ overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header Bar */}
      <div style={{
        padding: "0.75rem 1rem",
        background: "rgba(2, 6, 23, 0.9)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "var(--accent-rose)",
            boxShadow: "0 0 8px var(--accent-rose)",
            animation: "pulseGlow 1.5s infinite"
          }} />
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.85rem", color: "#fff" }}>
            SECURITY EVENT MONITOR & C2 LISTENER
          </span>
          <span className="badge badge-rose" style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>
            {events.length} EVENTS
          </span>
        </div>

        {/* Tab Controls & Clear */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            display: "flex",
            background: "rgba(255, 255, 255, 0.05)",
            padding: "2px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            fontSize: "0.75rem"
          }}>
            <button
              onClick={() => setActiveTab("logs")}
              style={{
                background: activeTab === "logs" ? "rgba(244, 63, 94, 0.2)" : "transparent",
                color: activeTab === "logs" ? "#fb7185" : "var(--text-muted)",
                border: "none",
                padding: "0.25rem 0.6rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Event Stream
            </button>
            <button
              onClick={() => setActiveTab("stolen")}
              style={{
                background: activeTab === "stolen" ? "rgba(245, 158, 11, 0.2)" : "transparent",
                color: activeTab === "stolen" ? "#fbbf24" : "var(--text-muted)",
                border: "none",
                padding: "0.25rem 0.6rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Victim State / Exfil
            </button>
          </div>

          <button
            onClick={onClear}
            title="Clear Log Terminal"
            style={{
              background: "transparent",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-muted)",
              padding: "0.3rem",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center"
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ padding: "1rem", flex: 1, overflowY: "auto", maxHeight: "420px" }}>
        {activeTab === "logs" && (
          <div>
            {events.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "3rem 1rem",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem"
              }}>
                <Terminal size={32} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
                <p>No security events intercepted yet.</p>
                <p style={{ fontSize: "0.75rem", opacity: 0.6, marginTop: "0.25rem" }}>
                  Inject a payload in any of the lab sandboxes to see real-time execution logs and defense audits.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    style={{
                      background: evt.type === "DEFENSE_BLOCKED"
                        ? "rgba(16, 185, 129, 0.06)"
                        : "rgba(244, 63, 94, 0.08)",
                      border: `1px solid ${
                        evt.type === "DEFENSE_BLOCKED"
                          ? "rgba(16, 185, 129, 0.25)"
                          : "rgba(244, 63, 94, 0.3)"
                      }`,
                      borderRadius: "var(--radius-md)",
                      padding: "0.75rem 0.9rem",
                      fontSize: "0.82rem",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        {evt.type === "DEFENSE_BLOCKED" ? (
                          <CheckCircle2 size={15} color="var(--accent-emerald)" />
                        ) : (
                          <AlertOctagon size={15} color="var(--accent-rose)" />
                        )}
                        <span style={{
                          fontWeight: 700,
                          color: evt.type === "DEFENSE_BLOCKED" ? "var(--accent-emerald)" : "#fb7185"
                        }}>
                          {evt.title}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {evt.time}
                      </span>
                    </div>

                    <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem", margin: "0.2rem 0" }}>
                      {evt.details}
                    </p>

                    {evt.payload && (
                      <div style={{
                        marginTop: "0.4rem",
                        padding: "0.4rem 0.6rem",
                        background: "rgba(2, 6, 23, 0.9)",
                        borderRadius: "4px",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        fontSize: "0.75rem",
                        color: "#38bdf8",
                        wordBreak: "break-all"
                      }}>
                        <strong>Payload:</strong> {evt.payload}
                      </div>
                    )}

                    {evt.stolenData && (
                      <div style={{
                        marginTop: "0.4rem",
                        padding: "0.4rem 0.6rem",
                        background: "rgba(245, 158, 11, 0.1)",
                        borderRadius: "4px",
                        border: "1px solid rgba(245, 158, 11, 0.3)",
                        fontSize: "0.72rem",
                        color: "#fbbf24"
                      }}>
                        <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>🚨 Simulated Exfiltrated State:</div>
                        {evt.stolenData.cookie && <div>• document.cookie: <code>{evt.stolenData.cookie}</code></div>}
                        {evt.stolenData.token && <div>• sessionStorage.jwt: <code>{evt.stolenData.token}</code></div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "stolen" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Victim Cookies */}
            <div style={{
              background: "rgba(2, 6, 23, 0.8)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "0.85rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                <Key size={15} color="var(--accent-amber)" />
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff" }}>
                  Simulated Victim Document Cookies
                </span>
                <span className="badge badge-amber" style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>
                  {Object.keys(mockCookies).length} ACTIVE
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
                {Object.entries(mockCookies).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", background: "rgba(255, 255, 255, 0.03)", padding: "0.4rem 0.6rem", borderRadius: "4px" }}>
                    <span style={{ color: "var(--accent-cyan)" }}>{k}:</span>
                    <span style={{ color: "#fb7185", fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                💡 <em>Defense Tip:</em> Cookies configured with the <code>HttpOnly</code> flag cannot be accessed via <code>document.cookie</code> even during a successful XSS!
              </p>
            </div>

            {/* Victim LocalStorage & Tokens */}
            <div style={{
              background: "rgba(2, 6, 23, 0.8)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "0.85rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                <Globe size={15} color="var(--accent-cyan)" />
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff" }}>
                  Simulated Local/Session Storage
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
                {Object.entries(mockStorage).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", background: "rgba(255, 255, 255, 0.03)", padding: "0.4rem 0.6rem", borderRadius: "4px" }}>
                    <span style={{ color: "var(--accent-emerald)" }}>{k}:</span>
                    <span style={{ color: "#38bdf8", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
