"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import { ResumeForm } from "@/components/ResumeForm";
import {
  ResumeDashboard,
  type ResumeResult,
} from "@/components/resume/ResumeDashboard";
import { PDFPreview } from "@/components/resume/PDFPreview";
import { ResumeHistorySidebar } from "@/components/resume/ResumeHistorySidebar";
import { Button } from "@/components/ui/button";
import { X, RotateCcw, Sparkles, Loader2, FileText, History, Plus, PanelLeft } from "lucide-react";
import { toast } from "sonner";
import { useProtectedRoute } from "@/hooks/protectedRoute";
import { useUserContext } from "@/context/userContext";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";

type HistoryDoc = {
  _id: string;
  role: string;
  jd?: string;
  fileName?: string;
  fileSize?: number;
  atsScore?: number;
  verdict?: string;
  summary?: string;
  result: ResumeResult;
  topFix?: string;
  createdAt: string;
};

export default function Resume() {
  const { user, loading: authLoading } = useUserContext();
  const { loading: guardLoading } = useProtectedRoute();
  const isAuthResolving = authLoading || guardLoading;
  const { setOpen, setOpenMobile, isMobile, toggleSidebar } = useSidebar();

  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<ResumeResult | string | null>(null);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryDoc[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
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

  const fetchHistory = useCallback(async () => {
    if (!user?.id) return;
    setHistoryLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/resumeHistory/user/${user.id}`,
      );
      setHistory(res.data.reviews ?? []);
    } catch {
      // silent
    } finally {
      setHistoryLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthResolving) return;
    if (user?.id) fetchHistory();
    else setHistoryLoading(false);
  }, [user, isAuthResolving, fetchHistory]);

  // auto-close sidebar on mount so analysis is readable full-width. Desktop = collapsed icon, mobile = Sheet closed.
  useEffect(() => {
    if (isAuthResolving) return;
    setOpen(false);
    setOpenMobile(false);
  }, [isAuthResolving, setOpen, setOpenMobile]);

  const saveHistory = async (
    structured: ResumeResult,
    effectiveRole: string,
    f: File | null,
    effectiveJd?: string,
  ) => {
    if (!user?.id) return;
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/resumeHistory`, {
        userId: user.id,
        role: effectiveRole,
        jd: effectiveJd,
        fileName: f?.name,
        fileSize: f?.size,
        result: structured,
      });
      fetchHistory();
    } catch (e) {
      console.error("save history failed", e);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    setActiveHistoryId(null);

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
        let structured: ResumeResult | string = res.data;
        if (res.data.atsScore != null || res.data.keyFixes) {
          structured = { ...res.data, role } as ResumeResult;
        } else if (res.data.output) {
          if (
            typeof res.data.output === "string" &&
            res.data.output.trim().startsWith("{")
          ) {
            try {
              const parsed = JSON.parse(res.data.output);
              structured = { ...parsed, role } as ResumeResult;
            } catch {
              structured = res.data.output;
            }
          } else {
            structured = res.data.output;
          }
        }
        setResult(structured);
        toast.success("Scan complete");
        if (
          typeof structured === "object" &&
          (structured as ResumeResult).atsScore != null
        ) {
          saveHistory(
            structured as ResumeResult,
            role.trim(),
            file,
            effectiveJd,
          );
        }
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || "Scan failed";
      toast.error(msg);
      setResult(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectHistory = (id: string) => {
    const doc = history.find((h) => h._id === id);
    if (!doc) return;
    setActiveHistoryId(id);
    setResult(doc.result as ResumeResult);
    setRole(doc.role);
    setFile(null);
    // auto-close sidebar so the analysis can be read properly
    if (isMobile) setOpenMobile(false);
    else setOpen(false);
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/resumeHistory/${id}`,
      );
      toast.success("Deleted");
      setHistory((prev) => prev.filter((h) => h._id !== id));
      if (activeHistoryId === id) {
        setActiveHistoryId(null);
        setResult(null);
      }
    } catch {
      toast.error("Could not delete");
    }
  };

  const handleNewScan = () => {
    setActiveHistoryId(null);
    setResult(null);
    setFile(null);
    setRole("");
    setJd("");
  };

  const isStructured =
    result &&
    typeof result === "object" &&
    (result as ResumeResult).atsScore != null;
  const isMarkdown = typeof result === "string";
  const activeHistoryDoc = activeHistoryId
    ? history.find((h) => h._id === activeHistoryId)
    : null;

  if (isAuthResolving) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">
          Checking session…
        </span>
      </div>
    );
  }
  if (!user) return null;

  const showHistoryView = !!activeHistoryId && !!activeHistoryDoc;

  return (
    <>
      <ResumeHistorySidebar
        items={history.map((h) => ({
          _id: h._id,
          role: h.role,
          fileName: h.fileName,
          atsScore: h.atsScore ?? (h.result as any)?.atsScore,
          verdict: h.verdict,
          createdAt: h.createdAt,
          topFix: h.topFix,
        }))}
        selectedId={activeHistoryId}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
        loading={historyLoading}
        onNewScan={handleNewScan}
      />
      <SidebarInset>
        {/* Mobile: dedicated history trigger bar — separated from Navbar hamburger */}
        <div className="md:hidden sticky top-14 z-20 flex items-center gap-2 border-b bg-background/80 backdrop-blur-md px-4 py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSidebar()}
            className="gap-2"
            aria-label="Open scan history"
          >
            <PanelLeft className="w-4 h-4" />
            <History className="w-4 h-4" />
            History
            <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs">
              {history.length}
            </span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleNewScan} className="ml-auto gap-1.5">
            <Plus className="w-4 h-4" /> New scan
          </Button>
        </div>
        <div className="flex flex-col p-4 md:p-6 lg:p-8 pt-4 md:pt-8 pb-20 w-full max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="text-center mb-6 pt-4 md:pt-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
              <Sparkles className="w-3.5 h-3.5" /> Resume ATS Lab • private &
              saved
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">
              Make your resume beat the bots
            </h1>
            <p className="text-sm md:text-[15px] text-muted-foreground mt-2 max-w-[60ch] mx-auto leading-relaxed">
              Upload your PDF and get a brutally honest score, page-level
              highlights, and a 30-minute fix list — history is saved so you can
              track progress.
            </p>
            {!showHistoryView &&
              !result &&
              history.length > 0 &&
              !historyLoading && (
                <p className="text-xs text-muted-foreground mt-2">
                  You have {history.length} past scan
                  {history.length !== 1 && "s"} — open the sidebar to revisit
                </p>
              )}
          </div>

          {showHistoryView ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewScan}
                  className="gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> New scan
                </Button>
                <span className="ml-auto text-xs text-muted-foreground hidden sm:inline">
                  {activeHistoryDoc?.fileName ?? "resume.pdf"} •{" "}
                  {activeHistoryDoc?.role} •{" "}
                  {new Date(activeHistoryDoc!.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="grid lg:grid-cols-[420px_1fr] gap-6 items-start">
                <div className="lg:sticky lg:top-[72px] space-y-3">
                  <div className="rounded-xl border bg-muted/30 p-6 text-center">
                    <FileText className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm font-medium">
                      {activeHistoryDoc?.fileName ?? "Original PDF not stored"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      History shows the analysis, not the file. Re-upload to
                      re-scan.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Scanned{" "}
                      {new Date(
                        activeHistoryDoc!.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="min-w-0">
                  <ResumeDashboard
                    data={activeHistoryDoc!.result as ResumeResult}
                    role={activeHistoryDoc!.role}
                    onReset={handleNewScan}
                  />
                </div>
              </div>
            </div>
          ) : !result ? (
            <div className="grid lg:grid-cols-2 gap-6 items-start max-w-5xl mx-auto w-full">
              <div className="order-1 lg:order-1">
                <PDFPreview file={file} url={pdfUrl} />
                {file && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <FileText className="w-4 h-4" /> {file.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setFile(null)}
                    >
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Extracting keywords • checking ATS traps • ~8 sec
                    </p>
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
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResult(null)}
                  className="gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> New scan (keep PDF)
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setResult(null);
                    setFile(null);
                    setRole("");
                    setJd("");
                    setActiveHistoryId(null);
                  }}
                  className="gap-1.5"
                >
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
                      <p className="text-xs font-semibold mb-1.5">
                        Highlights match PDF
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Use the chips in the analysis on the right to jump to
                        sections in your file.
                      </p>
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
                    <ResumeDashboard
                      data={result as ResumeResult}
                      role={role}
                      onReset={() => setResult(null)}
                    />
                  ) : isMarkdown ? (
                    <div className="rounded-xl border bg-card p-6">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {result as string}
                        </pre>
                      </div>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setResult(null)}
                      >
                        Back
                      </Button>
                    </div>
                  ) : (
                    <ResumeDashboard
                      data={result as ResumeResult}
                      role={role}
                      onReset={() => setResult(null)}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </>
  );
}
