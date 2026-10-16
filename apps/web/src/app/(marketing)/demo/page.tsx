import { Container, Section } from "../../../components/primitives";

const FORM_SLUG = process.env.NEXT_PUBLIC_DEMO_FORM_SLUG || "demo-request-ux7tu";
const MIN_HEIGHT = 560;

export default function DemoPage() {
  return (
    <Section>
      <Container>
        <div className="demo-layout">
          <div className="demo-copy">
            <h1 className="t-h1">Schedule a demo</h1>
            <p>
              See how Holistic AI discovers, tests and governs every AI system in your estate —
              from shadow AI discovery to red teaming and audit evidence.
            </p>
            <ul className="demo-list">
              <li>Discover AI across AWS, Azure, GitHub and Databricks</li>
              <li>Test models, LLMs and agents for security, safety and bias</li>
              <li>Produce audit-ready compliance evidence</li>
            </ul>
          </div>

          <div className="demo-embed">
            {/* Embed contract: parent iframe, child reports height via postMessage */}
            <div data-hai-form={FORM_SLUG} data-hai-min-height={MIN_HEIGHT}>
              <iframe
                src={`${process.env.NEXT_PUBLIC_HAI_BRAIN_URL || "http://localhost:3001"}/f/${FORM_SLUG}?embed=1`}
                title="Schedule a demo with Holistic AI"
                referrerPolicy="no-referrer-when-downgrade"
                scrolling="no"
                allowTransparency
                style={{
                  width: "100%",
                  border: 0,
                  minHeight: `${MIN_HEIGHT}px`,
                  display: "block",
                  background: "transparent",
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
