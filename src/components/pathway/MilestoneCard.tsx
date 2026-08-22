"use client";
import { useState } from "react";
import { Check, ChevronDown, Clock, ExternalLink, Award, Lightbulb, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Stage } from "@/app/prepareAI/types";
import * as Icons from "lucide-react";

function IconFor({ name, completed }: { name?: string; completed?: boolean }) {
  const key = (name || "Rocket") as keyof typeof Icons;
  const Icon = (Icons[key] as any) || Icons.Rocket;
  return (
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
        completed ? "bg-emerald-500 text-white border-emerald-600" : "bg-primary/10 text-primary border-primary/20"
      }`}
    >
      <Icon className="w-5 h-5" />
    </div>
  );
}

export function MilestoneCard({
  stage,
  isCompleted,
  isActive,
  completedTaskIds,
  onToggleTask,
  onToggleStage,
}: {
  stage: Stage;
  isCompleted: boolean;
  isActive: boolean;
  completedTaskIds: Set<string>;
  onToggleTask: (taskId: string) => void;
  onToggleStage: () => void;
}) {
  const [open, setOpen] = useState(isActive || isCompleted ? false : true);
  // auto-open active stage on first render? leave collapsed for done
  const doneCount = stage.tasks?.filter((t) => completedTaskIds.has(t.id)).length ?? 0;
  const totalTasks = stage.tasks?.length ?? 0;

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 ${
        isCompleted
          ? "border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20"
          : isActive
          ? "border-primary/40 shadow-md ring-1 ring-primary/10"
          : "opacity-90"
      }`}
    >
      {/* accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          isCompleted ? "bg-emerald-500" : isActive ? "bg-primary" : "bg-muted"
        }`}
      />
      <CardHeader className="pb-3 pl-6">
        <div className="flex gap-3">
          <IconFor name={stage.icon} completed={isCompleted} />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-[15px] md:text-base leading-tight flex items-center gap-2">
              <span className="truncate">{stage.title}</span>
              {isCompleted && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              <span
                className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${
                  stage.difficulty === "Advanced"
                    ? "border-red-300 text-red-600 bg-red-50"
                    : stage.difficulty === "Beginner"
                    ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                    : "border-amber-300 text-amber-700 bg-amber-50"
                }`}
              >
                {stage.difficulty}
              </span>
            </CardTitle>
            {stage.subtitle && <p className="text-xs text-muted-foreground mt-1">{stage.subtitle}</p>}
            <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted border">
                <Clock className="w-3 h-3" />
                {stage.estimatedDuration}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
                <Award className="w-3 h-3" /> {stage.xp ?? 100} XP
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                <Flag className="w-3 h-3" /> {stage.type}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => setOpen((v) => !v)}>
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pl-6">
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{stage.description}</p>

        {open && (
          <div className="mt-4 space-y-4 animate-in fade-in-50">
            {stage.whyItMatters && (
              <div className="flex gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs leading-relaxed text-blue-800 dark:text-blue-200">
                  <span className="font-semibold">Why this matters: </span>
                  {stage.whyItMatters}
                </p>
              </div>
            )}

            {/* Tasks */}
            {stage.tasks && stage.tasks.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                    Tasks ({doneCount}/{totalTasks})
                  </h4>
                  <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${totalTasks ? (doneCount / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {stage.tasks.map((t) => {
                    const done = completedTaskIds.has(t.id);
                    return (
                      <li
                        key={t.id}
                        onClick={() => onToggleTask(t.id)}
                        className={`group flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                          done
                            ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900"
                            : "hover:bg-muted/60 border-transparent hover:border-border"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            done ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground/30 bg-background"
                          }`}
                        >
                          {done && <Check className="w-3 h-3" />}
                        </div>
                        <span className={`text-sm flex-1 ${done ? "line-through text-muted-foreground" : ""}`}>{t.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted border capitalize">{t.type}</span>
                      </li>
                    );
                  })}
                </ul>
                {stage.deliverable && (
                  <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                    <Flag className="w-3 h-3" /> Deliverable: {stage.deliverable}
                  </p>
                )}
              </div>
            )}

            {/* Resources */}
            {stage.resources && stage.resources.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-2">
                  Curated Resources
                </h4>
                <div className="flex flex-wrap gap-2">
                  {stage.resources.map((r, idx) => (
                    <a
                      key={idx}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border bg-card hover:bg-muted transition-colors"
                    >
                      {r.label}
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant={isCompleted ? "outline" : "default"}
                onClick={onToggleStage}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-1" />
                {isCompleted ? "Mark incomplete" : totalTasks && doneCount < totalTasks ? "Complete anyway" : "Mark complete"}
              </Button>
              {!isCompleted && doneCount > 0 && doneCount < totalTasks && (
                <span className="text-[11px] text-muted-foreground self-center">{doneCount}/{totalTasks} done</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
