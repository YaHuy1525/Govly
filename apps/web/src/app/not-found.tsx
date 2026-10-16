import { Container, Section, Button } from "../components/primitives";

export default function NotFound() {
  return (
    <Section>
      <Container>
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <h1 className="t-h1">Page not found</h1>
          <p style={{ color: "var(--text)", marginBottom: 24 }}>
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <Button href="/">Back to home</Button>
        </div>
      </Container>
    </Section>
  );
}
