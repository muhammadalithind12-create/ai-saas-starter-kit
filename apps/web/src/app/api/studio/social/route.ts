import { NextRequest, NextResponse } from "next/server";
import { AI_NOT_CONFIGURED, getTextModel } from "@/lib/gemini";

const PLATFORMS = ["twitter", "linkedin", "instagram"] as const;
const TONES = ["professional", "casual", "playful", "bold", "educational"] as const;

const PLATFORM_GUIDE: Record<string, string> = {
  twitter: "punchy, under 280 characters each, 1-2 hashtags",
  linkedin: "insightful and professional, 2-4 short paragraphs, 3-5 hashtags",
  instagram: "visual and engaging with line breaks and emojis, 5-10 hashtags",
};

export async function POST(request: NextRequest) {
  const model = getTextModel();
  if (!model) {
    return NextResponse.json(AI_NOT_CONFIGURED, { status: 503 });
  }

  let body: { topic?: string; platform?: string; tone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const topic = (body.topic || "").trim();
  const platform = PLATFORMS.includes(body.platform as (typeof PLATFORMS)[number])
    ? body.platform!
    : "twitter";
  const tone = TONES.includes(body.tone as (typeof TONES)[number])
    ? body.tone!
    : "casual";

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

  const prompt = `Write 5 ready-to-post social media captions about: "${topic}".

Requirements:
- Platform: ${platform} (${PLATFORM_GUIDE[platform]})
- Tone: ${tone}
- Each caption must be complete, original, and post-ready with hashtags included
- Respond with ONLY a JSON array of 5 strings, no markdown fences, no commentary
- Example: ["caption one #tag", "caption two #tag"]`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });
    const raw = result.response.text().trim();
    const parsed: unknown = JSON.parse(raw);
    const captions = (Array.isArray(parsed) ? parsed : [])
      .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
      .slice(0, 5);

    if (captions.length === 0) {
      throw new Error("Model returned no captions");
    }

    return NextResponse.json({ captions, platform, tone });
  } catch (err) {
    console.error("studio/social generation failed:", err);
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 },
    );
  }
}
