import { useState, type ReactNode } from 'react'
import { Monitor, Tablet, Smartphone, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface BreakpointInfo {
  name: Breakpoint
  label: string
  width: number
  icon: typeof Monitor
}

const breakpoints: BreakpointInfo[] = [
  { name: 'xs', label: 'XS', width: 320, icon: Smartphone },
  { name: 'sm', label: 'SM', width: 640, icon: Smartphone },
  { name: 'md', label: 'MD', width: 768, icon: Tablet },
  { name: 'lg', label: 'LG', width: 1024, icon: Monitor },
  { name: 'xl', label: 'XL', width: 1280, icon: Monitor },
  { name: '2xl', label: '2XL', width: 1536, icon: Maximize2 },
]

interface BreakpointPreviewProps {
  children: ReactNode
  default_breakpoint?: Breakpoint
  className?: string
}

export function BreakpointPreview({
  children,
  default_breakpoint = 'lg',
  className,
}: BreakpointPreviewProps) {
  const [active_bp, set_active_bp] = useState<Breakpoint>(default_breakpoint)
  const current = breakpoints.find((bp) => bp.name === active_bp) || breakpoints[3]

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
          {breakpoints.map((bp) => {
            const Icon = bp.icon
            const is_active = active_bp === bp.name
            return (
              <button
                key={bp.name}
                onClick={() => set_active_bp(bp.name)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                  is_active
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                title={`${bp.width}px`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{bp.label}</span>
              </button>
            )
          })}
        </div>
        <span className="text-sm text-muted-foreground">
          {current.width}px
        </span>
      </div>

      <div className="flex justify-center p-4 rounded-lg border bg-muted/30 overflow-x-auto">
        <div
          className="rounded-lg border bg-background shadow-lg overflow-hidden transition-all duration-300"
          style={{ width: Math.min(current.width, 1200), maxWidth: '100%' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

interface BreakpointTableProps {
  className?: string
}

export function BreakpointTable({ className }: BreakpointTableProps) {
  const tailwind_breakpoints = [
    { name: 'Default', prefix: '', min: '0px', css: '', description: 'Mobile-first base styles' },
    { name: 'sm', prefix: 'sm:', min: '640px', css: '@media (min-width: 640px)', description: 'Large phones / small tablets' },
    { name: 'md', prefix: 'md:', min: '768px', css: '@media (min-width: 768px)', description: 'Tablets' },
    { name: 'lg', prefix: 'lg:', min: '1024px', css: '@media (min-width: 1024px)', description: 'Laptops / small desktops' },
    { name: 'xl', prefix: 'xl:', min: '1280px', css: '@media (min-width: 1280px)', description: 'Desktops' },
    { name: '2xl', prefix: '2xl:', min: '1536px', css: '@media (min-width: 1536px)', description: 'Large desktops' },
  ]

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-4 text-left font-medium text-muted-foreground">Breakpoint</th>
            <th className="py-3 px-4 text-left font-medium text-muted-foreground">Prefix</th>
            <th className="py-3 px-4 text-left font-medium text-muted-foreground">Min Width</th>
            <th className="py-3 px-4 text-left font-medium text-muted-foreground">CSS</th>
            <th className="py-3 px-4 text-left font-medium text-muted-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {tailwind_breakpoints.map((bp) => (
            <tr key={bp.name} className="border-b">
              <td className="py-3 px-4 font-medium text-foreground">{bp.name}</td>
              <td className="py-3 px-4 font-mono text-violet-600 dark:text-violet-400">{bp.prefix || '—'}</td>
              <td className="py-3 px-4 font-mono text-muted-foreground">{bp.min}</td>
              <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{bp.css || '—'}</td>
              <td className="py-3 px-4 text-muted-foreground">{bp.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface ResponsiveExampleProps {
  className?: string
}

export function ResponsiveExample({ className }: ResponsiveExampleProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="p-4 rounded-lg border bg-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-24 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center"
            >
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                Item {n}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 rounded-lg border bg-muted/50">
        <code className="text-sm">
          grid-cols-1 <span className="text-violet-600">sm:</span>grid-cols-2{' '}
          <span className="text-violet-600">lg:</span>grid-cols-4
        </code>
      </div>
    </div>
  )
}
