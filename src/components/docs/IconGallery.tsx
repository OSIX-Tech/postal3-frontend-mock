import { useState, useMemo } from 'react'
import { Check, Search } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { cn } from '@/lib/utils'
import { InputWithIcon } from '@/components/ui/input-with-icon'

type IconComponent = React.FC<{ className?: string }>

interface IconCardProps {
  name: string
  Icon: IconComponent
  size?: 'sm' | 'md' | 'lg'
}

function IconCard({ name, Icon, size = 'md' }: IconCardProps) {
  const [copied, set_copied] = useState(false)

  const handle_copy = async () => {
    await navigator.clipboard.writeText(`<${name} />`)
    set_copied(true)
    setTimeout(() => set_copied(false), 2000)
  }

  const icon_sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <button
      onClick={handle_copy}
      className={cn(
        'group flex flex-col items-center gap-2 p-4 rounded-lg border bg-card',
        'hover:bg-accent hover:border-accent-foreground/20 transition-all',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
      )}
      title={`Click to copy: <${name} />`}
    >
      <div className="relative">
        <Icon className={cn(icon_sizes[size], 'text-foreground')} />
        {copied && (
          <Check className="absolute -top-1 -right-1 w-3 h-3 text-emerald-500" />
        )}
      </div>
      <span className="text-xs text-muted-foreground truncate max-w-full">
        {name}
      </span>
    </button>
  )
}

interface IconGalleryProps {
  icons?: Record<string, IconComponent>
  searchable?: boolean
  show_sizes?: boolean
  columns?: 4 | 6 | 8 | 10
  className?: string
}

export function IconGallery({
  icons,
  searchable = true,
  show_sizes = false,
  columns = 6,
  className,
}: IconGalleryProps) {
  const [search, set_search] = useState('')
  const [size, set_size] = useState<'sm' | 'md' | 'lg'>('md')

  // Get all Lucide icons if none provided
  const all_icons = useMemo(() => {
    if (icons) return icons
    const lucide_icons: Record<string, IconComponent> = {}
    for (const [name, component] of Object.entries(LucideIcons)) {
      if (
        typeof component === 'function' &&
        name !== 'createLucideIcon' &&
        name !== 'default' &&
        !name.startsWith('Lucide')
      ) {
        lucide_icons[name] = component as IconComponent
      }
    }
    return lucide_icons
  }, [icons])

  const filtered_icons = useMemo(() => {
    if (!search) return Object.entries(all_icons).slice(0, 120) // Limit initial display
    return Object.entries(all_icons).filter(([name]) =>
      name.toLowerCase().includes(search.toLowerCase())
    )
  }, [all_icons, search])

  const grid_cols = {
    4: 'grid-cols-4',
    6: 'grid-cols-4 md:grid-cols-6',
    8: 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8',
    10: 'grid-cols-4 md:grid-cols-6 lg:grid-cols-10',
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-4">
        {searchable && (
          <div className="flex-1 max-w-xs">
            <InputWithIcon
              icon_left={<Search className="w-4 h-4" />}
              placeholder="Search icons..."
              value={search}
              onChange={(e) => set_search(e.target.value)}
            />
          </div>
        )}
        {show_sizes && (
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <button
                key={s}
                onClick={() => set_size(s)}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded transition-all',
                  size === s
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filtered_icons.length} of {Object.keys(all_icons).length} icons
        {!search && ' (search to see more)'}
      </div>

      <div className={cn('grid gap-2', grid_cols[columns])}>
        {filtered_icons.map(([name, Icon]) => (
          <IconCard key={name} name={name} Icon={Icon} size={size} />
        ))}
      </div>

      {filtered_icons.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No icons found for "{search}"
        </div>
      )}
    </div>
  )
}

interface IconSizeShowcaseProps {
  icon_name: string
  Icon: IconComponent
}

export function IconSizeShowcase({ Icon }: IconSizeShowcaseProps) {
  const sizes = [
    { name: 'xs', class: 'w-3 h-3', px: '12px' },
    { name: 'sm', class: 'w-4 h-4', px: '16px' },
    { name: 'md', class: 'w-5 h-5', px: '20px' },
    { name: 'lg', class: 'w-6 h-6', px: '24px' },
    { name: 'xl', class: 'w-8 h-8', px: '32px' },
  ]

  return (
    <div className="flex items-end gap-6 p-6 rounded-lg border bg-card">
      {sizes.map((size) => (
        <div key={size.name} className="flex flex-col items-center gap-2">
          <Icon className={cn(size.class, 'text-foreground')} />
          <div className="text-center">
            <p className="text-xs font-medium text-foreground">{size.name}</p>
            <p className="text-xs text-muted-foreground">{size.px}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
