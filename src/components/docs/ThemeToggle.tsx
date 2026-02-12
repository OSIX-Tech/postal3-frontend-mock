import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={className}>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ThemeSwitcherProps {
  className?: string
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 rounded-lg bg-muted',
        className
      )}
    >
      {themes.map((t) => {
        const Icon = t.icon
        const is_active = theme === t.value
        return (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
              is_active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="w-4 h-4" />
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

interface ThemeComparisonProps {
  children: (theme: 'light' | 'dark') => React.ReactNode
  className?: string
}

export function ThemeComparison({ children, className }: ThemeComparisonProps) {
  return (
    <div className={cn('grid md:grid-cols-2 gap-4', className)}>
      <div className="rounded-lg border overflow-hidden">
        <div className="px-4 py-2 bg-gray-100 border-b text-sm font-medium text-gray-700">
          Light Mode
        </div>
        <div className="p-4 bg-white">{children('light')}</div>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <div className="px-4 py-2 bg-gray-800 border-b text-sm font-medium text-gray-200">
          Dark Mode
        </div>
        <div className="p-4 bg-gray-900 dark">{children('dark')}</div>
      </div>
    </div>
  )
}
