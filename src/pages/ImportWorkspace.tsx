import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  Clipboard, 
  BookOpen, 
  Trash2, 
  Plus, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  FolderOpen
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAcademicEngine } from '@/stores/AcademicEngine'
import { PageHeader } from '@/components/ui/PageHeader'
import { AnimatedCard, AnimatedButton } from '@/components/ui/MotionSystem'
import { useToast } from '@/components/ui/Toast'
import type { Subject } from '@/models'

// Pre-loaded Template for instant workspace bootstrapping
const SAMPLE_LESSON_PLAN = `Course: Data Structures & Algorithms
Code: CS-DSA-301

Module 1: Basic Paradigms & Lists
Topic: Introduction to Algorithms and Complexity analysis (stiffness, damping)
Topic: Array-based List ADT implementations
Topic: Singly Linked Lists structures and insertions
Topic: Doubly and Circular Linked Lists traversals

Module 2: Stacks & Queues structures
Topic: Stack ADT implementations using arrays and pointers
Topic: Queue structures and circular buffer bounds
Topic: Real-world applications of stacks (expression parsing)

Module 3: Non-Linear Trees & Graphs
Topic: Binary Trees definitions and traversals (Pre, Post, In-order)
Topic: Binary Search Trees insertions and deletions
Topic: Graphs representations (adjacency lists, matrices)
Topic: Graph traversals BFS and DFS pathfinding algorithms
`

interface ParsedNode {
  id: string
  title: string
  type: 'course' | 'module' | 'topic'
  children: ParsedNode[]
  code?: string
}

export default function ImportWorkspace() {
  const navigate = useNavigate()
  const { importCourseDirectly } = useAcademicEngine()
  const { toast } = useToast()

  const [inputMethod, setInputMethod] = useState<'paste' | 'file'>('paste')
  const [pasteText, setPasteText] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedNode | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  // Accordion state
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleNodeExpand = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Text parser: Normalizes raw input lines into Course -> Module -> Topic structure
  const handleParseText = (text: string) => {
    if (!text.trim()) {
      toast('Please enter or paste syllabus details first.', undefined, 'warning')
      return
    }

    setIsParsing(true)
    
    setTimeout(() => {
      const lines = text.split('\n')
      let courseNode: ParsedNode = {
        id: `c-${crypto.randomUUID()}`,
        title: 'New Syllabus Course',
        type: 'course',
        code: 'GEN-101',
        children: []
      }

      let currentModule: ParsedNode | null = null

      lines.forEach((line) => {
        const trimmed = line.trim()
        if (!trimmed) return

        // 1. Detect Course details
        if (trimmed.toLowerCase().startsWith('course:') || trimmed.toLowerCase().startsWith('subject:')) {
          courseNode.title = trimmed.split(':')[1].trim()
        } else if (trimmed.toLowerCase().startsWith('code:')) {
          courseNode.code = trimmed.split(':')[1].trim().toUpperCase()
        } 
        // 2. Detect Module structures
        else if (
          trimmed.toLowerCase().startsWith('module') || 
          trimmed.toLowerCase().startsWith('unit') || 
          trimmed.toLowerCase().startsWith('chapter')
        ) {
          const modNode: ParsedNode = {
            id: `m-${crypto.randomUUID()}`,
            title: trimmed,
            type: 'module',
            children: []
          }
          courseNode.children.push(modNode)
          currentModule = modNode
        } 
        // 3. Detect Topics (default to module children)
        else {
          const cleanTopic = trimmed.replace(/^(topic:|-|\*|\d+\.|\u2022)\s*/i, '')
          const topicNode: ParsedNode = {
            id: `t-${crypto.randomUUID()}`,
            title: cleanTopic,
            type: 'topic',
            children: []
          }

          if (currentModule) {
            currentModule.children.push(topicNode)
          } else {
            // Auto create a default module if none exists yet
            if (courseNode.children.length === 0) {
              currentModule = {
                id: `m-${crypto.randomUUID()}`,
                title: 'Module 1: General Core',
                type: 'module',
                children: []
              }
              courseNode.children.push(currentModule)
            }
            currentModule?.children.push(topicNode)
          }
        }
      })

      // Expand all nodes by default
      const expansions: Record<string, boolean> = { [courseNode.id]: true }
      courseNode.children.forEach((mod) => {
        expansions[mod.id] = true
      })
      setExpandedNodes(expansions)

      setParsedData(courseNode)
      setIsParsing(false)
      toast('Syllabus layout parsed successfully!', undefined, 'success')
    }, 900)
  }

  // Load sample template directly
  const handleLoadSample = () => {
    setPasteText(SAMPLE_LESSON_PLAN)
    handleParseText(SAMPLE_LESSON_PLAN)
  }

  // File Uploader parser wrapper
  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      handleParseText(content)
    }
    reader.readAsText(file)
  }

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  // Inline editing handlers
  const startEditing = (id: string, title: string) => {
    setEditingNodeId(id)
    setEditTitle(title)
  }

  const saveEdit = (node: ParsedNode) => {
    if (editTitle.trim()) {
      node.title = editTitle.trim()
    }
    setEditingNodeId(null)
  }

  // Tree manipulation
  const deleteNode = (parentId: string | null, nodeId: string) => {
    if (!parsedData) return

    if (!parentId) {
      // Deleting the course itself
      setParsedData(null)
      return
    }

    const traverseAndRemove = (current: ParsedNode): boolean => {
      if (current.id === parentId) {
        current.children = current.children.filter(child => child.id !== nodeId)
        return true
      }
      for (const child of current.children) {
        if (traverseAndRemove(child)) return true
      }
      return false
    }

    traverseAndRemove(parsedData)
    setParsedData({ ...parsedData }) // force re-render
  }

  const addNode = (parentNode: ParsedNode, type: 'module' | 'topic') => {
    const newNode: ParsedNode = {
      id: `${type[0]}-${crypto.randomUUID()}`,
      title: type === 'module' ? 'New Module Folder' : 'New Study Topic',
      type,
      children: []
    }
    parentNode.children.push(newNode)
    setExpandedNodes(prev => ({ ...prev, [parentNode.id]: true, [newNode.id]: true }))
    setParsedData({ ...parsedData! }) // force re-render
  }

  // Commit parsed tree structure to AcademicEngine store
  const handleImportToWorkspace = () => {
    if (!parsedData) return

    const courseAccentColors = ['#3B82F6', '#10B981', '#8B5CF6', '#FBBF24', '#EC4899', '#06B6D4']
    const randomColor = courseAccentColors[Math.floor(Math.random() * courseAccentColors.length)]

    // Map recursive node elements to AcademicEngine Course/Subject structures
    const finalSubject: Subject = {
      id: parsedData.id,
      name: parsedData.title,
      code: parsedData.code || 'GEN-101',
      type: 'Theory',
      credits: 3,
      faculty: 'Assigned Professor',
      color: randomColor,
      attendance: 100,
      progress: 0,
      description: 'Syllabus imported via Academic Data Pipeline.',
      modules: parsedData.children.map((modNode, mIdx) => ({
        id: modNode.id,
        title: modNode.title,
        hours: modNode.children.length * 2,
        progress: 0,
        status: 'Not Started',
        topics: modNode.children.map((topNode) => ({
          id: topNode.id,
          title: topNode.title,
          duration: 1.5,
          deadline: new Date(Date.now() + (mIdx + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // space out deadlines weekly
          status: 'Not Started',
          difficulty: 'medium',
          estimatedStudyTime: 2
        }))
      })),
      assignments: [],
      resources: [],
      notes: []
    }

    importCourseDirectly(finalSubject)
    toast(`Successfully bootstrapped ${finalSubject.name} workspace!`, undefined, 'success')
    navigate('/courses')
  }

  // Recursive renderer for syllabus hierarchy preview nodes
  const renderTree = (node: ParsedNode, parentId: string | null = null) => {
    const isExpanded = expandedNodes[node.id] !== false
    const isEditing = editingNodeId === node.id

    return (
      <div key={node.id} className="pl-4 border-l border-border-subtle/50 ml-1.5 mt-2">
        <div className="flex items-center justify-between py-1 group select-none">
          <div className="flex items-center gap-2 flex-1">
            {node.children.length > 0 ? (
              <button 
                onClick={() => toggleNodeExpand(node.id)}
                className="p-0.5 rounded hover:bg-bg-secondary text-text-secondary cursor-pointer"
              >
                {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            ) : (
              <span className="w-4.5" />
            )}
            
            {node.type === 'course' && <BookOpen className="h-4 w-4 text-accent-blue" />}
            {node.type === 'module' && <FolderOpen className="h-4 w-4 text-accent-indigo" />}
            {node.type === 'topic' && <FileText className="h-3.5 w-3.5 text-text-tertiary" />}

            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="px-2 py-0.5 text-xs border border-primary rounded bg-bg-secondary text-text-primary outline-none focus:ring-1 focus:ring-primary/20"
                  autoFocus
                />
                {node.type === 'course' && (
                  <input
                    type="text"
                    placeholder="Code"
                    value={node.code || ''}
                    onChange={(e) => {
                      node.code = e.target.value.toUpperCase()
                      setParsedData({ ...parsedData! })
                    }}
                    className="w-16 px-2 py-0.5 text-[10px] border border-primary rounded bg-bg-secondary text-text-primary outline-none"
                  />
                )}
                <button 
                  onClick={() => saveEdit(node)} 
                  className="p-1 text-success hover:bg-success/10 rounded cursor-pointer"
                >
                  <Check className="h-3 w-3 stroke-[3]" />
                </button>
              </div>
            ) : (
              <span 
                className={`text-xs hover:text-text-primary transition-colors cursor-pointer ${
                  node.type === 'course' ? 'font-bold text-sm text-text-primary' :
                  node.type === 'module' ? 'font-semibold text-text-secondary' : 'text-text-secondary'
                }`}
                onClick={() => startEditing(node.id, node.title)}
              >
                {node.title} {node.type === 'course' && node.code && <span className="text-[10px] text-accent-blue font-mono bg-accent-blue/10 px-1.5 py-0.5 rounded ml-1.5">{node.code}</span>}
              </span>
            )}
          </div>

          {/* Action pills visible on hover */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-opacity">
            {node.type !== 'topic' && (
              <button
                onClick={() => addNode(node, node.type === 'course' ? 'module' : 'topic')}
                className="p-1 hover:bg-bg-secondary text-text-secondary rounded cursor-pointer"
                title={node.type === 'course' ? 'Add Module' : 'Add Topic'}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => deleteNode(parentId, node.id)}
              className="p-1 hover:bg-accent-rose/10 text-accent-rose rounded cursor-pointer"
              title="Delete node"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {isExpanded && node.children.length > 0 && (
          <div className="space-y-1">
            {node.children.map(child => renderTree(child, node.id))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12 text-left select-none">
      <PageHeader
        title="Academic Import Pipeline"
        description="Bootstrap your semester OS workspace directly from university syllabus files or pasted lesson plans."
        breadcrumbs={[
          { label: 'Academic OS' },
          { label: 'Import Pipeline' }
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        {/* LEFT COLUMN: Input controls */}
        <div className="space-y-6">
          <AnimatedCard>
            {/* Source selector */}
            <div className="flex border-b border-border-subtle pb-3 mb-5 gap-4">
              <button
                onClick={() => setInputMethod('paste')}
                className={`pb-2 text-xs font-semibold cursor-pointer relative ${
                  inputMethod === 'paste' ? 'text-primary font-bold' : 'text-text-secondary'
                }`}
              >
                {inputMethod === 'paste' && (
                  <motion.div layoutId="import-tab-indicator" className="absolute bottom-0 inset-x-0 h-0.5 bg-primary" />
                )}
                <span className="flex items-center gap-1.5">
                  <Clipboard className="h-4 w-4" /> Paste Lesson Plan
                </span>
              </button>
              <button
                onClick={() => setInputMethod('file')}
                className={`pb-2 text-xs font-semibold cursor-pointer relative ${
                  inputMethod === 'file' ? 'text-primary font-bold' : 'text-text-secondary'
                }`}
              >
                {inputMethod === 'file' && (
                  <motion.div layoutId="import-tab-indicator" className="absolute bottom-0 inset-x-0 h-0.5 bg-primary" />
                )}
                <span className="flex items-center gap-1.5">
                  <Upload className="h-4 w-4" /> Upload Syllabus File
                </span>
              </button>
            </div>

            {/* Inputs body */}
            <AnimatePresence mode="wait">
              {inputMethod === 'paste' ? (
                <motion.div
                  key="paste"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Paste Syllabus Text</label>
                    <textarea
                      value={pasteText}
                      onChange={(e) => setPasteText(e.target.value)}
                      placeholder="Paste G-Learn syllabus or lesson plan text here..."
                      className="w-full h-64 p-4 rounded-xl border border-border-subtle bg-bg-secondary/40 text-xs text-text-primary focus:outline-none focus:border-primary focus:bg-surface resize-none font-mono"
                    />
                  </div>

                  <div className="flex gap-3">
                    <AnimatedButton
                      onClick={() => handleParseText(pasteText)}
                      isLoading={isParsing}
                      className="bg-primary text-white"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Parse Lesson Plan
                    </AnimatedButton>
                    <AnimatedButton
                      variant="outline"
                      onClick={handleLoadSample}
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Try Sample Template
                    </AnimatedButton>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                      dragActive ? 'border-primary bg-primary/5' : 'border-border-medium hover:border-primary hover:bg-bg-secondary/35'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />
                    <Upload className="h-10 w-10 text-text-tertiary mb-3 opacity-45" />
                    <p className="text-xs font-semibold text-text-primary">Drag and drop your syllabus file here</p>
                    <p className="text-[10px] text-text-secondary mt-1">Supports TXT files (PDF/DOCX OCR support coming soon)</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </AnimatedCard>

          {/* Quick Explainer block */}
          <div className="rounded-xl border border-border-subtle bg-bg-secondary/20 p-4 text-xs text-text-secondary leading-relaxed">
            <span className="font-bold text-text-primary flex items-center gap-1.5 mb-1.5"><Sparkles className="h-4 w-4 text-primary" /> Why Bootstrap your workspace?</span>
            Uploading your lesson plan compiles topics directly into the **Syllabus Progress Ring** inside course workspaces. It schedules initial planner tasks and tags resources automatically, matching GITAM or standard university semester schedules.
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Preview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-tertiary">Import Preview</h3>
            {parsedData && (
              <AnimatedButton
                onClick={handleImportToWorkspace}
                className="bg-success text-white"
              >
                Confirm Import <ArrowRight className="h-3.5 w-3.5" />
              </AnimatedButton>
            )}
          </div>

          <AnimatedCard className="min-h-[400px]">
            {parsedData ? (
              <div className="space-y-3">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-accent-blue bg-accent-blue/10 px-2.5 py-1 rounded-lg inline-block">
                  Interactive Preview Tree
                </div>
                <div className="mt-4">
                  {renderTree(parsedData)}
                </div>
              </div>
            ) : (
              <div className="h-[380px] flex flex-col items-center justify-center text-center">
                <FileText className="h-12 w-12 text-text-tertiary opacity-35 mb-2.5" />
                <p className="text-xs font-semibold text-text-primary">No Syllabus Parsed Yet</p>
                <p className="text-[10px] text-text-secondary mt-1 max-w-[240px] leading-relaxed">
                  Paste or upload a syllabus in the left panel to preview the generated workspace tree.
                </p>
              </div>
            )}
          </AnimatedCard>
        </div>
      </div>
    </div>
  )
}
