import * as React from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'indigo' | 'rose' | 'orange' | 'teal'
}

export function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
  const baseStyle =
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider'
  
  const variants = {
    primary: 'bg-accent-blue/10 text-accent-blue',
    secondary: 'bg-bg-secondary text-text-secondary border border-border-subtle',
    indigo: 'bg-accent-indigo/10 text-accent-indigo',
    rose: 'bg-accent-rose/10 text-accent-rose',
    orange: 'bg-accent-orange/10 text-accent-orange',
    teal: 'bg-accent-teal/10 text-accent-teal',
  }

  return (
    <span
      className={cn(baseStyle, variants[variant], className)}
      {...props}
    />
  )
}
