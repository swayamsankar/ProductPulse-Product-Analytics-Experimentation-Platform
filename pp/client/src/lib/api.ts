
const BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

export async function api(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("pp_token");
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "Request failed");
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
}

export function saveAuth(token: string, user: unknown) {
  localStorage.setItem("pp_token", token);
  localStorage.setItem("pp_user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("pp_token");
  localStorage.removeItem("pp_user");
}
