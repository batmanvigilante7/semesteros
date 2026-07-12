import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Video,
  Link as LinkIcon,
  Search,
  SlidersHorizontal,
  Folder,
  FolderPlus,
  FileUp,
  Download,
  ExternalLink,
  Star,
  Bookmark,
  Sparkles,
  X,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

// Type interfaces
interface ResourceFile {
  id: string
  title: string
  type: 'pdf' | 'slides' | 'video' | 'link' | 'note'
  folderId: string
  size: string
  dateAdded: string
  subject: string
  tags: string[]
  isFavorite: boolean
  isBookmarked: boolean
  url: string
}

interface FolderItem {
  id: string
  name: string
  color: string
}

const initialFolders: FolderItem[] = [
  { id: 'f-oop', name: 'Object Oriented Programming', color: '#3B82F6' },
  { id: 'f-ds', name: 'Data Structures', color: '#10B981' },
  { id: 'f-coa', name: 'Computer Organization', color: '#8B5CF6' },
  { id: 'f-math', name: 'Probability & Statistics', color: '#FBBF24' },
  { id: 'f-personal', name: 'Personal Study Notes', color: '#EC4899' },
]

const initialFiles: ResourceFile[] = [
  {
    id: 'res-1',
    title: 'Lecture 1: Class Structures & OOP Intro.pdf',
    type: 'pdf',
    folderId: 'f-oop',
    size: '2.4 MB',
    dateAdded: '2026-07-01',
    subject: 'OOP',
    tags: ['Class', 'Object', 'Basics'],
    isFavorite: true,
    isBookmarked: true,
    url: '#',
  },
  {
    id: 'res-2',
    title: 'Unit 2: Binary Search Trees & AVL Slides.pdf',
    type: 'slides',
    folderId: 'f-ds',
    size: '5.8 MB',
    dateAdded: '2026-07-04',
    subject: 'DS',
    tags: ['Trees', 'AVL', 'Binary Search'],
    isFavorite: false,
    isBookmarked: true,
    url: '#',
  },
  {
    id: 'res-3',
    title: 'Cache Hierarchy & Pipeline Hazards Explained.mp4',
    type: 'video',
    folderId: 'f-coa',
    size: '42.1 MB',
    dateAdded: '2026-07-08',
    subject: 'COA',
    tags: ['Cache', 'Pipelining', 'Hazards'],
    isFavorite: true,
    isBookmarked: false,
    url: '#',
  },
  {
    id: 'res-4',
    title: 'Bayes Theorem Cheat Sheet & Practice.pdf',
    type: 'pdf',
    folderId: 'f-math',
    size: '1.2 MB',
    dateAdded: '2026-07-10',
    subject: 'P&S',
    tags: ['Bayes', 'Cheat Sheet'],
    isFavorite: false,
    isBookmarked: false,
    url: '#',
  },
]

export default function Resources() {
  // Storage hooks
  const [folders, setFolders] = useState<FolderItem[]>(() => {
    const saved = localStorage.getItem('semesteros.resources.folders')
    return saved ? JSON.parse(saved) : initialFolders
  })
  const [files, setFiles] = useState<ResourceFile[]>(() => {
    const saved = localStorage.getItem('semesteros.resources.files')
    return saved ? JSON.parse(saved) : initialFiles
  })

  useEffect(() => {
    localStorage.setItem('semesteros.resources.folders', JSON.stringify(folders))
  }, [folders])

  useEffect(() => {
    localStorage.setItem('semesteros.resources.files', JSON.stringify(files))
  }, [files])

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'All' | 'pdf' | 'slides' | 'video' | 'link' | 'note' | 'Favorites' | 'Bookmarks'>('All')
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)

  // Upload Overlay states
  const [dragActive, setDragActive] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [folderModalOpen, setFolderModalOpen] = useState(false)

  // Toggle favorite / bookmarks
  const toggleFavorite = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, isFavorite: !f.isFavorite } : f))
    )
  }

  const toggleBookmark = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, isBookmarked: !f.isBookmarked } : f))
    )
  }

  // Add folder
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) return
    const newFolder: FolderItem = {
      id: `f-${crypto.randomUUID()}`,
      name: newFolderName.trim(),
      color: ['#3B82F6', '#10B981', '#8B5CF6', '#FBBF24', '#EC4899'][Math.floor(Math.random() * 5)],
    }
    setFolders((prev) => [...prev, newFolder])
    setNewFolderName('')
    setFolderModalOpen(false)
  }

  // Mock upload action
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
      const droppedFile = e.dataTransfer.files[0]
      const newFile: ResourceFile = {
        id: `res-${crypto.randomUUID()}`,
        title: droppedFile.name,
        type: droppedFile.name.endsWith('.mp4') ? 'video' : droppedFile.name.includes('slide') ? 'slides' : 'pdf',
        folderId: selectedFolderId || 'f-personal',
        size: `${Math.round((droppedFile.size / 1024 / 1024) * 10) / 10} MB`,
        dateAdded: new Date().toISOString().split('T')[0],
        subject: 'General',
        tags: ['Uploaded'],
        isFavorite: false,
        isBookmarked: false,
        url: '#',
      }
      setFiles((prev) => [newFile, ...prev])
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

      if (selectedFolderId && f.folderId !== selectedFolderId) return false

      if (activeFilter === 'Favorites') return f.isFavorite
      if (activeFilter === 'Bookmarks') return f.isBookmarked
      if (activeFilter !== 'All' && f.type !== activeFilter) return false

      return true
    })
  }, [files, searchQuery, selectedFolderId, activeFilter])

  // File type counter
  const pdfCount = files.filter((f) => f.type === 'pdf').length
  const slidesCount = files.filter((f) => f.type === 'slides').length

  const getFileIcon = (type: ResourceFile['type']) => {
    if (type === 'pdf') return <FileText className="h-5 w-5 text-accent-rose" />
    if (type === 'slides') return <FileText className="h-5 w-5 text-accent-amber" />
    if (type === 'video') return <Video className="h-5 w-5 text-accent-blue" />
    return <LinkIcon className="h-5 w-5 text-accent-indigo" />
  }

  return (
    <div className="space-y-8 pb-12 text-left">
      {/* 1. TOP STATS HERO */}
      <Card className="overflow-hidden border border-border-subtle bg-surface shadow-subtle p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-secondary px-3 py-1 text-[10px] font-bold text-primary shadow-subtle uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              Knowledge Hub
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
                Your Academic Second Brain.
              </h2>
              <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                Everything you have collected, parsed, and learned in one place. Link documents, lecture videos, and notes folders directly to your term courses.
              </p>
            </div>
          </div>

          {/* Quick numbers widget */}
          <div className="grid grid-cols-3 gap-3 bg-bg-secondary/40 border border-border-subtle/50 rounded-2xl p-4 min-w-[280px] text-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Total Files</p>
              <h4 className="text-base font-extrabold text-text-primary mt-1 font-mono">{files.length}</h4>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">PDFs</p>
              <h4 className="text-base font-extrabold text-text-primary mt-1 font-mono">{pdfCount}</h4>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Slides</p>
              <h4 className="text-base font-extrabold text-text-primary mt-1 font-mono">{slidesCount}</h4>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. ACTION BUTTONS PANEL */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setFolderModalOpen(true)} variant="outline" className="gap-1.5 rounded-xl text-xs">
          <FolderPlus className="h-4 w-4" /> Create Folder
        </Button>
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        {/* LEFT COLUMN: FOLDERS TREE & RESOURCE GRID */}
        <div className="space-y-6">
          {/* FOLDERS ROW */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Folder className="h-4.5 w-4.5 text-primary" />
              Syllabus Folders
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button
                onClick={() => setSelectedFolderId(null)}
                className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                  selectedFolderId === null
                    ? 'border-primary bg-primary/5 shadow-subtle'
                    : 'border-border-subtle bg-surface hover:border-border-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">All Files</h4>
                    <p className="text-[10px] text-text-secondary mt-0.5">{files.length} items</p>
                  </div>
                </div>
              </button>

              {folders.map((fold) => {
                const foldFiles = files.filter((f) => f.folderId === fold.id)
                return (
                  <button
                    key={fold.id}
                    onClick={() => setSelectedFolderId(fold.id)}
                    className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                      selectedFolderId === fold.id
                        ? 'border-primary bg-primary/5 shadow-subtle'
                        : 'border-border-subtle bg-surface hover:border-border-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="h-6 w-6 shrink-0" style={{ color: fold.color }} />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-text-primary truncate">{fold.name}</h4>
                        <p className="text-[10px] text-text-secondary mt-0.5">{foldFiles.length} items</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* SEARCH & CATEGORY FILTERING */}
          <Card className="rounded-[20px] border border-border-subtle bg-surface p-4 shadow-subtle space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search file name, topic tags, courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 py-2 pl-10 pr-4 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-text-secondary" />
                <span className="text-xs font-semibold text-text-secondary">Category:</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-border-subtle/50">
              {([
                { label: 'All', value: 'All' },
                { label: 'PDFs', value: 'pdf' },
                { label: 'Slides', value: 'slides' },
                { label: 'Videos', value: 'video' },
                { label: 'Favorites', value: 'Favorites' },
                { label: 'Bookmarks', value: 'Bookmarks' },
              ] as const).map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => setActiveFilter(tag.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    activeFilter === tag.value
                      ? 'bg-primary text-white shadow-soft'
                      : 'bg-bg-secondary/60 text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </Card>

          {/* DRAG & DROP UPLOAD ZONE */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all flex flex-col items-center justify-center space-y-3 cursor-pointer ${
              dragActive
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : 'border-border-medium hover:border-text-secondary bg-bg-secondary/20'
            }`}
          >
            <FileUp className="h-8 w-8 text-text-secondary" />
            <div>
              <p className="text-xs font-bold text-text-primary">Drag & Drop Syllabus Resources Here</p>
              <p className="text-[10px] text-text-secondary mt-0.5">Supports PDF, DOCX, PPT slides up to 50MB.</p>
            </div>
          </div>

          {/* FILES CARD GRID */}
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredFiles.map((file) => (
              <Card
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`group rounded-2xl border p-4 shadow-subtle flex flex-col justify-between space-y-4 hover:shadow-soft transition-all duration-200 cursor-pointer ${
                  selectedFileId === file.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border-subtle bg-surface hover:border-border-medium'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <span className="text-[10px] font-extrabold text-text-secondary uppercase">{file.subject}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => toggleFavorite(file.id, e)}
                        className={`rounded-lg p-1 transition-colors cursor-pointer ${
                          file.isFavorite ? 'text-accent-amber' : 'text-text-muted hover:text-text-secondary'
                        }`}
                      >
                        <Star className={`h-3.5 w-3.5 ${file.isFavorite ? 'fill-accent-amber' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => toggleBookmark(file.id, e)}
                        className={`rounded-lg p-1 transition-colors cursor-pointer ${
                          file.isBookmarked ? 'text-accent-indigo' : 'text-text-muted hover:text-text-secondary'
                        }`}
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${file.isBookmarked ? 'fill-accent-indigo' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-text-primary line-clamp-2 leading-relaxed group-hover:text-primary transition-colors text-left">
                    {file.title}
                  </h4>
                </div>

                <div className="flex justify-between items-center text-[9px] text-text-secondary font-semibold border-t border-border-subtle/50 pt-3">
                  <span>Size: {file.size}</span>
                  <span>Added: {file.dateAdded}</span>
                </div>
              </Card>
            ))}

            {filteredFiles.length === 0 && (
              <Card className="col-span-full rounded-3xl border border-dashed border-border-medium p-12 text-center max-w-sm mx-auto">
                <FileText className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                <h4 className="text-sm font-bold text-text-primary">No Matching Files</h4>
                <p className="text-[10px] text-text-secondary mt-1">Try changing categories or folder focus to reveal resources.</p>
              </Card>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: RESOURCE PREVIEW PANEL */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-accent-indigo" />
            File Insights & Preview
          </h3>

          <AnimatePresence mode="wait">
            {selectedFile ? (
              <motion.div
                key={selectedFile.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                <Card className="rounded-[24px] border border-border-subtle bg-surface p-6 shadow-subtle space-y-6">
                  {/* File Metadata Overview */}
                  <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
                    <div className="h-10 w-10 shrink-0 bg-bg-secondary flex items-center justify-center rounded-xl border border-border-subtle">
                      {getFileIcon(selectedFile.type)}
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="text-xs font-bold text-text-primary truncate">{selectedFile.title}</h4>
                      <p className="text-[10px] text-text-secondary mt-0.5 uppercase font-semibold">
                        {selectedFile.type} File • Size: {selectedFile.size}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Topic Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFile.tags.map((tag) => (
                        <span key={tag} className="text-[9px] font-bold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-lg">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button className="gap-1.5 rounded-xl text-xs">
                      <ExternalLink className="h-3.5 w-3.5" /> Open File
                    </Button>
                    <Button variant="outline" className="gap-1.5 rounded-xl text-xs">
                      <Download className="h-3.5 w-3.5" /> Download
                    </Button>
                  </div>
                </Card>

                {/* Highlight/AI Summary Card */}
                <Card className="rounded-[24px] border border-border-subtle bg-surface p-5 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                      🤖 Summary Preview
                    </h4>
                    <Badge variant="indigo">Beta</Badge>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed text-left">
                    This file explains core structures related to {selectedFile.subject}. Highlights focus on theoretical models and basic exam hazard questions.
                  </p>
                </Card>
              </motion.div>
            ) : (
              <Card className="rounded-[24px] border border-dashed border-border-medium bg-bg-secondary/10 flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
                <FileText className="h-10 w-10 text-text-tertiary opacity-45 mb-2" />
                <p className="text-xs font-semibold text-text-secondary">No File Selected</p>
                <p className="text-[10px] text-text-secondary mt-1 max-w-[220px] leading-relaxed">
                  Select a document or slides file from your library cards to view detailed tags and previews.
                </p>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CREATE FOLDER MODAL OVERLAY */}
      <AnimatePresence>
        {folderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFolderModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm rounded-[24px] border border-border-subtle bg-surface p-5 shadow-high z-10"
            >
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <h4 className="text-xs font-bold text-text-primary">Create New Folder</h4>
                <button
                  onClick={() => setFolderModalOpen(false)}
                  className="rounded-lg p-1 text-text-secondary hover:bg-bg-secondary transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleCreateFolder} className="mt-4 space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Folder Name</label>
                  <input
                    type="text"
                    required
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="e.g. Midterm Preparation"
                    className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary focus:bg-surface"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" type="button" onClick={() => setFolderModalOpen(false)} className="rounded-xl text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-xl text-xs">
                    Create Folder
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
