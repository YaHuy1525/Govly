import Link from "next/link";

export function Pagination({
  base,
  page,
  totalPages,
}: {
  base: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const pages: (number | "…")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 && <Link href={`${base}?page=${page - 1}`}>← Prev</Link>}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`}>…</span>
        ) : (
          <Link
            key={p}
            href={`${base}?page=${p}`}
            className={p === page ? "is-current" : undefined}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </Link>
        ),
      )}
      {page < totalPages && <Link href={`${base}?page=${page + 1}`}>Next →</Link>}
    </nav>
  );
}
