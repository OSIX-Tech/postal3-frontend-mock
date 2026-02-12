import type { ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DosDontsProps {
  dos: Array<{ example: ReactNode; description: string }>
  donts: Array<{ example: ReactNode; description: string }>
  className?: string
}

export function DosDonts({ dos, donts, className }: DosDontsProps) {
  return (
    <div className={cn('grid md:grid-cols-2 gap-6', className)}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10">
            <Check className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Do</span>
        </div>
        <div className="space-y-4">
          {dos.map((item, index) => (
            <DoItem key={index} type="do" example={item.example} description={item.description} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/10">
            <X className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">Don't</span>
        </div>
        <div className="space-y-4">
          {donts.map((item, index) => (
            <DoItem key={index} type="dont" example={item.example} description={item.description} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface DoItemProps {
  type: 'do' | 'dont'
  example: ReactNode
  description: string
}

function DoItem({ type, example, description }: DoItemProps) {
  return (
    <div
      className={cn(
        'rounded-lg border overflow-hidden',
        type === 'do' ? 'border-emerald-200 dark:border-emerald-900' : 'border-rose-200 dark:border-rose-900'
      )}
    >
      <div
        className={cn(
          'p-4 flex items-center justify-center min-h-[80px]',
          type === 'do' ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-rose-50 dark:bg-rose-950/20'
        )}
      >
        {example}
      </div>
      <div className="px-4 py-3 bg-card border-t border-inherit">
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

interface GuidelineProps {
  type: 'do' | 'dont' | 'caution'
  title?: string
  children: ReactNode
  className?: string
}

export function Guideline({ type, title, children, className }: GuidelineProps) {
  const styles = {
    do: {
      border: 'border-l-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      icon: Check,
      icon_color: 'text-emerald-500',
    },
    dont: {
      border: 'border-l-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-950/20',
      icon: X,
      icon_color: 'text-rose-500',
    },
    caution: {
      border: 'border-l-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      icon: () => <span className="text-amber-500 text-lg">⚠</span>,
      icon_color: 'text-amber-500',
    },
  }

  const style = styles[type]
  const Icon = style.icon

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border-l-4',
        style.border,
        style.bg,
        className
      )}
    >
      <div className="shrink-0 mt-0.5">
        <Icon className={cn('w-5 h-5', style.icon_color)} />
      </div>
      <div>
        {title && <p className="text-sm font-semibold text-foreground mb-1">{title}</p>}
        <div className="text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  )
}
