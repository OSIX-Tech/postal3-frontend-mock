import type { ReactNode } from 'react'
import { Code, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CodeBlock } from './CodeBlock'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ComponentShowcaseProps {
  title: string
  description?: string
  code: string
  children: ReactNode
  className?: string
  preview_className?: string
  centered?: boolean
}

export function ComponentShowcase({
  title,
  description,
  code,
  children,
  className,
  preview_className,
  centered = true,
}: ComponentShowcaseProps) {
  return (
    <div className={cn('rounded-xl border bg-card overflow-hidden', className)}>
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <div className="px-4 pt-2 border-b bg-muted/30">
          <TabsList className="h-9 bg-transparent p-0 gap-4">
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-3"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-3"
            >
              <Code className="w-4 h-4 mr-2" />
              Code
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preview" className="m-0">
          <div
            className={cn(
              'p-8 min-h-[120px]',
              centered && 'flex items-center justify-center',
              preview_className
            )}
          >
            {children}
          </div>
        </TabsContent>

        <TabsContent value="code" className="m-0">
          <CodeBlock code={code} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ShowcaseGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function ShowcaseGrid({ children, columns = 2, className }: ShowcaseGridProps) {
  const grid_cols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-6', grid_cols[columns], className)}>
      {children}
    </div>
  )
}

interface ShowcaseItemProps {
  label: string
  children: ReactNode
  className?: string
}

export function ShowcaseItem({ label, children, className }: ShowcaseItemProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div>{children}</div>
    </div>
  )
}
