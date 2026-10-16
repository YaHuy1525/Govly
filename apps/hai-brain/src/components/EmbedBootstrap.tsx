"use client";

import { useEffect, useRef, useState } from "react";
import { parseTheme, applyTheme } from "../lib/theme";

/**
 * Embed-mode bootstrap (ported from the original's inline scripts):
 * 1. detect embed (iframe or ?embed=1) → body.embed class
 * 2. apply theme from query params
 * 3. report height to parent via postMessage
 * 4. expose window.__haiApplyTheme runtime API
 */
export function EmbedBootstrap({ slug }: { slug: string }) {
  useEffect(() => {
    let embedded = false;
    try {
      embedded = window.self !== window.top;
    } catch {
      embedded = true;
    }
    if (embedded || /[?&]embed=1(?:&|$)/.test(location.search)) {
      document.body.classList.add("embed");
    }

    // theme from query params
    const result = parseTheme(location.search);
    const root = document.documentElement;
    for (const [prop, val] of Object.entries(result.vars)) {
      root.style.setProperty(prop, val);
    }
    if (result.theme) root.style.colorScheme = result.theme;
    if (result.card === true) root.classList.add("f-card");
    if (result.card === false) root.classList.remove("f-card");
    if (result.layout === "two-column") root.classList.add("f-two-column");
    if (result.layout === "stacked") root.classList.add("f-stacked");

    // runtime theming API
    (window as unknown as { __haiApplyTheme: typeof applyTheme }).__haiApplyTheme = applyTheme;

    // height reporting to parent
    let last = 0;
    const report = () => {
      const h = document.body.scrollHeight;
      if (h !== last) {
        last = h;
        try {
          parent.postMessage({ type: "hai-form-height", slug, height: h }, "*");
        } catch {}
      }
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(document.body);
    const mo = new MutationObserver(report);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("load", report);

    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("load", report);
    };
  }, [slug]);

  return null;
}

/** Hook: current form height + post-submit navigate helper for embed mode. */
export function useEmbed() {
  return {
    navigate: (url: string) => {
      try {
        parent.postMessage({ type: "hai-navigate", url }, "*");
      } catch {
        location.href = url;
      }
    },
  };
}

/** Debounced height probe used inside the form component after state changes. */
export function useHeightReporter(slug: string) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      try {
        parent.postMessage({ type: "hai-form-height", slug, height: h }, "*");
      } catch {}
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [slug]);
  return ref;
}
