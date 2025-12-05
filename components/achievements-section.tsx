import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Medal, Award, Users, Heart } from "lucide-react"

export function AchievementsSection() {
  const achievements = [
    {
      icon: Trophy,
      title: "Zalo AI 2018 Winner",
      description: "1st place in image recognition category",
    },
    {
      icon: Medal,
      title: "NWERC 2006",
      description: "8th place, outperforming Oxford and Cambridge teams",
    },
    {
      icon: Award,
      title: "National Programming Contest",
      description: "2nd prize in Vietnam",
    },
    {
      icon: Users,
      title: "Team Development",
      description: "Mentored 3 engineers who advanced to CTO, EM, and AI R&D Manager roles",
    },
    {
      icon: Heart,
      title: "Vietnam Trifactor 2021",
      description: "9th place finish in triathlon",
    },
  ]

  return (
    <section id="achievements" className="py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-4 text-center mb-14 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Achievements</h2>
          <p className="text-muted-foreground text-lg">Recognition and milestones throughout my career</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item, index) => {
            const Icon = item.icon
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
