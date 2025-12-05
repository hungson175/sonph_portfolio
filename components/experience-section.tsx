import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ExperienceSection() {
  const experiences = [
    {
      title: "Senior Tech Lead",
      company: "MoMo",
      period: "2024 - Present",
      description: "Developed LLM-powered applications: deep-research agents, multi-document reasoning, financial advisory systems, and self-improving coding agents.",
      skills: ["LLM", "AI Agents", "Python", "System Architecture", "Langchain"],
    },
    {
      title: "Independent Projects",
      company: "Self-employed",
      period: "2020 - 2024",
      description: "Built autonomous research system (GPT-Researcher architecture), quantitative trading platform with Genetic Algorithms (15% ROI 2023, 8% ROI 2024), customer support chatbot with Langchain+OpenAI, and multi-agent investment advisor using CrewAI.",
      skills: ["Generative AI", "Quantitative Trading", "Langchain", "OpenAI", "CrewAI"],
    },
    {
      title: "Principal Software Engineer",
      company: "VNG",
      period: "2015 - 2020",
      description: "Led R&D team developing AI/Data Mining solutions for Adtima (Zalo), driving 20% annual revenue increase. Engineered image processing tools for Zalo PC using C++/Qt.",
      skills: ["AI/ML", "Data Mining", "C++", "Qt", "Team Leadership"],
    },
    {
      title: "Mobile PM / CEO",
      company: "Various (DTD Mobile, Tosy, FPT, Zing)",
      period: "2012 - 2015",
      description: "CEO at DTD Mobile Vietnam managing Viettel Telecom projects (Qualcomm-sponsored). Led Android development at Tosy Robotics. Delivered Nhacso 2.5 at FPT. Built Zing MP3 Android app (pre-installed on Samsung Galaxy Y Vietnam).",
      skills: ["Android", "Team Leadership", "Product Management", "Mobile Development"],
    },
  ]

  return (
    <section id="experience" className="py-12 md:py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-4 text-center mb-14 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Experience</h2>
          <p className="text-muted-foreground text-lg">My professional journey over the past two decades</p>
        </div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <CardTitle className="text-xl">{exp.title}</CardTitle>
                    <p className="text-muted-foreground">{exp.company}</p>
                  </div>
                  <Badge variant="secondary">{exp.period}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, i) => (
                    <Badge key={i} variant="outline">
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
