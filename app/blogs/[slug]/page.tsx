import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { notFound } from "next/navigation"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/markdown-renderer"

export const revalidate = 60

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

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="container py-12 md:py-16 max-w-4xl">
          <Button asChild variant="ghost" className="mb-8">
            <Link href="/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          {blog.cover_image && (
            <div className="aspect-video relative overflow-hidden rounded-lg mb-8">
              <img
                src={blog.cover_image || "/placeholder.svg"}
                alt={blog.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <div className="space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">{blog.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <time dateTime={blog.created_at}>
                {new Date(blog.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {/* Check if content is HTML (starts with <p>, <h, <div, <ul, <ol) or Markdown */}
            {blog.content?.trim().match(/^<(p|h[1-6]|div|ul|ol|blockquote)\b/i) ? (
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            ) : (
              <MarkdownRenderer content={blog.content || ""} />
            )}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
