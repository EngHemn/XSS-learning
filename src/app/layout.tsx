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
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 140px)" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
