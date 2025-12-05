import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Github, Facebook } from "lucide-react"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Get In Touch</h2>
          <p className="text-muted-foreground text-lg">Let's discuss how we can work together</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-6">
              <p className="text-center text-muted-foreground leading-relaxed max-w-2xl">
                I'm always interested in hearing about new opportunities, collaborations, or just having a conversation
                about technology and software engineering.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg">
                  <a href="mailto:sphamhung@gmail.com">
                    <Mail className="mr-2 h-5 w-5" />
                    Email Me
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://github.com/hungson175" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    GitHub
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://www.facebook.com/pham.hungson.355" target="_blank" rel="noopener noreferrer">
                    <Facebook className="mr-2 h-5 w-5" />
                    Facebook
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
