"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  LinkedinForm,
  type LinkedinFormValues,
} from "@/components/linkedin/LinkedinForm";
import {
  LinkedinDashboard,
  type LinkedinResult,
} from "@/components/linkedin/LinkedinDashboard";
import { LinkedinHistorySidebar } from "@/components/linkedin/LinkedinHistorySidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { useProtectedRoute } from "@/hooks/protectedRoute";
import { useUserContext } from "@/context/userContext";
import { Loader2, Sparkles, RotateCcw, X } from "lucide-react";

type HistoryDoc = {
  _id: string;
  targetRole: string;
  targetCompanies?: string;
  overallScore?: number;
  headlineScore?: number;
  result: LinkedinResult;
  topTip?: string;
  createdAt: string;
  inputs?: any;
};

export default function LinkedinPage() {
  const { user, loading: authLoading } = useUserContext();
  const { loading: guardLoading } = useProtectedRoute();
  const isAuthResolving = authLoading || guardLoading;

  const [values, setValues] = useState<LinkedinFormValues>({
    targetRole: "",
    targetCompanies: "",
    currentHeadline: "",
    currentAbout: "",
    currentExperience: "",
    tone: "professional",
    keywords: "",
  });
  const [result, setResult] = useState<LinkedinResult | null>(null);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryDoc[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [errors, setErrors] = useState<{ targetRole: boolean }>({
    targetRole: false,
  });

  const fetchHistory = useCallback(async () => {
    if (!user?.id) return;
    setHistoryLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/linkedinHistory/user/${user.id}`,
      );
      setHistory(res.data.reviews ?? []);
    } catch {
      // silent - backend may not be running in dev without mongo
    } finally {
      setHistoryLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthResolving) return;
    if (user?.id) fetchHistory();
    else setHistoryLoading(false);
  }, [user, isAuthResolving, fetchHistory]);

  const saveHistory = async (structured: LinkedinResult) => {
    if (!user?.id) return;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/linkedinHistory`,
        {
          userId: user.id,
          targetRole: values.targetRole.trim(),
          targetCompanies: values.targetCompanies.trim(),
          tone: values.tone,
          inputs: {
            headline: values.currentHeadline,
            about: values.currentAbout,
            experience: values.currentExperience,
            keywords: values.keywords,
          },
          result: structured,
        },
      );
      fetchHistory();
    } catch (e) {
      console.error("save history failed", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ targetRole: false });
    if (!values.targetRole.trim()) {
      toast.warning("Enter a target role");
      setErrors({ targetRole: true });
      return;
    }
    setLoading(true);
    setResult(null);
    setActiveHistoryId(null);
    try {
      const res = await axios.post("/api/linkedin", {
        targetRole: values.targetRole.trim(),
        targetCompanies: values.targetCompanies.trim(),
        currentHeadline: values.currentHeadline.trim(),
        currentAbout: values.currentAbout.trim(),
        currentExperience: values.currentExperience.trim(),
        tone: values.tone,
        keywords: values.keywords.trim(),
      });
      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }
      let structured: LinkedinResult = res.data;
      // if response is wrapped with output fallback, try parse
      if (res.data.output && !res.data.optimized) {
        try {
          const maybe =
            typeof res.data.output === "string"
              ? JSON.parse(res.data.output)
              : res.data.output;
          if (maybe.optimized) structured = maybe;
        } catch {
          // keep as is
        }
      }
      setResult(structured);
      toast.success("LinkedIn optimized — copy-paste ready");
      if (structured.overallScore != null || structured.optimized) {
        saveHistory(structured);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err.message || "Optimization failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (id: string) => {
    const doc = history.find((h) => h._id === id);
    if (!doc) return;
    setActiveHistoryId(id);
    setResult(doc.result as LinkedinResult);
    setValues((prev: LinkedinFormValues) => ({
      ...prev,
      targetRole: doc.targetRole,
      targetCompanies: doc.targetCompanies || "",
    }));
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/linkedinHistory/${id}`,
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

  const handleNew = () => {
    setActiveHistoryId(null);
    setResult(null);
  };

  const clearAll = () => {
    setActiveHistoryId(null);
    setResult(null);
    setValues({
      targetRole: "",
      targetCompanies: "",
      currentHeadline: "",
      currentAbout: "",
      currentExperience: "",
      tone: "professional",
      keywords: "",
    });
  };

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

  const showHistoryView =
    !!activeHistoryId && !!history.find((h) => h._id === activeHistoryId);
  const activeHistoryDoc = activeHistoryId
    ? history.find((h) => h._id === activeHistoryId)
    : null;

  return (
    <>
      <LinkedinHistorySidebar
        items={history.map((h) => ({
          _id: h._id,
          targetRole: h.targetRole,
          targetCompanies: h.targetCompanies,
          overallScore: h.overallScore ?? (h.result as any)?.overallScore,
          createdAt: h.createdAt,
          topTip: h.topTip,
        }))}
        selectedId={activeHistoryId}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
        loading={historyLoading}
        onNew={handleNew}
      />
      <SidebarInset>
        <div className="flex flex-col p-4 md:p-6 lg:p-8 pt-8 pb-20 w-full max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="text-center mb-6 pt-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a66c2]/10 border border-[#0a66c2]/20 text-xs font-medium text-[#0a66c2]">
              <Sparkles className="w-3.5 h-3.5" /> LinkedIn Optimizer •
              recruiter-magnet
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">
              Stop being invisible to recruiters
            </h1>
            <p className="text-sm md:text-[15px] text-muted-foreground mt-2 max-w-[62ch] mx-auto leading-relaxed">
              Your headline decides if you show up in search. Your About decides
              if they DM. Get both rewritten for your dream role — copy, paste,
              get inbound.
            </p>
            {!showHistoryView &&
              !result &&
              history.length > 0 &&
              !historyLoading && (
                <p className="text-xs text-muted-foreground mt-2">
                  You have {history.length} past optimization
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
                  onClick={handleNew}
                  className="gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> New optimization
                </Button>
                <span className="ml-auto text-xs text-muted-foreground hidden sm:inline">
                  {activeHistoryDoc?.targetRole}{" "}
                  {activeHistoryDoc?.targetCompanies
                    ? `• ${activeHistoryDoc.targetCompanies}`
                    : ""}{" "}
                  • {new Date(activeHistoryDoc!.createdAt).toLocaleString()}
                </span>
              </div>
              <LinkedinDashboard
                data={activeHistoryDoc!.result as LinkedinResult}
                role={activeHistoryDoc!.targetRole}
                onReset={handleNew}
              />
            </div>
          ) : !result ? (
            <div className="mx-auto w-full max-w-3xl">
              {loading ? (
                <div className="rounded-xl border bg-card p-8 flex flex-col items-center justify-center min-h-[420px]">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0a66c2] mb-3" />
                  <p className="text-sm font-medium">
                    Crafting your recruiter-magnet profile…
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Rewriting headline • About • bullets • ~7 sec
                  </p>
                  <div className="w-full max-w-sm h-1.5 bg-muted rounded-full overflow-hidden mt-6">
                    <div className="h-full w-full bg-gradient-to-r from-[#0a66c2] via-sky-500 to-violet-500 animate-pulse" />
                  </div>
                </div>
              ) : (
                <LinkedinForm
                  values={values}
                  setValues={setValues}
                  onSubmit={handleSubmit}
                  loading={loading}
                  errors={errors}
                />
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNew}
                  className="gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> New optimization (keep
                  inputs)
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="gap-1.5"
                >
                  <X className="w-4 h-4" /> Clear all
                </Button>
                <span className="ml-auto text-xs text-muted-foreground hidden sm:inline">
                  {values.targetRole}{" "}
                  {values.targetCompanies ? `• ${values.targetCompanies}` : ""}
                </span>
              </div>

              <LinkedinDashboard
                data={result as LinkedinResult}
                role={values.targetRole}
                onReset={handleNew}
              />
            </div>
          )}
        </div>
      </SidebarInset>
    </>
  );
}
