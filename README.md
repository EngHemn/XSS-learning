# 🛡️ XSS Academy - Interactive Security & Education Platform

Welcome to **XSS Academy**, an interactive educational playground and CTF (Capture The Flag) platform built on **Next.js** to master **Cross-Site Scripting (XSS)** vulnerabilities and modern defensive strategies. 

This repository serves as a safe, sandboxed lab environment designed to help developers, security engineers, and students understand how client-side injection vulnerabilities occur, how attackers exploit them, and how to programmatically implement foolproof remediation.

---

## 🚀 Key Features

*   **🧪 Sandboxed Interactive Labs**: Explore the mechanics of the three core categories of XSS in live, isolated playgrounds:
    *   **Reflected XSS (Type 1)**: See how unescaped query parameters reflect instantly back onto the page.
    *   **Stored XSS (Type 2)**: Witness how payloads permanently saved in databases or mock persistent states automatically execute for any visiting user.
    *   **DOM-Based XSS (Type 0)**: Inspect client-side sources (`location.hash`, etc.) flowing into unsafe sinks (`innerHTML`, `eval`) within the browser.
*   **🏆 5-Level CTF Challenge Arena**: Test your skills in bypass techniques. Attempt to compromise levels designed with weak, sanitization-filtering systems and recover flag strings.
*   **📊 Hacker Monitor Dashboard**: An interactive live logs display that visualizes exfiltrated cookie details, simulated keystrokes, and request histories from your payloads.
*   **📖 Defense & Remediation Guide**: Comprehensive documentation details covering DOMPurify sanitizer integration, Content Security Policy (CSP) configurations, and Context-Aware Output Escaping.

---

## 🛠️ Project Structure

```
xss/
├── src/
│   ├── app/
│   │   ├── docs/          # Interactive Documentation page
│   │   ├── test/          # Vulnerability labs & CTF Arena page
│   │   ├── globals.css    # Sleek dark mode / glassmorphism styling
│   │   ├── layout.tsx     # Base App shell with Navigation & Footer
│   │   └── page.tsx       # Landing page detailing the XSS Triad & lifecycle
│   ├── components/
│   │   ├── Navbar.tsx     # Modern interactive headers & logo
│   │   ├── Footer.tsx     # Detailed footer links
│   │   ├── HackerMonitor.tsx  # Logs console tracking simulated XSS activity
│   │   ├── PayloadEncoder.tsx # Interactive base64 / URL payload helper
│   │   └── SecurityAlertModal.tsx # Dynamic warnings notifying successful injections
├── package.json
└── tsconfig.json
```

---

## ⚙️ Getting Started & Local Setup

Prerequisites: Ensure you have **Node.js (v18+)** installed.

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/EngHemn/XSS-learning.git
    cd XSS-learning
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

4.  **Open the Web App**:
    Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🛡️ Defensive Best Practices Covered

This project demonstrates how to defend applications using standard industry guidelines:

1.  **Context-Aware Output Encoding**: Ensure that any user input is HTML-entity encoded before being rendered into the DOM.
2.  **DOMPurify Sanitizer**: Clean HTML content dynamically using standard libraries:
    ```javascript
    import DOMPurify from 'dompurify';
    const cleanHTML = DOMPurify.sanitize(userInput);
    ```
3.  **Strict Content Security Policy (CSP)**: Implement HTTP headers restricting the execution of inline scripts and unauthorized external domains:
    ```http
    Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-random2026';
    ```

---

## ⚠️ Disclaimer

This application is created **strictly for educational and testing purposes**. The simulated vulnerabilities are sandboxed to run locally on your browser. Never use the injection techniques demonstrated here on unauthorized websites or production systems.
