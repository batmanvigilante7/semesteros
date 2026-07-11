import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export interface TabItem {
  id: string
  label: string
  icon?: any
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex border-b border-border-subtle overflow-x-auto no-scrollbar gap-1 py-1', className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 outline-none cursor-pointer',
              isActive
                ? 'text-primary bg-bg-primary shadow-subtle border border-border-subtle'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40'
            )}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="active-ui-tab-indicator"
                className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
