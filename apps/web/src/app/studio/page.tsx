import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Lightbulb,
  MessagesSquare,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { APP_DESCRIPTION, APP_TAGLINE } from "@/lib/app-config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TOOLS = [
  {
    href: "/studio/blog",
    icon: FileText,
    title: "Blog Writer",
    description:
      "Full SEO-friendly blog posts from a single topic. Pick a tone and length — get a publish-ready draft.",
  },
  {
    href: "/studio/social",
    icon: MessagesSquare,
    title: "Social Captions",
    description:
      "Five ready-to-post captions for X, LinkedIn, or Instagram, tuned to each platform's style.",
  },
  {
    href: "/studio/ideas",
    icon: Lightbulb,
    title: "Idea Engine",
    description:
      "Scroll-stopping content ideas for any niche, each with a hook and a unique angle.",
  },
];

const HIGHLIGHTS = [
  {
    icon: Zap,
    title: "Instant output",
    description: "Type a topic, get finished copy in seconds.",
  },
  {
    icon: Timer,
    title: "No signup",
    description: "The whole Studio is free to try — no account needed.",
  },
  {
    icon: Sparkles,
    title: "Platform-tuned",
    description: "Captions shaped for each network's format and audience.",
  },
];

export default function StudioPage() {
  return (
    <div className="space-y-14">
      <section className="mx-auto max-w-2xl pt-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {APP_TAGLINE}
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Content Studio
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{APP_DESCRIPTION}</p>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        {TOOLS.map((tool) => (
          <Card key={tool.href} className="flex flex-col transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <tool.icon className="h-5 w-5" />
              </div>
              <CardTitle>{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-2">
              <Button asChild className="w-full">
                <Link href={tool.href}>
                  Open tool <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        {HIGHLIGHTS.map((h) => (
          <div key={h.title} className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <h.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">{h.title}</p>
              <p className="text-sm text-muted-foreground">{h.description}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
