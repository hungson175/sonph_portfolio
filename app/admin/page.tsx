import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { PlusCircle, Edit } from "lucide-react"
import { DeleteBlogButton } from "@/components/delete-blog-button"
import { LogoutButton } from "@/components/logout-button"

export const revalidate = 0

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

export default async function AdminPage() {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  const meRes = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  })
  if (!meRes.ok) {
    redirect("/auth/login")
  }
  const user = await meRes.json()
  if (!user?.id) {
    redirect("/auth/login")
  }

  const blogsRes = await fetch(`${API_BASE}/api/admin/blogs`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  })
  const blogs: BlogRow[] = await blogsRes.json()

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Blog Admin</h1>
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/admin/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="space-y-4 mb-6">
          <h2 className="text-2xl font-bold">Your Blog Posts</h2>
          <p className="text-muted-foreground">Manage and edit your blog posts</p>
        </div>

        {blogs.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No blog posts yet</p>
              <Button asChild>
                <Link href="/admin/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Post
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {blogs.length > 0 && (
          <div className="grid gap-4">
            {blogs.map((blog) => (
              <Card key={blog.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{blog.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={blog.published ? "default" : "secondary"}>
                          {blog.published ? "Published" : "Draft"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/edit/${blog.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteBlogButton blogId={blog.id} />
                    </div>
                  </div>
                </CardHeader>
                {blog.excerpt && (
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">{blog.excerpt}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
