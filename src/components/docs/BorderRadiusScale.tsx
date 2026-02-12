import { cn } from '@/lib/utils'

interface BorderRadiusItemProps {
  name: string
  class_name: string
  value: string
}

function BorderRadiusItem({ name, class_name, value }: BorderRadiusItemProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={cn(
          'w-20 h-20 bg-violet-500',
          class_name
        )}
      />
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{name}</p>
        <code className="text-xs text-muted-foreground">{class_name}</code>
        <p className="text-xs text-muted-foreground mt-0.5">{value}</p>
      </div>
    </div>
  )
}

interface BorderRadiusScaleProps {
  className?: string
}

export function BorderRadiusScale({ className }: BorderRadiusScaleProps) {
  const radii = [
    { name: 'None', class_name: 'rounded-none', value: '0px' },
    { name: 'Small', class_name: 'rounded-sm', value: '2px' },
    { name: 'Default', class_name: 'rounded', value: '4px' },
    { name: 'Medium', class_name: 'rounded-md', value: '6px' },
    { name: 'Large', class_name: 'rounded-lg', value: '8px' },
    { name: 'XL', class_name: 'rounded-xl', value: '12px' },
    { name: '2XL', class_name: 'rounded-2xl', value: '16px' },
    { name: '3XL', class_name: 'rounded-3xl', value: '24px' },
    { name: 'Full', class_name: 'rounded-full', value: '9999px' },
  ]

  return (
    <div className={cn('flex flex-wrap items-end justify-center gap-8 p-8 rounded-lg border bg-card', className)}>
      {radii.map((radius) => (
        <BorderRadiusItem key={radius.name} {...radius} />
      ))}
    </div>
  )
}

interface BorderRadiusUsageProps {
  className?: string
}

export function BorderRadiusUsage({ className }: BorderRadiusUsageProps) {
  const usage_examples = [
    {
      element: 'Buttons',
      radius: 'rounded-lg',
      example: (
        <button className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm font-medium">
          Button
        </button>
      ),
    },
    {
      element: 'Cards',
      radius: 'rounded-xl',
      example: (
        <div className="w-32 h-20 bg-card border rounded-xl shadow-sm" />
      ),
    },
    {
      element: 'Avatars',
      radius: 'rounded-full',
      example: (
        <div className="w-12 h-12 bg-violet-500 rounded-full" />
      ),
    },
    {
      element: 'Inputs',
      radius: 'rounded-md',
      example: (
        <input
          type="text"
          placeholder="Input"
          className="px-3 py-2 border rounded-md text-sm w-32"
          readOnly
        />
      ),
    },
    {
      element: 'Badges',
      radius: 'rounded-full',
      example: (
        <span className="px-2.5 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
          Badge
        </span>
      ),
    },
    {
      element: 'Tooltips',
      radius: 'rounded-md',
      example: (
        <div className="px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md">
          Tooltip
        </div>
      ),
    },
  ]

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6', className)}>
      {usage_examples.map((item) => (
        <div key={item.element} className="space-y-3">
          <div className="h-24 rounded-lg bg-muted/50 flex items-center justify-center p-4">
            {item.example}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">{item.element}</p>
            <code className="text-xs text-muted-foreground">{item.radius}</code>
          </div>
        </div>
      ))}
    </div>
  )
}
