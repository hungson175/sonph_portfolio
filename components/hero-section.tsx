import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Github, Facebook, Mail } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-12 md:py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-lg">Hello, I'm</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">Son Pham</h1>
            <p className="text-2xl md:text-3xl text-muted-foreground">Senior Software Engineer</p>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            15+ years of experience spanning AI/ML, LLM applications, and full-stack development. Proven track record
            in leading R&D teams, delivering revenue-impacting solutions, and building scalable platforms.
          </p>

          <div className="flex gap-4 items-center">
            <Button asChild size="lg">
              <Link href="/#contact">Get in Touch</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/blogs">Read My Blog</Link>
            </Button>
          </div>

          <div className="flex gap-4">
            <Button asChild variant="ghost" size="icon">
              <a href="https://github.com/hungson175" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <a href="https://www.facebook.com/pham.hungson.355" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <a href="mailto:sphamhung@gmail.com">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-3xl" />
            <Image
              src="/images/avatar.jpg"
              alt="Son Pham"
              width={500}
              height={500}
              className="relative rounded-2xl object-cover shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
