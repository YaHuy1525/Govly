import { Container, Section, Button } from "../../components/primitives";
import { StatCard } from "../../components/StatCard";
import { LogoWall } from "../../components/LogoWall";

const STATS = [
  { value: "63%", label: "of organizations have no AI governance policy", source: "IBM 2025" },
  { value: "€35M", label: "maximum EU AI Act penalty (or 7% of turnover)", source: "EU AI Act, Art. 99" },
  { value: "+$670K", label: "additional breach cost with high shadow AI use", source: "IBM, Cost of a Data Breach 2025" },
  { value: "8–16", label: "weeks deployment delay per AI system under manual governance", source: "Holistic AI customer data" },
];

const INTEGRATIONS = ["AWS", "Azure", "GitHub", "Databricks", "S3", "Kubernetes", "Slack", "Jira"];

const INVENTORY_ROWS = [
  { system: "Claims triage agent", risk: "High", owner: "Operations" },
  { system: "Customer assistant", risk: "Limited", owner: "Customer success" },
  { system: "Forecasting model", risk: "Minimal", owner: "Finance" },
];

const LOGOS = [
  "Unilever", "Mapfre", "Johnson Controls", "PMI", "Ebay", "GE Healthcare",
  "SLB", "Allegis", "Manpower", "GSK", "Mindbridge", "Starling Bank",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Section className="hero">
        <Container>
          <div className="hero__inner">
            <p className="t-label">Agentic AI Governance</p>
            <h1 className="t-hero hero__title">Govern AI across your enterprise.</h1>
            <p className="hero__sub">
              Discover every model, agent, and application. Assess AI risk, enforce policies,
              and bring your teams together around continuous governance.
            </p>
            <div className="hero__ctas">
              <Button href="/demo">Get a demo</Button>
              <Button href="/ai-governance-platform" variant="secondary">
                Explore the platform
              </Button>
            </div>
            <p className="hero__trust">Trusted by enterprises shaping the future of AI</p>
            <div className="badge badge--gartner hero__gartner">
              ★ Named a Challenger — 2026 Gartner® Magic Quadrant™ for AI Governance Platforms
            </div>
          </div>
        </Container>
      </Section>

      {/* Problem */}
      <Section bg="grey">
        <Container>
          <h2 className="t-h2 section__title">AI is shipping faster than you can govern it.</h2>
          <p className="section__lede">
            New AI agents, LLMs and vendor tools go live every week, while your AI inventory,
            risk assessments and compliance evidence still live in spreadsheets.
          </p>
          <div className="stats-grid">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Governed vs shadow */}
      <Section>
        <Container>
          <h2 className="t-h2 section__title">Most enterprise AI runs outside governance</h2>
          <div className="compare-grid">
            <div className="compare-card compare-card--good">
              <h3>Governed</h3>
              <ul>
                <li>Known, tested, owned</li>
                <li>Risk assessed after launch</li>
                <li>Evidence assembled automatically</li>
              </ul>
            </div>
            <div className="compare-card compare-card--warn">
              <h3>Known, untested</h3>
              <ul>
                <li>In the inventory, never tested</li>
                <li>Bias, hallucinations, drift unknown</li>
                <li>Manual compliance</li>
              </ul>
            </div>
            <div className="compare-card compare-card--bad">
              <h3>Shadow AI</h3>
              <ul>
                <li>No AI inventory</li>
                <li>LLMs and agents with no owner</li>
                <li>Compliance proven by hand</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Solution */}
      <Section bg="soft">
        <Container>
          <h2 className="t-h2 section__title">
            Govern every AI system automatically, continuously and ready for audit.
          </h2>
          <p className="section__lede">
            Our Agentic AI Governance platform gives enterprises complete visibility and control —
            discover every AI system, assess and monitor risk continuously, and enforce compliance
            across your entire AI portfolio. It connects to your cloud, code and SaaS, discovers
            every AI system, tests it and enforces your policies with evidence your auditors can trust.
          </p>
          <div className="integration-row">
            {INTEGRATIONS.map((name) => (
              <span key={name} className="integration-chip">
                {name}
              </span>
            ))}
            <span className="integration-chip integration-chip--more">20+ integrations</span>
          </div>
        </Container>
      </Section>

      {/* Inventory demo */}
      <Section>
        <Container>
          <h2 className="t-h2 section__title">Discover shadow AI. Build a living AI inventory.</h2>
          <p className="section__lede">
            Find every model, agent and AI application across cloud, code and SaaS — in one
            inventory that stays current.
          </p>
          <div className="inventory-card">
            <div className="inventory-card__head">
              <span>⌘ AI inventory</span>
              <span className="inventory-card__badge">Continuously synced</span>
            </div>
            <p className="inventory-card__count">128 AI systems in one place + 3 discovered</p>
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>AI system</th>
                  <th>Risk level</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {INVENTORY_ROWS.map((r) => (
                  <tr key={r.system}>
                    <td>{r.system}</td>
                    <td>
                      <span className={`risk-pill risk-pill--${r.risk.toLowerCase()}`}>{r.risk}</span>
                    </td>
                    <td>{r.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="inventory-card__foot">✓ Connected: AWS, Azure, GitHub and Databricks</p>
          </div>
        </Container>
      </Section>

      {/* Logo wall */}
      <Section bg="grey">
        <Container>
          <LogoWall logos={LOGOS} label="Trusted by the world's most innovative companies" />
        </Container>
      </Section>

      {/* Final CTA */}
      <Section>
        <Container>
          <div className="cta-band">
            <h2 className="t-h2">Ready to govern your AI?</h2>
            <p>See how Holistic AI discovers, tests and governs every AI system in your estate.</p>
            <Button href="/demo">Book a demo</Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
