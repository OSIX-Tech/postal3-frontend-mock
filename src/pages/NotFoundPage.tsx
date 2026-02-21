import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-6xl font-bold text-[var(--color-error)]">{t('not_found.title')}</h1>
      <p className="mb-8 text-xl text-[var(--color-text-muted)]">{t('not_found.message')}</p>
      <Link
        to="/"
        className="rounded-lg bg-[var(--color-primary)] px-6 py-3 text-white transition-colors hover:bg-[var(--color-primary-hover)]"
      >
        {t('not_found.go_home')}
      </Link>
    </div>
  );
}
