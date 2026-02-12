import { cn } from '@/lib/utils'

interface SpacingItemProps {
  name: string
  value: string
  pixels: number
}

export function SpacingItem({ name, value, pixels }: SpacingItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-20 shrink-0">
        <span className="text-sm font-mono text-foreground">{name}</span>
      </div>
      <div className="w-16 shrink-0">
        <span className="text-xs text-muted-foreground">{value}</span>
      </div>
      <div className="w-12 shrink-0">
        <span className="text-xs text-muted-foreground">{pixels}px</span>
      </div>
      <div className="flex-1">
        <div
          className="h-4 bg-violet-500 rounded-sm"
          style={{ width: `${Math.min(pixels * 2, 100)}%` }}
        />
      </div>
    </div>
  )
}

interface SpacingScaleProps {
  items: Array<{
    name: string
    value: string
    pixels: number
  }>
  className?: string
}

export function SpacingScale({ items, className }: SpacingScaleProps) {
  return (
    <div className={cn('space-y-3 p-6 rounded-lg border bg-card', className)}>
      <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider pb-2 border-b">
        <div className="w-20">Token</div>
        <div className="w-16">Value</div>
        <div className="w-12">Pixels</div>
        <div className="flex-1">Visual</div>
      </div>
      {items.map((item) => (
        <SpacingItem key={item.name} {...item} />
      ))}
    </div>
  )
}

interface SpacingDemoProps {
  size: string
  label: string
  className?: string
}

export function SpacingDemo({ size, label, className }: SpacingDemoProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative border border-dashed border-violet-300 bg-violet-50 dark:bg-violet-950/20">
        <div className={cn('bg-violet-500', size)} />
      </div>
      <span className="text-xs font-mono text-muted-foreground">{label}</span>
    </div>
  )
}

export function SpacingGridDemo() {
  const sizes = [
    { class: 'p-1', label: 'p-1 (4px)' },
    { class: 'p-2', label: 'p-2 (8px)' },
    { class: 'p-3', label: 'p-3 (12px)' },
    { class: 'p-4', label: 'p-4 (16px)' },
    { class: 'p-5', label: 'p-5 (20px)' },
    { class: 'p-6', label: 'p-6 (24px)' },
    { class: 'p-8', label: 'p-8 (32px)' },
    { class: 'p-10', label: 'p-10 (40px)' },
  ]

  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
      {sizes.map((size) => (
        <div key={size.class} className="flex flex-col items-center gap-2">
          <div className="border border-dashed border-violet-300 rounded">
            <div className={cn('bg-violet-500/20 rounded', size.class)}>
              <div className="w-4 h-4 bg-violet-500 rounded-sm" />
            </div>
          </div>
          <span className="text-xs font-mono text-muted-foreground text-center">
            {size.label}
          </span>
        </div>
      ))}
    </div>
  )
}
