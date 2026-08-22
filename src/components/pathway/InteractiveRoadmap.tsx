"use client";
import { useMemo, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import type { Chat } from "@/app/prepareAI/types";
import { PathwayHeader } from "./PathwayHeader";
import { MilestoneCard } from "./MilestoneCard";
import CareerFlowchart from "@/components/ui/flow-viewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Share2, RotateCcw } from "lucide-react";
import MarkdownViewer from "@/components/markDownViewer";

export function InteractiveRoadmap({
  chat,
  onUpdated,
}: {
  chat: Chat;
  onUpdated: (updated: Chat) => void;
}) {
  const stages = chat.flowjson?.pathwayData?.stages ?? [];
  const progress = chat.progress ?? { completedStageIds: [], completedTaskIds: [], xpEarned: 0 };
  const completedStageIds = new Set(progress.completedStageIds ?? []);
  const completedTaskIds = new Set(progress.completedTaskIds ?? []);

  // next active is first incomplete stage in order
  const nextActiveId = useMemo(() => {
    const sorted = [...stages].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return sorted.find((s) => !completedStageIds.has(s.id))?.id ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- completedStageIds is derived from progress array
  }, [stages, progress.completedStageIds]);

  const persist = useCallback(
    async (nextStageIds: string[], nextTaskIds: string[]) => {
      try {
        const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chat/${chat._id}/progress`, {
          completedStageIds: nextStageIds,
          completedTaskIds: nextTaskIds,
        });
        const newProgress = res.data.progress;
        onUpdated({ ...chat, progress: newProgress });
      } catch {
        toast.error("Could not save progress");
      }
    },
    [chat, onUpdated]
  );

  const toggleStage = (stageId: string) => {
    const wasCompleted = completedStageIds.has(stageId);
    const next = new Set(completedStageIds);
    if (wasCompleted) next.delete(stageId);
    else {
      next.add(stageId);
      toast.success("Quest completed! +XP", { description: stages.find((s) => s.id === stageId)?.title });
    }
    const arr = [...next];
    persist(arr, [...completedTaskIds]);
  };

  const toggleTask = (taskId: string) => {
    const next = new Set(completedTaskIds);
    const was = next.has(taskId);
    if (was) next.delete(taskId);
    else next.add(taskId);
    persist([...completedStageIds], [...next]);
  };

  const resetProgress = () => {
    persist([], []);
    toast.info("Progress reset");
  };

  if (stages.length === 0) {
    // fallback to old textual view
    return (
      <div className="space-y-4">
        <PathwayHeader chat={chat} />
        <Card>
          <CardContent className="pt-6">
            <MarkdownViewer content={chat.overview || chat.textual || ""} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PathwayHeader chat={chat} />

      <div className="grid lg:grid-cols-[1.6fr_0.9fr] gap-6 items-start">
        {/* LEFT: Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Quests
            </h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={resetProgress}>
                <RotateCcw className="w-4 h-4 mr-1" /> Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied");
                }}
              >
                <Share2 className="w-4 h-4 mr-1" /> Share
              </Button>
            </div>
          </div>

          {/* vertical line */}
          <div className="relative pl-4 md:pl-6">
            <div className="absolute left-[22px] md:left-[30px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/40 via-muted to-transparent hidden sm:block" />
            <div className="space-y-4">
              {[...stages]
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((stage) => (
                  <div key={stage.id} className="relative">
                    <MilestoneCard
                      stage={stage}
                      isCompleted={completedStageIds.has(stage.id)}
                      isActive={nextActiveId === stage.id}
                      completedTaskIds={completedTaskIds}
                      onToggleTask={toggleTask}
                      onToggleStage={() => toggleStage(stage.id)}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Overview markdown */}
          {(chat.overview || chat.textual) && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Mentor Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <MarkdownViewer content={chat.overview || chat.textual || ""} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT: sticky */}
        <div className="hidden lg:block sticky top-[72px] space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Roadmap</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px] p-2">
              <CareerFlowchart
                data={{
                  stages: stages.map((s) => ({
                    id: s.id,
                    title: (completedStageIds.has(s.id) ? "✓ " : "") + s.title,
                  })),
                  connections: chat.flowjson?.pathwayData?.connections ?? [],
                }}
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-sm mb-1">Keep the streak 🔥</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {chat.motivation?.streakTip ?? "25 minutes every morning before email beats binge weekends."}
              </p>
              <div className="mt-3 text-xs px-3 py-2 rounded-lg bg-background border">
                <span className="font-medium">Today:</span> mark 2 tasks done to stay on track for{" "}
                {chat.promptData.role} @ {chat.promptData.targetCompanies || "target"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
