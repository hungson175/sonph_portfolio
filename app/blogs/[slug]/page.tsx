import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { notFound } from "next/navigation"
import { Calendar, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/markdown-renderer"

export const revalidate = 60

function extractContentForRendering(content: string): { type: "html" | "markdown" | "mixed"; content: string; images?: string[] } {
  if (!content) return { type: "markdown", content: "" }

  const trimmed = content.trim()

  // Check if it's HTML that wraps markdown in code blocks
  // Pattern: <p>...</p><pre><code>...markdown...</code></pre> or similar
  const codeBlockMatch = trimmed.match(/<(?:pre>)?<code[^>]*>([\s\S]*?)<\/code>(?:<\/pre>)?/i)
  if (codeBlockMatch && codeBlockMatch[1]) {
    const codeContent = codeBlockMatch[1]
    // If the code block contains markdown-like content (headers, lists, mermaid)
    if (codeContent.match(/^[\s]*(?:\d+\.|#|graph\s|flowchart\s|sequenceDiagram|>|\*\s|-\s)/m)) {
      // Extract any images from the HTML before the code block
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

      // Decode HTML entities in the markdown content
      const decoded = codeContent
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")

      if (images.length > 0) {
        return { type: "mixed", content: decoded, images }
      }
      return { type: "markdown", content: decoded }
    }
  }

  // Check if it's pure HTML (starts with common HTML tags)
  if (trimmed.match(/^<(p|h[1-6]|div|ul|ol|blockquote)\b/i)) {
    return { type: "html", content: trimmed }
  }

  // Default to markdown
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
  const supabase = await createClient()

  const { data: blog, error } = await supabase.from("blogs").select("*").eq("slug", slug).eq("published", true).single()

  if (error || !blog) {
    notFound()
  }

  const { type: contentType, content: processedContent, images: contentImages } = extractContentForRendering(blog.content || "")
  const readingTime = calculateReadingTime(blog.content || "")

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="container px-4 md:px-6 py-8 md:py-12 max-w-4xl mx-auto">
          {/* Breadcrumb navigation */}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
            {/* Display embedded images from content if present */}
            {contentImages && contentImages.length > 0 && (
              <div className="not-prose mb-8">
                {contentImages.map((imgSrc, index) => (
                  <div key={index} className="rounded-xl overflow-hidden shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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

          {/* Bottom navigation */}
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
