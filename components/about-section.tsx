import { Card, CardContent } from "@/components/ui/card"
import { Code2, Users, Rocket, Award } from "lucide-react"

export function AboutSection() {
  const highlights = [
    {
      icon: Code2,
      title: "15+ Years Experience",
      description: "Deep expertise in AI/ML, LLM applications, and full-stack development",
    },
    {
      icon: Rocket,
      title: "AI/ML Specialist",
      description: "Building deep-research agents, multi-document reasoning, and coding agents",
    },
    {
      icon: Users,
      title: "Team Leadership",
      description: "Mentored engineers who advanced to CTO, EM, and AI R&D Manager roles",
    },
    {
      icon: Award,
      title: "Award Winner",
      description: "Zalo AI 2018 Winner, NWERC 2006 8th place (beat Oxford & Cambridge)",
    },
  ]

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-4 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">About Me</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A seasoned software engineer with a passion for building innovative solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {highlights.map((item, index) => {
            const Icon = item.icon
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                I'm a Senior Software Engineer with 15+ years of experience spanning AI/ML, LLM applications, and full-stack
                development. My journey has taken me from building scalable platforms (Zing MP3 - pre-installed on Samsung Galaxy Y Vietnam)
                to leading R&D teams that delivered 20% annual revenue growth at Zalo/VNG.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Currently at MoMo as Senior Tech Lead, I'm architecting LLM-powered applications including deep-research agents,
                multi-document reasoning systems, financial advisory platforms, and self-improving coding agents. I hold a B.Sc.
                in Computer Science from University of Saarland, Germany, with focus on Algorithms & Data Structures.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
