import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export interface ButtonProps extends React.ComponentPropsWithoutRef<typeof motion.button> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyle =
      'inline-flex items-center justify-center rounded-xl font-semibold tracking-tight transition-all duration-200 outline-none cursor-pointer focus-ring'

    const variants = {
      primary: 'bg-primary text-white shadow-soft hover:bg-primary-hover active:bg-primary-hover/90',
      secondary: 'bg-secondary text-text-primary hover:bg-bg-tertiary border border-border-subtle shadow-subtle',
      outline: 'border border-border-medium bg-transparent text-text-primary hover:bg-bg-secondary',
      ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40',
      danger: 'bg-danger text-white shadow-soft hover:bg-danger/90 active:bg-danger/85',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-xs',
      lg: 'px-5 py-2.5 text-sm',
    }

    return (
      <motion.button
        ref={ref as any}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn(baseStyle, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
