"use client";
import { Flame, Trophy, Clock3, Target as TargetIcon, Sparkles } from "lucide-react";
import type { Chat } from "@/app/prepareAI/types";

export function PathwayHeader({ chat }: { chat: Chat }) {
  const stages = chat.flowjson?.pathwayData?.stages ?? [];
  const progress = chat.progress ?? {};
  const completed = progress.completedStageIds?.length ?? 0;
  const total = stages.length || 1;
  const pct = Math.round((completed / total) * 100);
  const xpEarned = progress.xpEarned ?? 0;
  const totalXp = stages.reduce((s, st) => s + (st.xp ?? 100), 0);
  const chances = chat.meta?.chances ?? 50;

  const chanceColor =
    chances >= 70 ? "text-emerald-500" : chances >= 45 ? "text-amber-500" : "text-red-500";
  const chanceBg =
    chances >= 70 ? "bg-emerald-500" : chances >= 45 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="rounded-2xl border bg-card/50 backdrop-blur p-5 md:p-6 mb-6 shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-[240px]">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{chat.title}</h1>
            {chat.summary && (
              <p className="text-sm md:text-[15px] text-muted-foreground mt-1.5 leading-relaxed">
                {chat.summary}
              </p>
            )}
            {chat.meta?.verdict && (
              <p className="mt-3 inline-flex items-center gap-2 text-xs md:text-sm px-3 py-1.5 rounded-full bg-muted border">
                <Sparkles className="w-4 h-4 text-primary" />
                {chat.meta.verdict}
              </p>
            )}
          </div>

          {/* Chances ring */}
          <div className="flex items-center gap-4">
            <div className="relative w-[84px] h-[84px] shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx={42}
                  cy={42}
                  r={36}
                  stroke="currentColor"
                  className="text-muted"
                  strokeWidth={8}
                  fill="none"
                />
                <circle
                  cx={42}
                  cy={42}
                  r={36}
                  stroke="currentColor"
                  className={chanceColor}
                  strokeWidth={8}
                  fill="none"
                  strokeDasharray={`${(chances / 100) * 226} 226`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-bold ${chanceColor}`}>{chances}%</span>
                <span className="text-[10px] tracking-widest text-muted-foreground">FIT</span>
              </div>
            </div>
            <div className="hidden sm:flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs">
                <Clock3 className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{chat.meta?.timeline ?? "6-8 weeks"}</span>
                <span className="text-muted-foreground">timeline</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <TargetIcon className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{chat.meta?.level ?? "Intermediate"}</span>
                <span className="text-muted-foreground">• {chat.meta?.commitmentFit ?? "Fits schedule"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* XP + progress */}
        <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium">
                <Trophy className="w-4 h-4 text-amber-500" /> {completed}/{total} quests • {xpEarned} / {totalXp} XP
              </span>
              <span className="text-muted-foreground">{pct}% to {chat.promptData.role}</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full ${chanceBg} transition-all duration-700 ease-out`}
                style={{ width: `${pct}%` }}
              />
            </div>
            {chat.motivation?.nextWin && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" /> Next win: {chat.motivation.nextWin}
              </p>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-300">
            <Flame className="w-4 h-4" />
            {chat.motivation?.streakTip ?? "25 min daily beats 4h weekend cram"}
          </div>
        </div>
      </div>
    </div>
  );
}
