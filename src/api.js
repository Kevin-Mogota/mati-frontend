// Vite exposes any env var prefixed VITE_ via import.meta.env — set VITE_API_BASE
// in a .env file (see .env.example) to point at your deployed backend. Falls back
// to localhost so `npm run dev` keeps working with no setup, unchanged from before.
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// Reads Django's csrftoken cookie (set by GET /api/auth/csrf/) so it can be sent
// back as the X-CSRFToken header on every unsafe request — Django's standard CSRF
// flow, replacing the CsrfExemptSessionAuthentication dev shortcut used earlier.
function getCsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// Call once when the app loads (see hooks.js) so the csrftoken cookie exists
// before the first POST/PUT/PATCH/DELETE is attempted.
export async function primeCsrfCookie() {
  try { await fetch(API_BASE + "/api/auth/csrf/", { credentials: "include" }); } catch (e) {}
}

function csrfHeaders() {
  const token = getCsrfToken();
  return token ? { "X-CSRFToken": token } : {};
}

export async function apiGet(path) {
  const res = await fetch(API_BASE + path, { credentials: "include" });
  if (!res.ok) throw new Error("API error " + res.status);
  return res.json();
}


export async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...csrfHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("API error " + res.status);
  return res.json();
}


export async function apiPut(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...csrfHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("API error " + res.status);
  return res.json();
}


export async function apiPatch(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...csrfHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("API error " + res.status);
  return res.json();
}


export async function apiDelete(path) {
  const res = await fetch(API_BASE + path, {
    method: "DELETE",
    credentials: "include",
    headers: { ...csrfHeaders() },
  });
  if (!res.ok) throw new Error("API error " + res.status);
}

// Direct call to Claude, used by admin AI-assist buttons (draft text, region proposals)
// when we want a quick client-side generation rather than a dedicated backend endpoint.

export async function askClaude(systemPrompt, userMessage) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  const data = await res.json();
  return (data.content || []).map(b => b.type === "text" ? b.text : "").join("\n").trim();
}
