import type { ReactNode } from 'react'
import { AlertTriangle, WifiOff, ServerCrash, ShieldX, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ErrorVariant = 'default' | 'network' | 'server' | 'forbidden' | 'not-found'

interface ErrorStateProps {
  variant?: ErrorVariant
  title?: string
  description?: string
  icon?: ReactNode
  on_retry?: () => void
  retry_label?: string
  className?: string
}

const VARIANT_CONFIG: Record<ErrorVariant, { icon: ReactNode; title: string; description: string }> = {
  default: {
    icon: <AlertTriangle className="w-12 h-12" />,
    title: 'Algo salió mal',
    description: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.',
  },
  network: {
    icon: <WifiOff className="w-12 h-12" />,
    title: 'Sin conexión',
    description: 'No se pudo conectar al servidor. Verifica tu conexión a internet.',
  },
  server: {
    icon: <ServerCrash className="w-12 h-12" />,
    title: 'Error del servidor',
    description: 'El servidor no está disponible en este momento. Intenta más tarde.',
  },
  forbidden: {
    icon: <ShieldX className="w-12 h-12" />,
    title: 'Acceso denegado',
    description: 'No tienes permisos para acceder a este recurso.',
  },
  'not-found': {
    icon: <AlertTriangle className="w-12 h-12" />,
    title: 'No encontrado',
    description: 'El recurso que buscas no existe o ha sido eliminado.',
  },
}

export function ErrorState({
  variant = 'default',
  title,
  description,
  icon,
  on_retry,
  retry_label = 'Reintentar',
  className,
}: ErrorStateProps) {
  const config = VARIANT_CONFIG[variant]

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-500 mb-4">
        {icon || config.icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title || config.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description || config.description}
      </p>
      {on_retry && (
        <Button onClick={on_retry} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          {retry_label}
        </Button>
      )}
    </div>
  )
}
