import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BlogForm } from "@/components/blog-form"

export default async function NewBlogPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
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
