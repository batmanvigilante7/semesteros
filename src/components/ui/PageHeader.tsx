import React from 'react'
import { ChevronRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface ActionConfig {
  label: string
  onClick: () => void
  icon?: React.ComponentType<any>
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
}

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  searchQuery?: string
  onSearchChange?: (val: string) => void
  searchPlaceholder?: string
  primaryAction?: ActionConfig
  secondaryAction?: ActionConfig
  className?: string
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  primaryAction,
  secondaryAction,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 border-b border-border-subtle pb-6 text-left select-none', className)}>
      {/* 1. BREADCRUMBS & TOP CONTROLS */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="h-3 w-3 text-text-muted" />}
                {crumb.href && !isLast ? (
                  <Link to={crumb.href} className="hover:text-text-secondary transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={cn(isLast ? 'text-primary font-extrabold' : '')}>{crumb.label}</span>
                )}
              </React.Fragment>
            )
          })}
        </nav>
      )}

      {/* 2. TITLE & ACTION ACTIONS BUTTONS ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary">{title}</h1>
          {description && <p className="text-body-small text-text-secondary mt-1">{description}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* SEARCH BAR (IF APPLICABLE) */}
          {onSearchChange !== undefined && (
            <div className="relative w-full max-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-border-subtle bg-bg-secondary/40 text-xs text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/10"
              />
            </div>
          )}

          {/* SECONDARY ACTION */}
          {secondaryAction && (
            <Button
              size="sm"
              variant={secondaryAction.variant || 'secondary'}
              onClick={secondaryAction.onClick}
              className="gap-1.5 rounded-xl text-xs"
            >
              {secondaryAction.icon && <secondaryAction.icon className="h-4 w-4" />}
              {secondaryAction.label}
            </Button>
          )}

          {/* PRIMARY ACTION */}
          {primaryAction && (
            <Button
              size="sm"
              variant={primaryAction.variant || 'primary'}
              onClick={primaryAction.onClick}
              className="gap-1.5 rounded-xl text-xs bg-primary text-white"
            >
              {primaryAction.icon && <primaryAction.icon className="h-4 w-4" />}
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
