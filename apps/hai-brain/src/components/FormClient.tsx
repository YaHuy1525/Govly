"use client";

import { useState } from "react";
import { useHeightReporter, useEmbed } from "./EmbedBootstrap";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface Props {
  slug: string;
  title: string;
}

/**
 * The demo form — exact fields from the original:
 * Full Name*, Work email*, "What brings you here?"* (select),
 * "What are you looking for?"* (textarea 10–200 with counter),
 * consent checkbox (required, pre-checked).
 */
export function FormClient({ slug, title }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const heightRef = useHeightReporter(slug);
  const { navigate } = useEmbed();

  const valid =
    name.trim().length > 0 &&
    EMAIL.test(email.trim()) &&
    intent !== "" &&
    message.trim().length >= 10 &&
    message.length <= 200 &&
    consent;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || status === "submitting") return;
    setStatus("submitting");
    setError(null);

    // Merge attribution payload from the tracker when present.
    let attribution: Record<string, unknown> = {};
    try {
      const tracker = (window as unknown as { HAITrack?: { fields: (f?: unknown) => Record<string, unknown> } }).HAITrack;
      if (tracker) attribution = tracker.fields();
    } catch {}

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          intent,
          message: message.trim(),
          form_name: slug,
          form_id: slug,
          form_page_url: (typeof location !== "undefined" ? location.href : "") || null,
          page_title: (typeof document !== "undefined" ? document.title : "") || null,
          ...attribution,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      // In embed mode the parent redirects; standalone shows confirmation.
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div ref={heightRef} className="nf-success">
        <h2>Thanks — we&apos;ll be in touch</h2>
        <p>A member of our team will reach out within one business day.</p>
      </div>
    );
  }

  return (
    <div ref={heightRef}>
      <div className="public-form-head">
        <h1>{title}</h1>
      </div>
      <form className="nf-form" onSubmit={submit} noValidate>
        <label className="nf-field">
          <span>
            Full Name<i aria-hidden="true">*</i>
          </span>
          <input
            type="text"
            required
            placeholder="Jane"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </label>

        <label className="nf-field">
          <span>
            Work email<i aria-hidden="true">*</i>
          </span>
          <input
            type="email"
            required
            placeholder="jane@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="nf-field">
          <span>
            What brings you here?<i aria-hidden="true">*</i>
          </span>
          <select required value={intent} onChange={(e) => setIntent(e.target.value)}>
            <option value="" selected>
              Select…
            </option>
            <option>A solution for my company</option>
            <option>A partnership</option>
          </select>
        </label>

        <label className="nf-field">
          <span>
            What are you looking for?<i aria-hidden="true">*</i>
          </span>
          <textarea
            required
            minLength={10}
            maxLength={200}
            placeholder="e.g. Shadow AI discovery, red teaming and audit evidence - the whole AI governance platform, end to end."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <small className="nf-count">
            {message.length < 10
              ? `At least ${10 - message.length} more characters`
              : `${message.length}/200`}
          </small>
        </label>

        <label className="nf-consent">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            Holistic AI needs the contact information you provide to us to contact you about our
            products and services. You may unsubscribe from these communications at anytime. For
            information on how to unsubscribe, as well as our privacy practices and commitment to
            protecting your privacy, check out our{" "}
            <a href="https://www.holisticai.com/privacy-policy" target="_blank" rel="noreferrer noopener">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <button type="submit" disabled={!valid || status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Request a demo"}
        </button>

        {error && <p className="nf-error">{error}</p>}

        <p className="nf-contact">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
            <rect x="2" y="4" width="20" height="16" rx="2" />
          </svg>
          <span>Trouble submitting?</span>{" "}
          <a href="mailto:hello@holisticai.com">hello@holisticai.com</a>
        </p>
      </form>
    </div>
  );
}
