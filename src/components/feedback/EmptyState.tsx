import type { ReactNode } from 'react'
import { Inbox, Search, FileQuestion, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type EmptyStateVariant = 'default' | 'search' | 'no-results' | 'no-data'

interface EmptyStateProps {
  variant?: EmptyStateVariant
  title?: string
  description?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const VARIANT_CONFIG: Record<EmptyStateVariant, { icon: ReactNode; title: string; description: string }> = {
  default: {
    icon: <Inbox className="w-12 h-12" />,
    title: 'No hay contenido',
    description: 'No hay elementos para mostrar en este momento.',
  },
  search: {
    icon: <Search className="w-12 h-12" />,
    title: 'Sin resultados',
    description: 'No se encontraron resultados para tu búsqueda. Intenta con otros términos.',
  },
  'no-results': {
    icon: <FileQuestion className="w-12 h-12" />,
    title: 'No hay resultados',
    description: 'No se encontraron elementos que coincidan con los filtros aplicados.',
  },
  'no-data': {
    icon: <FolderOpen className="w-12 h-12" />,
    title: 'Sin datos',
    description: 'Aún no hay datos disponibles. Comienza agregando el primero.',
  },
}

export function EmptyState({
  variant = 'default',
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const config = VARIANT_CONFIG[variant]

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
        {icon || config.icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title || config.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description || config.description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
