import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  BookOpen,
  CheckCircle,
  FileText,
  User,
  Info,
  Calendar,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Input, Textarea, Select, Checkbox, Switch } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { Tooltip } from '@/components/ui/Tooltip'
import { Dialog, Drawer, Dropdown } from '@/components/ui/Dialog'
import { Tabs } from '@/components/ui/Tabs'
import { Accordion } from '@/components/ui/Accordion'
import { EmptyState, ErrorState, SkeletonLoader } from '@/components/ui/Feedback'
import { ProgressRing, ProgressBar, StatCard, TimelineCard, AssignmentCard } from '@/components/ui/DashboardCards'
import { useToast } from '@/components/ui/Toast'

export default function Showcase() {
  const { toast } = useToast()

  // Tab state
  const [activeShowcaseTab, setActiveShowcaseTab] = useState('buttons')

  // Interactive Form States
  const [inputText, setInputText] = useState('')
  const [checkState, setCheckState] = useState(false)
  const [switchState, setSwitchState] = useState(false)
  const [selectState, setSelectState] = useState('theory')

  // Interactive Overlay States
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Accordion Items
  const accordionItems = [
    {
      id: 'acc-1',
      title: 'Module 1: Linear Lists',
      subtitle: '6 Lecture Hours',
      content: 'Detailed focus on Singly Linked Lists, Doubly Linked Lists, and Circular Lists. Includes lab exercises.',
    },
    {
      id: 'acc-2',
      title: 'Module 2: Non-Linear Trees',
      subtitle: '8 Lecture Hours',
      content: 'Binary Search Trees (BST), AVL Tree Rotations, and balance factors. Includes self-study worksheets.',
    },
  ]

  // Tabs showcase items
  const tabItems = [
    { id: 'buttons', label: 'Buttons & Badges', icon: Sparkles },
    { id: 'forms', label: 'Form Controls', icon: FileText },
    { id: 'overlays', label: 'Overlays & Menus', icon: Layers },
    { id: 'cards', label: 'Dashboard Cards', icon: BookOpen },
    { id: 'feedback', label: 'Status & Feedbacks', icon: Info },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-6 pb-12 text-left"
    >
      {/* Header */}
      <div>
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-secondary px-3 py-1 text-xs font-bold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Component Library
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
          Design System Showcase
        </h2>
        <p className="text-xs text-text-secondary mt-1">
          Interactive catalog of SemesterOS UI design tokens and components built in Tailwind v4 & Framer Motion.
        </p>
      </div>

      {/* Tabs Selector */}
      <Tabs tabs={tabItems} activeTab={activeShowcaseTab} onChange={setActiveShowcaseTab} />

      {/* Showcase Tab Panels */}
      <Card className="rounded-[24px] p-6 border-border-subtle bg-surface shadow-subtle min-h-[400px]">
        {activeShowcaseTab === 'buttons' && (
          <div className="space-y-8">
            {/* 1. BUTTONS */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-2 uppercase tracking-wider text-[10px]">
                Button Actions (Spring micro-interactions)
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Button</Button>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="primary" size="sm">Small Primary</Button>
                <Button variant="secondary" size="lg">Large Secondary</Button>
              </div>
            </div>

            {/* 2. BADGES */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-2 uppercase tracking-wider text-[10px]">
                Status Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="indigo">Urgent</Badge>
                <Badge variant="rose">Critical</Badge>
                <Badge variant="orange">High</Badge>
                <Badge variant="teal">Completed</Badge>
              </div>
            </div>

            {/* 3. AVATARS */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-2 uppercase tracking-wider text-[10px]">
                Avatars
              </h3>
              <div className="flex items-center gap-4">
                <Avatar fallback="CR" size="sm" />
                <Avatar fallback="SW" size="md" />
                <Avatar fallback="AK" size="lg" />
              </div>
            </div>

            {/* 4. TOOLTIPS */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-2 uppercase tracking-wider text-[10px]">
                Hover Tooltips
              </h3>
              <div className="flex items-center gap-6">
                <Tooltip content="Tooltip message on top" position="top">
                  <span className="text-xs font-bold text-primary underline cursor-help">Hover Top</span>
                </Tooltip>
                <Tooltip content="Tooltip message on bottom" position="bottom">
                  <span className="text-xs font-bold text-primary underline cursor-help">Hover Bottom</span>
                </Tooltip>
              </div>
            </div>
          </div>
        )}

        {activeShowcaseTab === 'forms' && (
          <div className="space-y-6 max-w-md">
            <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-2 uppercase tracking-wider text-[10px]">
              Form Controls
            </h3>
            
            <Input
              label="Standard Text Input"
              placeholder="Type subject code..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <Input
              label="Text Input with Validation Error"
              error="A subject with this course code already exists."
              placeholder="e.g. 24CSEN1011"
              defaultValue="24CSEN1011"
            />

            <Textarea
              label="Detailed Notes Scratchpad"
              placeholder="Start typing your lecture formulas..."
            />

            <Select
              label="Course Category Type"
              value={selectState}
              onChange={(e) => setSelectState(e.target.value)}
              options={[
                { value: 'theory', label: 'Theory Class' },
                { value: 'lab', label: 'Practical Lab' },
              ]}
            />

            <div className="flex flex-wrap items-center gap-8 pt-2">
              <Checkbox
                label="Mark syllabus as active"
                checked={checkState}
                onCheckedChange={setCheckState}
              />

              <Switch
                label="Enable Condonation Alert Notification"
                checked={switchState}
                onCheckedChange={setSwitchState}
              />
            </div>
          </div>
        )}

        {activeShowcaseTab === 'overlays' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-2 uppercase tracking-wider text-[10px]">
              Overlays & Context Actions
            </h3>

            <div className="flex flex-wrap gap-3">
              {/* Dialog Trigger */}
              <Button onClick={() => setDialogOpen(true)}>Open Modal Dialog</Button>
              {/* Drawer Trigger */}
              <Button onClick={() => setDrawerOpen(true)} variant="secondary">Open Side Drawer</Button>
              {/* Dropdown Menu */}
              <Dropdown
                trigger={
                  <Button variant="outline" className="gap-1.5">
                    Click Dropdown Menu
                  </Button>
                }
                items={[
                  { label: 'View Profile', onClick: () => alert('Profile'), icon: User },
                  {
                    label: 'Sync Calendar',
                    onClick: () => toast('Calendar Sync', 'Sync finished successfully!', 'success'),
                    icon: Calendar,
                  },
                  { label: 'Delete Course', onClick: () => alert('Delete'), icon: Info, danger: true },
                ]}
              />
            </div>

            {/* Accoridon Disclosure */}
            <div className="pt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Accordion Expandable Lists</h4>
              <Accordion items={accordionItems} />
            </div>

            {/* Modals & Drawers components */}
            <Dialog
              isOpen={dialogOpen}
              onClose={() => setDialogOpen(false)}
              title="Add Custom Subject"
              footer={
                <>
                  <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => {
                    setDialogOpen(false)
                    toast('Subject Created', 'Custom course added successfully!', 'success')
                  }}>Save Course</Button>
                </>
              }
            >
              <div className="space-y-4 py-2">
                <p className="text-xs text-text-secondary">Configure a custom semester subject detail here.</p>
                <Input placeholder="Course Code" />
                <Input placeholder="Course Title" />
              </div>
            </Dialog>

            <Drawer
              isOpen={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              title="Notifications Center"
            >
              <div className="space-y-4 py-2">
                <p className="text-xs text-text-secondary">Here is a log of your upcoming semester checkpoints.</p>
                <div className="rounded-xl border border-border-subtle bg-bg-secondary p-3 text-xs text-text-primary">
                  <strong>OOP Assignment</strong> is due tomorrow. Est. Study Time: 2 hours.
                </div>
              </div>
            </Drawer>
          </div>
        )}

        {activeShowcaseTab === 'cards' && (
          <div className="space-y-8">
            <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-2 uppercase tracking-wider text-[10px]">
              Dashboard Cards & Metrics
            </h3>

            {/* 1. STAT CARDS */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                title="Active Semester Courses"
                value="9 subjects"
                trend="Fall Term III"
                icon={BookOpen}
                color="#2563EB"
                trendType="up"
              />
              <StatCard
                title="Pending Assignments"
                value="2 due"
                trend="Need attention"
                icon={CheckCircle}
                color="#EF4444"
              />
              <StatCard
                title="Attendance average"
                value="91.5%"
                trend="Healthy status"
                icon={User}
                color="#10B981"
              />
            </div>

            {/* 2. PROGRESS METRICS */}
            <div className="grid gap-6 md:grid-cols-[1fr_2fr] items-center">
              <div className="flex gap-4">
                <ProgressRing percentage={75} color="#2563EB" label="Syllabus" />
                <ProgressRing percentage={92} color="#10B981" label="Attendance" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-text-secondary">
                  <span>Semester Weight Completion</span>
                  <span>75%</span>
                </div>
                <ProgressBar percentage={75} color="#2563EB" />
              </div>
            </div>

            {/* 3. ASSIGNMENT & TIMELINE CARDS */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Timeline Logs & Tasks</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <TimelineCard
                  subjectCode="24CSEN1011"
                  subjectColor="#2563EB"
                  moduleTitle="Module 1: OOP Intro"
                  topicTitle="Inheritance & Interfaces"
                  status="In Progress"
                  dueDate="2026-07-15"
                />

                <AssignmentCard
                  title="Prepare Red-Black Tree Balancing Rotations"
                  dueDate="2026-07-18"
                  subjectName="Data Structures"
                  subjectColor="#F59E0B"
                  priority="high"
                  status="in_progress"
                  onCompleteToggle={() => alert('Toggle Completion')}
                  onMenuClick={() => alert('Menu Actions')}
                />
              </div>
            </div>
          </div>
        )}

        {activeShowcaseTab === 'feedback' && (
          <div className="space-y-8">
            <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-2 uppercase tracking-wider text-[10px]">
              Status Feeds & Loadings
            </h3>

            {/* 1. SKELETON LOADERS */}
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-[10px] font-bold text-text-tertiary mb-2 uppercase">Text Shimmer</p>
                <SkeletonLoader variant="text" rows={3} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-tertiary mb-2 uppercase">List Shimmer</p>
                <SkeletonLoader variant="list" rows={2} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-tertiary mb-2 uppercase">Card Shimmer</p>
                <SkeletonLoader variant="card" rows={1} />
              </div>
            </div>

            {/* 2. ERROR & EMPTY STATES */}
            <div className="grid gap-6 md:grid-cols-2">
              <ErrorState onRetry={() => alert('Retrying...')} />
              <EmptyState type="tasks" action={<Button size="sm">Create Task</Button>} />
            </div>
          </div>
        )}
      </Card>

      {/* Global Toast trigger */}
      <Card className="rounded-[24px] p-6 border-border-subtle bg-bg-secondary/40 text-center">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Toast Notifications</h4>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <Button onClick={() => toast('Operation Successful', 'Your notebook changes were saved.', 'success')}>
            Success Toast
          </Button>
          <Button variant="secondary" onClick={() => toast('Invalid Parameter', 'Course credits must be positive.', 'error')}>
            Error Toast
          </Button>
          <Button variant="outline" onClick={() => toast('Review Warning', 'Your attendance is approaching condonation levels.', 'warning')}>
            Warning Toast
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
