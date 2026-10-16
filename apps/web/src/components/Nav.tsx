import { Container } from "./primitives";

const NAV = [
  {
    label: "Products",
    items: [
      { label: "AI Governance Platform", href: "/ai-governance-platform" },
      { label: "AI Asset Discovery", href: "/ai-asset-discovery" },
      { label: "AI Inventory", href: "/ai-inventory" },
      { label: "AI Risk Management", href: "/ai-risk-management" },
      { label: "AI System Testing", href: "/ai-system-testing" },
      { label: "AI Red Teaming", href: "/ai-red-teaming" },
      { label: "AI Audits", href: "/ai-audits" },
      { label: "Guardian Agents", href: "/guardian-agents" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Learn", href: "/learn" },
      { label: "Glossary", href: "/glossary" },
      { label: "Papers", href: "/papers" },
      { label: "Events", href: "/events" },
      { label: "News", href: "/news" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Trust Center", href: "/trust-center" },
      { label: "Why Holistic AI", href: "/why-holisticai" },
    ],
  },
];

export function Nav() {
  return (
    <header className="site-header">
      <Container>
        <nav className="site-nav" aria-label="Main">
          <a href="/" className="site-logo" aria-label="Holistic AI home">
            <span className="site-logo__mark" aria-hidden="true" />
            Holistic AI
          </a>

          <ul className="site-nav__list">
            {NAV.map((group) => (
              <li key={group.label} className="site-nav__item">
                <details className="site-nav__dropdown">
                  <summary>{group.label}</summary>
                  <ul className="site-nav__submenu">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <a href={item.href}>{item.label}</a>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
            <li>
              <a href="/search">Search</a>
            </li>
          </ul>

          <div className="site-nav__cta">
            <a href="/demo" className="btn btn--primary">
              Book a demo
            </a>
          </div>
        </nav>
      </Container>
    </header>
  );
}

const FOOTER_COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "AI Governance Platform", href: "/ai-governance-platform" },
      { label: "AI Asset Discovery", href: "/ai-asset-discovery" },
      { label: "AI Inventory", href: "/ai-inventory" },
      { label: "AI Risk Management", href: "/ai-risk-management" },
      { label: "AI Red Teaming", href: "/ai-red-teaming" },
      { label: "Guardian Agents", href: "/guardian-agents" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Learn", href: "/learn" },
      { label: "Glossary", href: "/glossary" },
      { label: "Papers", href: "/papers" },
      { label: "Newsletters", href: "/newsletters" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Trust Center", href: "/trust-center" },
      { label: "Press", href: "/press-release" },
      { label: "Contact", href: "/demo" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-conditions" },
      { label: "Security", href: "/trust-center" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__grid">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="site-footer__title">{col.title}</h3>
              <ul className="site-footer__list">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="site-footer__legal">
          <span>© {new Date().getFullYear()} Holistic AI. All rights reserved.</span>
          <nav aria-label="Legal">
            <a href="/privacy-policy">Privacy</a>
            <a href="/terms-conditions">Terms</a>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
