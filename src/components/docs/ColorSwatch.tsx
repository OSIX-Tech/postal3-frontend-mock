import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ColorSwatchProps {
  name: string
  value: string
  css_variable?: string
  text_color?: 'light' | 'dark' | 'auto'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ColorSwatch({
  name,
  value,
  css_variable,
  text_color = 'auto',
  size = 'md',
  className,
}: ColorSwatchProps) {
  const [copied, set_copied] = useState(false)

  const handle_copy = async () => {
    await navigator.clipboard.writeText(css_variable ? `var(${css_variable})` : value)
    set_copied(true)
    setTimeout(() => set_copied(false), 2000)
  }

  const sizes = {
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-24',
  }

  const get_text_color = () => {
    if (text_color !== 'auto') return text_color === 'light' ? 'text-white' : 'text-gray-900'
    // Simple luminance check for auto
    const hex = value.replace('#', '')
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      return luminance > 0.5 ? 'text-gray-900' : 'text-white'
    }
    return 'text-white'
  }

  return (
    <div className={cn('group rounded-lg overflow-hidden border', className)}>
      <button
        onClick={handle_copy}
        className={cn(
          'w-full flex items-end justify-between p-3 transition-all',
          sizes[size],
          get_text_color()
        )}
        style={{ backgroundColor: value }}
        title="Click to copy"
      >
        <span className="text-sm font-medium">{name}</span>
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </button>
      <div className="px-3 py-2 bg-card">
        <p className="text-xs font-mono text-muted-foreground">{value}</p>
        {css_variable && (
          <p className="text-xs font-mono text-muted-foreground/70 truncate">
            {css_variable}
          </p>
        )}
      </div>
    </div>
  )
}

interface ColorPaletteProps {
  name: string
  colors: Array<{
    shade: string
    value: string
    css_variable?: string
  }>
  className?: string
}

export function ColorPalette({ name, colors, className }: ColorPaletteProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <h4 className="text-sm font-semibold text-foreground capitalize">{name}</h4>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-1">
        {colors.map((color) => (
          <ColorSwatchCompact
            key={color.shade}
            shade={color.shade}
            value={color.value}
            css_variable={color.css_variable}
          />
        ))}
      </div>
    </div>
  )
}

interface ColorSwatchCompactProps {
  shade: string
  value: string
  css_variable?: string
}

function ColorSwatchCompact({ shade, value }: ColorSwatchCompactProps) {
  const [copied, set_copied] = useState(false)

  const handle_copy = async () => {
    await navigator.clipboard.writeText(value)
    set_copied(true)
    setTimeout(() => set_copied(false), 2000)
  }

  const is_light = () => {
    const hex = value.replace('#', '')
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5
    }
    return false
  }

  return (
    <button
      onClick={handle_copy}
      className="group relative aspect-square rounded-md overflow-hidden border border-border/50"
      style={{ backgroundColor: value }}
      title={`${shade}: ${value}`}
    >
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity',
          is_light() ? 'text-gray-900' : 'text-white'
        )}
      >
        {copied ? <Check className="w-3 h-3" /> : shade}
      </span>
    </button>
  )
}

interface SemanticColorProps {
  name: string
  description: string
  value: string
  css_variable: string
  usage: string
}

export function SemanticColor({ name, description, value, css_variable, usage }: SemanticColorProps) {
  const [copied, set_copied] = useState(false)

  const handle_copy = async () => {
    await navigator.clipboard.writeText(`var(${css_variable})`)
    set_copied(true)
    setTimeout(() => set_copied(false), 2000)
  }

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
      <button
        onClick={handle_copy}
        className="w-12 h-12 rounded-lg shrink-0 ring-1 ring-border/50"
        style={{ backgroundColor: value }}
        title="Click to copy"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-foreground">{name}</h4>
          {copied && <Check className="w-3 h-3 text-emerald-500" />}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        <p className="text-xs font-mono text-muted-foreground/70 mt-1">{css_variable}</p>
        <p className="text-xs text-muted-foreground mt-2">
          <span className="font-medium">Usage:</span> {usage}
        </p>
      </div>
    </div>
  )
}
