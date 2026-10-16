/**
 * LogoWall — SSR component with the original's fade-in animation.
 * Ported from the original's federated `LogoSection` code-island.
 */
export function LogoWall({ logos, label }: { logos: string[]; label: string }) {
  const mid = Math.ceil(logos.length / 2);
  const rows = [logos.slice(0, mid), logos.slice(mid)];
  return (
    <div className="logo-wall">
      <div className="logo-wall__label">
        <span className="logo-wall__line" aria-hidden="true" />
        <p className="t-label">{label}</p>
        <span className="logo-wall__line" aria-hidden="true" />
      </div>
      {rows.map((row, i) => (
        <div key={i} className="logo-wall__row">
          {row.map((name) => (
            <span key={name} className="logo-wall__item" title={name}>
              {name}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
