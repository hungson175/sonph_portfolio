export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Son Pham. All rights reserved.</p>
        <p className="text-sm text-muted-foreground">Built with Next.js and Supabase</p>
      </div>
    </footer>
  )
}
