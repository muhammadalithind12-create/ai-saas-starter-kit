// Typed client for the public Content Studio API routes.
export interface BlogResult {
  title: string;
  content: string;
  wordCount: number;
  tone: string;
  length: string;
}

export interface SocialResult {
  captions: string[];
  platform: string;
  tone: string;
}

export interface ContentIdea {
  title: string;
  hook: string;
  angle: string;
}

export interface IdeasResult {
  ideas: ContentIdea[];
  niche: string;
  count: number;
}

export class StudioApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    message?: string;
  };
  if (!res.ok) {
    throw new StudioApiError(
      res.status,
      data.error || data.message || "Something went wrong. Please try again.",
    );
  }
  return data as T;
}

export function generateBlog(input: {
  topic: string;
  tone: string;
  length: string;
}): Promise<BlogResult> {
  return postJson<BlogResult>("/api/studio/blog", input);
}

export function generateCaptions(input: {
  topic: string;
  platform: string;
  tone: string;
}): Promise<SocialResult> {
  return postJson<SocialResult>("/api/studio/social", input);
}

export function generateIdeas(input: {
  niche: string;
  count: number;
}): Promise<IdeasResult> {
  return postJson<IdeasResult>("/api/studio/ideas", input);
}

export function studioErrorMessage(err: unknown): string {
  if (err instanceof StudioApiError && err.status === 503) {
    return "AI is not configured on this demo. The site owner needs to set GEMINI_API_KEY.";
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}
