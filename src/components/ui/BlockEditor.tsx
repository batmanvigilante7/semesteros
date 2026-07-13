import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Heading1, 
  Heading2, 
  Heading3, 
  CheckSquare, 
  List, 
  ListOrdered, 
  Text, 
  Quote, 
  Info, 
  Code, 
  Minus 
} from 'lucide-react'
import { cn } from '@/utils/cn'

export interface Block {
  id: string
  type: 'paragraph' | 'h1' | 'h2' | 'h3' | 'todo' | 'bullet' | 'numbered' | 'quote' | 'callout' | 'code' | 'divider'
  content: string
  checked?: boolean
  language?: string
}

interface BlockEditorProps {
  value: string
  onChange: (newValue: string) => void
  placeholder?: string
}

// Custom hook to automatically resize textarea elements
function useAutoResize(content: string) {
  const ref = useRef<HTMLTextAreaElement>(null)
  
  useEffect(() => {
    const element = ref.current
    if (element) {
      element.style.height = '0px'
      const scrollHeight = element.scrollHeight
      element.style.height = `${scrollHeight}px`
    }
  }, [content])
  
  return ref
}

export default function BlockEditor({ value, onChange, placeholder = "Type '/' for commands..." }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [showSlashMenu, setShowSlashMenu] = useState<number | null>(null) // index of block
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  
  // Safe JSON Parsing of blocks
  useEffect(() => {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed) && parsed.length > 0) {
        setBlocks(parsed)
      } else {
        // Fallback for empty array
        setBlocks([{ id: 'b-1', type: 'paragraph', content: '' }])
      }
    } catch (e) {
      // Fallback for plain text legacy notes
      if (value) {
        setBlocks([{ id: 'b-legacy', type: 'paragraph', content: value }])
      } else {
        setBlocks([{ id: 'b-1', type: 'paragraph', content: '' }])
      }
    }
  }, [value])

  const saveBlocks = (newBlocks: Block[]) => {
    setBlocks(newBlocks)
    onChange(JSON.stringify(newBlocks))
  }

  // Update specific block content
  const handleContentChange = (index: number, content: string) => {
    const updated = [...blocks]
    updated[index] = { ...updated[index], content }
    
    // Slash commands trigger
    if (content.endsWith('/')) {
      setShowSlashMenu(index)
    } else if (showSlashMenu === index && !content.includes('/')) {
      setShowSlashMenu(null)
    }
    
    saveBlocks(updated)
  }

  // Handle enter key to add a block below
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const newBlock: Block = {
        id: `b-${crypto.randomUUID()}`,
        type: 'paragraph',
        content: ''
      }
      const updated = [...blocks]
      updated.splice(index + 1, 0, newBlock)
      saveBlocks(updated)
      
      // Delay focus slightly so element can render
      setTimeout(() => {
        const textareas = document.querySelectorAll('.block-textarea')
        const target = textareas[index + 1] as HTMLTextAreaElement
        if (target) {
          target.focus()
        }
      }, 30)
    }
    
    // Backspace merges or deletes empty blocks
    if (e.key === 'Backspace' && blocks[index].content === '') {
      e.preventDefault()
      if (blocks.length > 1) {
        const updated = [...blocks]
        updated.splice(index, 1)
        saveBlocks(updated)
        
        // Focus previous block
        setTimeout(() => {
          const textareas = document.querySelectorAll('.block-textarea')
          const target = textareas[Math.max(0, index - 1)] as HTMLTextAreaElement
          if (target) {
            target.focus()
            // Put cursor at end
            const len = target.value.length
            target.setSelectionRange(len, len)
          }
        }, 30)
      }
    }
  }

  // Add block manually
  const addBlockAtEnd = () => {
    const newBlock: Block = {
      id: `b-${crypto.randomUUID()}`,
      type: 'paragraph',
      content: ''
    }
    saveBlocks([...blocks, newBlock])
  }

  // Transform block type
  const transformBlock = (index: number, type: Block['type']) => {
    const updated = [...blocks]
    const cleanedContent = updated[index].content.replace(/\/$/, '') // strip slash command indicator
    updated[index] = { 
      ...updated[index], 
      type, 
      content: cleanedContent,
      checked: type === 'todo' ? false : undefined
    }
    saveBlocks(updated)
    setShowSlashMenu(null)
  }

  // Delete a block
  const deleteBlock = (index: number) => {
    if (blocks.length > 1) {
      const updated = [...blocks]
      updated.splice(index, 1)
      saveBlocks(updated)
    } else {
      saveBlocks([{ id: `b-${crypto.randomUUID()}`, type: 'paragraph', content: '' }])
    }
  }

  // Toggle todo check
  const toggleTodo = (index: number) => {
    const updated = [...blocks]
    updated[index] = { ...updated[index], checked: !updated[index].checked }
    saveBlocks(updated)
  }

  // HTML5 Drag & Drop
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
  }

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return
    const reordered = [...blocks]
    const [moved] = reordered.splice(draggedIndex, 1)
    reordered.splice(index, 0, moved)
    saveBlocks(reordered)
    setDraggedIndex(null)
  }

  const slashMenuItems = [
    { type: 'paragraph' as const, label: 'Text', icon: Text, desc: 'Plain layout writing' },
    { type: 'h1' as const, label: 'Heading 1', icon: Heading1, desc: 'Large title sections' },
    { type: 'h2' as const, label: 'Heading 2', icon: Heading2, desc: 'Medium headings' },
    { type: 'h3' as const, label: 'Heading 3', icon: Heading3, desc: 'Small headings' },
    { type: 'todo' as const, label: 'To-do List', icon: CheckSquare, desc: 'Checklist tasks' },
    { type: 'bullet' as const, label: 'Bulleted List', icon: List, desc: 'Simple bullet lists' },
    { type: 'numbered' as const, label: 'Numbered List', icon: ListOrdered, desc: 'Sequence lists' },
    { type: 'quote' as const, label: 'Quote', icon: Quote, desc: 'Capture visual quotes' },
    { type: 'callout' as const, label: 'Callout', icon: Info, desc: 'Highlighted alert box' },
    { type: 'code' as const, label: 'Code Block', icon: Code, desc: 'Monospace code block' },
    { type: 'divider' as const, label: 'Divider', icon: Minus, desc: 'Separate sections' },
  ]

  return (
    <div className="space-y-3 w-full text-left relative min-h-[350px]">
      <AnimatePresence initial={false}>
        {blocks.map((block, idx) => {
          return (
            <motion.div
              key={block.id}
              layoutId={block.id}
              className={cn(
                "group relative flex items-start gap-2 py-1 px-2 rounded-xl transition-all duration-200 border border-transparent",
                draggedIndex === idx && "opacity-40 border-dashed border-primary/20",
                activeBlockId === block.id && "bg-bg-secondary/20 border-border-subtle/40 shadow-subtle"
              )}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
            >
              {/* Drag handles & command buttons (visible on hover) */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 select-none pt-1">
                <div className="cursor-grab active:cursor-grabbing text-text-muted hover:text-text-secondary">
                  <GripVertical className="h-4 w-4" />
                </div>
                <button
                  type="button"
                  onClick={() => deleteBlock(idx)}
                  className="text-text-muted hover:text-accent-rose p-0.5 rounded transition-colors"
                  title="Delete Block"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Block Content Switcher */}
              <div className="flex-1 min-w-0">
                {block.type === 'divider' ? (
                  <div className="py-3" onClick={() => setActiveBlockId(block.id)}>
                    <hr className="border-t border-border-subtle" />
                  </div>
                ) : (
                  <div className="flex items-start gap-2 w-full">
                    {/* Prefix indicators */}
                    {block.type === 'todo' && (
                      <input
                        type="checkbox"
                        checked={!!block.checked}
                        onChange={() => toggleTodo(idx)}
                        className="h-4.5 w-4.5 rounded border-border-medium bg-transparent text-primary focus:ring-primary/20 mt-1 cursor-pointer"
                      />
                    )}
                    {block.type === 'bullet' && (
                      <span className="text-text-secondary select-none font-bold text-lg leading-none mt-0.5 shrink-0 w-3 text-center">•</span>
                    )}
                    {block.type === 'numbered' && (
                      <span className="text-[11px] text-text-tertiary select-none font-bold font-mono mt-1 shrink-0 w-4 text-left">{idx + 1}.</span>
                    )}

                    {/* Block Text Component */}
                    <div
                      className={cn(
                        "w-full flex items-stretch relative",
                        block.type === 'quote' && "border-l-3 border-primary/50 pl-3.5 italic text-text-secondary",
                        block.type === 'callout' && "bg-primary/5 border border-primary/10 rounded-xl p-3 text-text-secondary flex items-start gap-2.5",
                        block.type === 'code' && "bg-bg-secondary border border-border-subtle rounded-xl p-3 font-mono text-[11px] text-text-primary"
                      )}
                    >
                      {block.type === 'callout' && (
                        <span className="text-sm select-none mt-0.5">💡</span>
                      )}
                      
                      <BlockTextarea
                        block={block}
                        index={idx}
                        placeholder={placeholder}
                        onFocus={() => setActiveBlockId(block.id)}
                        onBlur={() => setTimeout(() => setActiveBlockId(null), 200)}
                        onChange={(e) => handleContentChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Slash Command Dropdown Overlay */}
              {showSlashMenu === idx && (
                <div className="absolute left-10 top-full z-[100] mt-1 w-64 rounded-2xl border border-border-subtle bg-surface/95 backdrop-blur-md p-2.5 shadow-premium text-left animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-text-tertiary border-b border-border-subtle/50 mb-1.5">
                    Transform Block
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-0.5">
                    {slashMenuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.type}
                          onClick={() => transformBlock(idx, item.type)}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-bg-secondary flex items-center gap-3 cursor-pointer transition-colors"
                        >
                          <div className="p-1 rounded-lg bg-bg-secondary group-hover:bg-surface border border-border-subtle">
                            <Icon className="h-4 w-4 text-text-secondary" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-text-primary">{item.label}</span>
                            <span className="block text-[9px] text-text-tertiary">{item.desc}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Quick click area to add blocks */}
      <div 
        onClick={addBlockAtEnd}
        className="py-4 hover:bg-bg-secondary/10 rounded-xl cursor-text text-center text-[10px] font-semibold text-text-tertiary flex items-center justify-center gap-1.5 select-none transition-colors border border-dashed border-transparent hover:border-border-subtle/50"
      >
        <Plus className="h-3.5 w-3.5" /> Add a new block
      </div>
    </div>
  )
}

// Inner helper component to handle autogrow textareas cleanly
interface BlockTextareaProps {
  block: Block
  index: number
  placeholder: string
  onFocus: () => void
  onBlur: () => void
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

function BlockTextarea({ block, index, placeholder, onFocus, onBlur, onChange, onKeyDown }: BlockTextareaProps) {
  const textareaRef = useAutoResize(block.content)
  
  const getStyle = () => {
    switch (block.type) {
      case 'h1':
        return 'text-lg font-extrabold text-text-primary tracking-tight leading-normal py-0.5'
      case 'h2':
        return 'text-base font-bold text-text-primary tracking-tight leading-normal py-0.5'
      case 'h3':
        return 'text-xs font-bold text-text-primary tracking-tight leading-normal py-0.5'
      case 'todo':
        return cn(
          'text-xs text-text-primary leading-relaxed py-0.5',
          block.checked && 'line-through text-text-secondary/70 font-medium'
        )
      case 'code':
        return 'w-full bg-transparent border-none text-[11px] font-mono leading-relaxed resize-none overflow-hidden outline-none'
      case 'quote':
      case 'callout':
      case 'bullet':
      case 'numbered':
      case 'paragraph':
      default:
        return 'text-xs text-text-primary leading-relaxed py-0.5'
    }
  }

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      value={block.content}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={index === 0 ? "Empty page title..." : placeholder}
      className={cn(
        "block-textarea w-full bg-transparent border-none resize-none overflow-hidden outline-none placeholder:text-text-muted focus:ring-0 p-0",
        getStyle()
      )}
    />
  )
}
