"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Hash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  generateCaptions,
  studioErrorMessage,
  type SocialResult,
} from "@/lib/studio-client";
import { CopyButton } from "../_components/copy-button";

const PLATFORMS = [
  { value: "twitter", label: "X (Twitter)" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
];
const TONES = ["professional", "casual", "playful", "bold", "educational"];

export default function SocialCaptionsPage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const [tone, setTone] = useState("casual");

  const mutation = useMutation({
    mutationFn: () => generateCaptions({ topic: topic.trim(), platform, tone }),
  });

  const result: SocialResult | undefined = mutation.data;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-3xl font-bold tracking-tight">
          <Hash className="h-7 w-7 text-primary" /> Social Captions
        </h1>
        <p className="mt-2 text-muted-foreground">
          Five ready-to-post captions, tuned to each platform&apos;s style.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g. Our new AI scheduling feature just launched"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              maxLength={300}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          </div>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || topic.trim().length < 3}
            className="w-full sm:w-auto"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Generate captions
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
          {result.captions.map((caption, i) => (
            <Card key={i}>
              <CardContent className="flex items-start justify-between gap-4 pt-5">
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
                  {caption}
                </p>
                <CopyButton text={caption} label="Copy" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
