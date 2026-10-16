// The tracker prefers navigator.sendBeacon and only falls back to fetch when
// it is absent. Define a permanent no-op sendBeacon so the fetch fallback
// (which happy-dom aborts on teardown) is never reached.
if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon !== 'function') {
  Object.defineProperty(navigator, 'sendBeacon', {
    configurable: true,
    value: () => true,
  });
}

/**
 * Test setup — a DOM environment with the tracker script loaded fresh per test.
 * We stub the things a real browser provides: crypto, sendBeacon, location.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const TRACKER_SRC = readFileSync(
  resolve(import.meta.dirname, "../public/hai-track.js"),
  "utf8",
);

/**
 * Neutralize happy-dom's real fetch for the whole test file — the tracker's
 * fallback path calls fetch, and happy-dom attempts real network I/O which
 * produces unhandled rejections. Tests that need to observe network calls use
 * stubBeacon()/stubFetch() explicitly.
 */
function neutralizeFetch() {
  try {
    Object.defineProperty(window, "fetch", {
      configurable: true,
      writable: true,
      value: () => Promise.resolve(new Response("{}", { status: 200 })),
    });
  } catch {
    /* ignore */
  }
}
neutralizeFetch();

/**
 * happy-dom on Node 26 exposes sessionStorage but not localStorage.
 * Shim it from a module-level store so values persist across loadTracker()
 * calls within a test (simulating a real browser reload). Test-harness only.
 */
const STORE = new Map<string, string>();
function ensureLocalStorage() {
  if (typeof window.localStorage !== "undefined" && (window.localStorage as unknown as { __shim?: boolean }).__shim) return;
  const shim = {
    __shim: true,
    getItem: (k: string) => (STORE.has(k) ? STORE.get(k)! : null),
    setItem: (k: string, v: string) => void STORE.set(k, String(v)),
    removeItem: (k: string) => void STORE.delete(k),
    clear: () => STORE.clear(),
    key: (i: number) => Array.from(STORE.keys())[i] ?? null,
    get length() {
      return STORE.size;
    },
  };
  Object.defineProperty(window, "localStorage", { configurable: true, value: shim });
}

/** Load the tracker into the current jsdom window. */
export function loadTracker(attrs: Record<string, string> = {}) {
  ensureLocalStorage();
  // Neutralize fetch BEFORE the tracker's init() runs its beacon fallback,
  // so no real network I/O (or async rejection) escapes into later tests.
  neutralizeFetch();
  document.body.innerHTML = "";
  delete (window as unknown as { HAITrack?: unknown }).HAITrack;

  // Build the script tag with data-attributes so document.currentScript resolves.
  // We do NOT set a real src (happy-dom tries to load it); instead we pass the
  // API origin via data-api, which the tracker reads as an explicit override —
  // exactly the documented mechanism for serving the script from a CDN while
  // beacons go elsewhere. This mirrors production config.
  const origin = window.location.origin;
  const script = document.createElement("script");
  script.setAttribute("data-api", origin);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "api") continue;
    script.dataset[k] = v;
  }
  script.textContent = TRACKER_SRC;
  document.head.appendChild(script);
  Object.defineProperty(document, "currentScript", { value: script, configurable: true });
  // eslint-disable-next-line no-eval
  (0, eval)(TRACKER_SRC);
  delete (document as unknown as { currentScript?: unknown }).currentScript;
  return script;
}

/** Stub navigator.sendBeacon and record calls. */
export function stubBeacon() {
  const calls: { url: string; body: string }[] = [];
  Object.defineProperty(navigator, "sendBeacon", {
    value: (url: string, data: Blob) => {
      const entry = { url, body: "" };
      calls.push(entry);
      // Blob.text() is async; capture synchronously if possible, else via microtask.
      try {
        // happy-dom Blob exposes text() as a promise — await in the test.
        Promise.resolve(data.text()).then((t: string) => {
          entry.body = t;
        });
      } catch {
        entry.body = String(data);
      }
      return true;
    },
    configurable: true,
  });
  return calls;
}

/** Stub fetch so the tracker's fallback path makes no real network calls. */
export function stubFetch() {
  Object.defineProperty(window, "fetch", {
    configurable: true,
    value: () => Promise.resolve(new Response("{}", { status: 200 })),
  });
}

/**
 * Point the page at a URL. Uses jsdom's history API so location stays a real
 * Location object (replacing it wholesale breaks localStorage's binding).
 */
export function setLocation(url: string) {
  const u = new URL(url);
  window.history.replaceState({}, "", u.pathname + u.search);
  try {
    Object.defineProperty(window.location, "origin", { value: u.origin, configurable: true });
    Object.defineProperty(window.location, "hostname", { value: u.hostname, configurable: true });
    Object.defineProperty(window.location, "href", { value: u.href, configurable: true });
  } catch {
    /* some jsdom versions seal these — history.replaceState covers the rest */
  }
}

export function setReferrer(ref: string) {
  Object.defineProperty(document, "referrer", { value: ref, configurable: true });
}

/** Reset the shimmed localStorage store between tests. */
export function resetStore() {
  STORE.clear();
}
