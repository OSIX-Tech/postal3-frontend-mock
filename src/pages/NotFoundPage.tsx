import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-6xl font-bold text-[var(--color-error)]">404</h1>
      <p className="mb-8 text-xl text-[var(--color-text-muted)]">Página no encontrada</p>
      <Link
        to="/"
        className="rounded-lg bg-[var(--color-primary)] px-6 py-3 text-white transition-colors hover:bg-[var(--color-primary-hover)]"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
