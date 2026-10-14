"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  generateBlog,
  studioErrorMessage,
  type BlogResult,
} from "@/lib/studio-client";
import { CopyButton } from "../_components/copy-button";
import { MarkdownText } from "../_components/markdown-text";

const TONES = ["professional", "casual", "playful", "bold", "educational"];
const LENGTHS = [
  { value: "short", label: "Short (~300 words)" },
  { value: "medium", label: "Medium (~700 words)" },
  { value: "long", label: "Long (~1200 words)" },
];

export default function BlogWriterPage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");

  const mutation = useMutation({
    mutationFn: () => generateBlog({ topic: topic.trim(), tone, length }),
  });

  const result: BlogResult | undefined = mutation.data;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-3xl font-bold tracking-tight">
          <FileText className="h-7 w-7 text-primary" /> Blog Writer
        </h1>
        <p className="mt-2 text-muted-foreground">
          Describe your topic — get a complete, publish-ready blog post.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g. How small teams can ship faster with AI"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              maxLength={300}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LENGTHS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || topic.trim().length < 3}
            className="w-full sm:w-auto"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Write my blog post
          </Button>
          {mutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {studioErrorMessage(mutation.error)}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl">{result.title}</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                {result.wordCount} words · {result.tone} tone
              </p>
            </div>
            <CopyButton text={`# ${result.title}\n\n${result.content}`} />
          </CardHeader>
          <CardContent>
            <MarkdownText text={result.content} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
