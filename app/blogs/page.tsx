import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { Calendar } from "lucide-react"

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

export default async function BlogsPage() {
  const res = await fetch(`${API_BASE}/api/blogs`, { next: { revalidate: 60 } })
  const blogs: BlogRow[] = await res.json()

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 pb-16">
        <div className="container px-4 md:px-6 py-12 md:py-20">
          <div className="space-y-4 text-center mb-14 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Blog</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Thoughts on software engineering, AI/ML, and technology
            </p>
          </div>

          {blogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
            </div>
          )}

          {blogs.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blogs/${blog.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {blog.cover_image && (
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={blog.cover_image || "/placeholder.svg"}
                          alt={blog.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-balance text-xl">{blog.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(blog.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </CardHeader>
                    {blog.excerpt && (
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
