import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { BlogForm } from "@/components/blog-form"

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

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  const blogRes = await fetch(`${API_BASE}/api/admin/blogs/${id}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  })
  if (!blogRes.ok) {
    notFound()
  }
  const blog: BlogRow = await blogRes.json()

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center">
          <h1 className="text-xl font-bold">Edit Post</h1>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        <BlogForm userId={user.id} blog={{
          id: blog.id,
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content || "",
          cover_image: blog.cover_image,
          published: !!blog.published,
        }} />
      </main>
    </div>
  )
}
