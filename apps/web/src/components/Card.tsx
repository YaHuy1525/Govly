import Link from "next/link";

export function Card({
  href,
  title,
  excerpt,
  category,
  meta,
}: {
  href: string;
  title: string;
  excerpt?: string;
  category?: string;
  meta?: string;
}) {
  return (
    <Link href={href} className="card">
      <div className="card__body">
        {category && <span className="card__category">{category}</span>}
        <h3 className="card__title">{title}</h3>
        {excerpt && <p className="card__excerpt">{excerpt}</p>}
        {meta && <span className="card__meta">{meta}</span>}
      </div>
    </Link>
  );
}
