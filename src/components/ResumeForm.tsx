"use client";

import { FileUpload } from "./ui/file-upload";
import { ResumeFormType } from "@/types/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, FileText, Sparkles, Upload, Lightbulb, Check, AlertCircle } from "lucide-react";
import { useState } from "react";

const ROLE_SUGGESTIONS = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Developer",
  "Data Scientist",
  "Product Manager",
  "Business Analyst",
  "DevOps Engineer",
  "ML Engineer",
];

export function ResumeForm({
  setFile,
  file,
  onSubmit,
  setRole,
  role,
  errors,
}: ResumeFormType & { setJd?: (v: string) => void; jd?: string }) {
  const [showJd, setShowJd] = useState(false);
  const [jdLocal, setJdLocal] = useState("");

  // expose jd via side-effect if parent provided setter
  // parent page will read formData jd if we pass via hidden field? Instead we monkey patch onSubmit to include jd
  const handleSubmit: React.FormEventHandler = (e) => {
    // attach jd to form by setting a hidden input? We'll store in localStorage hack or call parent via custom event
    // Simpler: if parent didn't provide setJd, we store jdLocal into a global for page to pick up via data attr
    (e.currentTarget as any)._jd = jdLocal;
    onSubmit(e);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="overflow-hidden border shadow-xl shadow-primary/5">
        <div className="h-1 w-full bg-gradient-to-r from-primary via-violet-500 to-emerald-500" />
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <span className="w-8 h-8 rounded-xl bg-primary text-primary-foreground grid place-items-center">
              <FileText className="w-4 h-4" />
            </span>
            Resume ATS scan
          </CardTitle>
          <CardDescription className="mt-1.5">
            Upload your PDF and tell us the role. We&apos;ll highlight exactly where the ATS will ding you — with a live preview.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-7">
            {/* Step 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Upload className="w-4 h-4 text-primary" /> Step 1 — Upload CV
                <span className="ml-auto text-[11px] font-normal px-2 py-0.5 rounded-full bg-muted border hidden sm:inline">PDF only • max 5MB</span>
              </div>
              <div className={`rounded-xl border-2 border-dashed p-2 transition-colors ${errors.file ? "border-red-300 bg-red-50/40" : file ? "border-emerald-300 bg-emerald-50/20" : "border-muted-foreground/20 hover:border-primary/30 hover:bg-muted/20"}`}>
                <FileUpload setFile={setFile} file={file} />
              </div>
              {errors.file ? (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Please upload a PDF first
                </p>
              ) : file ? (
                <p className="text-xs text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {file.name} ready
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">Drag & drop or click the card above</p>
              )}
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Briefcase className="w-4 h-4 text-primary" /> Step 2 — Target role
                <span className="ml-2 text-[11px] font-normal px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">required</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Role you&apos;re applying for
                </Label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <Input
                    id="role"
                    placeholder="e.g. Frontend Engineer @ Stripe"
                    className="pl-9 h-11"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                {errors.role ? (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Enter a role to score against
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">We tailor keywords & hiring bar to this title</p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ROLE_SUGGESTIONS.slice(0, 6).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${role === r ? "bg-primary text-primary-foreground border-primary" : "bg-muted hover:bg-muted/80"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="h-7 text-xs px-2 mb-2 cursor-pointer"
                  onClick={() => setShowJd((v) => !v)}
                >
                  <Lightbulb className="w-3.5 h-3.5 mr-1" />
                  {showJd ? "Hide job description" : "Add job description (better accuracy)"}
                </Button>
                <span className="text-[11px] text-muted-foreground hidden sm:inline mb-2">Paste JD for keyword-perfect scan</span>
              </div>
              {showJd && (
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Job description</Label>
                  <Textarea
                    placeholder="Paste 3–10 lines from the JD — responsibilities & must-have stack"
                    className="min-h-[96px]"
                    value={jdLocal}
                    onChange={(e) => setJdLocal(e.target.value)}
                  />
                </div>
              )}
            </div>
          </CardContent>

          <div className="px-6 pb-6">
            <div className="rounded-xl border bg-muted/30 p-3 flex items-start gap-2.5 mb-4">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">What you get:</span> ATS score 0–100, breakdown by impact/keywords/structure, present vs missing keywords, page-level highlights, and a 30-min fix list.
              </p>
            </div>

            <Button
              type="submit"
              disabled={role.trim().length < 2}
              className="w-full h-11 text-[15px] gap-2 shadow-lg shadow-primary/20 disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              Score my resume
            </Button>
            <p className="text-[11px] text-center text-muted-foreground mt-2">PDF stays on device until you click score • ~8 sec scan</p>
          </div>
        </form>
      </Card>
    </div>
  );
}
