import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { BlogForm } from "@/components/blog-form"

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: blog, error } = await supabase.from("blogs").select("*").eq("id", id).eq("author_id", user.id).single()

  if (error || !blog) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center">
          <h1 className="text-xl font-bold">Edit Post</h1>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        <BlogForm userId={user.id} blog={blog} />
      </main>
    </div>
  )
}
