"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeHighlight from "rehype-highlight"
import { useEffect, useRef, useState, useCallback, isValidElement, type ReactNode } from "react"
import mermaid from "mermaid"
import { Check, Copy } from "lucide-react"
import "highlight.js/styles/github-dark.css"

// Recursively extract plain text from React children.
// rehype-highlight wraps code content in <span> elements for syntax coloring,
// so String(children) produces "[object Object]". This walks the tree instead.
function extractText(node: ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (node == null || typeof node === "boolean") return ""
  if (Array.isArray(node)) return node.map(extractText).join("")
  if (isValidElement(node)) {
    return extractText(node.props.children)
  }
  return ""
}

// Initialize mermaid with fontFamily to ensure consistent rendering
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  fontFamily: "sans-serif",
})

interface MermaidDiagramProps {
  chart: string
}

function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>("")

  useEffect(() => {
    const renderChart = async () => {
      if (containerRef.current) {
        try {
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
          const { svg } = await mermaid.render(id, chart)
          setSvg(svg)
        } catch (error) {
          console.error("Mermaid render error:", error)
          setSvg(`<pre class="text-red-500">Failed to render diagram</pre>`)
        }
      }
    }
    renderChart()
  }, [chart])

  return (
    <div
      ref={containerRef}
      className="my-6 overflow-x-auto flex justify-center bg-[#0d1117] rounded-lg p-4 border border-border"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

interface CodeBlockProps {
  language: string
  children: string
}

function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [children])

  return (
    <div className="relative group my-6">
      {language && (
        <div className="absolute top-0 left-4 -translate-y-1/2 px-2 py-0.5 bg-muted border border-border rounded text-xs font-mono text-muted-foreground">
          {language}
        </div>
      )}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-muted/80 hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      <pre className="bg-[#0d1117] dark:bg-[#0d1117] rounded-lg p-4 pt-6 overflow-x-auto text-sm border border-border">
        <code className="text-gray-100">{children}</code>
      </pre>
    </div>
  )
}

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        // Heading hierarchy: since page title is h1, markdown headings start from h2
        h1: ({ children }) => (
          <h2 className="text-2xl font-bold mt-10 mb-4 text-balance scroll-mt-20">{children}</h2>
        ),
        h2: ({ children }) => (
          <h3 className="text-xl font-bold mt-8 mb-3 text-balance scroll-mt-20">{children}</h3>
        ),
        h3: ({ children }) => (
          <h4 className="text-lg font-semibold mt-6 mb-2 text-balance scroll-mt-20">{children}</h4>
        ),
        h4: ({ children }) => (
          <h5 className="text-base font-semibold mt-4 mb-2 scroll-mt-20">{children}</h5>
        ),
        // Paragraphs
        p: ({ children }) => (
          <p className="my-4 leading-7 text-foreground/90">{children}</p>
        ),
        // Lists
        ul: ({ children }) => (
          <ul className="list-disc pl-6 my-4 space-y-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 my-4 space-y-2">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-7">{children}</li>
        ),
        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary/50 bg-muted/30 pl-4 pr-4 py-2 my-6 italic text-muted-foreground rounded-r-lg">
            {children}
          </blockquote>
        ),
        // Code blocks - handle mermaid specially
        pre: ({ children }) => {
          return <>{children}</>
        },
        code: ({ className, children }) => {
          const match = /language-(\w+)/.exec(className || "")
          const language = match ? match[1] : ""
          const codeString = extractText(children).replace(/\n$/, "")

          // Handle mermaid diagrams
          if (language === "mermaid") {
            return <MermaidDiagram chart={codeString} />
          }

          const isInline = !className && !codeString.includes('\n')
          if (isInline) {
            return (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">
                {children}
              </code>
            )
          }

          // Block code with copy button and language badge
          return <CodeBlock language={language} children={codeString} />
        },
        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-primary underline underline-offset-2 hover:no-underline font-medium"
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        ),
        // Images
        img: ({ src, alt }) => (
          <figure className="my-6">
            <img
              src={src}
              alt={alt || ""}
              className="rounded-lg max-w-full h-auto shadow-md"
            />
            {alt && (
              <figcaption className="text-center text-sm text-muted-foreground mt-2">
                {alt}
              </figcaption>
            )}
          </figure>
        ),
        // Horizontal rule
        hr: () => <hr className="my-10 border-border" />,
        // Strong/Bold
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto my-6 rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-muted/50">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left text-sm font-semibold">
            {children}
          </th>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-border">{children}</tbody>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-sm">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
