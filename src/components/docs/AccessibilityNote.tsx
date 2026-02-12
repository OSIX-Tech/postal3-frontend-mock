import type { ReactNode } from 'react'
import { Keyboard, Eye, MousePointer, Volume2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type A11yCategory = 'keyboard' | 'screen-reader' | 'focus' | 'contrast' | 'general'

interface AccessibilityNoteProps {
  category: A11yCategory
  title?: string
  children: ReactNode
  className?: string
}

const category_config = {
  keyboard: {
    icon: Keyboard,
    label: 'Keyboard',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-900',
  },
  'screen-reader': {
    icon: Volume2,
    label: 'Screen Reader',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-200 dark:border-purple-900',
  },
  focus: {
    icon: MousePointer,
    label: 'Focus',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-900',
  },
  contrast: {
    icon: Eye,
    label: 'Color Contrast',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-200 dark:border-emerald-900',
  },
  general: {
    icon: Info,
    label: 'Accessibility',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/20',
    border: 'border-violet-200 dark:border-violet-900',
  },
}

export function AccessibilityNote({
  category,
  title,
  children,
  className,
}: AccessibilityNoteProps) {
  const config = category_config[category]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border',
        config.bg,
        config.border,
        className
      )}
    >
      <div className="shrink-0">
        <Icon className={cn('w-5 h-5', config.color)} />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('text-xs font-medium uppercase tracking-wider', config.color)}>
            {config.label}
          </span>
          {title && <span className="text-sm font-semibold text-foreground">• {title}</span>}
        </div>
        <div className="text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  )
}

interface KeyboardShortcutProps {
  keys: string[]
  description: string
}

export function KeyboardShortcut({ keys, description }: KeyboardShortcutProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <span key={index}>
            <kbd className="px-2 py-1 text-xs font-mono bg-muted border rounded shadow-sm">
              {key}
            </kbd>
            {index < keys.length - 1 && <span className="text-muted-foreground mx-1">+</span>}
          </span>
        ))}
      </div>
    </div>
  )
}

interface KeyboardShortcutsTableProps {
  shortcuts: Array<{
    keys: string[]
    description: string
  }>
  className?: string
}

export function KeyboardShortcutsTable({ shortcuts, className }: KeyboardShortcutsTableProps) {
  return (
    <div className={cn('divide-y divide-border rounded-lg border bg-card', className)}>
      {shortcuts.map((shortcut, index) => (
        <div key={index} className="px-4">
          <KeyboardShortcut keys={shortcut.keys} description={shortcut.description} />
        </div>
      ))}
    </div>
  )
}

interface WCAGBadgeProps {
  level: 'A' | 'AA' | 'AAA'
  criterion: string
  title: string
}

export function WCAGBadge({ level, criterion, title }: WCAGBadgeProps) {
  const colors = {
    A: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    AA: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    AAA: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className={cn('px-2 py-0.5 rounded text-xs font-bold', colors[level])}>
        WCAG {level}
      </span>
      <span className="text-xs text-muted-foreground">
        {criterion} - {title}
      </span>
    </div>
  )
}
