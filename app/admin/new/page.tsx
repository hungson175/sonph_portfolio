import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { BlogForm } from "@/components/blog-form"

const API_BASE = process.env.API_BASE || "http://localhost:17064"

export default async function NewBlogPage() {
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

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center">
          <h1 className="text-xl font-bold">Create New Post</h1>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        <BlogForm userId={user.id} />
      </main>
    </div>
  )
}
