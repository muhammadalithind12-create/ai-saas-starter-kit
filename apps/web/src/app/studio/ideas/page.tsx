"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Lightbulb, Loader2, Quote } from "lucide-react";
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
  generateIdeas,
  studioErrorMessage,
  type IdeasResult,
} from "@/lib/studio-client";
import { CopyButton } from "../_components/copy-button";

const COUNTS = [3, 5, 8, 10];

export default function IdeaEnginePage() {
  const [niche, setNiche] = useState("");
  const [count, setCount] = useState("5");

  const mutation = useMutation({
    mutationFn: () =>
      generateIdeas({ niche: niche.trim(), count: Number(count) }),
  });

  const result: IdeasResult | undefined = mutation.data;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-3xl font-bold tracking-tight">
          <Lightbulb className="h-7 w-7 text-primary" /> Idea Engine
        </h1>
        <p className="mt-2 text-muted-foreground">
          Scroll-stopping content ideas for any niche — each with a hook and an
          angle.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
            <div className="space-y-2">
              <Label htmlFor="niche">Niche</Label>
              <Input
                id="niche"
                placeholder="e.g. Productivity for remote teams"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label>Ideas</Label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTS.map((c) => (
                    <SelectItem key={c} value={String(c)}>
                      {c} ideas
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || niche.trim().length < 2}
            className="w-full sm:w-auto"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Generate ideas
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
        <div className="space-y-3">
          {result.ideas.map((idea, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-base leading-snug">
                    {i + 1}. {idea.title}
                  </CardTitle>
                  <CopyButton
                    text={`${idea.title}\n\nHook: ${idea.hook}\nAngle: ${idea.angle}`}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex gap-2 text-muted-foreground">
                  <Quote className="h-4 w-4 shrink-0 text-primary" />
                  <span className="italic">{idea.hook}</span>
                </p>
                <p>
                  <span className="font-medium">Angle: </span>
                  <span className="text-muted-foreground">{idea.angle}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
