import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Send,
  Paperclip,
  MessageSquare,
  Plus,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  Settings,
  X,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useCourses } from '@/hooks/useCourses'
import { useProfile } from '@/hooks/useProfile'
import {
  SUPPORTED_MODELS,
  getSimulatedResponse,
} from '@/services/AiService'
import type { Conversation, AiMessage } from '@/services/AiService'
import { cn } from '@/utils/cn'

// Animation variant presets
const sidebarVariants = {
  expanded: { width: 260, opacity: 1 },
  collapsed: { width: 0, opacity: 0 },
}

export default function Ai() {
  const { courses } = useCourses()
  const { profile } = useProfile()

  // Conversations history state
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('semesteros.ai.conversations')
    if (saved) return JSON.parse(saved)
    return [
      {
        id: 'chat-1',
        title: 'OOP Polymorphism Revision',
        subjectId: 'course-oop-theory',
        model: 'ollama-llama3',
        temperature: 0.7,
        systemPrompt: 'You are an expert tutor for computer science students.',
        messages: [
          { id: 'm-1', role: 'user', content: 'What is polymorphism?', timestamp: '10:30 AM' },
          {
            id: 'm-2',
            role: 'assistant',
            content: 'Polymorphism allows objects to take on multiple forms. In CS, it typically manifests as method overloading or overriding.',
            timestamp: '10:31 AM',
            type: 'text',
          },
        ],
        updatedAt: new Date().toISOString(),
      },
    ]
  })

  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    return conversations.length > 0 ? conversations[0].id : null
  })

  // Collapsible panels states
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [contextOpen, setContextOpen] = useState(true)

  // Message composer prompt
  const [prompt, setPrompt] = useState('')
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Interactive flashcards flipped indices
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)

  // Interactive quiz selected option
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<string | null>(null)

  // Sync conversations to storage
  useEffect(() => {
    localStorage.setItem('semesteros.ai.conversations', JSON.stringify(conversations))
  }, [conversations])

  // Scroll to bottom on message updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversations, activeConversationId])

  // Get active conversation object
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || null
  }, [conversations, activeConversationId])

  // Add new conversation
  const handleNewChat = () => {
    const newChat: Conversation = {
      id: `chat-${crypto.randomUUID()}`,
      title: 'New Conversation',
      model: 'ollama-llama3',
      temperature: 0.7,
      systemPrompt: 'You are an expert tutor for computer science students.',
      messages: [],
      updatedAt: new Date().toISOString(),
    }
    setConversations((prev) => [newChat, ...prev])
    setActiveConversationId(newChat.id)
    setFlippedIndex(null)
    setQuizAnswerSelected(null)
  }

  // Delete conversation
  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Delete this conversation?')) {
      setConversations((prev) => prev.filter((c) => c.id !== chatId))
      if (activeConversationId === chatId) {
        setActiveConversationId(conversations.length > 1 ? conversations[0].id : null)
      }
    }
  }

  // Update conversation settings
  const handleUpdateConversation = (updates: Partial<Conversation>) => {
    if (!activeConversationId) return
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConversationId ? { ...c, ...updates } : c))
    )
  }

  // Trigger simulated streaming LLM output
  const handleSendPrompt = (textToSend = prompt) => {
    if (!textToSend.trim() || !activeConversationId) return

    const userMsg: AiMessage = {
      id: `m-${crypto.randomUUID()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    // Append user message immediately
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConversationId) return c
        return {
          ...c,
          messages: [...c.messages, userMsg],
          title: c.messages.length === 0 ? textToSend.trim().substring(0, 24) : c.title,
          updatedAt: new Date().toISOString(),
        }
      })
    )
    setPrompt('')
    setFlippedIndex(null)
    setQuizAnswerSelected(null)

    // Simulate response delay
    setTimeout(() => {
      const responseDraft = getSimulatedResponse(textToSend)
      const assistantMsg: AiMessage = {
        ...responseDraft,
        id: `m-${crypto.randomUUID()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConversationId) return c
          return {
            ...c,
            messages: [...c.messages, assistantMsg],
            updatedAt: new Date().toISOString(),
          }
        })
      )
    }, 850)
  }

  // Copy helper
  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedMessageId(msgId)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  return (
    <div className="flex h-[calc(100vh-8.5rem)] w-full overflow-hidden bg-bg-secondary border border-border-subtle rounded-3xl shadow-subtle select-none">
      
      {/* 1. LEFT SIDEBAR: CHATS HISTORY LIST */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            variants={sidebarVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="flex flex-col border-r border-border-subtle bg-bg-primary h-full overflow-hidden shrink-0"
          >
            {/* Header action */}
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Recent Chats</span>
              <button
                onClick={handleNewChat}
                className="rounded-lg p-1.5 text-primary hover:bg-bg-secondary transition-colors cursor-pointer"
                title="New Chat"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Conversation cards list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {conversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setActiveConversationId(chat.id)
                    setFlippedIndex(null)
                    setQuizAnswerSelected(null)
                  }}
                  className={cn(
                    'w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs text-left transition-all cursor-pointer relative group',
                    chat.id === activeConversationId
                      ? 'bg-bg-secondary text-primary font-bold shadow-subtle'
                      : 'text-text-secondary hover:bg-bg-secondary/40 hover:text-text-primary'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-4">
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-text-tertiary" />
                    <span className="truncate">{chat.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 rounded-lg text-text-secondary hover:text-accent-rose hover:bg-bg-secondary transition-all"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="h-10 w-5 self-center border-y border-r border-border-subtle bg-bg-primary hover:bg-bg-secondary rounded-r-lg flex items-center justify-center text-text-secondary shrink-0 cursor-pointer"
        aria-label="Toggle chat history"
      >
        <ChevronRight className={cn('h-3.5 w-3.5 transition-transform', sidebarOpen && 'rotate-180')} />
      </button>

      {/* 2. CENTRAL WORKSPACE: MESSAGES WINDOW */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-bg-secondary/20 relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Welcome Dashboard layout (shown if conversation is empty) */}
          {activeConversation && activeConversation.messages.length === 0 ? (
            <div className="max-w-2xl mx-auto space-y-8 pt-8">
              <div className="text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-subtle">
                  <Bot className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                  What would you like to learn today, {profile.name}?
                </h2>
                <p className="text-xs text-text-secondary max-w-[45ch] mx-auto text-wrap-pretty">
                  Select a template shortcut below or draft custom syllabus questions in the composer.
                </p>
              </div>

              {/* Suggestions grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: 'Explain Topic', query: 'Explain Polymorphism concept in simple terms' },
                  { title: 'Generate Quiz', query: 'Generate quiz questions for Data Structures BST' },
                  { title: 'Create Study Plan', query: 'Create study plan for Computer Organization midterm exam' },
                  { title: 'Generate Flashcards', query: 'Generate flashcards for cache memory types' },
                ].map((sug) => (
                  <button
                    key={sug.title}
                    onClick={() => handleSendPrompt(sug.query)}
                    className="p-4 rounded-2xl border border-border-subtle bg-surface hover:border-border-medium hover:bg-bg-secondary/20 transition-all text-left shadow-subtle flex flex-col justify-between h-24 group cursor-pointer"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">{sug.title}</span>
                    <span className="text-xs font-semibold text-text-secondary line-clamp-2 group-hover:text-primary transition-colors leading-relaxed">
                      &ldquo;{sug.query}&rdquo;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Render active conversation messages */
            <div className="max-w-3xl mx-auto space-y-6">
              {activeConversation?.messages.map((msg) => {
                const isUser = msg.role === 'user'
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex items-start gap-4',
                      isUser ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {!isUser && (
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-border-subtle shadow-subtle shrink-0">
                        <Bot className="h-4.5 w-4.5" />
                      </div>
                    )}

                    <div className="space-y-1.5 max-w-[85%] text-left">
                      {/* Text/Bubble box */}
                      <div
                        className={cn(
                          'rounded-2xl p-4 text-xs leading-relaxed border shadow-subtle',
                          isUser
                            ? 'bg-primary text-white border-primary/20 rounded-tr-none'
                            : 'bg-surface text-text-primary border-border-subtle rounded-tl-none'
                        )}
                      >
                        {/* Render simple markdown code lines */}
                        <div className="whitespace-pre-wrap">{msg.content}</div>

                        {/* Interactive Flashcard render */}
                        {msg.type === 'flashcard' && msg.metadata?.flashcards && (
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {msg.metadata.flashcards.map((fc: any, fcIdx: number) => {
                              const isFlipped = flippedIndex === fcIdx
                              return (
                                <Card
                                  key={fcIdx}
                                  onClick={() => setFlippedIndex(isFlipped ? null : fcIdx)}
                                  className="h-28 flex flex-col items-center justify-center p-4 border border-border-subtle bg-bg-secondary/40 shadow-soft cursor-pointer relative group text-center"
                                >
                                  <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider font-bold text-text-tertiary">
                                    {isFlipped ? 'Answer' : 'Question'}
                                  </span>
                                  <p className="text-[10px] font-bold text-text-primary">
                                    {isFlipped ? fc.a : fc.q}
                                  </p>
                                  <span className="text-[8px] font-semibold text-text-secondary mt-2 px-1.5 py-0.5 rounded bg-bg-primary uppercase">
                                    {fc.difficulty}
                                  </span>
                                </Card>
                              )
                            })}
                          </div>
                        )}

                        {/* Interactive Quiz render */}
                        {msg.type === 'quiz' && msg.metadata?.quiz && (
                          <div className="mt-4 border border-border-subtle rounded-2xl p-4 bg-bg-secondary/20 space-y-3">
                            <h4 className="font-bold text-[11px] text-text-primary">
                              {msg.metadata.quiz.question}
                            </h4>
                            <div className="space-y-2">
                              {msg.metadata.quiz.options.map((opt: string) => {
                                const isCorrect = opt === msg.metadata.quiz.answer
                                const isSelected = quizAnswerSelected === opt

                                return (
                                  <button
                                    key={opt}
                                    onClick={() => setQuizAnswerSelected(opt)}
                                    className={cn(
                                      'w-full text-left p-3 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer',
                                      quizAnswerSelected
                                        ? isCorrect
                                          ? 'bg-accent-teal/15 border-accent-teal text-accent-teal'
                                          : isSelected
                                          ? 'bg-accent-rose/15 border-accent-rose text-accent-rose'
                                          : 'bg-bg-primary border-border-subtle opacity-70'
                                        : 'bg-bg-primary border-border-subtle hover:border-text-secondary'
                                    )}
                                  >
                                    {opt}
                                  </button>
                                )
                              })}
                            </div>
                            {quizAnswerSelected && (
                              <p className="text-[9px] text-text-secondary leading-relaxed bg-bg-primary rounded-lg p-2.5 border border-border-subtle mt-2">
                                💡 <strong>Explanation:</strong> {msg.metadata.quiz.explanation}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Study Plan Timeline Table render */}
                        {msg.type === 'plan' && msg.metadata?.plan && (
                          <div className="mt-4 border border-border-subtle rounded-2xl overflow-hidden bg-bg-secondary/20 text-[10px]">
                            <div className="grid grid-cols-4 gap-2 bg-bg-secondary p-2.5 font-bold uppercase tracking-wider text-text-tertiary text-center">
                              <span>Period</span>
                              <span className="col-span-2">Focus Topic</span>
                              <span>Hours</span>
                            </div>
                            <div className="divide-y divide-border-subtle">
                              {msg.metadata.plan.map((p: any, idx: number) => (
                                <div key={idx} className="grid grid-cols-4 gap-2 p-2.5 items-center text-center">
                                  <span className="font-bold text-text-primary">{p.day}</span>
                                  <span className="col-span-2 font-medium text-text-secondary text-left">{p.focus}</span>
                                  <span className="font-mono text-text-primary">{p.hours}h</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Message Actions */}
                      <div
                        className={cn(
                          'flex items-center gap-2 text-[10px] text-text-secondary font-medium px-2',
                          isUser ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <>
                            <span>•</span>
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="hover:text-text-primary transition-colors flex items-center gap-0.5"
                            >
                              {copiedMessageId === msg.id ? <Check className="h-3 w-3 text-accent-teal" /> : <Copy className="h-3 w-3" />}
                              Copy
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* PROMPT COMPOSER FOOTER */}
        <div className="p-4 border-t border-border-subtle bg-bg-primary select-none shrink-0 z-10">
          <div className="max-w-3xl mx-auto flex items-end gap-3 bg-bg-secondary/40 border border-border-subtle rounded-2xl p-2">
            <button
              className="rounded-xl p-2 text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors cursor-pointer"
              title="Attach document resources"
            >
              <Paperclip className="h-4.5 w-4.5" />
            </button>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendPrompt()
                }
              }}
              placeholder="Ask anything, generate quiz notes, or study plans..."
              rows={1}
              className="flex-1 bg-transparent resize-none text-xs text-text-primary leading-relaxed py-2 outline-none border-none placeholder:text-text-muted focus:ring-0 max-h-24 overflow-y-auto"
            />

            <Button
              onClick={() => handleSendPrompt()}
              className="h-8 w-8 rounded-xl p-0 flex items-center justify-center shrink-0"
              disabled={!prompt.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 3. RIGHT COLLAPSIBLE DRAWER: CONTEXT & SETTINGS PANEL */}
      <AnimatePresence initial={false}>
        {contextOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex flex-col border-l border-border-subtle bg-bg-primary h-full overflow-hidden shrink-0 text-left"
          >
            {/* Header */}
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">AI Workspace Settings</span>
              <button
                onClick={() => setContextOpen(false)}
                className="rounded-lg p-1 text-text-secondary hover:bg-bg-secondary cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Context Selector */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-wider text-text-tertiary">Syllabus Course Context</label>
                <select
                  value={activeConversation?.subjectId || ''}
                  onChange={(e) => handleUpdateConversation({ subjectId: e.target.value })}
                  className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value="">General Chat Context</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Selector */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-wider text-text-tertiary">Model Engine Provider</label>
                <select
                  value={activeConversation?.model || 'ollama-llama3'}
                  onChange={(e) => handleUpdateConversation({ model: e.target.value })}
                  className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                >
                  {SUPPORTED_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* System Prompt Editor */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-wider text-text-tertiary">System Instructions</label>
                <textarea
                  value={activeConversation?.systemPrompt || ''}
                  onChange={(e) => handleUpdateConversation({ systemPrompt: e.target.value })}
                  placeholder="Set AI behavior or syllabus guidelines..."
                  rows={4}
                  className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary outline-none focus:border-primary"
                />
              </div>

              {/* Temperature Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-text-tertiary">
                  <span>Temperature</span>
                  <span className="font-mono text-text-primary">{activeConversation?.temperature || 0.7}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={activeConversation?.temperature || 0.7}
                  onChange={(e) => handleUpdateConversation({ temperature: Number(e.target.value) })}
                  className="w-full accent-primary bg-bg-secondary h-1 rounded-lg outline-none"
                />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Context Open toggle button */}
      {!contextOpen && (
        <button
          onClick={() => setContextOpen(true)}
          className="absolute right-4 top-4 z-20 h-8 w-8 rounded-xl border border-border-subtle bg-bg-primary hover:bg-bg-secondary flex items-center justify-center text-text-secondary cursor-pointer shadow-subtle"
          title="Open settings"
        >
          <Settings className="h-4.5 w-4.5" />
        </button>
      )}

    </div>
  )
}
