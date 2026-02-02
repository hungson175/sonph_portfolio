import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { notFound } from "next/navigation"
import { Calendar, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/markdown-renderer"

export const revalidate = 60

const API_BASE = process.env.API_BASE || "http://localhost:17064"

interface BlogRow {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  published: number
  author_id: string | null
  created_at: string
  updated_at: string
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function htmlToMarkdown(html: string): string {
  return html
    // Convert <p>...</p> to lines with double newline
    .replace(/<\/p>\s*<p>/gi, '\n')
    .replace(/<p>/gi, '')
    .replace(/<\/p>/gi, '\n')
    // Convert inline formatting
    .replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<em>([\s\S]*?)<\/em>/gi, '*$1*')
    .replace(/<code>([\s\S]*?)<\/code>/gi, '`$1`')
    // Convert links
    .replace(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    // Convert images
    .replace(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*?)["'][^>]*\/?>/gi, '![$2]($1)')
    .replace(/<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi, '![]($1)')
    // Convert line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    // Strip any remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Decode HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Clean up excessive blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractContentForRendering(content: string): { type: "html" | "markdown" | "mixed"; content: string; images?: string[] } {
  if (!content) return { type: "markdown", content: "" }

  const trimmed = content.trim()

  // Case 1: Content wrapped in <pre><code> (TipTap stored as code block)
  const codeBlockMatch = trimmed.match(/<(?:pre>)?<code[^>]*>([\s\S]*?)<\/code>(?:<\/pre>)?/i)
  if (codeBlockMatch && codeBlockMatch[1]) {
    const codeContent = codeBlockMatch[1]
    if (codeContent.match(/^[\s]*(?:\d+\.|#|graph\s|flowchart\s|sequenceDiagram|>|\*\s|-\s)/m)) {
      const imageMatches = trimmed.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)
      const images: string[] = []
      if (imageMatches) {
        imageMatches.forEach(img => {
          const srcMatch = img.match(/src=["']([^"']+)["']/i)
          if (srcMatch && srcMatch[1]) {
            images.push(srcMatch[1])
          }
        })
      }

      const decoded = decodeHtmlEntities(codeContent)

      if (images.length > 0) {
        return { type: "mixed", content: decoded, images }
      }
      return { type: "markdown", content: decoded }
    }
  }

  // Case 2: Content is <p>-wrapped HTML (TipTap stored as rich text)
  // Convert back to markdown if it looks like markdown was pasted
  if (trimmed.match(/^<p>/i)) {
    const converted = htmlToMarkdown(trimmed)
    // If the converted content has markdown patterns, treat as markdown
    if (converted.match(/^[\s]*(?:#{1,6}\s|```|>\s|\*\s|-\s|\d+\.\s|\|)/m)) {
      return { type: "markdown", content: converted }
    }
  }

  if (trimmed.match(/^<(h[1-6]|div|ul|ol|blockquote)\b/i)) {
    return { type: "html", content: trimmed }
  }

  return { type: "markdown", content: trimmed }
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const textContent = content.replace(/<[^>]*>/g, '').replace(/```[\s\S]*?```/g, '')
  const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const res = await fetch(`${API_BASE}/api/blogs/${slug}`, { next: { revalidate: 60 } })
  if (!res.ok) {
    notFound()
  }
  const blog: BlogRow = await res.json()

  const { type: contentType, content: processedContent, images: contentImages } = extractContentForRendering(blog.content || "")
  const readingTime = calculateReadingTime(blog.content || "")

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="container px-4 md:px-6 py-8 md:py-12 max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-foreground transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{blog.title}</span>
          </nav>

          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 hover:bg-muted">
            <Link href="/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          {blog.cover_image && (
            <div className="aspect-video md:aspect-[2/1] relative overflow-hidden rounded-xl mb-8 shadow-lg">
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <header className="space-y-4 mb-10 pb-8 border-b">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={blog.created_at}>
                  {new Date(blog.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary prose-pre:bg-muted/80 prose-code:before:content-none prose-code:after:content-none">
            {contentImages && contentImages.length > 0 && (
              <div className="not-prose mb-8">
                {contentImages.map((imgSrc, index) => (
                  <div key={index} className="rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={imgSrc}
                      alt={`${blog.title} - Image ${index + 1}`}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            )}
            {contentType === "html" ? (
              <div dangerouslySetInnerHTML={{ __html: processedContent }} />
            ) : (
              <MarkdownRenderer content={processedContent} />
            )}
          </div>

          <div className="mt-12 pt-8 border-t">
            <Button asChild variant="outline" size="sm">
              <Link href="/blogs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all posts
              </Link>
            </Button>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
