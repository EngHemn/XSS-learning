import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "XSS Academy & Lab | Master Cross-Site Scripting & Defense",
  description:
    "An interactive, hands-on educational platform to master Cross-Site Scripting (XSS) concepts, attack vectors (Reflected, Stored, DOM), and robust modern defenses.",
  keywords: ["XSS", "Cross-Site Scripting", "Web Security", "Cybersecurity", "Next.js", "AppSec", "CSP", "Sanitization"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>" />
      </head>
      <body>
        <div className="laptop-required-overlay">
          <div className="laptop-required-card">
            <h2 style={{ fontSize: "1.75rem", marginBottom: "1rem", color: "var(--accent-rose)" }}>
              Laptop Screen Required
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
              XSS Academy is an interactive security testing lab and CTF arena. To inspect code contexts, execute payloads, and utilize developer tools effectively, a minimum screen width of 1024px (laptop/desktop size) is required.
            </p>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Please resize your browser or switch to a laptop or desktop computer.
            </div>
          </div>
        </div>
        <div className="app-layout-wrapper">
          <Navbar />
          <main style={{ minHeight: "calc(100vh - 140px)" }}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
