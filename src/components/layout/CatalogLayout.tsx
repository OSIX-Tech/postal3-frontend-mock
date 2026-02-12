import type { ReactNode } from 'react'

interface CatalogLayoutProps {
  children: ReactNode
  sidebar: ReactNode
  title: string
  description?: string
}

export function CatalogLayout({
  children,
  sidebar,
  title,
  description,
}: CatalogLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        {description && (
          <p className="text-muted-foreground max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </header>

      {/* Content with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="sticky top-20 space-y-4">
            {sidebar}
          </div>
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-9">
          {children}
        </section>
      </div>
    </div>
  )
}
