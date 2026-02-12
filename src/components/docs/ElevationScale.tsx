import { cn } from '@/lib/utils'

interface ElevationCardProps {
  name: string
  level: number
  shadow_class: string
  css_value: string
  usage: string
}

export function ElevationCard({
  name,
  level,
  shadow_class,
  usage,
}: ElevationCardProps) {
  return (
    <div className="space-y-3">
      <div
        className={cn(
          'h-24 rounded-lg bg-card border flex items-center justify-center',
          shadow_class
        )}
      >
        <span className="text-2xl font-bold text-muted-foreground">{level}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground mt-1">{usage}</p>
        <code className="text-xs text-muted-foreground/70 block mt-2 truncate">
          {shadow_class}
        </code>
      </div>
    </div>
  )
}

interface ElevationScaleProps {
  className?: string
}

export function ElevationScale({ className }: ElevationScaleProps) {
  const elevations = [
    {
      name: 'Level 0 - Flat',
      level: 0,
      shadow_class: 'shadow-none',
      css_value: 'none',
      usage: 'Base elements, backgrounds',
    },
    {
      name: 'Level 1 - Raised',
      level: 1,
      shadow_class: 'shadow-sm',
      css_value: 'var(--shadow-sm)',
      usage: 'Cards, buttons',
    },
    {
      name: 'Level 2 - Floating',
      level: 2,
      shadow_class: 'shadow-md',
      css_value: 'var(--shadow-md)',
      usage: 'Dropdown menus, hover cards',
    },
    {
      name: 'Level 3 - Overlay',
      level: 3,
      shadow_class: 'shadow-lg',
      css_value: 'var(--shadow-lg)',
      usage: 'Modals, dialogs',
    },
    {
      name: 'Level 4 - Prominent',
      level: 4,
      shadow_class: 'shadow-xl',
      css_value: 'var(--shadow-xl)',
      usage: 'Popovers, tooltips',
    },
    {
      name: 'Level 5 - Hover',
      level: 5,
      shadow_class: 'shadow-2xl',
      css_value: 'var(--shadow-2xl)',
      usage: 'Focused/highlighted elements',
    },
  ]

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6', className)}>
      {elevations.map((elevation) => (
        <ElevationCard key={elevation.level} {...elevation} />
      ))}
    </div>
  )
}

interface ShadowDemoProps {
  className?: string
}

export function ShadowDemo({ className }: ShadowDemoProps) {
  return (
    <div className={cn('space-y-8', className)}>
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-4">Standard Shadows</h4>
        <div className="flex flex-wrap items-end gap-8 p-8 rounded-lg bg-muted/30">
          {['shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl'].map(
            (shadow) => (
              <div key={shadow} className="flex flex-col items-center gap-3">
                <div
                  className={cn('w-16 h-16 rounded-lg bg-card border', shadow)}
                />
                <code className="text-xs text-muted-foreground">{shadow}</code>
              </div>
            )
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-foreground mb-4">Brand Shadows (Violet Tint)</h4>
        <div className="flex flex-wrap items-end gap-8 p-8 rounded-lg bg-muted/30">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-16 h-16 rounded-lg bg-card border"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            />
            <code className="text-xs text-muted-foreground">--shadow-sm</code>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-16 h-16 rounded-lg bg-card border"
              style={{ boxShadow: 'var(--shadow-md)' }}
            />
            <code className="text-xs text-muted-foreground">--shadow-md</code>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-16 h-16 rounded-lg bg-card border"
              style={{ boxShadow: 'var(--shadow-lg)' }}
            />
            <code className="text-xs text-muted-foreground">--shadow-lg</code>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-16 h-16 rounded-lg bg-card border"
              style={{ boxShadow: 'var(--shadow-hover)' }}
            />
            <code className="text-xs text-muted-foreground">--shadow-hover</code>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-16 h-16 rounded-lg bg-card border"
              style={{ boxShadow: 'var(--shadow-glow)' }}
            />
            <code className="text-xs text-muted-foreground">--shadow-glow</code>
          </div>
        </div>
      </div>
    </div>
  )
}
