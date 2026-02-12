import { cn } from '@/lib/utils'

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

interface PropsTableProps {
  props: PropDefinition[]
  className?: string
}

export function PropsTable({ props, className }: PropsTableProps) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="py-3 px-4 text-left font-medium text-muted-foreground">Prop</th>
            <th className="py-3 px-4 text-left font-medium text-muted-foreground">Type</th>
            <th className="py-3 px-4 text-left font-medium text-muted-foreground">Default</th>
            <th className="py-3 px-4 text-left font-medium text-muted-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b last:border-b-0">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm text-violet-600 dark:text-violet-400">
                    {prop.name}
                  </code>
                  {prop.required && (
                    <span className="px-1.5 py-0.5 text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded">
                      Required
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <code className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {prop.type}
                </code>
              </td>
              <td className="py-3 px-4">
                {prop.default ? (
                  <code className="font-mono text-xs text-muted-foreground">
                    {prop.default}
                  </code>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="py-3 px-4 text-muted-foreground">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface TypeDefinition {
  name: string
  type: string
  description?: string
}

interface TypesTableProps {
  title: string
  types: TypeDefinition[]
  className?: string
}

export function TypesTable({ title, types, className }: TypesTableProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="py-2 px-4 text-left font-medium text-muted-foreground">Name</th>
              <th className="py-2 px-4 text-left font-medium text-muted-foreground">Type</th>
              <th className="py-2 px-4 text-left font-medium text-muted-foreground">Description</th>
            </tr>
          </thead>
          <tbody>
            {types.map((t) => (
              <tr key={t.name} className="border-b last:border-b-0">
                <td className="py-2 px-4">
                  <code className="font-mono text-sm text-violet-600 dark:text-violet-400">
                    {t.name}
                  </code>
                </td>
                <td className="py-2 px-4">
                  <code className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {t.type}
                  </code>
                </td>
                <td className="py-2 px-4 text-muted-foreground">{t.description || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface VariantsTableProps {
  variants: Array<{
    name: string
    description: string
    preview?: React.ReactNode
  }>
  className?: string
}

export function VariantsTable({ variants, className }: VariantsTableProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {variants.map((variant) => (
        <div
          key={variant.name}
          className="flex items-center gap-4 p-4 rounded-lg border bg-card"
        >
          {variant.preview && (
            <div className="shrink-0">{variant.preview}</div>
          )}
          <div>
            <code className="font-mono text-sm text-violet-600 dark:text-violet-400">
              {variant.name}
            </code>
            <p className="text-sm text-muted-foreground mt-1">{variant.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
