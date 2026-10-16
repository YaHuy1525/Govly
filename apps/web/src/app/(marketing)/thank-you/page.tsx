import { Container, Section } from "../../../components/primitives";

export default function ThankYouPage() {
  return (
    <Section>
      <Container>
        <div style={{ textAlign: "center", padding: "80px 0", maxWidth: 560, margin: "0 auto" }}>
          <h1 className="t-h1">Thank you</h1>
          <p style={{ fontSize: 17, lineHeight: "28px", color: "var(--text)" }}>
            A member of our team will reach out within one business day. In the meantime, you can
            explore the platform or read the latest research on AI governance.
          </p>
        </div>
      </Container>
    </Section>
  );
}
