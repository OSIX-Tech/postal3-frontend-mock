import type { ReactNode } from 'react'
import { CheckCircle2, PartyPopper, ThumbsUp, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SuccessVariant = 'default' | 'celebration' | 'completed' | 'achievement'

interface SuccessStateProps {
  variant?: SuccessVariant
  title?: string
  description?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  secondary_action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const VARIANT_CONFIG: Record<SuccessVariant, { icon: ReactNode; title: string; description: string }> = {
  default: {
    icon: <CheckCircle2 className="w-12 h-12" />,
    title: 'Operación exitosa',
    description: 'La acción se ha completado correctamente.',
  },
  celebration: {
    icon: <PartyPopper className="w-12 h-12" />,
    title: '¡Felicidades!',
    description: 'Has completado esta tarea con éxito.',
  },
  completed: {
    icon: <ThumbsUp className="w-12 h-12" />,
    title: 'Completado',
    description: 'Todo está listo. Puedes continuar.',
  },
  achievement: {
    icon: <Trophy className="w-12 h-12" />,
    title: '¡Logro desbloqueado!',
    description: 'Has alcanzado un nuevo hito.',
  },
}

export function SuccessState({
  variant = 'default',
  title,
  description,
  icon,
  action,
  secondary_action,
  className,
}: SuccessStateProps) {
  const config = VARIANT_CONFIG[variant]

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4">
        {icon || config.icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title || config.title}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        {description || config.description}
      </p>
      {(action || secondary_action) && (
        <div className="flex items-center gap-3">
          {secondary_action && (
            <Button variant="outline" onClick={secondary_action.onClick}>
              {secondary_action.label}
            </Button>
          )}
          {action && (
            <Button onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
