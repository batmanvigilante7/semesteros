import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Video,
  Link as LinkIcon,
  Search,
  FolderPlus,
  FileUp,
  Download,
  ExternalLink,
  Star,
  Bookmark,
  X,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Image,
  Lightbulb,
  HelpCircle,
  Code2,
  Briefcase,
  Trash2,
  ArrowLeft,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AnimatedButton } from '@/components/ui/MotionSystem'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'
import { db } from '@/utils/db'
import { PageHeader } from '@/components/ui/PageHeader'

// Type interfaces
interface KnowledgeFile {
  id: string
  title: string
  type: 'pdf' | 'video' | 'link' | 'note' | 'image' | 'concept' | 'question' | 'lab' | 'assignment'
  courseId: string // e.g. 'course-oop', 'course-ds'
  size: string
  dateAdded: string
  subject: string
  tags: string[]
  isFavorite: boolean
  isBookmarked: boolean
  url: string
  subCategory: 'notes' | 'pdfs' | 'images' | 'videos' | 'concepts' | 'questions' | 'bookmarks' | 'labs' | 'assignments'
}

interface CourseSecondBrain {
  id: string
  name: string
  code: string
  color: string
}

const initialCourses: CourseSecondBrain[] = []
const initialFiles: KnowledgeFile[] = []

// Icons for each Notion folder sub-category
const subCategoryMetadata = [
  { id: 'notes', label: 'Notes', icon: FileText, color: 'text-accent-blue bg-accent-blue/10' },
  { id: 'pdfs', label: 'PDFs & Slides', icon: BookOpen, color: 'text-accent-rose bg-accent-rose/10' },
  { id: 'images', label: 'Images', icon: Image, color: 'text-accent-teal bg-accent-teal/10' },
  { id: 'videos', label: 'Videos', icon: Video, color: 'text-accent-amber bg-accent-amber/10' },
  { id: 'concepts', label: 'Concepts', icon: Lightbulb, color: 'text-accent-indigo bg-accent-indigo/10' },
  { id: 'questions', label: 'Exam Questions', icon: HelpCircle, color: 'text-accent-rose bg-accent-rose/10' },
  { id: 'bookmarks', label: 'Bookmarks', icon: LinkIcon, color: 'text-accent-teal bg-accent-teal/10' },
  { id: 'labs', label: 'Lab Files', icon: Code2, color: 'text-accent-blue bg-accent-blue/10' },
  { id: 'assignments', label: 'Assignments', icon: Briefcase, color: 'text-accent-indigo bg-accent-indigo/10' },
] as const

export default function Resources() {
  const [courses, setCourses] = useState<CourseSecondBrain[]>(() => {
    const saved = localStorage.getItem('semesteros.knowledge.courses')
    return saved ? JSON.parse(saved) : initialCourses
  })
  const [files, setFiles] = useState<KnowledgeFile[]>(initialFiles)

  useEffect(() => {
    localStorage.setItem('semesteros.knowledge.courses', JSON.stringify(courses))
  }, [courses])

  // Load files from IndexedDB on mount
  useEffect(() => {
    db.getFiles().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setFiles(loaded)
      } else {
        // Seed default initial files if IndexedDB is blank
        Promise.all(initialFiles.map(f => db.saveFile(f as any))).then(() => {
          setFiles(initialFiles)
        })
      }
    }).catch(err => {
      console.error('Failed to load files from IndexedDB', err)
    })
  }, [])

  // Navigation / Focus States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '')
  const [selectedSubCat, setSelectedSubCat] = useState<KnowledgeFile['subCategory']>('pdfs')
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [mobileActiveColumn, setMobileActiveColumn] = useState<'folders' | 'files' | 'insights'>('folders')
  
  // State for the PDF/media preview modal
  const [previewFile, setPreviewFile] = useState<KnowledgeFile | null>(null)
  
  // Ref for the hidden file upload input
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Expand states for Notion collapsible course second brains
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({})

  // Modal / Drag states
  const [dragActive, setDragActive] = useState(false)
  const [courseModalOpen, setCourseModalOpen] = useState(false)
  const [newCourseName, setNewCourseName] = useState('')
  const [newCourseCode, setNewCourseCode] = useState('')

  const toggleCourseExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedCourses(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Toggle favorite / bookmarks
  const toggleFavorite = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const targetFile = files.find(f => f.id === fileId)
    if (!targetFile) return
    const updated = { ...targetFile, isFavorite: !targetFile.isFavorite }
    db.saveFile(updated as any).then(() => {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? updated : f))
      )
    })
  }

  const toggleBookmark = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const targetFile = files.find(f => f.id === fileId)
    if (!targetFile) return
    const updated = { ...targetFile, isBookmarked: !targetFile.isBookmarked }
    db.saveFile(updated as any).then(() => {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? updated : f))
      )
    })
  }

  useEffect(() => {
    const handleGlobalCreateCourse = () => {
      setCourseModalOpen(true)
    }
    const handleGlobalUploadFile = () => {
      fileInputRef.current?.click()
    }
    window.addEventListener('open-create-course', handleGlobalCreateCourse)
    window.addEventListener('open-upload-file', handleGlobalUploadFile)
    return () => {
      window.removeEventListener('open-create-course', handleGlobalCreateCourse)
      window.removeEventListener('open-upload-file', handleGlobalUploadFile)
    }
  }, [])

  // Add course
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCourseName.trim() || !newCourseCode.trim()) return
    const newCourse: CourseSecondBrain = {
      id: `course-${crypto.randomUUID()}`,
      name: newCourseName.trim(),
      code: newCourseCode.trim().toUpperCase(),
      color: ['#3B82F6', '#10B981', '#8B5CF6', '#FBBF24', '#EC4899'][Math.floor(Math.random() * 5)],
    }
    setCourses((prev) => [...prev, newCourse])
    setExpandedCourses(prev => ({ ...prev, [newCourse.id]: true }))
    setNewCourseName('')
    setNewCourseCode('')
    setCourseModalOpen(false)
  }

  // File processing and base64 parsing helper
  const processUpload = (file: File) => {
    const reader = new FileReader()
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    
    let type: KnowledgeFile['type'] = 'link'
    if (['pdf', 'epub'].includes(extension)) type = 'pdf'
    else if (['mp4', 'mov', 'avi'].includes(extension)) type = 'video'
    else if (['png', 'jpg', 'jpeg', 'gif'].includes(extension)) type = 'image'
    else if (['cpp', 'py', 'java', 'ts', 'js'].includes(extension)) type = 'lab'
    else type = 'note'

    reader.onload = () => {
      const dataUrl = reader.result as string
      const newFile: KnowledgeFile = {
        id: `kf-${crypto.randomUUID()}`,
        title: file.name,
        type,
        courseId: selectedCourseId,
        size: file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${(file.size / 1024).toFixed(0)} KB`,
        dateAdded: new Date().toISOString().split('T')[0],
        subject: courses.find(c => c.id === selectedCourseId)?.code || 'GEN',
        tags: [extension.toUpperCase() || 'FILE', 'Uploaded'],
        isFavorite: false,
        isBookmarked: false,
        url: dataUrl,
        subCategory: selectedSubCat,
      }
      db.saveFile(newFile as any).then(() => {
        setFiles((prev) => [newFile, ...prev])
      })
    }
    reader.readAsDataURL(file)
  }

  // Drag & drop upload
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
      processUpload(e.dataTransfer.files[0])
    }
  }

  // Selected file details
  const selectedFile = useMemo(() => {
    return files.find((f) => f.id === selectedFileId)
  }, [files, selectedFileId])

  // Filtered files lists
  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.subject.toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchSearch) return false

      if (f.courseId !== selectedCourseId) return false
      if (f.subCategory !== selectedSubCat) return false

      return true
    })
  }, [files, searchQuery, selectedCourseId, selectedSubCat])

  // Get file counts for each folder in expanded tree
  const getSubCategoryCount = (courseId: string, subCat: KnowledgeFile['subCategory']) => {
    return files.filter(f => f.courseId === courseId && f.subCategory === subCat).length
  }

  const getFileIconComponent = (type: KnowledgeFile['type']) => {
    if (type === 'pdf') return <FileText className="h-4 w-4 text-accent-rose" />
    if (type === 'video') return <Video className="h-4 w-4 text-accent-amber" />
    if (type === 'image') return <Image className="h-4 w-4 text-accent-teal" />
    if (type === 'concept') return <Lightbulb className="h-4 w-4 text-accent-indigo" />
    if (type === 'question') return <HelpCircle className="h-4 w-4 text-accent-rose" />
    if (type === 'lab') return <Code2 className="h-4 w-4 text-accent-blue" />
    if (type === 'assignment') return <Briefcase className="h-4 w-4 text-accent-indigo" />
    return <LinkIcon className="h-4 w-4 text-accent-teal" />
  }

  return (
    <div className="space-y-6 pb-12 text-left select-none">
      
      {/* 1. TOP FOCUS HEADER */}
      <PageHeader
        title="Knowledge Hub"
        description="Your term courses organized into interactive second-brain trees."
        breadcrumbs={[
          { label: "Academic Second Brain" },
          { label: "Knowledge Hub" }
        ]}
        primaryAction={{
          label: "Add Course Brain",
          onClick: () => setCourseModalOpen(true),
          icon: FolderPlus
        }}
      />

      {/* 2. MAIN HUB WORKSPACE GRID */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr_320px]">
        
        {/* LEFT COLUMN: Collapsible Notion-style Second Brain Trees */}
        <div className={cn("space-y-3 lg:block", mobileActiveColumn === 'folders' ? 'block' : 'hidden')}>
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-text-tertiary">Course Second Brains</span>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {courses.map(course => {
              const isExpanded = !!expandedCourses[course.id]
              return (
                <div key={course.id} className="border border-border-subtle rounded-2xl bg-surface/50 overflow-hidden">
                  {/* Course Header */}
                  <div
                    onClick={() => {
                      setSelectedCourseId(course.id)
                      // Auto select first subcategory
                      setSelectedSubCat('pdfs')
                      setMobileActiveColumn('files')
                    }}
                    className={cn(
                      'p-3 flex items-center justify-between cursor-pointer transition-all hover:bg-bg-secondary/45',
                      selectedCourseId === course.id ? 'bg-primary/5 border-l-3' : ''
                    )}
                    style={{ borderLeftColor: selectedCourseId === course.id ? course.color : 'transparent' }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: course.color }} />
                      <span className="text-xs font-bold text-text-primary truncate">{course.code}</span>
                    </div>
                    <button
                      onClick={(e) => toggleCourseExpand(course.id, e)}
                      className="p-1 rounded hover:bg-bg-secondary text-text-secondary cursor-pointer"
                    >
                      {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  {/* Collapsible Notion folder items list */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-bg-secondary/15 border-t border-border-subtle/40 px-2 py-1.5 space-y-0.5 text-[11px]"
                      >
                        {subCategoryMetadata.map(meta => {
                          const count = getSubCategoryCount(course.id, meta.id)
                          const isSubSelected = selectedCourseId === course.id && selectedSubCat === meta.id
                          const Icon = meta.icon
                          return (
                            <button
                              key={meta.id}
                              onClick={() => {
                                setSelectedCourseId(course.id)
                                setSelectedSubCat(meta.id)
                                setMobileActiveColumn('files')
                              }}
                              className={cn(
                                'w-full flex items-center justify-between p-1.5 rounded-lg text-left transition-colors cursor-pointer',
                                isSubSelected
                                  ? 'bg-surface text-primary font-bold shadow-subtle'
                                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/30'
                              )}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className={cn('p-1 rounded-md', meta.color)}>
                                  <Icon className="h-3 w-3" />
                                </span>
                                <span className="truncate">{meta.label}</span>
                              </div>
                              <span className="text-[8.5px] font-bold text-text-tertiary bg-bg-secondary/50 px-1.5 py-0.2 rounded-md font-mono">{count}</span>
                            </button>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        {/* MIDDLE COLUMN: Subcategory grid with Drop area */}
        <div className={cn("space-y-4 lg:block", mobileActiveColumn === 'files' ? 'block' : 'hidden')}>
          {/* Mobile Back Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileActiveColumn('folders')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border-subtle bg-surface px-4 py-2 text-xs font-bold text-text-primary shadow-soft cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Course Brains
            </button>
          </div>
          
          {/* Search bar & Type indicator */}
          <Card className="p-3 border-border-subtle bg-surface shadow-subtle flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-border-subtle bg-bg-secondary/40 text-xs text-text-primary outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary font-bold">
              <span className="text-text-tertiary uppercase tracking-wider font-extrabold text-[9.5px]">Selected:</span>
              <Badge variant="indigo">
                {subCategoryMetadata.find(s => s.id === selectedSubCat)?.label}
              </Badge>
            </div>
          </Card>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.[0]) processUpload(e.target.files[0])
            }}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.gif,.mp4,.mov,.avi,.zip,.docx,.pptx,.xlsx,.cpp,.py,.java,.ts,.js,.txt"
          />

          {/* Drag and drop zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-3xl p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer min-h-[140px]',
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-border-medium bg-surface hover:border-text-tertiary'
            )}
          >
            <FileUp className={cn('h-8 w-8 mb-2 transition-transform', dragActive ? 'translate-y-[-4px] text-primary' : 'text-text-tertiary')} />
            <p className="text-xs font-bold text-text-primary">Drag & drop files here to upload</p>
            <p className="text-[10px] text-text-secondary mt-1">Upload lecture notes, slides, code images, or research papers</p>
          </div>

          {/* Files grid */}
          {filteredFiles.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredFiles.map(file => (
                <Card
                  key={file.id}
                  onClick={() => {
                    setSelectedFileId(file.id)
                    setMobileActiveColumn('insights')
                  }}
                  className={cn(
                    'p-4 border bg-surface hover:border-border-medium hover:shadow-soft transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 text-left relative group',
                    selectedFileId === file.id ? 'border-primary shadow-soft' : 'border-border-subtle'
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5">
                      <div className="h-8 w-8 shrink-0 bg-bg-secondary border border-border-subtle flex items-center justify-center rounded-lg">
                        {getFileIconComponent(file.type)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-text-primary line-clamp-2 leading-snug">{file.title}</h4>
                        <span className="text-[8.5px] font-bold text-text-tertiary uppercase mt-1 block">{file.size} • {file.dateAdded}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {file.tags.map(tag => (
                        <span key={tag} className="text-[8.5px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.2 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-1.5 pt-2 border-t border-border-subtle/50">
                    <button
                      onClick={(e) => toggleFavorite(file.id, e)}
                      className={cn('p-1 rounded hover:bg-bg-secondary cursor-pointer', file.isFavorite ? 'text-accent-amber' : 'text-text-tertiary')}
                    >
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </button>
                    <button
                      onClick={(e) => toggleBookmark(file.id, e)}
                      className={cn('p-1 rounded hover:bg-bg-secondary cursor-pointer', file.isBookmarked ? 'text-accent-teal' : 'text-text-tertiary')}
                    >
                      <Bookmark className="h-3.5 w-3.5 fill-current" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            // Premium Notion-inspired Empty State
            <Card className="rounded-[30px] border border-dashed border-border-medium p-12 text-center max-w-sm mx-auto bg-bg-secondary/10 flex flex-col items-center justify-center min-h-[300px]">
              <span className="text-3xl mb-3">📚</span>
              <h4 className="text-xs font-extrabold text-text-primary uppercase tracking-wider">Your library is empty.</h4>
              <p className="text-[10px] text-text-secondary mt-1.5 max-w-[200px] leading-relaxed">
                Upload your first academic file or reference link to start building your second brain.
              </p>
              <Button onClick={() => {}} className="mt-4 text-[10px] font-bold rounded-xl py-1.5 px-4 bg-primary text-white">
                Upload Resource
              </Button>
            </Card>
          )}

        </div>

        {/* RIGHT COLUMN: File detailed insights panel */}
        <div className={cn("space-y-4 lg:block", mobileActiveColumn === 'insights' ? 'block' : 'hidden')}>
          {/* Mobile Back Button */}
          <div className="lg:hidden mb-2">
            <button
              onClick={() => setMobileActiveColumn('files')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border-subtle bg-surface px-4 py-2 text-xs font-bold text-text-primary shadow-soft cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Files List
            </button>
          </div>
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-text-tertiary">File Insights & Actions</span>
          
          <AnimatePresence mode="wait">
            {selectedFile ? (
              <motion.div
                key={selectedFile.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                <Card className="p-5 border-border-subtle bg-surface shadow-subtle space-y-4">
                  
                  {/* File Metadata Overview */}
                  <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
                    <div className="h-10 w-10 shrink-0 bg-bg-secondary flex items-center justify-center rounded-xl border border-border-subtle">
                      {getFileIconComponent(selectedFile.type)}
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="text-xs font-bold text-text-primary truncate">{selectedFile.title}</h4>
                      <p className="text-[9px] text-text-secondary mt-0.5 uppercase font-semibold">
                        {selectedFile.type} File • Size: {selectedFile.size}
                      </p>
                    </div>
                  </div>

                  {/* Properties table - Notion Database style */}
                  <div className="space-y-2 text-xs">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-text-tertiary">Properties</span>
                    <div className="rounded-xl border border-border-subtle bg-bg-secondary/35 p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text-secondary text-[10px]">Subject</span>
                        <span className="font-bold text-text-primary text-[10px]">{selectedFile.subject}</span>
                      </div>
                      <div className="flex justify-between border-t border-border-subtle/50 pt-2">
                        <span className="text-text-secondary text-[10px]">Date Added</span>
                        <span className="font-bold text-text-primary text-[10px]">{selectedFile.dateAdded}</span>
                      </div>
                      <div className="flex justify-between border-t border-border-subtle/50 pt-2">
                        <span className="text-text-secondary text-[10px]">Favorite</span>
                        <span className="font-bold text-text-primary text-[10px]">{selectedFile.isFavorite ? 'Yes ⭐' : 'No'}</span>
                      </div>
                      <div className="flex justify-between border-t border-border-subtle/50 pt-2">
                        <span className="text-text-secondary text-[10px]">Bookmarked</span>
                        <span className="font-bold text-text-primary text-[10px]">{selectedFile.isBookmarked ? 'Yes 🔖' : 'No'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2 text-left">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-text-tertiary">Topic Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFile.tags.map((tag) => (
                        <span key={tag} className="text-[9.5px] font-bold text-accent-blue bg-accent-blue/10 px-2.5 py-0.5 rounded-lg">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rename File */}
                  <div className="space-y-2 text-left pt-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-text-tertiary">Rename Object</span>
                    <input
                      type="text"
                      value={selectedFile.title}
                      onChange={(e) => {
                        const newTitle = e.target.value
                        setFiles(prev => prev.map(f => f.id === selectedFile.id ? { ...f, title: newTitle } : f))
                      }}
                      onBlur={() => {
                        db.saveFile(selectedFile as any)
                      }}
                      className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary focus:bg-surface"
                    />
                  </div>

                  {/* Actions buttons */}
                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <AnimatedButton 
                        onClick={() => setPreviewFile(selectedFile)}
                        className="gap-1.5 rounded-xl text-xs bg-primary text-white"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Preview File
                      </AnimatedButton>
                      <a
                        href={selectedFile.url}
                        download={selectedFile.title}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold tracking-tight border border-border-medium bg-transparent text-text-primary hover:bg-bg-secondary cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    </div>
                    <AnimatedButton
                      variant="danger"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this file permanently from your second brain?')) {
                          db.deleteFile(selectedFile.id).then(() => {
                            setFiles(prev => prev.filter(f => f.id !== selectedFile.id))
                            setSelectedFileId(null)
                            setMobileActiveColumn('files')
                          })
                        }
                      }}
                      className="w-full gap-1.5 rounded-xl text-xs"
                    >
                      <Trash2 className="h-4 w-4" /> Delete File
                    </AnimatedButton>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card className="rounded-[24px] border border-dashed border-border-medium bg-bg-secondary/10 flex flex-col items-center justify-center text-center p-8 min-h-[250px]">
                <FileText className="h-10 w-10 text-text-tertiary opacity-45 mb-2" />
                <p className="text-xs font-semibold text-text-secondary">No File Selected</p>
                <p className="text-[9px] text-text-secondary mt-1 max-w-[220px] leading-relaxed">
                  Select a document, slides, or link from your second brain tree to view properties and previews.
                </p>
              </Card>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* CREATE COURSE MODAL OVERLAY */}
      <AnimatePresence>
        {courseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCourseModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm rounded-[24px] border border-border-subtle bg-surface p-5 shadow-high z-10"
            >
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <h4 className="text-xs font-bold text-text-primary">Create New Course Brain</h4>
                <button
                  onClick={() => setCourseModalOpen(false)}
                  className="rounded-lg p-1 text-text-secondary hover:bg-bg-secondary transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="mt-4 space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Course Name</label>
                  <input
                    type="text"
                    required
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="e.g. Distributed Systems"
                    className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary focus:bg-surface"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Course Code</label>
                  <input
                    type="text"
                    required
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    placeholder="e.g. CS-401"
                    className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary focus:bg-surface"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" type="button" onClick={() => setCourseModalOpen(false)} className="rounded-xl text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-xl text-xs bg-primary text-white">
                    Create Folder
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MEDIA PREVIEW MODAL OVERLAY */}
      <AnimatePresence>
        {previewFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 lg:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewFile(null)}
              className="absolute inset-0 bg-black/45 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative w-full h-full lg:max-w-4xl lg:rounded-[30px] border-0 lg:border border-border-subtle bg-surface lg:bg-surface/90 lg:backdrop-blur-lg p-3 lg:p-6 shadow-high z-10 flex flex-col max-h-screen lg:max-h-[85vh]"
            >
              <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
                <div className="text-left">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-accent-indigo">Document Reader</span>
                  <h3 className="text-xs font-bold text-text-primary leading-normal truncate max-w-md">{previewFile.title}</h3>
                </div>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="rounded-xl p-2 text-text-secondary hover:bg-bg-secondary transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto rounded-2xl bg-black/5 flex items-center justify-center p-2">
                {previewFile.type === 'pdf' && previewFile.url && previewFile.url !== '#' ? (
                  <iframe 
                    src={previewFile.url} 
                    className="w-full h-[calc(100vh-140px)] lg:h-[60vh] border-none rounded-xl bg-white" 
                    title={previewFile.title}
                  />
                ) : previewFile.type === 'image' && previewFile.url && previewFile.url !== '#' ? (
                  <img 
                    src={previewFile.url} 
                    className="max-h-[calc(100vh-140px)] lg:max-h-[60vh] max-w-full object-contain rounded-xl shadow-premium" 
                    alt={previewFile.title}
                  />
                ) : previewFile.type === 'video' && previewFile.url && previewFile.url !== '#' ? (
                  <video 
                    src={previewFile.url} 
                    controls 
                    className="max-h-[calc(100vh-140px)] lg:max-h-[60vh] max-w-full rounded-xl"
                  />
                ) : (
                  <div className="text-center py-20 px-8 text-text-secondary">
                    <FileText className="h-16 w-16 text-text-tertiary mx-auto mb-4 opacity-40" />
                    <p className="text-xs font-semibold">No File Preview Available</p>
                    <p className="text-[10px] text-text-tertiary mt-1.5 max-w-xs mx-auto leading-relaxed">
                      This file does not contain a previewable local URL. Please open the link directly or upload a PDF/image to use the live viewer.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
