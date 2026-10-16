/*!
 * hai-track.js — Holistic AI first-party visit & source tracker (clone port).
 *
 * WHAT IT SOLVES
 * The CRM only ever sees people who converted, and the browser
 * only tells you the referrer of the CURRENT page — by the time someone reaches
 * the demo form three pages later, document.referrer is your own site. This script
 * captures the source at the moment of arrival, keeps first-touch and last-touch
 * separately, and hands both to /api/lead on submit, along with WHICH form on
 * WHICH page was used.
 *
 * CHANNELS (mirrors convex/attribution.ts on the server — keep both in sync):
 *   Direct · Organic Search · Paid Search · Paid Social · Organic Social
 *   Display · AI Assistant · Email · Affiliate · Referral · Campaign · Internal
 *
 * INSTALL (one tag, site-wide):
 *   <script src="https://<hai-brain>/hai-track.js" defer></script>
 * The API origin defaults to wherever this script was served from, so the same
 * tag works in dev and prod. Override with data-api="https://…" if you serve the
 * script from a CDN but want the beacon to go elsewhere.
 *
 * PRIVACY: first-party localStorage only. No cookies, no fingerprinting, no
 * third-party requests, no personal data until the visitor submits a form.
 *
 * Ported from hai-track.js v2.0.0 (artifacts/hai-track.js) — behavior parity
 * with the original; the classifier tables live in @hai/attribution.
 */
(function (window, document) {
  "use strict";
  if (window.HAITrack) return; // never double-install

  /* ─────────────────────────── config ─────────────────────────────────── */

  var SCRIPT = document.currentScript || {};
  var DS = SCRIPT.dataset || {};
  // Default to the origin this script was served from, so the tag needs no
  // editing when the platform moves hosts. data-api still overrides.
  function selfOrigin() {
    try { return new URL(SCRIPT.src).origin; } catch (e) { return ""; }
  }
  var API = DS.api || selfOrigin();
  var CONSENT_REQUIRED = DS.consent === "required";
  var BEACON = DS.beacon !== "off"; // send pageviews to /api/visit
  var DEBUG = DS.debug === "on" || /[?&]haidebug=1/.test(location.search);

  var K_VISITOR = "hai_visitor";
  var K_FIRST = "hai_first_touch";
  var K_LAST = "hai_last_touch";
  var K_SESSION = "hai_session";
  var K_COUNTS = "hai_counts";
  var K_CONSENT = "hai_consent";
  var K_QUEUE = "hai_queue";
  var SESSION_MINUTES = 30; // GA-style inactivity window
  var FIRST_TOUCH_DAYS = 400; // ~13 months, matches a typical B2B sales cycle

  // Form activity — OFF by default: set data-activity="on" on the script tag.
  var ACTIVITY = DS.activity === "on";
  var ACTIVITY_VALUES = { intent: 1, plan: 1, team_size: 1, topic: 1 };
  var EMAIL_OK = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  var actQueue = [];
  var actEmail = null;
  var actTimer = null;
  var actForm = null;
  var actSession = null;

  /* ─────────────────────────── storage (never throws) ─────────────────────── */

  function read(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; } // private mode / storage full / storage blocked
  }
  function remove(key) {
    try { window.localStorage.removeItem(key); } catch (e) {}
  }
  function log() {
    if (DEBUG && window.console) console.log.apply(console, ["[hai-track]"].concat([].slice.call(arguments)));
  }

  /* ─────────────────────────── identity ──────────────────────────────────── */

  // First-party random id, localStorage only. No cookies, no fingerprinting —
  // it exists purely so visit rows can be grouped into sessions and visitors.
  function visitorId() {
    var id = read(K_VISITOR, null);
    if (id) return id;
    var rand;
    try {
      var buf = new Uint8Array(16);
      (window.crypto || window.msCrypto).getRandomValues(buf);
      rand = Array.prototype.map.call(buf, function (b) {
        return ("0" + b.toString(16)).slice(-2);
      }).join("");
    } catch (e) {
      rand = String(Date.now()) + Math.random().toString(16).slice(2);
    }
    write(K_VISITOR, rand);
    return rand;
  }

  function sessionId() {
    var s = read(K_SESSION, null);
    return "s" + ((s && s.started) || Date.now());
  }

  /* ─────────────────────────── classifier (from @hai/attribution) ───────── */

  // Tables + classify() + hasSignal() are inlined below to keep the tracker a
  // single self-contained file (no module loader needed on any page).
  // Source of truth: packages/attribution/src/tables.ts + classify.ts.

  var CLICK_IDS = {
    gclid: ["Google Ads", "Paid Search"],
    gbraid: ["Google Ads", "Paid Search"],
    wbraid: ["Google Ads", "Paid Search"],
    dclid: ["Google Display/YouTube", "Display"],
    msclkid: ["Microsoft Ads", "Paid Search"],
    fbclid: ["Meta", "Paid Social"],
    li_fat_id: ["LinkedIn Ads", "Paid Social"],
    ttclid: ["TikTok Ads", "Paid Social"],
    twclid: ["X Ads", "Paid Social"],
    rdt_cid: ["Reddit Ads", "Paid Social"],
    ScCid: ["Snapchat Ads", "Paid Social"],
    epik: ["Pinterest Ads", "Paid Social"],
    qclid: ["Quora Ads", "Paid Social"],
    tblci: ["Taboola", "Display"],
    dicbo: ["Outbrain", "Display"],
    irclickid: ["Impact", "Affiliate"],
    cjevent: ["Commission Junction", "Affiliate"],
    tduid: ["TradeDoubler", "Affiliate"],
    yclid: ["Yandex/Yahoo", "Paid Search"],
    mc_eid: ["Mailchimp", "Email"],
    mkt_tok: ["Marketo", "Email"],
    _hsenc: ["HubSpot", "Email"]
  };

  var AI = [
    [/(^|\.)chatgpt\.com$/, "ChatGPT"],
    [/(^|\.)chat\.openai\.com$/, "ChatGPT"],
    [/(^|\.)openai\.com$/, "OpenAI"],
    [/(^|\.)perplexity\.ai$/, "Perplexity"],
    [/(^|\.)claude\.ai$/, "Claude"],
    [/(^|\.)anthropic\.com$/, "Claude"],
    [/(^|\.)gemini\.google\.com$/, "Gemini"],
    [/(^|\.)bard\.google\.com$/, "Gemini"],
    [/(^|\.)aistudio\.google\.com$/, "Google AI Studio"],
    [/(^|\.)copilot\.microsoft\.com$/, "Microsoft Copilot"],
    [/(^|\.)edgeservices\.bing\.com$/, "Microsoft Copilot"],
    [/(^|\.)you\.com$/, "You.com"],
    [/(^|\.)poe\.com$/, "Poe"],
    [/(^|\.)phind\.com$/, "Phind"],
    [/(^|\.)deepseek\.com$/, "DeepSeek"],
    [/(^|\.)grok\.com$/, "Grok"],
    [/(^|\.)x\.ai$/, "Grok"],
    [/(^|\.)mistral\.ai$/, "Mistral"],
    [/(^|\.)meta\.ai$/, "Meta AI"],
    [/(^|\.)kagi\.com$/, "Kagi"],
    [/(^|\.)felo\.ai$/, "Felo"],
    [/(^|\.)genspark\.ai$/, "Genspark"],
    [/(^|\.)iask\.ai$/, "iAsk"]
  ];

  var SEARCH = [
    [/(^|\.)google\./, "Google"],
    [/(^|\.)bing\.com$/, "Bing"],
    [/(^|\.)duckduckgo\.com$/, "DuckDuckGo"],
    [/(^|\.)search\.yahoo\./, "Yahoo"],
    [/(^|\.)ecosia\.org$/, "Ecosia"],
    [/(^|\.)search\.brave\.com$/, "Brave"],
    [/(^|\.)startpage\.com$/, "Startpage"],
    [/(^|\.)baidu\.com$/, "Baidu"],
    [/(^|\.)yandex\./, "Yandex"],
    [/(^|\.)naver\.com$/, "Naver"],
    [/(^|\.)qwant\.com$/, "Qwant"]
  ];

  var SOCIAL = [
    [/(^|\.)linkedin\.com$/, "LinkedIn"],
    [/(^|\.)lnkd\.in$/, "LinkedIn"],
    [/(^|\.)facebook\.com$/, "Facebook"],
    [/(^|\.)instagram\.com$/, "Instagram"],
    [/(^|\.)t\.co$/, "X"],
    [/(^|\.)twitter\.com$/, "X"],
    [/(^|\.)x\.com$/, "X"],
    [/(^|\.)youtube\.com$/, "YouTube"],
    [/(^|\.)youtu\.be$/, "YouTube"],
    [/(^|\.)reddit\.com$/, "Reddit"],
    [/(^|\.)tiktok\.com$/, "TikTok"],
    [/(^|\.)news\.ycombinator\.com$/, "Hacker News"],
    [/(^|\.)medium\.com$/, "Medium"],
    [/(^|\.)substack\.com$/, "Substack"],
    [/(^|\.)threads\.(net|com)$/, "Threads"],
    [/(^|\.)quora\.com$/, "Quora"],
    [/(^|\.)slack\.com$/, "Slack"],
    [/(^|\.)teams\.microsoft\.com$/, "Microsoft Teams"]
  ];

  var WEBMAIL = [
    /(^|\.)mail\.google\.com$/,
    /(^|\.)outlook\.(live|office|office365)\.com$/,
    /(^|\.)mail\.yahoo\.com$/,
    /(^|\.)mail\.proton\.me$/
  ];

  // Our own hosts — self-referrals must not be counted as new acquisition.
  // CLONE: add your own domains here.
  var SELF = [
    /(^|\.)holisticai\.com$/,
    /(^|\.)holisticai\.io$/,
    /(^|\.)webflow\.io$/,
    /^localhost$/
  ];

  function hostOf(url) {
    if (!url) return "";
    try { return new URL(url).hostname.toLowerCase().replace(/^www\./, ""); }
    catch (e) { return ""; }
  }
  function lookup(list, h) {
    if (!h) return null;
    for (var i = 0; i < list.length; i++) if (list[i][0].test(h)) return list[i][1];
    return null;
  }
  function isSelf(h) {
    for (var i = 0; i < SELF.length; i++) if (SELF[i].test(h)) return true;
    return false;
  }

  /**
   * Classify a visit. Precedence, strongest signal first:
   *   AI assistant → explicit utm_medium → click ID → referrer host → Direct
   */
  function classify(v) {
    var med = String(v.utm_medium || "").toLowerCase();
    var srcRaw = v.utm_source || "";
    var src = String(srcRaw).toLowerCase();
    var ref = hostOf(v.referrer);
    var click = v.click_id_param
      ? { param: v.click_id_param, platform: (CLICK_IDS[v.click_id_param] || [])[0], channel: (CLICK_IDS[v.click_id_param] || [])[1] }
      : null;
    var out = function (channel, platform) {
      return { channel: channel, platform: platform || (click ? click.platform : null) || null };
    };

    // AI first — before search, so gemini.google.com isn't read as Google organic.
    var ai = lookup(AI, ref) || lookup(AI, hostOf("https://" + src)) || lookup(AI, src);
    if (med === "ai" || med === "ai-assistant" || ai) return out("AI Assistant", ai || srcRaw || null);

    if (med) {
      if (/^(cpc|ppc|paid|paidsearch|paid-search|paid_search|sem|adwords)$/.test(med)) return out("Paid Search", srcRaw);
      if (/^(paidsocial|paid-social|paid_social)$/.test(med)) return out("Paid Social", srcRaw);
      if (/^(display|banner|cpm|programmatic|native)$/.test(med)) return out("Display", srcRaw);
      if (/^(social|social-media|social_media|organic-social)$/.test(med)) {
        var paid = click && click.channel === "Paid Social";
        return out(paid ? "Paid Social" : "Organic Social", srcRaw || lookup(SOCIAL, ref));
      }
      if (/^(email|e-mail|newsletter|mail)$/.test(med)) return out("Email", srcRaw);
      if (/^(affiliate|partner)$/.test(med)) return out("Affiliate", srcRaw);
      if (/^(referral|referrer)$/.test(med)) return out("Referral", srcRaw || ref);
      if (med === "organic") return out("Organic Search", lookup(SEARCH, ref) || srcRaw);
      return out("Campaign", srcRaw || null); // tagged but unrecognised — don't lose it
    }

    if (click && click.channel) return out(click.channel, click.platform);

    if (ref) {
      if (isSelf(ref)) return out("Internal", null);
      for (var i = 0; i < WEBMAIL.length; i++) if (WEBMAIL[i].test(ref)) return out("Email", "Webmail");
      var s = lookup(SEARCH, ref); if (s) return out("Organic Search", s);
      var so = lookup(SOCIAL, ref); if (so) return out("Organic Social", so);
      return out("Referral", ref);
    }

    if (srcRaw || v.utm_campaign) return out("Campaign", srcRaw || null);
    return out("Direct", null);
  }

  /* ─────────────────────────── capture this visit ─────────────────────────── */

  function currentVisit() {
    var q;
    try { q = new URLSearchParams(location.search); } catch (e) { q = { get: function () { return null; } }; }
    var get = function (k) { var v = q.get(k); return v ? String(v).slice(0, 500) : null; };

    // First click ID present in the URL.
    var clickParam = null, clickValue = null;
    for (var key in CLICK_IDS) {
      if (Object.prototype.hasOwnProperty.call(CLICK_IDS, key) && q.get(key)) {
        clickParam = key; clickValue = get(key); break;
      }
    }

    var ref = document.referrer || "";
    // A same-site referrer is navigation, not acquisition — drop it so page 3 of
    // a visit doesn't overwrite the real source with our own domain.
    if (ref && isSelf(hostOf(ref))) ref = "";

    var v = {
      utm_source: get("utm_source"),
      utm_medium: get("utm_medium"),
      utm_campaign: get("utm_campaign"),
      utm_term: get("utm_term"),
      utm_content: get("utm_content"),
      // `ref` is a common hand-rolled alternative to utm_source; accept it.
      ref_param: get("ref"),
      click_id_param: clickParam,
      click_id: clickValue,
      referrer: ref || null,
      landing_page: location.origin + location.pathname + location.search,
      ts: new Date().toISOString()
    };
    if (!v.utm_source && v.ref_param) v.utm_source = v.ref_param;
    var c = classify(v);
    v.channel = c.channel;
    v.platform = c.platform;
    if (clickParam) v[clickParam] = clickValue; // forwarded verbatim to the API
    return v;
  }

  /** Does this visit carry a source strong enough to start a new attribution? */
  function hasSignal(v) {
    return Boolean(v.utm_source || v.utm_medium || v.utm_campaign || v.click_id_param || v.referrer);
  }

  /* ─────────────────────────── session + counters ─────────────────────────── */

  function touchSession(visit) {
    var now = Date.now();
    var s = read(K_SESSION, null);
    var counts = read(K_COUNTS, { pageviews: 0, sessions: 0 });
    var expired = !s || (now - (s.last || 0)) > SESSION_MINUTES * 60 * 1000;
    // A fresh campaign click starts a new session even mid-visit — that's how
    // GA4 behaves, and it keeps "which ad converted?" answerable.
    var newCampaign = s && hasSignal(visit) && visit.channel !== "Internal" &&
      (visit.utm_campaign || null) !== (s.campaign || null);

    if (expired || newCampaign) {
      counts.sessions = (counts.sessions || 0) + 1;
      s = { started: now, sid: "s" + now, campaign: visit.utm_campaign || null, channel: visit.channel };
    }
    s.last = now;
    counts.pageviews = (counts.pageviews || 0) + 1;
    write(K_SESSION, s);
    write(K_COUNTS, counts);
    return { session: s, counts: counts, isNewSession: expired || newCampaign };
  }

  /* ─────────────────────────── attribution state ──────────────────────────── */

  var state = { first: null, last: null, counts: { pageviews: 0, sessions: 0 } };

  function recordVisit() {
    var v = currentVisit();
    var first = read(K_FIRST, null);
    var last = read(K_LAST, null);

    // First-touch is written once and then left alone — that's the whole point.
    // It expires after FIRST_TOUCH_DAYS so a returning stranger isn't credited
    // to a campaign from two years ago.
    var firstStale = first && first.ts &&
      (Date.now() - new Date(first.ts).getTime()) > FIRST_TOUCH_DAYS * 864e5;
    if (!first || firstStale) { first = v; write(K_FIRST, first); }

    // Last-touch only advances on a real new signal. Internal navigation and
    // signal-less pageviews must NOT overwrite it, or every lead becomes Direct.
    if (!last || (hasSignal(v) && v.channel !== "Internal")) { last = v; write(K_LAST, last); }

    var t = touchSession(v);
    state = { first: first, last: last, counts: t.counts, current: v, isNewSession: t.isNewSession };
    log("visit", v.channel, v.platform || "", "| first:", first.channel, "| last:", last.channel);
    return state;
  }

  /* ─────────────────────────── form identification ────────────────────────── */

  /**
   * Name a form so the CRM note can say WHICH form was filled in.
   * Priority: explicit data-hai-form → aria-label → submit button text
   *           → nearest preceding heading → "Website form".
   */
  function formName(form) {
    if (!form) return null;
    var explicit = form.getAttribute("data-hai-form") || form.getAttribute("data-name");
    if (explicit) return explicit.slice(0, 120);
    var aria = form.getAttribute("aria-label");
    if (aria) return aria.slice(0, 120);
    var btn = form.querySelector('[type="submit"], button');
    var btnText = btn && (btn.value || btn.textContent || "").trim();
    var heading = null, node = form;
    for (var hop = 0; hop < 4 && node && !heading; hop++) {
      node = node.parentElement;
      if (node) { var h = node.querySelector("h1, h2, h3"); if (h) heading = (h.textContent || "").trim(); }
    }
    return (heading || btnText || form.id || form.getAttribute("name") || "Website form").slice(0, 120);
  }

  function formContext(form) {
    return {
      form_name: formName(form),
      form_id: (form && (form.id || form.getAttribute("data-hai-form-id"))) || null,
      form_page_url: location.origin + location.pathname + location.search,
      page_title: (document.title || "").slice(0, 200)
    };
  }

  /* ─────────────────────────── public payload ─────────────────────────────── */

  /**
   * The flat object to merge into the /api/lead POST body. Field names match
   * exactly what the API destructures.
   */
  function fields(form) {
    var f = state.first || {}, l = state.last || {}, c = state.counts || {};
    var out = {
      // last touch — the visit that converted
      utm_source: l.utm_source || null,
      utm_medium: l.utm_medium || null,
      utm_campaign: l.utm_campaign || null,
      utm_term: l.utm_term || null,
      utm_content: l.utm_content || null,
      referrer: l.referrer || null,
      landing_page: l.landing_page || null,
      gclid: l.gclid || null,
      // first touch — how they originally found us
      first_utm_source: f.utm_source || null,
      first_utm_medium: f.utm_medium || null,
      first_utm_campaign: f.utm_campaign || null,
      first_referrer: f.referrer || null,
      first_landing_page: f.landing_page || null,
      first_seen_at: f.ts || null,
      // engagement before converting
      pageview_count: c.pageviews || 0,
      session_count: c.sessions || 0
    };
    // Forward whichever click ID we actually saw, under its real param name.
    if (l.click_id_param && l.click_id) out[l.click_id_param] = l.click_id;
    if (form) {
      var fc = formContext(form);
      for (var k in fc) if (Object.prototype.hasOwnProperty.call(fc, k)) out[k] = fc[k];
    }
    return out;
  }

  /**
   * Mirror the payload into hidden inputs, for forms that post somewhere we don't
   * control (native submits, HubSpot embeds, Marketo). Creates any input
   * that doesn't already exist.
   */
  function fillHiddenFields(form) {
    if (!form) return;
    var data = fields(form);
    for (var name in data) {
      if (!Object.prototype.hasOwnProperty.call(data, name)) continue;
      var el = form.querySelector('[name="' + name + '"]');
      if (!el) {
        el = document.createElement("input");
        el.type = "hidden";
        el.name = name;
        form.appendChild(el);
      }
      if (el.type === "hidden" || !el.value) el.value = data[name] == null ? "" : String(data[name]);
    }
  }

  /* ─────────────────────────── pageview beacon ────────────────────────────── */

  function beacon(extra) {
    if (!BEACON || !consented()) return;
    var cur = state.current || {};
    var last = state.last || {};
    var params = {
      utm_source: last.utm_source || null,
      utm_medium: last.utm_medium || null,
      utm_campaign: last.utm_campaign || null,
      utm_term: last.utm_term || null,
      utm_content: last.utm_content || null
    };
    if (last.click_id_param && last.click_id) params[last.click_id_param] = last.click_id;
    var body = JSON.stringify({
      type: (extra && extra.type) || "pageview",
      visitorId: visitorId(),
      sessionId: sessionId(),
      isFirstTouch: Boolean(state.first && state.current && state.first.ts === state.current.ts),
      isNewSession: Boolean(state.isNewSession),
      consent: consented(),
      channel: cur.channel || null,
      platform: cur.platform || null,
      referrer: last.referrer || null,
      landingPage: cur.landing_page || null,
      pageTitle: (document.title || "").slice(0, 200),
      params: params,
      ts: new Date().toISOString()
    });
    try {
      // `/api/visit`, NOT `/api/track`. Generic privacy blocklists match the PATH
      // `/api/track`, so the browser refused the beacon outright.
      var beaconUrl = API + "/api/visit";
      // The Blob type MUST stay text/plain. An application/json body makes this a
      // non-simple cross-origin request, which needs a CORS preflight — and
      // sendBeacon cannot preflight. text/plain is simple, no preflight.
      if (navigator.sendBeacon) {
        navigator.sendBeacon(beaconUrl, new Blob([body], { type: "text/plain" }));
      } else {
        fetch(beaconUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: body, keepalive: true }).catch(function () {});
      }
    } catch (e) {}
  }

  /* ─────────────────────────── consent gate ───────────────────────────────── */

  function consented() {
    if (!CONSENT_REQUIRED) return true;
    return read(K_CONSENT, false) === true;
  }

  /* ─────────────────── form activity (pre-submit) ─────────────────────────── */

  function harvestEmail(form) {
    if (!form) return;
    var inputs = form.querySelectorAll('input[type="email"], input[name*="email" i]');
    for (var i = 0; i < inputs.length; i++) {
      var val = (inputs[i].value || "").trim();
      if (EMAIL_OK.test(val)) { actEmail = val.toLowerCase(); return; }
    }
  }

  function queueActivity(type, el) {
    if (!ACTIVITY) { log("activity off — set data-activity=\"on\" on the script tag"); return; }
    if (!consented()) { log("activity held — consent not granted"); return; }
    var field = fieldNameOf(el);
    if (!field) { log("activity ignored — no field name on", el && el.tagName); return; }
    var val = el && typeof el.value === "string" ? el.value : "";
    if (isEmailField(el, field) && EMAIL_OK.test(val.trim())) actEmail = val.trim().toLowerCase();
    var ev = { type: type, field: field, filled: val.length > 0, length: val.length, at: Date.now() };
    if (ACTIVITY_VALUES[field]) ev.value = val.slice(0, 60);
    actQueue.push(ev);
    if (actQueue.length >= 20) flushActivity();
    else {
      if (actTimer) clearTimeout(actTimer);
      actTimer = setTimeout(flushActivity, 4000);
    }
  }

  function flushActivity() {
    if (!actQueue.length || !ACTIVITY) return;
    harvestEmail(actForm);
    var payload = fields(actForm);
    payload.sessionId = activitySessionId();
    payload.events = actQueue.splice(0, actQueue.length);
    if (actEmail) payload.email = actEmail;
    payload.page_path = location.pathname;
    var url = selfOrigin() + "/api/form-activity";
    var body = JSON.stringify(payload);
    log("activity flush →", url, payload.events.length + " event(s)", payload.email || "no email");
    // sendBeacon survives the tab closing — exactly when an abandoned session's
    // last events would otherwise be lost. text/plain = no preflight.
    if (navigator.sendBeacon) {
      try {
        if (navigator.sendBeacon(url, new Blob([body], { type: "text/plain;charset=UTF-8" }))) return;
      } catch (e) {}
    }
    try {
      fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: body, keepalive: true, mode: "cors" });
    } catch (e) { log("activity beacon failed", e); }
  }

  function fieldNameOf(el) {
    if (!el) return null;
    return el.name || el.id || el.getAttribute("data-field") || null;
  }

  function isEmailField(el, field) {
    return el.type === "email" || /email/i.test(field);
  }

  function activitySessionId() {
    if (!actSession) actSession = "a" + Date.now() + Math.random().toString(16).slice(2, 8);
    return actSession;
  }

  /**
   * The element the event REALLY came from. A form inside a web component's
   * shadow root retargets e.target to the custom-element host, so a
   * document-level listener misses every keystroke. composedPath()[0] is the
   * actual inner target.
   */
  function realTarget(e) {
    if (e && typeof e.composedPath === "function") {
      var path = e.composedPath();
      if (path && path.length) return path[0];
    }
    return e.target;
  }

  function watchFormActivity() {
    if (!ACTIVITY) return;
    var onFocus = function (e) {
      var el = realTarget(e);
      if (el && el.tagName && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) {
        if (!actForm || !actForm.contains(el)) actForm = el.form || el.closest("form");
        queueActivity("focus", el);
      }
    };
    var onInput = function (e) {
      var el = realTarget(e);
      if (el && el.tagName && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) {
        if (!actForm || !actForm.contains(el)) actForm = el.form || el.closest("form");
        queueActivity("input", el);
      }
    };
    var onBlur = function (e) {
      var el = realTarget(e);
      if (el && el.tagName && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) queueActivity("blur", el);
    };
    document.addEventListener("focusin", onFocus, true);
    document.addEventListener("input", onInput, true);
    document.addEventListener("focusout", onBlur, true);
    window.addEventListener("pagehide", flushActivity);
  }

  /* ─────────────────────────── init ──────────────────────────────────────── */

  function init() {
    if (!consented()) {
      // Hold the arrival signal in memory so granting consent later still gets
      // the true source rather than a self-referral from a subsequent page.
      state.pending = currentVisit();
      log("consent required — holding visit in memory");
      return;
    }
    recordVisit();
    beacon();
    // Pre-fill any forms already on the page.
    var forms = document.querySelectorAll("form");
    for (var i = 0; i < forms.length; i++) fillHiddenFields(forms[i]);
    watchFormActivity();
  }

  // Client-side route changes (any SPA nav) — count the pageview,
  // but do not re-run attribution: it would be a self-referral.
  var lastPath = location.pathname + location.search;
  function onRouteChange() {
    var now = location.pathname + location.search;
    if (now === lastPath) return;
    lastPath = now;
    if (!consented()) return;
    var counts = read(K_COUNTS, { pageviews: 0, sessions: 0 });
    counts.pageviews = (counts.pageviews || 0) + 1;
    write(K_COUNTS, counts);
    var s = read(K_SESSION, {}); s.last = Date.now(); write(K_SESSION, s);
    state.counts = counts;
    beacon();
  }
  ["pushState", "replaceState"].forEach(function (m) {
    var orig = history[m];
    if (typeof orig !== "function") return;
    history[m] = function () { var r = orig.apply(this, arguments); onRouteChange(); return r; };
  });
  window.addEventListener("popstate", onRouteChange);

  // Late-rendered forms (embeds, modals) get their hidden fields too.
  if (window.MutationObserver) {
    new MutationObserver(function (muts) {
      if (!consented()) return;
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var n = added[j];
          if (n.nodeType !== 1) continue;
          if (n.tagName === "FORM") fillHiddenFields(n);
          else if (n.querySelectorAll) {
            var fs = n.querySelectorAll("form");
            for (var k = 0; k < fs.length; k++) fillHiddenFields(fs[k]);
          }
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  /* ─────────────────────────── public API ─────────────────────────────────── */

  window.HAITrack = {
    /** Full attribution state — { first, last, counts, current }. */
    get: function () { return JSON.parse(JSON.stringify(state)); },
    /** Flat payload to merge into a /api/lead POST. Pass the form for form identity. */
    fields: fields,
    /** Human-readable channel of the converting visit, e.g. "Paid Search". */
    channel: function () { return (state.last || {}).channel || "Direct"; },
    /** Name we'd report for a given form element. */
    formName: formName,
    /** Inject/refresh hidden inputs on a form. */
    fill: fillHiddenFields,
    /** Custom event beacon, e.g. HAITrack.track("pricing_cta_click"). */
    track: function (type) { beacon({ type: type || "event" }); },
    /** Is the abandoned-form path actually armed? */
    activity: function () {
      return {
        enabled: ACTIVITY,
        consented: consented(),
        endpoint: selfOrigin() + "/api/form-activity",
        sessionId: actSession,
        emailCaptured: actEmail,
        queued: actQueue.length,
        formName: actForm ? formName(actForm) : null
      };
    },
    /** Send whatever is buffered right now, instead of waiting for the timer. */
    flushActivity: flushActivity,
    /** Call from your cookie banner when the visitor accepts. */
    grantConsent: function () {
      write(K_CONSENT, true);
      // Replay the arrival we held in memory so the real source isn't lost.
      if (state.pending) {
        var v = state.pending;
        if (!read(K_FIRST, null)) write(K_FIRST, v);
        if (hasSignal(v)) write(K_LAST, v);
        state.pending = null;
      }
      init();
    },
    revokeConsent: function () {
      [K_VISITOR, K_FIRST, K_LAST, K_SESSION, K_COUNTS, K_CONSENT, K_QUEUE].forEach(function (k) { remove(k); });
      state = { first: null, last: null, counts: { pageviews: 0, sessions: 0 } };
    },
    version: "2.0.0"
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window, document);
