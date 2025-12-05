import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SkillsSection() {
  const skillCategories = [
    {
      category: "Languages",
      skills: ["Python", "Java", "C++", "JavaScript", "TypeScript"],
    },
    {
      category: "AI/ML & LLM",
      skills: ["LLM Applications", "Langchain", "OpenAI", "CrewAI", "Data Mining", "RAG"],
    },
    {
      category: "Frameworks & Tools",
      skills: ["Qt", "Android SDK", "Next.js", "React", "Git", "Docker"],
    },
    {
      category: "Methods & Leadership",
      skills: ["Scrum", "Agile", "R&D Leadership", "System Architecture", "Team Mentoring"],
    },
  ]

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-4 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Skills & Technologies</h2>
          <p className="text-muted-foreground text-lg">Technical expertise across multiple domains</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">{category.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
