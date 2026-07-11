import * as React from 'react'
import { cn } from '@/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-border-subtle bg-bg-primary p-6 shadow-subtle hover:shadow-soft transition-all duration-300',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'
