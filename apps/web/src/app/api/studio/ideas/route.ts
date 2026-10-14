import { NextRequest, NextResponse } from "next/server";
import { AI_NOT_CONFIGURED, getTextModel } from "@/lib/gemini";

export interface ContentIdea {
  title: string;
  hook: string;
  angle: string;
}

export async function POST(request: NextRequest) {
  const model = getTextModel();
  if (!model) {
    return NextResponse.json(AI_NOT_CONFIGURED, { status: 503 });
  }

  let body: { niche?: string; count?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const niche = (body.niche || "").trim();
  const count = Math.min(Math.max(Number(body.count) || 5, 3), 10);

  if (!niche || niche.length < 2) {
    return NextResponse.json(
      { error: "Provide a niche of at least 2 characters" },
      { status: 400 },
    );
  }
  if (niche.length > 200) {
    return NextResponse.json(
      { error: "Niche must be under 200 characters" },
      { status: 400 },
    );
  }

  const prompt = `Generate ${count} scroll-stopping content ideas for the niche: "${niche}".

For each idea provide:
- "title": a working title (under 12 words)
- "hook": the opening line that grabs attention (under 25 words)
- "angle": one sentence on the unique angle or takeaway

Respond with ONLY a JSON array of objects with keys title, hook, angle. No markdown fences, no commentary.`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });
    const raw = result.response.text().trim();
    const parsed: unknown = JSON.parse(raw);
    const ideas = (Array.isArray(parsed) ? parsed : [])
      .filter(
        (i): i is ContentIdea =>
          typeof i === "object" &&
          i !== null &&
          typeof (i as ContentIdea).title === "string",
      )
      .slice(0, count)
      .map((i) => ({
        title: i.title.trim(),
        hook: (i.hook || "").trim(),
        angle: (i.angle || "").trim(),
      }));

    if (ideas.length === 0) {
      throw new Error("Model returned no ideas");
    }

    return NextResponse.json({ ideas, niche, count: ideas.length });
  } catch (err) {
    console.error("studio/ideas generation failed:", err);
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 },
    );
  }
}
