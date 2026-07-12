import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, Flame, Clock, Award, BookOpen } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  category: 'deadlines' | 'streak' | 'lesson' | 'system'
  isRead: boolean
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Assignment Due Tomorrow',
    description: 'Unit 3 Polymorphism Assignment is due in 24 hours.',
    time: '2 hours ago',
    category: 'deadlines',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: 'Study Streak Restored!',
    description: 'You completed your daily focus. Streak is at 12 days.',
    time: '4 hours ago',
    category: 'streak',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'New Lesson Available',
    description: 'Instructor uploaded Unit 4 AVL Tree lectures.',
    time: '1 day ago',
    category: 'lesson',
    isRead: true,
  },
]

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('semesteros.notifications')
    return saved ? JSON.parse(saved) : initialNotifications
  })
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    localStorage.setItem('semesteros.notifications', JSON.stringify(notifications))
  }, [notifications])

  // Count unread
  const unreadCount = notifications.filter((n) => !n.isRead).length

  // Filter list
  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead
    return true
  })

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  const getCategoryIcon = (category: NotificationItem['category']) => {
    if (category === 'deadlines') return <Clock className="h-4 w-4 text-accent-rose" />
    if (category === 'streak') return <Flame className="h-4 w-4 text-accent-amber" />
    if (category === 'lesson') return <BookOpen className="h-4 w-4 text-accent-blue" />
    return <Bell className="h-4 w-4 text-accent-indigo" />
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/25 backdrop-blur-sm"
          />

          {/* Slide-over Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-sm border-l border-border-subtle bg-surface shadow-high h-full flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-4 border-b border-border-subtle flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold text-text-primary">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-accent-rose px-1.5 py-0.5 text-[8.5px] font-extrabold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-text-secondary hover:bg-bg-secondary transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Sub-navigation filtering tabs */}
            <div className="px-4 py-2 border-b border-border-subtle/50 flex justify-between items-center bg-bg-secondary/20">
              <div className="flex gap-2">
                {(['all', 'unread'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'text-[10px] font-bold capitalize px-2 py-1 rounded transition-colors cursor-pointer',
                      activeTab === tab
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-[9px] font-bold text-accent-rose hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* List panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredNotifs.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    'p-3 border rounded-xl flex items-start gap-3 transition-all text-left relative',
                    notif.isRead
                      ? 'border-border-subtle bg-surface opacity-75'
                      : 'border-border-medium bg-bg-secondary/40 shadow-soft'
                  )}
                >
                  <div className="p-2 bg-bg-secondary rounded-lg shrink-0">
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="min-w-0 pr-6">
                    <h4 className="text-xs font-bold text-text-primary">{notif.title}</h4>
                    <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">{notif.description}</p>
                    <span className="text-[8px] text-text-tertiary font-semibold mt-1.5 block">{notif.time}</span>
                  </div>

                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="absolute right-2 top-2 p-1 rounded hover:bg-bg-secondary text-text-tertiary hover:text-accent-teal transition-all cursor-pointer"
                      title="Mark as read"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {filteredNotifs.length === 0 && (
                <div className="h-64 flex flex-col items-center justify-center text-center">
                  <Award className="h-10 w-10 text-text-tertiary opacity-35 mb-2" />
                  <p className="text-xs font-semibold text-text-secondary">All caught up!</p>
                  <p className="text-[9px] text-text-secondary mt-0.5">No notifications here.</p>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
