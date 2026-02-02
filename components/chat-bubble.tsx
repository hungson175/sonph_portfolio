"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { MessageCircle, X, Send, Square, ChevronDown, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useIsMobile } from "@/components/ui/use-mobile"
import { streamChatResponse } from "@/lib/chat-api"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// --- Types ---

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  isError?: boolean
  thinkingSteps?: string[]
  suggestions?: string[]
}

// --- Constants ---

const SUGGESTED_QUESTIONS = [
  "What projects have you built?",
  "Tell me about your AI experience",
  "What's your tech stack?",
  "Bạn có blog nào không?",
]

const GREETING_MESSAGE: Message = {
  id: "greeting",
  role: "assistant",
  content:
    "Hi! I'm Son's AI assistant. Ask me anything about his projects, experience, or skills!",
}

// --- Sub-components ---

function BubbleButton({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <Button
      onClick={onClick}
      size="icon-lg"
      className="fixed bottom-6 right-6 z-50 size-14 rounded-full shadow-lg animate-in fade-in zoom-in-75 duration-500"
    >
      {isOpen ? <X className="size-6" /> : <MessageCircle className="size-6" />}
    </Button>
  )
}

function ChatHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center gap-3 border-b px-4 py-3">
      <Avatar className="size-8">
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          SP
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm font-semibold">Chat with Son</p>
        <p className="text-xs text-muted-foreground">AI Assistant</p>
      </div>
      <Button variant="ghost" size="icon-sm" onClick={onClose}>
        <X className="size-4" />
      </Button>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <span
        className="size-1.5 rounded-full bg-muted-foreground animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="size-1.5 rounded-full bg-muted-foreground animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="size-1.5 rounded-full bg-muted-foreground animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  )
}

function ThinkingBox({
  steps,
  isActive,
}: {
  steps: string[]
  isActive: boolean
}) {
  const [open, setOpen] = useState(true)

  // Auto-collapse when thinking finishes
  useEffect(() => {
    if (!isActive) setOpen(false)
  }, [isActive])

  // Auto-expand when new steps arrive while active
  useEffect(() => {
    if (isActive) setOpen(true)
  }, [isActive, steps.length])

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1 cursor-pointer">
        <ChevronDown
          className={`size-3 transition-transform duration-200 ${
            open ? "" : "-rotate-90"
          }`}
        />
        {isActive ? (
          <span className="flex items-center gap-1.5">
            <Spinner className="size-3" />
            Thinking...
          </span>
        ) : (
          <span>Thought for {steps.length} step{steps.length !== 1 ? "s" : ""}</span>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-1 pl-4 pt-1 pb-1">
          {steps.map((step, i) => {
            const isLatest = isActive && i === steps.length - 1
            return (
              <div
                key={i}
                className={`flex items-center gap-2 text-xs animate-in fade-in duration-300 ${
                  isLatest
                    ? "text-muted-foreground"
                    : "text-muted-foreground/50"
                }`}
              >
                {isLatest ? (
                  <Spinner className="size-3" />
                ) : (
                  <span className="size-3 flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
                <span>{step}</span>
              </div>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const text = String(children).replace(/\n$/, "")

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative group my-1.5 rounded-lg bg-background/30 overflow-hidden">
      <button
        onClick={handleCopy}
        className="absolute top-1.5 right-1.5 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/80"
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      </button>
      <pre className="overflow-x-auto p-2.5 text-xs font-mono leading-relaxed">
        <code>{text}</code>
      </pre>
    </div>
  )
}

function ChatMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        ul: ({ children }) => <ul className="list-disc pl-4 my-1 space-y-0.5">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-4 my-1 space-y-0.5">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            className="underline underline-offset-2 hover:no-underline"
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        ),
        pre: ({ children }) => <>{children}</>,
        code: ({ className, children }) => {
          const isBlock = className?.startsWith("language-") || String(children).includes("\n")
          if (!isBlock) {
            return (
              <code className="bg-background/20 px-1 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            )
          }
          return <CodeBlock>{children}</CodeBlock>
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

function MessageBubble({
  message,
  isThinking,
}: {
  message: Message
  isThinking: boolean
}) {
  const isUser = message.role === "user"
  const hasThinking = message.thinkingSteps && message.thinkingSteps.length > 0

  return (
    <div
      className={`flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {!isUser && (
        <Avatar className="size-6 mt-1 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
            SP
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[80%] flex flex-col gap-1 ${isUser ? "items-end" : ""}`}>
        {isThinking && !hasThinking && <TypingIndicator />}
        {hasThinking && (
          <ThinkingBox
            steps={message.thinkingSteps!}
            isActive={isThinking}
          />
        )}
        {message.content && (
          <div
            className={`rounded-2xl px-3 py-2 text-sm break-words ${
              isUser
                ? "bg-primary text-primary-foreground"
                : message.isError
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-foreground"
            }`}
          >
            {isUser ? message.content : <ChatMarkdown content={message.content} />}
          </div>
        )}
      </div>
    </div>
  )
}

function SuggestedChips({
  onSelect,
}: {
  onSelect: (question: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 px-1 pt-2">
      {SUGGESTED_QUESTIONS.map((q) => (
        <Badge
          key={q}
          variant="secondary"
          className="cursor-pointer hover:bg-accent transition-colors text-xs py-1 px-2"
          onClick={() => onSelect(q)}
        >
          {q}
        </Badge>
      ))}
    </div>
  )
}

function DynamicSuggestedChips({
  suggestions,
  onSelect,
}: {
  suggestions: string[]
  onSelect: (question: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5 pl-8 pt-1 animate-in fade-in duration-500">
      {suggestions.map((q) => (
        <Badge
          key={q}
          variant="outline"
          className="cursor-pointer hover:bg-accent transition-colors text-xs py-1 px-2"
          onClick={() => onSelect(q)}
        >
          {q}
        </Badge>
      ))}
    </div>
  )
}

function ChatInput({
  value,
  onChange,
  onSend,
  onStop,
  isStreaming,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  onStop: () => void
  isStreaming: boolean
  disabled: boolean
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!disabled && value.trim()) onSend()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = Math.min(el.scrollHeight, 100) + "px"
    }
  }, [value])

  return (
    <div className="flex items-end gap-2 border-t px-3 py-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything..."
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground max-h-[100px]"
      />
      {isStreaming ? (
        <Button variant="ghost" size="icon-sm" onClick={onStop}>
          <Square className="size-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onSend}
          disabled={disabled || !value.trim()}
        >
          <Send className="size-4" />
        </Button>
      )}
    </div>
  )
}

// --- Main Component ---

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING_MESSAGE])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [activeAssistantId, setActiveAssistantId] = useState<string | null>(null)
  const isMobile = useIsMobile()
  const abortRef = useRef<AbortController | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollAreaRef.current
      if (el) {
        el.scrollTop = el.scrollHeight
      }
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSend = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim()
      if (!content || isStreaming) return

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
      }
      setMessages((prev) =>
        prev.map((m) => (m.suggestions ? { ...m, suggestions: undefined } : m))
          .concat(userMsg)
      )
      setInput("")
      setIsStreaming(true)

      const assistantId = (Date.now() + 1).toString()
      setActiveAssistantId(assistantId)
      const abortController = new AbortController()
      abortRef.current = abortController

      // Create a placeholder assistant message for thinking steps
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          thinkingSteps: [],
        },
      ])

      try {
        for await (const event of streamChatResponse(
          content,
          abortController.signal
        )) {
          if (abortController.signal.aborted) break

          switch (event.type) {
            case "thinking":
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        thinkingSteps: [
                          ...(m.thinkingSteps ?? []),
                          event.text ?? "Thinking...",
                        ],
                      }
                    : m
                )
              )
              scrollToBottom()
              break
            case "content":
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: event.text ?? "" }
                    : m
                )
              )
              break
            case "content_delta":
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: (m.content || "") + (event.text ?? "") }
                    : m
                )
              )
              scrollToBottom()
              break
            case "suggestions":
              if (event.suggestions?.length) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, suggestions: event.suggestions }
                      : m
                  )
                )
              }
              break
            case "error":
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        content: event.text ?? "Something went wrong.",
                        isError: true,
                      }
                    : m
                )
              )
              break
            case "done":
              break
          }
        }
      } catch {
        // aborted or network error — keep partial content
      } finally {
        setIsStreaming(false)
        setActiveAssistantId(null)
        abortRef.current = null
      }
    },
    [input, isStreaming, scrollToBottom]
  )

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const hasUserMessages = messages.some((m) => m.role === "user")

  const panelClasses = isMobile
    ? "fixed inset-0 z-50 flex flex-col bg-background overflow-hidden"
    : "fixed bottom-24 right-6 z-50 flex flex-col w-[440px] h-[640px] rounded-2xl border bg-background shadow-xl overflow-hidden"

  return (
    <>
      {isOpen && (
        <div
          className={`${panelClasses} transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`}
        >
          <ChatHeader onClose={() => setIsOpen(false)} />
          <div
            ref={scrollAreaRef}
            className="flex-1 overflow-y-auto px-4 py-3"
            style={{ overscrollBehavior: "contain" }}
          >
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <MessageBubble
                    message={msg}
                    isThinking={msg.id === activeAssistantId && isStreaming && !msg.content}
                  />
                  {msg.role === "assistant" && msg.suggestions?.length && !isStreaming ? (
                    <DynamicSuggestedChips
                      suggestions={msg.suggestions}
                      onSelect={(q) => handleSend(q)}
                    />
                  ) : null}
                </div>
              ))}
              {isStreaming && messages[messages.length - 1]?.role === "user" && (
                <TypingIndicator />
              )}
              {!hasUserMessages && (
                <SuggestedChips onSelect={(q) => handleSend(q)} />
              )}
              <div aria-hidden />
            </div>
          </div>
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => handleSend()}
            onStop={handleStop}
            isStreaming={isStreaming}
            disabled={isStreaming}
          />
        </div>
      )}
      {!(isMobile && isOpen) && (
        <BubbleButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      )}
    </>
  )
}
