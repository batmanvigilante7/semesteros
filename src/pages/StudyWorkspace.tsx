import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  Plus,
  Trash2,
  Bookmark,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Clock,
  Pin,
  Star,
  Search,
  ExternalLink,
  ChevronRight,
  FileText,
  CheckSquare,
  PlusCircle,
  Save,
  BookmarkCheck,
  FolderOpen,
  X,
  ArrowLeft,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useCourseStore } from '@/stores/AcademicEngine'
import BlockEditor from '@/components/ui/BlockEditor'
import { cn } from '@/utils/cn'

// Interfaces
interface QuickNote {
  id: string
  title: string
  content: string
  isPinned: boolean
  updatedAt: string
}

interface Flashcard {
  id: string
  question: string
  answer: string
  subject: string
  isMastered: boolean
}

interface ReadingItem {
  id: string
  title: string
  status: 'To Read' | 'Reading' | 'Completed'
  priority: 'high' | 'medium' | 'low'
  subject: string
}

interface ImportantTopic {
  id: string
  title: string
  subject: string
  importance: 'high' | 'medium' | 'low'
}

interface FavoriteResource {
  id: string
  title: string
  url: string
  type: 'pdf' | 'video' | 'link' | 'slides'
  subject: string
}

interface RevisionItem {
  id: string
  topic: string
  subject: string
  isCompleted: boolean
  dueDate: string
}

interface ManualStudySession {
  id: string
  subject: string
  duration: number // minutes
  date: string
  notes: string
}

interface BookmarkItem {
  id: string
  title: string
  url: string
  category: string
}

export default function StudyWorkspace() {
  const { courses } = useCourseStore()

  // --- Active Tab State ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'notes' | 'flashcards' | 'reading' | 'revision' | 'sessions'>('dashboard')

  // --- 1. Quick Notes State ---
  const [notes, setNotes] = useState<QuickNote[]>(() => {
    const saved = localStorage.getItem('semesteros.study.notes')
    return saved ? JSON.parse(saved) : [
      {
        id: 'n-1',
        title: 'Polymorphism & Inheritance Quick Guide',
        content: '### Polymorphism\nAllows objects to take multiple forms. Commonly achieved via:\n1. **Overloading** (Compile-time): Same method name, different signatures.\n2. **Overriding** (Run-time): Child class redefines parent method.\n\n### Inheritance\nCode reusability mechanism where child inherits properties from parent class.',
        isPinned: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: 'n-2',
        title: 'Midterm Revision Plan',
        content: '- Revise OOP lab sheets 1 to 4.\n- Practice BST insertion and tree balancing.\n- Clear cache hazards pipeline doubts.',
        isPinned: false,
        updatedAt: new Date().toISOString()
      }
    ]
  })
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes.length > 0 ? notes[0].id : null)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [mobileNotesView, setMobileNotesView] = useState<'list' | 'editor'>('list')

  // Sync Note Editor fields when selected note changes
  const activeNote = useMemo(() => notes.find(n => n.id === selectedNoteId), [notes, selectedNoteId])
  useEffect(() => {
    if (activeNote) {
      setNoteTitle(activeNote.title)
      setNoteContent(activeNote.content)
    } else {
      setNoteTitle('')
      setNoteContent('')
    }
  }, [selectedNoteId, activeNote])

  // Save Notes to storage
  useEffect(() => {
    localStorage.setItem('semesteros.study.notes', JSON.stringify(notes))
  }, [notes])

  // --- 2. Flashcards State ---
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('semesteros.study.flashcards')
    return saved ? JSON.parse(saved) : [
      { id: 'fc-1', question: 'What does SOLID stand for?', answer: 'Single responsibility, Open-closed, Liskov substitution, Interface segregation, and Dependency inversion.', subject: 'Object Oriented Programming', isMastered: false },
      { id: 'fc-2', question: 'What is the worst-case lookup time of a Binary Search Tree?', answer: 'O(N) when the tree becomes skewed. To avoid this, self-balancing trees like AVL or Red-Black trees are used to ensure O(log N).', subject: 'Data Structures', isMastered: true },
      { id: 'fc-3', question: 'What are the three main types of pipelining hazards?', answer: '1. Structural Hazards (resource conflict)\n2. Data Hazards (instruction depends on result of previous instruction)\n3. Control Hazards (caused by branch instructions).', subject: 'Computer Organization', isMastered: false }
    ]
  })
  const [flippedId, setFlippedId] = useState<string | null>(null)
  const [newFcQ, setNewFcQ] = useState('')
  const [newFcA, setNewFcA] = useState('')
  const [newFcSubj, setNewFcSubj] = useState(courses[0]?.name || 'General')
  const [fcFilter, setFcFilter] = useState('All')
  const [fcModalOpen, setFcModalOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('semesteros.study.flashcards', JSON.stringify(flashcards))
  }, [flashcards])

  // --- 3. Reading List & Bookmarks State ---
  const [readingList, setReadingList] = useState<ReadingItem[]>(() => {
    const saved = localStorage.getItem('semesteros.study.reading')
    return saved ? JSON.parse(saved) : [
      { id: 'r-1', title: 'Chapter 4: Class Diagrams and UML models', status: 'Reading', priority: 'high', subject: 'Object Oriented Programming' },
      { id: 'r-2', title: 'AVL Trees balancing algorithms and rotations guide', status: 'To Read', priority: 'medium', subject: 'Data Structures' },
      { id: 'r-3', title: 'Cache mapping policies & cache coherence research', status: 'Completed', priority: 'low', subject: 'Computer Organization' }
    ]
  })
  const [newReadTitle, setNewReadTitle] = useState('')
  const [newReadSubj, setNewReadSubj] = useState(courses[0]?.name || 'General')
  const [newReadPriority, setNewReadPriority] = useState<'high' | 'medium' | 'low'>('medium')

  useEffect(() => {
    localStorage.setItem('semesteros.study.reading', JSON.stringify(readingList))
  }, [readingList])

  // Bookmarks & Favorites & Topics
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    const saved = localStorage.getItem('semesteros.study.bookmarks')
    return saved ? JSON.parse(saved) : [
      { id: 'b-1', title: 'Interactive AVL Tree Visualization tool', url: 'https://visualgo.net/en/bst', category: 'Visualization' },
      { id: 'b-2', title: 'UML class relationship diagram reference sheet', url: 'https://www.uml-diagrams.org/', category: 'Cheat Sheets' }
    ]
  })
  const [newBkmkTitle, setNewBkmkTitle] = useState('')
  const [newBkmkUrl, setNewBkmkUrl] = useState('')
  const [newBkmkCat, setNewBkmkCat] = useState('General')

  useEffect(() => {
    localStorage.setItem('semesteros.study.bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  const [favResources, setFavResources] = useState<FavoriteResource[]>(() => {
    const saved = localStorage.getItem('semesteros.study.favs')
    return saved ? JSON.parse(saved) : [
      { id: 'fv-1', title: 'OOP Design Patterns CheatSheet.pdf', url: '#', type: 'pdf', subject: 'Object Oriented Programming' },
      { id: 'fv-2', title: 'Hazards & Pipelining lecture recording.mp4', url: '#', type: 'video', subject: 'Computer Organization' }
    ]
  })
  const [newFavTitle, setNewFavTitle] = useState('')
  const [newFavUrl, setNewFavUrl] = useState('')
  const [newFavType, setNewFavType] = useState<'pdf' | 'video' | 'link' | 'slides'>('link')
  const [newFavSubj, setNewFavSubj] = useState(courses[0]?.name || 'General')

  useEffect(() => {
    localStorage.setItem('semesteros.study.favs', JSON.stringify(favResources))
  }, [favResources])

  const [importantTopics, setImportantTopics] = useState<ImportantTopic[]>(() => {
    const saved = localStorage.getItem('semesteros.study.topics')
    return saved ? JSON.parse(saved) : [
      { id: 'it-1', title: 'Dynamic Method Dispatch / Run-time Polymorphism', subject: 'Object Oriented Programming', importance: 'high' },
      { id: 'it-2', title: 'Stack & Queue operations using Linked Lists', subject: 'Data Structures', importance: 'high' },
      { id: 'it-3', title: 'IEEE 754 Floating Point Representation structure', subject: 'Computer Organization', importance: 'medium' }
    ]
  })
  const [newTopicTitle, setNewTopicTitle] = useState('')
  const [newTopicSubj, setNewTopicSubj] = useState(courses[0]?.name || 'General')
  const [newTopicImp, setNewTopicImp] = useState<'high' | 'medium' | 'low'>('high')

  useEffect(() => {
    localStorage.setItem('semesteros.study.topics', JSON.stringify(importantTopics))
  }, [importantTopics])

  // --- 4. Revision Checklist State ---
  const [revisionList, setRevisionList] = useState<RevisionItem[]>(() => {
    const saved = localStorage.getItem('semesteros.study.revision')
    return saved ? JSON.parse(saved) : [
      { id: 'rev-1', topic: 'Practice Abstract Classes and Interfaces methods', subject: 'Object Oriented Programming', isCompleted: false, dueDate: new Date().toISOString().split('T')[0] },
      { id: 'rev-2', topic: 'Review BFS and DFS graph search traversals', subject: 'Data Structures', isCompleted: true, dueDate: new Date().toISOString().split('T')[0] },
      { id: 'rev-3', topic: 'Solve Cache Hit/Miss ratio mathematical questions', subject: 'Computer Organization', isCompleted: false, dueDate: new Date().toISOString().split('T')[0] }
    ]
  })
  const [newRevTopic, setNewRevTopic] = useState('')
  const [newRevSubj, setNewRevSubj] = useState(courses[0]?.name || 'General')
  const [newRevDate, setNewRevDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    localStorage.setItem('semesteros.study.revision', JSON.stringify(revisionList))
  }, [revisionList])

  // --- 5. Study Sessions State ---
  const [studySessions, setStudySessions] = useState<ManualStudySession[]>(() => {
    const saved = localStorage.getItem('semesteros.study.sessions')
    return saved ? JSON.parse(saved) : [
      { id: 'ss-1', subject: 'Object Oriented Programming', duration: 45, date: '2026-07-11', notes: 'Revised overloading examples and interface constraints.' },
      { id: 'ss-2', subject: 'Data Structures', duration: 90, date: '2026-07-10', notes: 'Coded binary tree traversals in typescript. Checked outputs.' }
    ]
  })
  const [newSessSubj, setNewSessSubj] = useState(courses[0]?.name || 'General')
  const [newSessDur, setNewSessDur] = useState(30)
  const [newSessDate, setNewSessDate] = useState(new Date().toISOString().split('T')[0])
  const [newSessNotes, setNewSessNotes] = useState('')

  useEffect(() => {
    localStorage.setItem('semesteros.study.sessions', JSON.stringify(studySessions))
  }, [studySessions])

  // Search filter
  const [searchQuery, setSearchQuery] = useState('')

  // Compute stats for Dashboard
  const dashboardStats = useMemo(() => {
    const totalMinutes = studySessions.reduce((acc, s) => acc + s.duration, 0)
    const hours = Math.round((totalMinutes / 60) * 10) / 10
    const totalFc = flashcards.length
    const masteredFc = flashcards.filter(f => f.isMastered).length
    const masteredPct = totalFc > 0 ? Math.round((masteredFc / totalFc) * 100) : 0

    const totalRev = revisionList.length
    const doneRev = revisionList.filter(r => r.isCompleted).length
    const revPct = totalRev > 0 ? Math.round((doneRev / totalRev) * 100) : 0

    const activeRead = readingList.filter(r => r.status === 'Reading').length
    const toRead = readingList.filter(r => r.status === 'To Read').length

    return {
      hours,
      masteredPct,
      masteredFc,
      totalFc,
      revPct,
      doneRev,
      totalRev,
      activeRead,
      toRead
    }
  }, [studySessions, flashcards, revisionList, readingList])

  // --- ACTIONS ---

  // Notes actions
  const handleCreateNote = () => {
    const newNote: QuickNote = {
      id: `n-${crypto.randomUUID()}`,
      title: 'Untitled Note',
      content: '',
      isPinned: false,
      updatedAt: new Date().toISOString()
    }
    setNotes(prev => [newNote, ...prev])
    setSelectedNoteId(newNote.id)
    setMobileNotesView('editor')
  }

  const handleSaveNote = () => {
    if (!selectedNoteId) return
    setNotes(prev => prev.map(n => {
      if (n.id === selectedNoteId) {
        return {
          ...n,
          title: noteTitle.trim() || 'Untitled Note',
          content: noteContent,
          updatedAt: new Date().toISOString()
        }
      }
      return n
    }))
  }

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Delete this note permanently?')) {
      const remaining = notes.filter(n => n.id !== noteId)
      setNotes(remaining)
      if (selectedNoteId === noteId) {
        setSelectedNoteId(remaining.length > 0 ? remaining[0].id : null)
        setMobileNotesView('list')
      }
    }
  }

  const handleTogglePinNote = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, isPinned: !n.isPinned } : n))
  }

  // Flashcard Actions
  const handleCreateFlashcard = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFcQ.trim() || !newFcA.trim()) return
    const newFc: Flashcard = {
      id: `fc-${crypto.randomUUID()}`,
      question: newFcQ.trim(),
      answer: newFcA.trim(),
      subject: newFcSubj,
      isMastered: false
    }
    setFlashcards(prev => [newFc, ...prev])
    setNewFcQ('')
    setNewFcA('')
    setFcModalOpen(false)
  }

  const handleDeleteFlashcard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this flashcard?')) {
      setFlashcards(prev => prev.filter(f => f.id !== id))
    }
  }

  const handleToggleMasteredFc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFlashcards(prev => prev.map(f => f.id === id ? { ...f, isMastered: !f.isMastered } : f))
  }

  // Reading Actions
  const handleAddReading = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReadTitle.trim()) return
    const newItem: ReadingItem = {
      id: `r-${crypto.randomUUID()}`,
      title: newReadTitle.trim(),
      status: 'To Read',
      priority: newReadPriority,
      subject: newReadSubj
    }
    setReadingList(prev => [newItem, ...prev])
    setNewReadTitle('')
  }

  const handleToggleReadingStatus = (id: string) => {
    setReadingList(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus: ReadingItem['status'] =
          item.status === 'To Read' ? 'Reading' :
          item.status === 'Reading' ? 'Completed' : 'To Read'
        return { ...item, status: nextStatus }
      }
      return item
    }))
  }

  const handleDeleteReading = (id: string) => {
    setReadingList(prev => prev.filter(r => r.id !== id))
  }

  // Bookmarks & Resources Actions
  const handleAddBookmark = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBkmkTitle.trim() || !newBkmkUrl.trim()) return
    const newB: BookmarkItem = {
      id: `b-${crypto.randomUUID()}`,
      title: newBkmkTitle.trim(),
      url: newBkmkUrl.trim().startsWith('http') ? newBkmkUrl.trim() : `https://${newBkmkUrl.trim()}`,
      category: newBkmkCat.trim() || 'General'
    }
    setBookmarks(prev => [...prev, newB])
    setNewBkmkTitle('')
    setNewBkmkUrl('')
  }

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id))
  }

  const handleAddFavResource = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFavTitle.trim() || !newFavUrl.trim()) return
    const newF: FavoriteResource = {
      id: `fv-${crypto.randomUUID()}`,
      title: newFavTitle.trim(),
      url: newFavUrl.trim(),
      type: newFavType,
      subject: newFavSubj
    }
    setFavResources(prev => [...prev, newF])
    setNewFavTitle('')
    setNewFavUrl('')
  }

  const handleDeleteFavResource = (id: string) => {
    setFavResources(prev => prev.filter(f => f.id !== id))
  }

  const handleAddImportantTopic = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTopicTitle.trim()) return
    const newT: ImportantTopic = {
      id: `it-${crypto.randomUUID()}`,
      title: newTopicTitle.trim(),
      subject: newTopicSubj,
      importance: newTopicImp
    }
    setImportantTopics(prev => [...prev, newT])
    setNewTopicTitle('')
  }

  const handleDeleteImportantTopic = (id: string) => {
    setImportantTopics(prev => prev.filter(t => t.id !== id))
  }

  // Revision Actions
  const handleAddRevision = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRevTopic.trim()) return
    const newR: RevisionItem = {
      id: `rev-${crypto.randomUUID()}`,
      topic: newRevTopic.trim(),
      subject: newRevSubj,
      isCompleted: false,
      dueDate: newRevDate || new Date().toISOString().split('T')[0]
    }
    setRevisionList(prev => [newR, ...prev])
    setNewRevTopic('')
  }

  const handleToggleRevision = (id: string) => {
    setRevisionList(prev => prev.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
  }

  const handleDeleteRevision = (id: string) => {
    setRevisionList(prev => prev.filter(r => r.id !== id))
  }

  // Session Actions
  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault()
    const durationNum = Number(newSessDur)
    if (isNaN(durationNum) || durationNum <= 0) return
    const newS: ManualStudySession = {
      id: `ss-${crypto.randomUUID()}`,
      subject: newSessSubj,
      duration: durationNum,
      date: newSessDate || new Date().toISOString().split('T')[0],
      notes: newSessNotes.trim()
    }
    setStudySessions(prev => [newS, ...prev])
    setNewSessDur(30)
    setNewSessNotes('')
  }

  const handleDeleteSession = (id: string) => {
    if (confirm('Delete this study log?')) {
      setStudySessions(prev => prev.filter(s => s.id !== id))
    }
  }

  // Sort notes so pinned ones are at the top
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.updatedAt.localeCompare(a.updatedAt)
    })
  }, [notes])

  // Filtered flashcards list
  const filteredFlashcards = useMemo(() => {
    return flashcards.filter(f => {
      const matchSubj = fcFilter === 'All' || f.subject === fcFilter
      const matchSearch = f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase())
      return matchSubj && matchSearch
    })
  }, [flashcards, fcFilter, searchQuery])

  return (
    <div className="space-y-6 text-left pb-16">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-secondary px-3 py-1 text-[10px] font-bold text-accent-indigo shadow-subtle uppercase tracking-wider">
            <GraduationCap className="h-3.5 w-3.5" />
            Productivity Suite
          </div>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight mt-1">Study Workspace</h2>
          <p className="text-xs text-text-secondary mt-0.5">Your core distraction-free workspace. No APIs, no AI prompts, just pure organization.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-1 bg-bg-secondary/40 border border-border-subtle rounded-2xl p-1 self-start select-none">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'notes', label: 'Notes' },
            { id: 'flashcards', label: 'Flashcards' },
            { id: 'reading', label: 'Reading & Links' },
            { id: 'revision', label: 'Revision' },
            { id: 'sessions', label: 'Logs' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TAB SECTIONS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.18 }}
        >
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Bird's Eye Metrics */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-5 border-border-subtle bg-surface flex items-center gap-4 shadow-subtle">
                  <div className="rounded-xl bg-accent-blue/10 p-3 text-accent-blue">
                    <Clock className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Logged Hours</span>
                    <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">{dashboardStats.hours} hrs</h4>
                  </div>
                </Card>

                <Card className="p-5 border-border-subtle bg-surface flex items-center gap-4 shadow-subtle">
                  <div className="rounded-xl bg-accent-indigo/10 p-3 text-accent-indigo">
                    <BookmarkCheck className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Mastered Cards</span>
                    <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">
                      {dashboardStats.masteredFc}/{dashboardStats.totalFc} ({dashboardStats.masteredPct}%)
                    </h4>
                  </div>
                </Card>

                <Card className="p-5 border-border-subtle bg-surface flex items-center gap-4 shadow-subtle">
                  <div className="rounded-xl bg-accent-rose/10 p-3 text-accent-rose">
                    <CheckSquare className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary font-semibold">Revision Progress</span>
                    <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">
                      {dashboardStats.doneRev}/{dashboardStats.totalRev} ({dashboardStats.revPct}%)
                    </h4>
                  </div>
                </Card>

                <Card className="p-5 border-border-subtle bg-surface flex items-center gap-4 shadow-subtle">
                  <div className="rounded-xl bg-accent-teal/10 p-3 text-accent-teal">
                    <BookOpen className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Active Readings</span>
                    <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">
                      {dashboardStats.activeRead} reading, {dashboardStats.toRead} to read
                    </h4>
                  </div>
                </Card>
              </div>

              {/* Quick Actions & Workspace summary */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-6 border-border-subtle bg-surface shadow-subtle space-y-4">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-accent-blue" />
                    Manually Crafted Flashcard Deck
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Flashcards are a highly effective revision strategy. Write questions on key topics and test yourself daily to cement knowledge before exams.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <Button size="sm" className="rounded-xl text-xs" onClick={() => { setActiveTab('flashcards'); setFcModalOpen(true); }}>
                      <Plus className="h-4 w-4" /> Create Flashcard
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl text-xs" onClick={() => setActiveTab('flashcards')}>
                      Review Deck
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 border-border-subtle bg-surface shadow-subtle space-y-4">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-accent-indigo" />
                    Quick Session Log
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Accountability increases completion rates. Keep track of your real study sessions and monitor how much effort you have dedicated to each course module.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <Button size="sm" className="rounded-xl text-xs bg-accent-indigo hover:bg-accent-indigo/90" onClick={() => setActiveTab('sessions')}>
                      <Plus className="h-4 w-4" /> Log Study Session
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl text-xs" onClick={() => setActiveTab('sessions')}>
                      View Session History
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Study Stats Dashboard Cards */}
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="p-5 border-border-subtle bg-surface shadow-subtle space-y-4">
                  <h4 className="text-xs font-bold text-text-primary flex items-center justify-between border-b border-border-subtle pb-2.5">
                    <span>📌 Important Topics</span>
                    <Badge variant="indigo">{importantTopics.length}</Badge>
                  </h4>
                  {importantTopics.length > 0 ? (
                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                      {importantTopics.slice(0, 4).map(it => (
                        <div key={it.id} className="flex justify-between items-start text-xs border-b border-border-subtle/50 pb-2 last:border-0 last:pb-0">
                          <div>
                            <p className="font-bold text-text-primary leading-tight">{it.title}</p>
                            <span className="text-[9px] text-text-secondary mt-0.5 block">{it.subject}</span>
                          </div>
                          <Badge variant={it.importance === 'high' ? 'rose' : it.importance === 'medium' ? 'orange' : 'indigo'}>
                            {it.importance}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-text-secondary text-center py-6">No important topics listed.</p>
                  )}
                  <button className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 mt-1" onClick={() => setActiveTab('reading')}>
                    Manage Topics <ChevronRight className="h-3 w-3" />
                  </button>
                </Card>

                <Card className="p-5 border-border-subtle bg-surface shadow-subtle space-y-4">
                  <h4 className="text-xs font-bold text-text-primary flex items-center justify-between border-b border-border-subtle pb-2.5">
                    <span>⭐ Favorite Resources</span>
                    <Badge variant="teal">{favResources.length}</Badge>
                  </h4>
                  {favResources.length > 0 ? (
                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                      {favResources.slice(0, 4).map(fv => (
                        <div key={fv.id} className="flex justify-between items-center text-xs border-b border-border-subtle/50 pb-2 last:border-0 last:pb-0">
                          <div>
                            <p className="font-bold text-text-primary leading-tight line-clamp-1">{fv.title}</p>
                            <span className="text-[9px] text-text-secondary uppercase mt-0.5 block">{fv.type} • {fv.subject}</span>
                          </div>
                          <button className="text-text-secondary hover:text-text-primary p-1">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-text-secondary text-center py-6">No favorite resources listed.</p>
                  )}
                  <button className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 mt-1" onClick={() => setActiveTab('reading')}>
                    Manage Resources <ChevronRight className="h-3 w-3" />
                  </button>
                </Card>

                <Card className="p-5 border-border-subtle bg-surface shadow-subtle space-y-4">
                  <h4 className="text-xs font-bold text-text-primary flex items-center justify-between border-b border-border-subtle pb-2.5">
                    <span>📚 Bookmarks</span>
                    <Badge variant="indigo">{bookmarks.length}</Badge>
                  </h4>
                  {bookmarks.length > 0 ? (
                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                      {bookmarks.slice(0, 4).map(b => (
                        <div key={b.id} className="flex justify-between items-center text-xs border-b border-border-subtle/50 pb-2 last:border-0 last:pb-0">
                          <div>
                            <p className="font-bold text-text-primary leading-tight line-clamp-1">{b.title}</p>
                            <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-[9px] text-accent-indigo hover:underline mt-0.5 block truncate max-w-[150px]">{b.url}</a>
                          </div>
                          <span className="text-[9px] font-bold text-text-tertiary bg-bg-secondary px-2 py-0.5 rounded-lg shrink-0">
                            {b.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-text-secondary text-center py-6">No bookmarks added yet.</p>
                  )}
                  <button className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 mt-1" onClick={() => setActiveTab('reading')}>
                    Manage Bookmarks <ChevronRight className="h-3 w-3" />
                  </button>
                </Card>
              </div>

            </div>
          )}

          {/* TAB: QUICK NOTES */}
          {activeTab === 'notes' && (
            <div className="grid gap-6 lg:grid-cols-[280px_1fr] h-[calc(100vh-14rem)] min-h-[500px]">
              
              {/* Left pane: Notes list */}
              <div className={cn("border border-border-subtle rounded-3xl bg-surface p-4 flex flex-col justify-between overflow-hidden lg:flex", mobileNotesView === 'list' ? 'flex' : 'hidden')}>
                <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center pb-2 border-b border-border-subtle/60">
                    <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Quick Notes</h3>
                    <button
                      onClick={handleCreateNote}
                      className="rounded-lg p-1 text-primary hover:bg-bg-secondary cursor-pointer"
                      title="Add Note"
                    >
                      <Plus className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  {/* Notes search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
                    <input
                      type="text"
                      placeholder="Search notes..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-border-subtle bg-bg-secondary/40 text-xs text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Notes stack */}
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                    {sortedNotes
                      .filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(note => {
                        const isSelected = note.id === selectedNoteId
                        return (
                          <div
                            key={note.id}
                            onClick={() => {
                              setSelectedNoteId(note.id)
                              setMobileNotesView('editor')
                            }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer text-left relative group ${
                              isSelected
                                ? 'border-primary bg-primary/5 shadow-soft'
                                : 'border-border-subtle bg-surface hover:border-border-medium'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              {note.isPinned && <Pin className="h-3 w-3 text-accent-amber fill-accent-amber shrink-0" />}
                              <p className="text-xs font-bold text-text-primary truncate pr-4">{note.title || 'Untitled Note'}</p>
                            </div>
                            <p className="text-[10px] text-text-secondary truncate mt-1">{note.content.substring(0, 45) || 'No content yet...'}</p>
                            <span className="text-[8px] text-text-tertiary mt-2 block">
                              {new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>

                            {/* Hover delete & pin */}
                            <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-1">
                              <button
                                onClick={(e) => handleTogglePinNote(note.id, e)}
                                className="p-1 rounded bg-bg-secondary hover:bg-bg-tertiary text-text-secondary cursor-pointer"
                              >
                                <Pin className="h-3 w-3" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                                className="p-1 rounded bg-bg-secondary hover:bg-rose-500/10 text-rose-500 cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>

              {/* Right pane: Note editor */}
              <div className={cn("border border-border-subtle rounded-3xl bg-surface p-6 flex flex-col justify-between overflow-hidden lg:flex", mobileNotesView === 'editor' ? 'flex' : 'hidden')}>
                {selectedNoteId ? (
                  <div className="flex-1 flex flex-col space-y-4 overflow-hidden h-full">
                    <div className="flex justify-between items-center border-b border-border-subtle/60 pb-3">
                      <div className="flex items-center gap-2 w-full">
                        <button
                          onClick={() => setMobileNotesView('list')}
                          className="lg:hidden p-1.5 mr-1 rounded-xl text-text-secondary hover:bg-bg-secondary cursor-pointer shrink-0"
                          title="Back to list"
                        >
                          <ArrowLeft className="h-4.5 w-4.5" />
                        </button>
                        <input
                          type="text"
                          value={noteTitle}
                          onChange={(e) => setNoteTitle(e.target.value)}
                          placeholder="Untitled Note"
                          className="bg-transparent text-lg font-bold text-text-primary border-none outline-none focus:ring-0 w-full"
                          onBlur={handleSaveNote}
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          className="rounded-xl text-xs gap-1"
                          onClick={handleSaveNote}
                        >
                          <Save className="h-3.5 w-3.5" /> Save Note
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col overflow-y-auto max-h-[500px] pr-2 pt-2 border-t border-border-subtle/50">
                      <BlockEditor
                        value={noteContent}
                        onChange={(val) => {
                          setNoteContent(val)
                          setNotes(prev => prev.map(n => n.id === selectedNoteId ? { ...n, content: val, updatedAt: new Date().toISOString() } : n))
                        }}
                        placeholder="Type '/' for formatting blocks (Heading, To-do list, Bullet list, Code block, Divider)..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-full flex justify-start lg:hidden mb-4">
                      <button
                        onClick={() => setMobileNotesView('list')}
                        className="p-1.5 rounded-xl text-text-secondary hover:bg-bg-secondary cursor-pointer"
                      >
                        <ArrowLeft className="h-4.5 w-4.5" /> Back to list
                      </button>
                    </div>
                    <FileText className="h-12 w-12 text-text-tertiary opacity-40 mb-3" />
                    <h4 className="text-sm font-bold text-text-primary">No Note Selected</h4>
                    <p className="text-xs text-text-secondary mt-1">Select an existing quick note or create a new one to get started.</p>
                    <Button className="mt-4 rounded-xl text-xs" onClick={handleCreateNote}>
                      <Plus className="h-4 w-4" /> Create New Note
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <div className="space-y-6">
              
              {/* Header options */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
                    <input
                      type="text"
                      placeholder="Search flashcards..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 w-48 sm:w-64 rounded-xl border border-border-subtle bg-bg-secondary/40 text-xs text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>

                  <select
                    value={fcFilter}
                    onChange={(e) => setFcFilter(e.target.value)}
                    className="rounded-xl border border-border-subtle bg-surface px-3 py-1.5 text-xs text-text-primary focus:outline-none"
                  >
                    <option value="All">All Subjects</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.name}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <Button size="sm" className="rounded-xl text-xs gap-1.5" onClick={() => setFcModalOpen(true)}>
                  <Plus className="h-4 w-4" /> Create Flashcard
                </Button>
              </div>

              {/* Flashcard grid */}
              {filteredFlashcards.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredFlashcards.map(fc => {
                    const isFlipped = flippedId === fc.id
                    return (
                      <div
                        key={fc.id}
                        className="group relative h-64 [perspective:1000px] cursor-pointer"
                        onClick={() => setFlippedId(isFlipped ? null : fc.id)}
                      >
                        {/* FLIP CARD INNER WRAPPER */}
                        <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
                          isFlipped ? '[transform:rotateY(180deg)]' : ''
                        }`}>
                          
                          {/* CARD FRONT SIDE */}
                          <Card className="absolute inset-0 w-full h-full p-6 border-border-subtle bg-surface flex flex-col justify-between [backface-visibility:hidden] shadow-subtle rounded-3xl">
                            <div className="flex justify-between items-center">
                              <Badge variant="indigo">{fc.subject}</Badge>
                              <div className="flex gap-1.5 items-center">
                                <button
                                  onClick={(e) => handleToggleMasteredFc(fc.id, e)}
                                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                    fc.isMastered ? 'text-accent-teal hover:bg-accent-teal/10' : 'text-text-tertiary hover:bg-bg-secondary'
                                  }`}
                                  title={fc.isMastered ? 'Mastered' : 'Mark as Mastered'}
                                >
                                  <CheckCircle2 className="h-4.5 w-4.5" />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteFlashcard(fc.id, e)}
                                  className="p-1 rounded-lg text-text-tertiary hover:bg-rose-500/10 hover:text-rose-500 cursor-pointer"
                                  title="Delete card"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center py-4">
                              <h4 className="text-center font-bold text-text-primary text-sm sm:text-base px-2 leading-relaxed">
                                {fc.question}
                              </h4>
                            </div>
                            <div className="text-center text-[10px] text-text-tertiary font-bold tracking-wider uppercase select-none">
                              Click to flip and view answer
                            </div>
                          </Card>

                          {/* CARD BACK SIDE */}
                          <Card className="absolute inset-0 w-full h-full p-6 border-border-primary bg-bg-secondary/35 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-soft rounded-3xl">
                            <div className="flex justify-between items-center">
                              <Badge variant="indigo">Answer Review</Badge>
                              <div className="flex gap-1.5 items-center">
                                <button
                                  onClick={(e) => handleToggleMasteredFc(fc.id, e)}
                                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                    fc.isMastered ? 'text-accent-teal hover:bg-accent-teal/10' : 'text-text-tertiary hover:bg-bg-secondary'
                                  }`}
                                  title={fc.isMastered ? 'Mastered' : 'Mark as Mastered'}
                                >
                                  <CheckCircle2 className="h-4.5 w-4.5" />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteFlashcard(fc.id, e)}
                                  className="p-1 rounded-lg text-text-tertiary hover:bg-rose-500/10 hover:text-rose-500 cursor-pointer"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center py-4 overflow-y-auto">
                              <p className="text-center text-xs sm:text-sm text-text-secondary leading-relaxed px-2 font-medium whitespace-pre-line">
                                {fc.answer}
                              </p>
                            </div>
                            <div className="text-center text-[10px] text-text-tertiary font-bold tracking-wider uppercase select-none">
                              Click to flip back
                            </div>
                          </Card>

                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-16 text-center border border-dashed border-border-medium rounded-3xl bg-bg-secondary/10">
                  <BookOpen className="h-10 w-10 text-text-tertiary opacity-45 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-text-secondary">No Flashcards Found</p>
                  <p className="text-[10px] text-text-secondary mt-1">Try changing subjects or create a new manual flashcard.</p>
                  <Button className="mt-4 rounded-xl text-xs" onClick={() => setFcModalOpen(true)}>
                    <Plus className="h-4 w-4" /> Create Card
                  </Button>
                </div>
              )}

              {/* CREATE CARD MODAL OVERLAY */}
              <AnimatePresence>
                {fcModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setFcModalOpen(false)}
                      className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="relative w-full max-w-md rounded-3xl border border-border-subtle bg-surface p-6 shadow-high z-10"
                    >
                      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                        <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                          <PlusCircle className="h-4.5 w-4.5 text-accent-indigo" />
                          Add Manual Study Flashcard
                        </h4>
                        <button
                          onClick={() => setFcModalOpen(false)}
                          className="rounded-lg p-1 text-text-secondary hover:bg-bg-secondary transition-colors cursor-pointer"
                        >
                          <X className="h-4.5 w-4.5" />
                        </button>
                      </div>

                      <form onSubmit={handleCreateFlashcard} className="mt-4 space-y-4 text-left">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Question</label>
                          <input
                            type="text"
                            required
                            value={newFcQ}
                            onChange={(e) => setNewFcQ(e.target.value)}
                            placeholder="e.g. What is polymorphism?"
                            className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary focus:bg-surface"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Answer / Explanation</label>
                          <textarea
                            required
                            rows={3}
                            value={newFcA}
                            onChange={(e) => setNewFcA(e.target.value)}
                            placeholder="Write the explanation clearly..."
                            className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary focus:bg-surface resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Associated Subject</label>
                          <select
                            value={newFcSubj}
                            onChange={(e) => setNewFcSubj(e.target.value)}
                            className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary focus:bg-surface"
                          >
                            {courses.map(c => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                            <option value="General">General Study</option>
                          </select>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <Button variant="outline" type="button" onClick={() => setFcModalOpen(false)} className="rounded-xl text-xs">
                            Cancel
                          </Button>
                          <Button type="submit" className="rounded-xl text-xs bg-primary text-white">
                            Create Flashcard
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </div>
          )}

          {/* TAB: READING LIST & BOOKMARKS */}
          {activeTab === 'reading' && (
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              
              {/* Left pane: Bookmarks & Resource lists */}
              <div className="space-y-6">
                
                {/* Bookmarks section */}
                <Card className="p-6 border-border-subtle bg-surface shadow-subtle space-y-4">
                  <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                    <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                      <Bookmark className="h-4.5 w-4.5 text-accent-indigo" />
                      Academic Bookmarks
                    </h3>
                  </div>

                  {/* Add Bookmark form */}
                  <form onSubmit={handleAddBookmark} className="grid gap-3 sm:grid-cols-[1.5fr_2fr_1fr_auto] items-end bg-bg-secondary/30 p-4 rounded-2xl border border-border-subtle/50">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Bookmark Title</label>
                      <input
                        type="text"
                        required
                        value={newBkmkTitle}
                        onChange={e => setNewBkmkTitle(e.target.value)}
                        placeholder="e.g. Visualgo BST Tool"
                        className="w-full rounded-xl border border-border-subtle bg-bg-primary px-3 py-1.5 text-xs text-text-primary outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">URL Link</label>
                      <input
                        type="text"
                        required
                        value={newBkmkUrl}
                        onChange={e => setNewBkmkUrl(e.target.value)}
                        placeholder="e.g. visualgo.net/en/bst"
                        className="w-full rounded-xl border border-border-subtle bg-bg-primary px-3 py-1.5 text-xs text-text-primary outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Category</label>
                      <input
                        type="text"
                        value={newBkmkCat}
                        onChange={e => setNewBkmkCat(e.target.value)}
                        placeholder="e.g. Visualization"
                        className="w-full rounded-xl border border-border-subtle bg-bg-primary px-3 py-1.5 text-xs text-text-primary outline-none focus:border-primary"
                      />
                    </div>
                    <Button type="submit" className="rounded-xl text-xs px-3 py-1.5 h-[34px] bg-accent-indigo text-white">
                      Add
                    </Button>
                  </form>

                  {/* Bookmarks list */}
                  {bookmarks.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {bookmarks.map(b => (
                        <div key={b.id} className="p-3 border border-border-subtle rounded-xl flex items-center justify-between gap-3 bg-bg-secondary/15 hover:border-border-medium transition-colors">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-text-primary truncate">{b.title}</p>
                            <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-accent-blue hover:underline truncate block mt-0.5 max-w-[200px]">
                              {b.url}
                            </a>
                            <span className="inline-block text-[8px] font-bold text-text-tertiary bg-bg-secondary px-1.5 py-0.5 rounded mt-1.5">
                              {b.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <a href={b.url} target="_blank" rel="noopener noreferrer" className="p-1 rounded-lg text-text-secondary hover:bg-bg-secondary">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <button onClick={() => handleDeleteBookmark(b.id)} className="p-1 rounded-lg text-text-tertiary hover:bg-rose-500/10 hover:text-rose-500">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-text-secondary text-center py-6">No bookmarks added yet.</p>
                  )}
                </Card>

                {/* Favorite Resources & Important Topics section */}
                <div className="grid gap-6 md:grid-cols-2">
                  
                  {/* Favorite Resources */}
                  <Card className="p-5 border-border-subtle bg-surface shadow-subtle space-y-4">
                    <h3 className="text-xs font-bold text-text-primary flex items-center gap-1.5 border-b border-border-subtle pb-2.5">
                      <Star className="h-4 w-4 text-accent-amber fill-accent-amber" />
                      ⭐ Favorite Resources Links
                    </h3>

                    <form onSubmit={handleAddFavResource} className="space-y-3 bg-bg-secondary/20 p-3 rounded-xl border border-border-subtle/50">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Resource Title"
                          value={newFavTitle}
                          onChange={e => setNewFavTitle(e.target.value)}
                          className="w-full rounded-xl border border-border-subtle bg-bg-primary px-3 py-1.5 text-[10px] text-text-primary outline-none"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Resource Link"
                          value={newFavUrl}
                          onChange={e => setNewFavUrl(e.target.value)}
                          className="w-full rounded-xl border border-border-subtle bg-bg-primary px-3 py-1.5 text-[10px] text-text-primary outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={newFavType}
                          onChange={e => setNewFavType(e.target.value as any)}
                          className="rounded-xl border border-border-subtle bg-bg-primary px-2 py-1.5 text-[10px]"
                        >
                          <option value="link">Website Link</option>
                          <option value="pdf">PDF File</option>
                          <option value="video">Lecture Video</option>
                          <option value="slides">Slides File</option>
                        </select>
                        <select
                          value={newFavSubj}
                          onChange={e => setNewFavSubj(e.target.value)}
                          className="rounded-xl border border-border-subtle bg-bg-primary px-2 py-1.5 text-[10px]"
                        >
                          {courses.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                          <option value="General">General Study</option>
                        </select>
                      </div>
                      <Button type="submit" className="w-full rounded-xl text-[10px] py-1 bg-accent-amber text-white">
                        Add Favorite Link
                      </Button>
                    </form>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {favResources.map(f => (
                        <div key={f.id} className="flex justify-between items-center text-xs p-2.5 border border-border-subtle rounded-xl bg-bg-secondary/10">
                          <div>
                            <p className="font-bold text-text-primary leading-tight line-clamp-1">{f.title}</p>
                            <span className="text-[8px] text-text-tertiary uppercase mt-0.5 block">{f.type} • {f.subject}</span>
                          </div>
                          <div className="flex gap-0.5">
                            <a href={f.url} target="_blank" rel="noopener noreferrer" className="p-1 rounded text-text-secondary hover:bg-bg-secondary">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            <button onClick={() => handleDeleteFavResource(f.id)} className="p-1 rounded text-text-tertiary hover:bg-rose-500/10 hover:text-rose-500">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Important Topics */}
                  <Card className="p-5 border-border-subtle bg-surface shadow-subtle space-y-4">
                    <h3 className="text-xs font-bold text-text-primary flex items-center gap-1.5 border-b border-border-subtle pb-2.5">
                      <Pin className="h-4 w-4 text-accent-rose" />
                      📌 Important Syllabus Topics
                    </h3>

                    <form onSubmit={handleAddImportantTopic} className="space-y-3 bg-bg-secondary/20 p-3 rounded-xl border border-border-subtle/50">
                      <input
                        type="text"
                        required
                        placeholder="Key Topic Name"
                        value={newTopicTitle}
                        onChange={e => setNewTopicTitle(e.target.value)}
                        className="w-full rounded-xl border border-border-subtle bg-bg-primary px-3 py-1.5 text-[10px] text-text-primary outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={newTopicSubj}
                          onChange={e => setNewTopicSubj(e.target.value)}
                          className="rounded-xl border border-border-subtle bg-bg-primary px-2 py-1.5 text-[10px]"
                        >
                          {courses.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                          <option value="General">General</option>
                        </select>
                        <select
                          value={newTopicImp}
                          onChange={e => setNewTopicImp(e.target.value as any)}
                          className="rounded-xl border border-border-subtle bg-bg-primary px-2 py-1.5 text-[10px]"
                        >
                          <option value="high">High priority</option>
                          <option value="medium">Medium priority</option>
                          <option value="low">Low priority</option>
                        </select>
                      </div>
                      <Button type="submit" className="w-full rounded-xl text-[10px] py-1 bg-accent-rose text-white">
                        Add Key Topic
                      </Button>
                    </form>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {importantTopics.map(it => (
                        <div key={it.id} className="flex justify-between items-start text-xs p-2.5 border border-border-subtle rounded-xl bg-bg-secondary/10">
                          <div>
                            <p className="font-bold text-text-primary leading-tight">{it.title}</p>
                            <span className="text-[8px] text-text-tertiary mt-0.5 block">{it.subject}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <Badge variant={it.importance === 'high' ? 'rose' : it.importance === 'medium' ? 'orange' : 'indigo'}>
                              {it.importance}
                            </Badge>
                            <button onClick={() => handleDeleteImportantTopic(it.id)} className="p-1 rounded text-text-tertiary hover:bg-rose-500/10 hover:text-rose-500">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                </div>

              </div>

              {/* Right pane: Reading list tracker */}
              <div className="space-y-6">
                <Card className="p-5 border-border-subtle bg-surface shadow-subtle space-y-4">
                  <h3 className="text-xs font-bold text-text-primary flex items-center gap-1.5 border-b border-border-subtle pb-2.5">
                    <BookOpen className="h-4.5 w-4.5 text-primary" />
                    📖 Reading List Tracker
                  </h3>

                  <form onSubmit={handleAddReading} className="space-y-3 bg-bg-secondary/20 p-3 rounded-xl border border-border-subtle/50">
                    <input
                      type="text"
                      required
                      placeholder="Book / Article Title"
                      value={newReadTitle}
                      onChange={e => setNewReadTitle(e.target.value)}
                      className="w-full rounded-xl border border-border-subtle bg-bg-primary px-3 py-1.5 text-xs text-text-primary outline-none focus:border-primary"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newReadSubj}
                        onChange={e => setNewReadSubj(e.target.value)}
                        className="rounded-xl border border-border-subtle bg-bg-primary px-2 py-1 text-[10px] text-text-primary outline-none"
                      >
                        {courses.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                        <option value="General">General</option>
                      </select>
                      <select
                        value={newReadPriority}
                        onChange={e => setNewReadPriority(e.target.value as any)}
                        className="rounded-xl border border-border-subtle bg-bg-primary px-2 py-1 text-[10px] text-text-primary outline-none"
                      >
                        <option value="high">High priority</option>
                        <option value="medium">Medium priority</option>
                        <option value="low">Low priority</option>
                      </select>
                    </div>

                    <Button type="submit" className="w-full rounded-xl text-xs py-1.5 bg-primary text-white">
                      <Plus className="h-3.5 w-3.5" /> Add Reading Item
                    </Button>
                  </form>

                  {/* Reading list items */}
                  {readingList.length > 0 ? (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {readingList.map(item => (
                        <div key={item.id} className="p-3 border border-border-subtle rounded-xl space-y-2 bg-bg-secondary/10 text-xs">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-text-primary leading-tight">{item.title}</h4>
                            <button onClick={() => handleDeleteReading(item.id)} className="text-text-tertiary hover:text-rose-500 p-0.5">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-[9px] text-text-secondary">{item.subject}</p>
                          <div className="flex justify-between items-center pt-1 border-t border-border-subtle/50">
                            <span className="text-[8px] font-bold text-text-tertiary uppercase">Priority: {item.priority}</span>
                            <button
                              onClick={() => handleToggleReadingStatus(item.id)}
                              className={`text-[8.5px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                                item.status === 'Completed'
                                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                  : item.status === 'Reading'
                                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                  : 'bg-bg-secondary text-text-secondary border-border-subtle'
                              }`}
                            >
                              {item.status}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-text-secondary text-center py-6">No reading list items added yet.</p>
                  )}
                </Card>
              </div>

            </div>
          )}

          {/* TAB: REVISION CHECKLIST */}
          {activeTab === 'revision' && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              <Card className="p-6 border-border-subtle bg-surface shadow-subtle space-y-4">
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border-subtle pb-3">
                  <CheckCircle2 className="h-5 w-5 text-accent-rose" />
                  🎯 Revision Center & Study Goals
                </h3>

                {/* Add Revision Checklist Form */}
                <form onSubmit={handleAddRevision} className="grid gap-3 sm:grid-cols-[2fr_1fr_1.2fr_auto] items-end bg-bg-secondary/35 p-4 border border-border-subtle/70 rounded-2xl">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Topic Revision Goal</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Solve recursion logic worksheets"
                      value={newRevTopic}
                      onChange={e => setNewRevTopic(e.target.value)}
                      className="w-full rounded-xl border border-border-subtle bg-bg-primary px-3 py-1.5 text-xs text-text-primary outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Course</label>
                    <select
                      value={newRevSubj}
                      onChange={e => setNewRevSubj(e.target.value)}
                      className="w-full rounded-xl border border-border-subtle bg-bg-primary px-2 py-1.5 text-xs text-text-primary outline-none focus:border-primary"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Target Date</label>
                    <input
                      type="date"
                      value={newRevDate}
                      onChange={e => setNewRevDate(e.target.value)}
                      className="w-full rounded-xl border border-border-subtle bg-bg-primary px-3 py-1.5 text-xs text-text-primary outline-none focus:border-primary"
                    />
                  </div>
                  <Button type="submit" className="rounded-xl text-xs h-[34px] bg-accent-rose text-white">
                    Add
                  </Button>
                </form>

                {/* Revision checklists list */}
                {revisionList.length > 0 ? (
                  <div className="divide-y divide-border-subtle">
                    {revisionList.map(r => (
                      <div key={r.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 group">
                        <div className="flex items-start gap-3 text-left">
                          <button
                            onClick={() => handleToggleRevision(r.id)}
                            className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                              r.isCompleted
                                ? 'bg-accent-teal border-accent-teal text-white shadow-soft'
                                : 'border-border-medium hover:border-text-secondary'
                            }`}
                          >
                            {r.isCompleted && <CheckCircle2 className="h-3.5 w-3.5 fill-accent-teal text-white" />}
                          </button>
                          <div>
                            <p className={`text-xs font-bold text-text-primary ${
                              r.isCompleted ? 'line-through text-text-secondary font-medium' : ''
                            }`}>
                              {r.topic}
                            </p>
                            <span className="text-[9px] text-text-secondary mt-0.5 block">{r.subject}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-text-secondary font-medium font-mono bg-bg-secondary px-2 py-0.5 rounded-lg">
                            Due: {new Date(r.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                          <button
                            onClick={() => handleDeleteRevision(r.id)}
                            className="p-1 rounded text-text-tertiary hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-text-secondary text-center py-8">No revision checklist items added yet.</p>
                )}
              </Card>

            </div>
          )}

          {/* TAB: STUDY SESSIONS LOGS */}
          {activeTab === 'sessions' && (
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
              
              {/* Left pane: Log Study Session Form */}
              <div>
                <Card className="p-5 border-border-subtle bg-surface shadow-subtle space-y-4 text-left">
                  <h3 className="text-xs font-bold text-text-primary flex items-center gap-1.5 border-b border-border-subtle pb-2.5">
                    <Clock className="h-4.5 w-4.5 text-accent-indigo" />
                    📋 Log Study Session
                  </h3>

                  <form onSubmit={handleAddSession} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Subject / Course</label>
                      <select
                        value={newSessSubj}
                        onChange={e => setNewSessSubj(e.target.value)}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary outline-none focus:border-primary"
                      >
                        {courses.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                        <option value="General">General Study</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Duration (mins)</label>
                        <input
                          type="number"
                          required
                          min={5}
                          max={300}
                          value={newSessDur}
                          onChange={e => setNewSessDur(Number(e.target.value))}
                          className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary outline-none focus:border-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Date</label>
                        <input
                          type="date"
                          required
                          value={newSessDate}
                          onChange={e => setNewSessDate(e.target.value)}
                          className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Study Notes / Topics Covered</label>
                      <textarea
                        rows={3}
                        value={newSessNotes}
                        onChange={e => setNewSessNotes(e.target.value)}
                        placeholder="Summarize what you accomplished during this session..."
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary outline-none focus:border-primary resize-none"
                      />
                    </div>

                    <Button type="submit" className="w-full rounded-xl text-xs py-2 bg-accent-indigo hover:bg-accent-indigo/90 text-white">
                      Log Study Hours
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Right pane: Session logs history */}
              <div>
                <Card className="p-6 border-border-subtle bg-surface shadow-subtle space-y-4">
                  <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                    <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                      <FolderOpen className="h-4.5 w-4.5 text-accent-indigo" />
                      Session History Log
                    </h3>
                    <Badge variant="indigo">{studySessions.length} total logs</Badge>
                  </div>

                  {studySessions.length > 0 ? (
                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                      {studySessions.map(sess => (
                        <div key={sess.id} className="p-4 border border-border-subtle rounded-2xl bg-bg-secondary/15 hover:border-border-medium transition-colors text-left flex justify-between gap-4">
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2.5">
                              <h4 className="font-bold text-text-primary text-xs leading-tight truncate">{sess.subject}</h4>
                              <span className="text-[9px] font-bold text-accent-indigo bg-accent-indigo/10 px-2 py-0.5 rounded-lg shrink-0">
                                {sess.duration} mins
                              </span>
                            </div>
                            <p className="text-[10px] text-text-secondary leading-normal">{sess.notes || 'No notes logged.'}</p>
                            <span className="text-[8px] text-text-tertiary font-bold font-mono block">
                              {new Date(sess.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteSession(sess.id)}
                            className="p-1 rounded-lg text-text-tertiary hover:bg-rose-500/10 hover:text-rose-500 shrink-0 self-start"
                            title="Delete log"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center border border-dashed border-border-medium rounded-3xl">
                      <Clock className="h-10 w-10 text-text-tertiary opacity-45 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-text-secondary">No Logs Found</p>
                      <p className="text-[10px] text-text-secondary mt-1">Use the panel on the left to manually log your daily study hours.</p>
                    </div>
                  )}
                </Card>
              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  )
}
