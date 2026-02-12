import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Play, RotateCcw } from 'lucide-react'

interface DurationDemoProps {
  className?: string
}

export function DurationDemo({ className }: DurationDemoProps) {
  const [playing, set_playing] = useState<string | null>(null)

  const durations = [
    { name: 'Instant', ms: 0, class: 'duration-0', usage: 'Immediate feedback' },
    { name: 'Fast', ms: 75, class: 'duration-75', usage: 'Micro-interactions' },
    { name: 'Quick', ms: 150, class: 'duration-150', usage: 'Button hovers, toggles' },
    { name: 'Normal', ms: 200, class: 'duration-200', usage: 'Default transitions' },
    { name: 'Smooth', ms: 300, class: 'duration-300', usage: 'Menus, dropdowns' },
    { name: 'Relaxed', ms: 500, class: 'duration-500', usage: 'Page transitions' },
    { name: 'Slow', ms: 700, class: 'duration-700', usage: 'Complex animations' },
    { name: 'Slower', ms: 1000, class: 'duration-1000', usage: 'Emphasis, loading' },
  ]

  const handle_play = (name: string) => {
    set_playing(name)
    setTimeout(() => set_playing(null), 1500)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {durations.map((duration) => (
        <div
          key={duration.name}
          className="flex items-center gap-4 p-4 rounded-lg border bg-card"
        >
          <button
            onClick={() => handle_play(duration.name)}
            className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
          >
            <Play className="w-4 h-4 text-violet-600" />
          </button>
          <div className="w-24">
            <p className="text-sm font-medium text-foreground">{duration.name}</p>
            <p className="text-xs text-muted-foreground">{duration.ms}ms</p>
          </div>
          <div className="flex-1">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  'h-full bg-violet-500 rounded-full transition-all',
                  duration.class,
                  playing === duration.name ? 'w-full' : 'w-0'
                )}
              />
            </div>
          </div>
          <code className="text-xs text-muted-foreground w-28">{duration.class}</code>
          <p className="text-xs text-muted-foreground w-36">{duration.usage}</p>
        </div>
      ))}
    </div>
  )
}

interface EasingDemoProps {
  className?: string
}

export function EasingDemo({ className }: EasingDemoProps) {
  const [playing, set_playing] = useState(false)

  const easings = [
    { name: 'Linear', class: 'ease-linear', curve: 'linear' },
    { name: 'Ease In', class: 'ease-in', curve: 'cubic-bezier(0.4, 0, 1, 1)' },
    { name: 'Ease Out', class: 'ease-out', curve: 'cubic-bezier(0, 0, 0.2, 1)' },
    { name: 'Ease In-Out', class: 'ease-in-out', curve: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  ]

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => set_playing(!playing)}
          className="gap-2"
        >
          {playing ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {playing ? 'Reset' : 'Play All'}
        </Button>
      </div>

      <div className="space-y-4">
        {easings.map((easing) => (
          <div key={easing.name} className="flex items-center gap-4">
            <div className="w-24">
              <p className="text-sm font-medium text-foreground">{easing.name}</p>
              <code className="text-xs text-muted-foreground">{easing.class}</code>
            </div>
            <div className="flex-1 h-12 rounded-lg bg-muted/50 relative overflow-hidden">
              <div
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-violet-500 transition-all duration-1000',
                  easing.class,
                  playing ? 'left-[calc(100%-3rem)]' : 'left-2'
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface TransitionExampleProps {
  className?: string
}

export function TransitionExample({ className }: TransitionExampleProps) {

  const examples = [
    {
      name: 'Scale',
      class: 'hover:scale-110',
      transition: 'transition-transform duration-200',
    },
    {
      name: 'Opacity',
      class: 'hover:opacity-50',
      transition: 'transition-opacity duration-200',
    },
    {
      name: 'Background',
      class: 'hover:bg-violet-600',
      transition: 'transition-colors duration-200',
    },
    {
      name: 'Shadow',
      class: 'hover:shadow-xl',
      transition: 'transition-shadow duration-200',
    },
    {
      name: 'All',
      class: 'hover:scale-105 hover:shadow-lg hover:bg-violet-600',
      transition: 'transition-all duration-200',
    },
  ]

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-5 gap-4', className)}>
      {examples.map((example) => (
        <div key={example.name} className="space-y-2">
          <div
            className={cn(
              'h-20 rounded-lg bg-violet-500 flex items-center justify-center cursor-pointer',
              example.transition,
              example.class
            )}
          >
            <span className="text-sm font-medium text-white">{example.name}</span>
          </div>
          <code className="text-xs text-muted-foreground block text-center">
            {example.transition}
          </code>
        </div>
      ))}
    </div>
  )
}

export function AnimationDemo({ className }: { className?: string }) {
  const animations = [
    { name: 'Spin', class: 'animate-spin', description: 'Continuous rotation' },
    { name: 'Ping', class: 'animate-ping', description: 'Pulse expansion' },
    { name: 'Pulse', class: 'animate-pulse', description: 'Opacity pulse' },
    { name: 'Bounce', class: 'animate-bounce', description: 'Bouncing motion' },
  ]

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-6', className)}>
      {animations.map((animation) => (
        <div key={animation.name} className="space-y-3 text-center">
          <div className="h-24 rounded-lg bg-muted/50 flex items-center justify-center">
            <div
              className={cn('w-8 h-8 rounded-lg bg-violet-500', animation.class)}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{animation.name}</p>
            <code className="text-xs text-muted-foreground">{animation.class}</code>
            <p className="text-xs text-muted-foreground mt-1">{animation.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
