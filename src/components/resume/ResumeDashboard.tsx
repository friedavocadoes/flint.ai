"use client";
import { ATSGauge } from "./ATSGauge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MarkdownViewer from "@/components/markDownViewer";
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Target,
  FileWarning,
  Lightbulb,
  ArrowRight,
  Hash,
  Star,
  Info,
  ExternalLink,
} from "lucide-react";

type Fix = { title: string; desc: string; priority: "high" | "medium" | "low"; where?: string };
type Strength = { title: string; desc: string };
type Breakdown = { label: string; score: number; max: number; feedback: string };

export type ResumeResult = {
  atsScore?: number;
  verdict?: string;
  summary?: string;
  breakdown?: Breakdown[];
  keyFixes?: Fix[];
  strengths?: Strength[] | string[];
  keywordMatch?: { present?: string[]; missing?: string[]; suggestions?: string[] };
  highlights?: { page?: number; section?: string; issue: string }[];
  nextSteps?: string[];
  rawMarkdown?: string;
  output?: string;
  role?: string;
};

function priorityStyles(p: string) {
  if (p === "high") return "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-300";
  if (p === "medium") return "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-300";
  return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-300";
}

export function ResumeDashboard({
  data,
  role,
  onReset,
}: {
  data: ResumeResult;
  role?: string;
  onReset: () => void;
}) {
  const score = data.atsScore ?? 50;
  const isLegacy = !data.breakdown && !!data.output;
  const markdown = data.rawMarkdown || data.output || "";

  if (isLegacy) {
    return (
      <Card>
        <CardContent className="pt-6">
          <MarkdownViewer content={markdown} />
          <Button variant="outline" className="mt-6" onClick={onReset}>
            Analyze another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top hero */}
      <Card className="overflow-hidden border shadow-sm">
        <div className="h-1 w-full bg-gradient-to-r from-primary via-amber-500 to-emerald-500" />
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <ATSGauge score={score} />
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                  ATS Score for {role || data.role || "this role"}
                  <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-muted border">{data.summary ?? "Quick scan"}</span>
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{data.verdict}</p>
              </div>

              {data.breakdown && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {data.breakdown.map((b) => {
                    const pct = Math.round((b.score / b.max) * 100);
                    const bar =
                      pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : pct >= 40 ? "bg-orange-500" : "bg-red-500";
                    return (
                      <div key={b.label} className="rounded-lg border p-2.5 bg-card">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium">{b.label}</span>
                          <span className="text-muted-foreground">
                            {b.score}/{b.max}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1.5">
                          <div className={`h-full ${bar} transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{b.feedback}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highlights strip */}
      {data.highlights && data.highlights.length > 0 && (
        <Card className="border-amber-200/60 bg-amber-50/40 dark:bg-amber-950/10 dark:border-amber-900/50">
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileWarning className="w-4 h-4 text-amber-600" /> Where to fix in your PDF
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {data.highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border bg-background"
                  title={h.issue}
                >
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white grid place-items-center text-[11px] font-bold shrink-0">
                    P{h.page ?? 1}
                  </span>
                  <span className="font-medium">{h.section}</span>
                  <span className="text-muted-foreground hidden sm:inline">— {h.issue}</span>
                </span>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" /> Check the preview on the left — these sections are highlighted for quick edits
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Fixes */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Key Fixes <span className="text-xs font-normal text-muted-foreground">top priorities</span>
            </CardTitle>
            <CardDescription className="text-xs">Do these first — biggest ATS lift</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data.keyFixes ?? []).map((f, i) => (
              <div key={i} className={`rounded-xl border p-3.5 ${priorityStyles(f.priority)}`}>
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-semibold text-sm flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-full bg-background border grid place-items-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    {f.title}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border bg-background font-medium uppercase tracking-wide shrink-0">
                    {f.priority} • {f.where ?? "General"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mt-1.5 opacity-90">{f.desc}</p>
              </div>
            ))}
            {(!data.keyFixes || data.keyFixes.length === 0) && (
              <p className="text-sm text-muted-foreground">No critical fixes — nice work!</p>
            )}
          </CardContent>
        </Card>

        {/* Strengths + Keywords */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {(data.strengths ?? []).map((s: any, i) => {
                const title = typeof s === "string" ? s : s.title;
                const desc = typeof s === "string" ? "" : s.desc;
                return (
                  <div key={i} className="flex gap-2 p-2.5 rounded-lg border bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-200/50 dark:border-emerald-900/50">
                    <Star className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{title}</p>
                      {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Hash className="w-5 h-5 text-primary" /> Keyword Match
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-emerald-700 dark:text-emerald-300 mb-2">Present ✓</p>
                <div className="flex flex-wrap gap-1.5">
                  {(data.keywordMatch?.present ?? []).map((k) => (
                    <span key={k} className="px-2.5 py-1 rounded-full text-xs border bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200">
                      {k}
                    </span>
                  ))}
                  {(data.keywordMatch?.present ?? []).length === 0 && (
                    <span className="text-xs text-muted-foreground">None detected</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-red-700 dark:text-red-300 mb-2">Missing ✗</p>
                <div className="flex flex-wrap gap-1.5">
                  {(data.keywordMatch?.missing ?? []).map((k) => (
                    <span key={k} className="px-2.5 py-1 rounded-full text-xs border bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200">
                      {k}
                    </span>
                  ))}
                  {(data.keywordMatch?.missing ?? []).length === 0 && (
                    <span className="text-xs text-muted-foreground">No gaps</span>
                  )}
                </div>
              </div>
              {data.keywordMatch?.suggestions && data.keywordMatch.suggestions.length > 0 && (
                <div className="rounded-lg bg-muted/40 border p-2.5">
                  <p className="text-xs font-medium flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> How to add
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
        </div>
      </div>

      {/* Verdict + Next steps */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-primary/20 bg-primary/[0.03]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Verdict
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{data.verdict}</p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={onReset}>
                Analyze another
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  const blob = new Blob([data.rawMarkdown || ""], { type: "text/markdown" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `flint-ats-${score}.md`;
                  a.click();
                }}
              >
                <ExternalLink className="w-4 h-4 mr-1" /> Export report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Next 30 minutes
            </CardTitle>
            <CardDescription className="text-xs">Do these now to lift your score by 10+ points</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {(data.nextSteps ?? []).map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 p-2.5 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold shrink-0">
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

      {/* Raw markdown fallback expander */}
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
