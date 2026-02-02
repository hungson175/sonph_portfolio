export interface ChatSSEEvent {
  type: "thinking" | "content" | "content_delta" | "error" | "done" | "suggestions"
  text?: string
  suggestions?: string[]
}

const TOOL_LABELS: Record<string, string> = {
  Read: "Reading files...",
  Glob: "Searching files...",
  Grep: "Searching content...",
  TodoWrite: "Planning...",
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function getSessionId(): string {
  let id = sessionStorage.getItem("chat_session_id")
  if (!id) {
    id = generateId()
    sessionStorage.setItem("chat_session_id", id)
  }
  return id
}

export async function* streamChatResponse(
  message: string,
  signal: AbortSignal
): AsyncGenerator<ChatSSEEvent> {
  let response: Response
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, session_id: getSessionId() }),
      signal,
    })
  } catch {
    yield { type: "error", text: "Network error. Please try again." }
    return
  }

  if (!response.ok) {
    yield { type: "error", text: `Server error (${response.status}). Please try again.` }
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    yield { type: "error", text: "No response body." }
    return
  }

  const decoder = new TextDecoder()
  let buffer = ""

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      const parts = buffer.split("\n\n")
      buffer = parts.pop() ?? ""

      for (const part of parts) {
        const line = part.trim()
        if (!line.startsWith("data: ")) continue

        const json = line.slice(6)
        let parsed: Record<string, any>
        try {
          parsed = JSON.parse(json)
        } catch {
          continue
        }

        switch (parsed.type) {
          case "tool_call":
            yield {
              type: "thinking",
              text: TOOL_LABELS[parsed.name] ?? `Using ${parsed.name}...`,
            }
            break
          case "content":
            yield { type: "content", text: parsed.text }
            break
          case "content_delta":
            yield { type: "content_delta", text: parsed.text }
            break
          case "suggestions":
            yield { type: "suggestions", suggestions: parsed.suggestions }
            break
          case "error":
            yield { type: "error", text: parsed.message ?? "Something went wrong." }
            break
          case "done":
            yield { type: "done" }
            break
        }
      }
    }
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === "AbortError") return
    yield { type: "error", text: "Connection lost. Please try again." }
  } finally {
    reader.releaseLock()
  }
}
