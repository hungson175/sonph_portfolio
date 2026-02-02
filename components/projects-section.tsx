import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Bot, Brain, Search, BookOpen } from "lucide-react"
import Link from "next/link"

export function ProjectsSection() {
  const projects = [
    {
      icon: Bot,
      title: "Autonomous Self-Improving Software Teams",
      description:
        "Multi-agent teams leveraging Claude Code and tmux where AI agents work together autonomously on development sprints with role-based collaboration (PO, SM, Tech Lead, Frontend, Backend, QA).",
      tech: ["Claude Code", "tmux", "Git", "Multi-Agent"],
      link: "https://github.com/hungson175/AI-teams-controller-public",
    },
    {
      icon: Brain,
      title: "Coder-Mem",
      description:
        "Reverse-engineered Claude Code to give it memory capabilities so coding agents can learn and improve themselves over time.",
      tech: ["Claude Code", "Vector DB", "Memory Systems"],
      link: "https://github.com/hungson175/coder-mem",
    },
    {
      icon: Search,
      title: "Deep-Research",
      description:
        "Autonomous research platform that rewrote GPT-Researcher's architecture from LangGraph to LangChain for comprehensive multi-source analysis.",
      tech: ["LangChain", "Python", "AI Agents"],
      link: "https://github.com/hungson175/deep-research-langchain",
    },
    {
      icon: BookOpen,
      title: "AI Coding Agent Memory Guide",
      description:
        "Technical documentation covering memory system implementation for coding agents utilizing vector databases and retrieval patterns.",
      tech: ["Documentation", "Vector DB", "RAG"],
      link: "https://github.com/hungson175/AI-teams-controller-public/blob/master/memory-system/docs/tech/memory_guide_draft_v7.md",
    },
  ]

  return (
    <section id="projects" className="py-12 md:py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-4 text-center mb-14 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Featured Projects</h2>
          <p className="text-muted-foreground text-lg">Open-source tools and research in AI agents and autonomous systems</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => {
            const Icon = project.icon
            return (
              <Link
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full transition-colors group-hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg leading-snug">{project.title}</CardTitle>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t, i) => (
                        <Badge key={i} variant="outline">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
