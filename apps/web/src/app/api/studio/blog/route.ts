import { NextRequest, NextResponse } from "next/server";
import { AI_NOT_CONFIGURED, getTextModel } from "@/lib/gemini";

const TONES = ["professional", "casual", "playful", "bold", "educational"] as const;
const LENGTHS = ["short", "medium", "long"] as const;

const LENGTH_GUIDE: Record<string, string> = {
  short: "about 300 words",
  medium: "about 700 words",
  long: "about 1200 words",
};

export async function POST(request: NextRequest) {
  const model = getTextModel();
  if (!model) {
    return NextResponse.json(AI_NOT_CONFIGURED, { status: 503 });
  }

  let body: { topic?: string; tone?: string; length?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const topic = (body.topic || "").trim();
  const tone = TONES.includes(body.tone as (typeof TONES)[number])
    ? body.tone!
    : "professional";
  const length = LENGTHS.includes(body.length as (typeof LENGTHS)[number])
    ? body.length!
    : "medium";

  if (!topic || topic.length < 3) {
    return NextResponse.json(
      { error: "Provide a topic of at least 3 characters" },
      { status: 400 },
    );
  }
  if (topic.length > 300) {
    return NextResponse.json(
      { error: "Topic must be under 300 characters" },
      { status: 400 },
    );
  }

  const prompt = `Write a complete, publish-ready blog post about: "${topic}".

Requirements:
- Tone: ${tone}
- Length: ${LENGTH_GUIDE[length]}
- Start with a compelling SEO-friendly title on its own first line, prefixed with "TITLE: "
- Then the article in Markdown: a strong hook intro, clear H2 sections, short paragraphs, one bulleted takeaway list, and a closing call-to-action
- No placeholder text, no lorem ipsum — write the full article`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const titleMatch = text.match(/^TITLE:\s*(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : topic;
    const content = text.replace(/^TITLE:\s*.+$/m, "").trim();
    const wordCount = content.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({ title, content, wordCount, tone, length });
  } catch (err) {
    console.error("studio/blog generation failed:", err);
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 },
    );
  }
}
