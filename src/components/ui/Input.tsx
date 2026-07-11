import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Check } from 'lucide-react'

// 1. Text Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, type = 'text', id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          ref={ref}
          className={cn(
            'w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-3 text-xs text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary/30 focus:bg-surface focus:ring-4 focus:ring-primary/10',
            error && 'border-danger focus:border-danger focus:ring-danger/10',
            className
          )}
          {...props}
        />
        {error && <p className="text-[10px] font-semibold text-danger">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

// 2. Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            'w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-3 text-xs text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary/30 focus:bg-surface focus:ring-4 focus:ring-primary/10 resize-y min-h-[100px]',
            error && 'border-danger focus:border-danger focus:ring-danger/10',
            className
          )}
          {...props}
        />
        {error && <p className="text-[10px] font-semibold text-danger">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

// 3. Select Component
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  label?: string
  options: { value: string; label: string }[]
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, options, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={cn(
            'w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-3 text-xs text-text-primary outline-none transition-all focus:border-primary/30 focus:bg-surface focus:ring-4 focus:ring-primary/10 appearance-none',
            error && 'border-danger focus:border-danger focus:ring-danger/10',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[10px] font-semibold text-danger">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

// 4. Checkbox Component
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onCheckedChange, id, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer select-none text-left">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="sr-only"
          ref={ref}
          id={id}
          {...props}
        />
        <div
          className={cn(
            'h-5 w-5 rounded-lg border border-border-medium flex items-center justify-center transition-all duration-200',
            checked ? 'bg-primary border-primary text-white' : 'bg-bg-primary hover:border-text-secondary'
          )}
        >
          {checked && <Check className="h-3.5 w-3.5 stroke-[3.5]" />}
        </div>
        {label && <span className="text-xs font-semibold text-text-primary">{label}</span>}
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'

// 5. Switch Component (iOS Toggle Style)
export interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
}

export function Switch({ checked, onCheckedChange, label }: SwitchProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none text-left">
      <div
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          'w-10 h-6 rounded-full p-0.5 transition-colors duration-250 flex items-center',
          checked ? 'bg-success' : 'bg-bg-tertiary'
        )}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-5 h-5 rounded-full bg-white shadow-soft"
        />
      </div>
      {label && <span className="text-xs font-semibold text-text-primary">{label}</span>}
    </label>
  )
}
