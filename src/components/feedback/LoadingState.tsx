import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingState({
  text = 'Cargando...',
  size = 'md',
  className,
}: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <Spinner size={size} className="mb-4" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  )
}
