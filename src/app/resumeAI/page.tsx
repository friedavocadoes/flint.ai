"use client";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { ResumeForm } from "@/components/ResumeForm";
import { ResumeDashboard, type ResumeResult } from "@/components/resume/ResumeDashboard";
import { PDFPreview } from "@/components/resume/PDFPreview";
import { Button } from "@/components/ui/button";
import { X, RotateCcw, Sparkles, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

export default function Resume() {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<ResumeResult | string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ file: boolean; role: boolean }>({
    file: false,
    role: false,
  });

  const pdfUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  // keep jd from ResumeForm's internal state (via global hack) in sync if needed
  // ResumeForm now manages its own jdLocal, but we also capture via window? Instead we read from form's _jd
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // try to read jd from form element if ResumeForm attached it
    const maybeJd = (e.currentTarget as any)._jd as string | undefined;
    const effectiveJd = maybeJd ?? jd;

    setErrors({ file: false, role: false });
    if (!file || !role.trim()) {
      toast.warning("Check if all fields filled!");
      if (!file) setErrors((prev) => ({ ...prev, file: true }));
      if (!role.trim()) setErrors((prev) => ({ ...prev, role: true }));
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role.trim());
    if (effectiveJd?.trim()) formData.append("jd", effectiveJd.trim());

    try {
      const res = await axios.post("/api/resume", formData);
      if (res.data.error) {
        toast.error(res.data.error);
        setResult(`Error: ${res.data.error}`);
      } else {
        // structured JSON path: res.data has atsScore etc, plus output fallback
        if (res.data.atsScore != null || res.data.keyFixes) {
          const structured: ResumeResult = { ...res.data, role };
          setResult(structured);
        } else if (res.data.output) {
          // fallback markdown
          if (typeof res.data.output === "string" && res.data.output.trim().startsWith("{")) {
            try {
              const parsed = JSON.parse(res.data.output);
              setResult({ ...parsed, role });
            } catch {
              setResult(res.data.output);
            }
          } else {
            setResult(res.data.output);
          }
        } else {
          setResult(res.data);
        }
        toast.success("Scan complete");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || "Scan failed";
      toast.error(msg);
      setResult(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  const isStructured = result && typeof result === "object" && (result as ResumeResult).atsScore != null;
  const isMarkdown = typeof result === "string";

  const reset = () => {
    setResult(null);
    // keep file and role for quick re-scan, or clear? keep file preview
  };

  const clearAll = () => {
    setResult(null);
    setFile(null);
    setRole("");
    setJd("");
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 mt-14 md:mt-18 mb-16">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
          <Sparkles className="w-3.5 h-3.5" /> Resume ATS Lab • private scan
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">Make your resume beat the bots</h1>
        <p className="text-sm md:text-[15px] text-muted-foreground mt-2 max-w-[60ch] mx-auto leading-relaxed">
          Upload your PDF and get a brutally honest score, page-level highlights, and a 30-minute fix list — with your PDF right beside the analysis.
        </p>
      </div>

      {!result ? (
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div className="order-1 lg:order-1">
            <PDFPreview file={file} url={pdfUrl} />
            {file && (
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> {file.name}
                </span>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setFile(null)}>
                  <X className="w-3.5 h-3.5 mr-1" /> Remove
                </Button>
              </div>
            )}
          </div>

          <div className="order-2 lg:order-2">
            {loading ? (
              <div className="rounded-xl border bg-card p-8 flex flex-col items-center justify-center min-h-[420px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                <p className="text-sm font-medium">Scanning your PDF…</p>
                <p className="text-xs text-muted-foreground mt-1">Extracting keywords • checking ATS traps • ~8 sec</p>
                <div className="w-full max-w-sm h-1.5 bg-muted rounded-full overflow-hidden mt-6">
                  <div className="h-full w-full bg-gradient-to-r from-primary via-amber-500 to-primary animate-pulse" />
                </div>
              </div>
            ) : (
              <ResumeForm
                setFile={setFile}
                file={file}
                onSubmit={handleSubmit}
                setRole={setRole}
                role={role}
                errors={errors}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top action bar */}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={reset} className="gap-1.5">
              <RotateCcw className="w-4 h-4" /> New scan (keep PDF)
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1.5">
              <X className="w-4 h-4" /> Clear all
            </Button>
            <span className="ml-auto text-xs text-muted-foreground hidden sm:inline">
              {file?.name ?? "PDF"} • {role}
            </span>
          </div>

          <div className="grid lg:grid-cols-[420px_1fr] gap-6 items-start">
            <div className="lg:sticky lg:top-[72px] space-y-3">
              <PDFPreview file={file} url={pdfUrl} />
              {isStructured && (result as ResumeResult).highlights && (
                <div className="hidden lg:block rounded-xl border bg-amber-50/50 dark:bg-amber-950/10 p-3">
                  <p className="text-xs font-semibold mb-1.5">Highlights match PDF</p>
                  <p className="text-xs text-muted-foreground">Use the chips in the analysis on the right to jump to sections in your file. No auto-annotation — just precise pointers.</p>
                </div>
              )}
            </div>

            <div className="min-w-0">
              {loading ? (
                <div className="rounded-xl border bg-card p-8 flex flex-col items-center justify-center min-h-[420px]">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                  <p className="text-sm font-medium">Re-scanning…</p>
                </div>
              ) : isStructured ? (
                <ResumeDashboard data={result as ResumeResult} role={role} onReset={reset} />
              ) : isMarkdown ? (
                <div className="rounded-xl border bg-card p-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{result as string}</pre>
                  </div>
                  <Button variant="outline" className="mt-4" onClick={reset}>
                    Back
                  </Button>
                </div>
              ) : (
                <ResumeDashboard data={result as ResumeResult} role={role} onReset={reset} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
