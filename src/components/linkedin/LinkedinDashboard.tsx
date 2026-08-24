"use client";
import { ATSGauge } from "@/components/resume/ATSGauge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MarkdownViewer from "@/components/markDownViewer";
import { toast } from "sonner";
import {
  Sparkles,
  Target,
  FileWarning,
  Lightbulb,
  ArrowRight,
  Hash,
  Copy,
  Check,
  Wand2,
  Quote,
  ListChecks,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";

export type LinkedinResult = {
  overallScore?: number;
  headlineScore?: number;
  aboutScore?: number;
  experienceScore?: number;
  verdict?: string;
  summary?: string;
  breakdown?: { label: string; score: number; max: number; feedback: string }[];
  optimized?: {
    headline: string;
    about: string;
    experienceBullets: string[];
    bannerSuggestion?: string;
  };
  keywordMatch?: {
    present?: string[];
    missing?: string[];
    suggestions?: string[];
  };
  improvements?: {
    section: string;
    before: string;
    after: string;
    why: string;
  }[];
  highlights?: { section: string; issue: string }[];
  nextSteps?: string[];
  rawMarkdown?: string;
  output?: string;
};

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(label ? `${label} copied` : "Copied");
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 text-xs gap-1.5"
      onClick={onCopy}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

export function LinkedinDashboard({
  data,
  role,
  onReset,
}: {
  data: LinkedinResult;
  role?: string;
  onReset: () => void;
}) {
  const score = data.overallScore ?? 50;
  const markdown = data.rawMarkdown || data.output || "";
  const isLegacy = !data.optimized && !!markdown;

  if (isLegacy) {
    return (
      <Card>
        <CardContent className="pt-6">
          <MarkdownViewer content={markdown} />
          <Button variant="outline" className="mt-6" onClick={onReset}>
            Optimize another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top hero */}
      <Card className="overflow-hidden border shadow-sm">
        <div className="h-1 w-full bg-gradient-to-r from-[#0a66c2] via-sky-500 to-violet-500" />
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <ATSGauge score={score} />
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  LinkedIn score for {role || "this role"}
                </h2>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2.5 py-1 rounded-full bg-muted border">
                    Headline {data.headlineScore ?? "—"}/100
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-muted border">
                    About {data.aboutScore ?? "—"}/100
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-muted border">
                    Experience {data.experienceScore ?? "—"}/100
                  </span>
                </div>
                {data.summary && (
                  <div className="mt-3 inline-flex max-w-full items-start gap-2 px-3 py-2 rounded-lg bg-[#0a66c2]/5 border border-[#0a66c2]/20 text-sm leading-relaxed">
                    <Sparkles className="w-4 h-4 text-[#0a66c2] mt-0.5 shrink-0" />
                    <span className="break-words">{data.summary}</span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {data.verdict}
                </p>
              </div>

              {data.breakdown && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {data.breakdown.map((b) => {
                    const pct = Math.round((b.score / b.max) * 100);
                    const bar =
                      pct >= 80
                        ? "bg-emerald-500"
                        : pct >= 60
                          ? "bg-amber-500"
                          : pct >= 40
                            ? "bg-orange-500"
                            : "bg-red-500";
                    return (
                      <div
                        key={b.label}
                        className="rounded-lg border p-2.5 bg-card"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium">{b.label}</span>
                          <span className="text-muted-foreground">
                            {b.score}/{b.max}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1.5">
                          <div
                            className={`h-full ${bar} transition-all`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                          {b.feedback}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highlights */}
      {data.highlights && data.highlights.length > 0 && (
        <Card className="border-amber-200/60 bg-amber-50/40 dark:bg-amber-950/10 dark:border-amber-900/50">
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileWarning className="w-4 h-4 text-amber-600" /> Fix these first
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {data.highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border bg-background"
                >
                  <span className="font-medium">{h.section}</span>
                  <span className="text-muted-foreground hidden sm:inline">
                    — {h.issue}
                  </span>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimized sections */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 justify-between">
                <span className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-[#0a66c2]" /> Optimized
                  Headline
                </span>
                {data.optimized?.headline && (
                  <CopyButton text={data.optimized.headline} label="Headline" />
                )}
              </CardTitle>
              <CardDescription className="text-xs">
                220 chars max — paste as-is. Keywords front-loaded for search.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-[#0a66c2]/[0.04] p-4">
                <p className="text-[15px] leading-relaxed font-medium">
                  {data.optimized?.headline}
                </p>
                <p className="text-[11px] text-muted-foreground mt-2">
                  {data.optimized?.headline?.length ?? 0} chars • ideal 180–220
                </p>
              </div>
              {data.optimized?.bannerSuggestion && (
                <div className="mt-3 rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs font-semibold">Banner idea</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.optimized.bannerSuggestion}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 justify-between">
                <span className="flex items-center gap-2">
                  <Quote className="w-5 h-5 text-violet-600" /> Optimized About
                </span>
                {data.optimized?.about && (
                  <CopyButton text={data.optimized.about} label="About" />
                )}
              </CardTitle>
              <CardDescription className="text-xs">
                First-person • 3–4 paras • recruiter skims in 8 sec
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-card p-4 whitespace-pre-wrap text-sm leading-relaxed">
                {data.optimized?.about}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                {data.optimized?.about?.length ?? 0} chars • aim 900–1100 • keep
                line breaks as is
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 justify-between">
                <span className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-emerald-600" /> Experience
                  bullets — copy-ready
                </span>
                {data.optimized?.experienceBullets && (
                  <CopyButton
                    text={data.optimized.experienceBullets.join("\n• ")}
                    label="Bullets"
                  />
                )}
              </CardTitle>
              <CardDescription className="text-xs">
                STAR + metrics • result first • verbs: Built/Shipped/Led
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {(data.optimized?.experienceBullets ?? []).map((b, i) => (
                <div
                  key={i}
                  className="group relative rounded-xl border p-3.5 bg-card hover:bg-muted/20 transition-colors"
                >
                  <p className="text-sm leading-relaxed pr-10">
                    {b.startsWith("•") ? b : `• ${b}`}
                  </p>
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={b} />
                  </div>
                </div>
              ))}
              <p className="text-[11px] text-muted-foreground pt-2">
                Tip: Replace top 3 bullets in your latest experience with these
                — keep older roles brief.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Hash className="w-5 h-5 text-[#0a66c2]" /> Keyword Match
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-emerald-700 dark:text-emerald-300 mb-2">
                  Present ✓
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(data.keywordMatch?.present ?? []).map((k) => (
                    <span
                      key={k}
                      className="px-2.5 py-1 rounded-full text-xs border bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200"
                    >
                      {k}
                    </span>
                  ))}
                  {(data.keywordMatch?.present ?? []).length === 0 && (
                    <span className="text-xs text-muted-foreground">
                      None detected
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-red-700 dark:text-red-300 mb-2">
                  Missing ✗
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(data.keywordMatch?.missing ?? []).map((k) => (
                    <span
                      key={k}
                      className="px-2.5 py-1 rounded-full text-xs border bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200"
                    >
                      {k}
                    </span>
                  ))}
                  {(data.keywordMatch?.missing ?? []).length === 0 && (
                    <span className="text-xs text-muted-foreground">
                      No gaps
                    </span>
                  )}
                </div>
              </div>
              {data.keywordMatch?.suggestions &&
                data.keywordMatch.suggestions.length > 0 && (
                  <div className="rounded-lg bg-muted/40 border p-2.5">
                    <p className="text-xs font-medium flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> How
                      to add
                    </p>
                    <ul className="text-xs text-muted-foreground list-disc pl-4 mt-1 space-y-1">
                      {data.keywordMatch.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-primary" /> Before → After
              </CardTitle>
              <CardDescription className="text-xs">
                Why each change ranks higher
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(data.improvements ?? []).map((imp, i) => (
                <div key={i} className="rounded-xl border p-3 bg-card">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {imp.section}
                  </p>
                  <p className="text-xs mt-1 line-through text-muted-foreground/70">
                    "{imp.before}"
                  </p>
                  <p className="text-sm mt-1 font-medium text-emerald-700 dark:text-emerald-300">
                    "{imp.after}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {imp.why}
                  </p>
                </div>
              ))}
              {(!data.improvements || data.improvements.length === 0) && (
                <p className="text-xs text-muted-foreground">
                  No before/after — your input was blank, so we drafted from
                  scratch.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Verdict + Next steps */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-[#0a66c2]/20 bg-[#0a66c2]/[0.03]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-[#0a66c2]" /> Verdict
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{data.verdict}</p>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Button variant="outline" onClick={onReset}>
                Optimize another
              </Button>
              <Button
                variant="default"
                className="bg-[#0a66c2] hover:bg-[#0959a9]"
                onClick={() => {
                  const blob = new Blob(
                    [data.rawMarkdown || JSON.stringify(data, null, 2)],
                    { type: "text/markdown" },
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `flint-linkedin-${score}.md`;
                  a.click();
                }}
              >
                Export markdown
              </Button>
              <Button
                variant="secondary"
                onClick={async () => {
                  const txt = `HEADLINE:\n${data.optimized?.headline}\n\nABOUT:\n${data.optimized?.about}\n\nBULLETS:\n${(data.optimized?.experienceBullets ?? []).join("\n")}`;
                  await navigator.clipboard.writeText(txt);
                  toast.success("All copied");
                }}
              >
                <Copy className="w-4 h-4 mr-1" /> Copy all
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Ship in 15 minutes
            </CardTitle>
            <CardDescription className="text-xs">
              Do these now — profile views lift in 24–48h
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {(data.nextSteps ?? []).map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 p-2.5 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-[#0a66c2] text-white grid place-items-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm flex-1">{step}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {markdown && (
        <details className="rounded-xl border bg-card">
          <summary className="px-4 py-3 text-sm font-medium cursor-pointer flex items-center gap-2">
            <FileWarning className="w-4 h-4" /> View raw markdown report
          </summary>
          <div className="px-4 pb-4">
            <MarkdownViewer content={markdown} />
          </div>
        </details>
      )}
    </div>
  );
}
