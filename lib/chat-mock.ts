export interface ChatSSEEvent {
  type: "thinking" | "content" | "error" | "done"
  text?: string // thinking: step label | content: full answer | error: message
}

interface CannedResponse {
  pattern: RegExp
  thinkingSteps: string[]
  content: string
}

const CANNED_RESPONSES: CannedResponse[] = [
  {
    pattern: /project|built|portfolio|work/i,
    thinkingSteps: [
      "Searching project database...",
      "Reading project details...",
      "Composing summary...",
    ],
    content:
      "I've built several notable projects! Here are a few highlights:\n\n" +
      "• **AI-powered Trading Bot** — Uses ML models for market analysis and automated trading with a React dashboard.\n\n" +
      "• **Multi-Agent Teams Controller** — A platform for orchestrating multiple AI agents across tmux sessions for collaborative coding.\n\n" +
      "• **This Portfolio Site** — Built with Next.js 15, FastAPI, and features a blog with a custom TipTap editor.\n\n" +
      "Feel free to ask about any of these in more detail!",
  },
  {
    pattern: /ai|experience|machine\s*learning|ml|deep\s*learning/i,
    thinkingSteps: [
      "Searching experience records...",
      "Analyzing AI background...",
    ],
    content:
      "Son has extensive experience in AI and software engineering:\n\n" +
      "• Research in NLP and computer vision at university level\n\n" +
      "• Built production ML pipelines for data analysis and prediction\n\n" +
      "• Developed multi-agent AI systems for task automation\n\n" +
      "• Experience with LLMs, RAG architectures, and prompt engineering\n\n" +
      "He's passionate about applying AI to solve real-world problems.",
  },
  {
    pattern: /blog|write|article|bài|viết/i,
    thinkingSteps: [
      "Looking up blog posts...",
    ],
    content:
      "Yes! Son maintains a blog where he writes about software engineering, AI, and tech insights. " +
      "You can check it out at the /blogs page. Topics range from deep learning experiments to practical dev tips. " +
      "The blog supports both English and Vietnamese! 🇻🇳",
  },
  {
    pattern: /contact|email|reach|hire|connect/i,
    thinkingSteps: [
      "Finding contact information...",
    ],
    content:
      "You can reach Son through several channels:\n\n" +
      "• **Email** — Check the Contact section below\n\n" +
      "• **GitHub** — Active open-source contributions\n\n" +
      "• **LinkedIn** — Professional networking\n\n" +
      "He's always open to interesting collaborations and opportunities!",
  },
  {
    pattern: /tech|stack|tool|language|framework/i,
    thinkingSteps: [
      "Searching skills database...",
      "Reading tech stack details...",
      "Cross-referencing with projects...",
    ],
    content:
      "Here's Son's core tech stack:\n\n" +
      "• **Frontend:** React, Next.js, TypeScript, Tailwind CSS\n\n" +
      "• **Backend:** Python (FastAPI, Django), Node.js\n\n" +
      "• **AI/ML:** PyTorch, LangChain, RAG systems\n\n" +
      "• **DevOps:** Docker, Linux, Cloudflare, systemd\n\n" +
      "• **Databases:** PostgreSQL, SQLite, Redis\n\n" +
      "He's a full-stack developer with a strong AI focus.",
  },
]

const FALLBACK_RESPONSE: CannedResponse = {
  pattern: /.*/,
  thinkingSteps: [
    "Searching knowledge base...",
    "Thinking...",
  ],
  content:
    "That's an interesting question! While I'm currently running in demo mode with limited knowledge, " +
    "the full version of this chat will be connected to Son's AI brain and can answer much more. " +
    "In the meantime, try asking about his projects, tech stack, AI experience, or blog!",
}

function matchResponse(message: string): CannedResponse {
  for (const resp of CANNED_RESPONSES) {
    if (resp.pattern.test(message)) return resp
  }
  return FALLBACK_RESPONSE
}

function randomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function* streamChatResponse(
  message: string,
  signal: AbortSignal
): AsyncGenerator<ChatSSEEvent> {
  const response = matchResponse(message)

  // Phase 1: Thinking — stream tool_call events sentence-by-sentence
  for (const step of response.thinkingSteps) {
    await sleep(randomDelay(400, 900))
    if (signal.aborted) return
    yield { type: "thinking", text: step }
  }

  // Pause before final answer
  await sleep(randomDelay(500, 1000))
  if (signal.aborted) return

  // Phase 2: Final answer — one shot, no streaming
  yield { type: "content", text: response.content }

  if (signal.aborted) return
  yield { type: "done" }
}
