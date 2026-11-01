const URL = "https://igotuhaxmvtzpjhfkskc.supabase.co";
const KEY = "sb_publishable_QiCAZ9S2qoE5P4iW9kLxoQ__pp5S3ag";
let session;
try {
  session = JSON.parse(localStorage.getItem("sq.session") || "null");
} catch {
  session = null;
}
let refreshing;
function remember(data) {
  session = data;
  try {
    data
      ? localStorage.setItem("sq.session", JSON.stringify(data))
      : localStorage.removeItem("sq.session");
  } catch {}
  return data;
}
async function response(res) {
  const data = await res.json().catch(() => null);
  if (!res.ok)
    throw new Error(
      data?.msg ||
        data?.message ||
        data?.error_description ||
        data?.error ||
        `Connection error (${res.status})`,
    );
  return data;
}
async function auth(path, body, token) {
  return response(
    await fetch(`${URL}/auth/v1/${path}`, {
      method: "POST",
      headers: {
        apikey: KEY,
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    }),
  );
}
export const user = () => session?.user || null;
export async function token() {
  if (!session) return null;
  const expires =
    session.expires_at || Math.floor(Date.now() / 1000) + session.expires_in;
  if (expires < Date.now() / 1000 + 60) {
    refreshing ??= auth("token?grant_type=refresh_token", {
      refresh_token: session.refresh_token,
    })
      .then((d) =>
        remember({
          ...d,
          expires_at: Math.floor(Date.now() / 1000) + d.expires_in,
        }),
      )
      .catch((e) => {
        remember(null);
        throw e;
      })
      .finally(() => (refreshing = null));
    await refreshing;
  }
  return session.access_token;
}
export async function signin(email, password) {
  const d = await auth("token?grant_type=password", { email, password });
  return remember({
    ...d,
    expires_at: Math.floor(Date.now() / 1000) + d.expires_in,
  });
}
export async function signup(email, password, name) {
  const d = await auth("signup", {
    email,
    password,
    data: { display_name: name },
  });
  if (d.access_token)
    remember({
      ...d,
      expires_at: Math.floor(Date.now() / 1000) + d.expires_in,
    });
  return d;
}
export async function signout() {
  const t = session?.access_token;
  remember(null);
  if (t) await auth("logout", {}, t);
}
export const recover = (email) => auth("recover", { email });
export const resend = (email) => auth("resend", { type: "signup", email });
export async function verify(email, code) {
  const d = await auth("verify", { email, token: code, type: "signup" });
  if (d.access_token)
    remember({
      ...d,
      expires_at: Math.floor(Date.now() / 1000) + d.expires_in,
    });
  return d;
}
export async function request(
  table,
  { query = "", method = "GET", body, upsert = false } = {},
) {
  const t = await token();
  const res = await fetch(
    `${URL}/rest/v1/${table}${query ? "?" + query : ""}`,
    {
      method,
      headers: {
        apikey: KEY,
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
        "Content-Type": "application/json",
        Prefer: `return=representation${upsert ? ",resolution=merge-duplicates" : ""}`,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    },
  );
  if (res.status === 204) return null;
  return response(res);
}
let dbPromise;
async function db() {
  if (!("indexedDB" in globalThis))
    throw Error(
      "Local database is unavailable. Enable site storage to save progress.",
    );
  return (dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open("side-quest", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("records");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}
export async function get(key, fallback = null) {
  try {
    const d = await db();
    return await new Promise((resolve, reject) => {
      const r = d.transaction("records").objectStore("records").get(key);
      r.onsuccess = () => resolve(r.result ?? fallback);
      r.onerror = () => reject(r.error);
    });
  } catch {
    return fallback;
  }
}
export async function put(key, value) {
  const d = await db();
  return new Promise((resolve, reject) => {
    const tx = d.transaction("records", "readwrite");
    tx.objectStore("records").put(value, key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}
export async function remove(key) {
  const d = await db();
  return new Promise((resolve, reject) => {
    const tx = d.transaction("records", "readwrite");
    tx.objectStore("records").delete(key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}
export async function all() {
  const d = await db();
  return new Promise((resolve, reject) => {
    const s = d.transaction("records").objectStore("records");
    const req = s.openCursor();
    const out = {};
    req.onsuccess = () => {
      const c = req.result;
      if (c) {
        out[c.key] = c.value;
        c.continue();
      } else resolve(out);
    };
    req.onerror = () => reject(req.error);
  });
}
export async function health() {
  await request("sq_quests", { query: "select=id&limit=1" });
  return true;
}
