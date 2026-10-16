/**
 * Theme system for the embeddable form.
 * Ported from the original's query-param contract (form-embed.html inline script).
 *
 * Query params: theme=light|dark, card=true|false, accent, bg, pageBg, text,
 * muted, label, border, inputBg, radius, font, layout=two-column|stacked,
 * cardBorder, titleSize, buttonRadius, weight, maxWidth, link.
 */

const COLOR = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([0-9 .,%/deg]+\)|[a-z]{3,20})$/i;
const NUM = /^\d{1,3}(\.\d+)?$/;
const FONT = /^[a-z0-9 ,'"-]{1,80}$/i;

const PROP_MAP: Record<string, string> = {
  accent: "--f-accent",
  accentText: "--f-accent-text",
  bg: "--f-card",
  pageBg: "--f-page",
  text: "--f-text",
  muted: "--f-muted",
  label: "--f-label",
  border: "--f-border",
  inputBg: "--f-input-bg",
  radius: "--f-radius",
  font: "--f-font",
  layout: "--f-layout",
  cardBorder: "--f-card-border",
  titleSize: "--f-title-size",
  buttonRadius: "--f-button-radius",
  weight: "--f-weight",
  maxWidth: "--f-max-width",
  link: "--f-link",
};

const PRESETS: Record<string, Record<string, string>> = {
  light: {
    "--f-page": "#F9FAFB",
    "--f-card": "#FFFFFF",
    "--f-text": "#101828",
    "--f-label": "#182230",
    "--f-muted": "#667085",
    "--f-placeholder": "#98A2B3",
    "--f-border": "#D0D5DD",
    "--f-input-bg": "#FFFFFF",
    "--f-accent": "#5049F9",
    "--f-accent-text": "#FFFFFF",
    "--f-radius": "9px",
    "--f-card-radius": "14px",
    "--f-card-border": "1px",
    "--f-shadow": "0 12px 38px rgba(20, 30, 55, .06)",
  },
  dark: {
    "--f-page": "#0B0B0C",
    "--f-card": "#141416",
    "--f-text": "#F3F4F6",
    "--f-label": "#E5E7EB",
    "--f-muted": "#9CA3AF",
    "--f-placeholder": "#6B7280",
    "--f-border": "#2A2B30",
    "--f-input-bg": "#0F0F11",
    "--f-accent": "#BFD7F5",
    "--f-accent-text": "#0B0B0B",
    "--f-radius": "8px",
    "--f-card-radius": "16px",
    "--f-card-border": "1px",
    "--f-shadow": "0 24px 60px rgba(0, 0, 0, .45)",
  },
};

function validate(prop: string, value: string): string | null {
  if (!value) return null;
  const v = value.trim();
  if (prop === "--f-max-width") {
    if (v === "none") return v;
    const n = v.replace(/px$/i, "");
    return /^\d{2,4}$/.test(n) ? n + "px" : null;
  }
  if (prop === "--f-weight") return /^[1-9]00$/.test(v) ? v : null;
  if (prop === "--f-radius" || prop === "--f-button-radius") {
    const n = v.replace(/px$/i, "");
    return NUM.test(n) ? n + "px" : null;
  }
  if (prop === "--f-card-border") {
    if (v === "false" || v === "0" || v === "none") return "0";
    if (v === "true" || v === "1") return "1px";
    return null;
  }
  if (prop === "--f-layout") return v === "two-column" || v === "stacked" ? v : null;
  if (prop === "--f-font") return FONT.test(v) ? v : null;
  return COLOR.test(v) ? v : null;
}

export interface ThemeResult {
  vars: Record<string, string>;
  theme: string | null;
  card: boolean | null;
  layout: string | null;
}

/** Parse theme from a search string (e.g. "?theme=dark&accent=%23fff"). */
export function parseTheme(search: string): ThemeResult {
  const q = new URLSearchParams(search);
  const vars: Record<string, string> = {};
  let layout: string | null = null;

  const theme = q.get("theme");
  if (theme && PRESETS[theme]) {
    Object.assign(vars, PRESETS[theme]);
  }

  const card = q.get("card");
  for (const [param, prop] of Object.entries(PROP_MAP)) {
    const v = q.get(param);
    if (v) {
      const ok = validate(prop, v);
      if (ok) {
        vars[prop] = ok;
        if (prop === "--f-layout") layout = ok;
      }
    }
  }
  return { vars, theme: theme && PRESETS[theme] ? theme : null, card: card ? card === "true" : null, layout };
}

/** Apply vars to a style object (for SSR) or documentElement (client). */
export function themeStyleObject(result: ThemeResult): React.CSSProperties {
  return result.vars as React.CSSProperties;
}

/** Runtime API: window.__haiApplyTheme(obj) */
export function applyTheme(obj: Record<string, string>): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (obj.theme && PRESETS[obj.theme]) {
    Object.assign(obj, PRESETS[obj.theme]);
    root.style.colorScheme = obj.theme;
  }
  for (const [param, prop] of Object.entries(PROP_MAP)) {
    const v = obj[param];
    if (typeof v === "string") {
      const ok = validate(prop, v);
      if (ok) root.style.setProperty(prop, ok);
    }
  }
}
