"use client";
import { Clock, FileText, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type HistoryItem = {
  _id: string;
  role: string;
  fileName?: string;
  atsScore?: number;
  verdict?: string;
  createdAt: string;
  topFix?: string;
};

export function ResumeHistorySidebar({
  items,
  selectedId,
  onSelect,
  onDelete,
  loading,
}: {
  items: HistoryItem[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}) {
  const scoreColor = (s?: number) => {
    if (s == null) return "bg-muted text-muted-foreground";
    if (s >= 80) return "bg-emerald-500 text-white";
    if (s >= 65) return "bg-amber-500 text-white";
    if (s >= 45) return "bg-orange-500 text-white";
    return "bg-red-500 text-white";
  };

  return (
    <Card className="flex flex-col h-full border shadow-sm">
      <CardHeader className="py-3 px-4 border-b shrink-0">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Past scans
          <span className="ml-auto text-xs font-normal px-2 py-0.5 rounded-full bg-muted border">
            {items.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 overflow-hidden">
        <div className="h-[280px] lg:h-[520px] overflow-y-auto">
          <div className="p-2 space-y-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[72px] rounded-lg bg-muted animate-pulse" />
              ))
            ) : items.length === 0 ? (
              <div className="py-10 text-center">
                <FileText className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm font-medium">No scans yet</p>
                <p className="text-xs text-muted-foreground">Your history will appear here</p>
              </div>
            ) : (
              items.map((it) => {
                const active = selectedId === it._id;
                return (
                  <div
                    key={it._id}
                    onClick={() => onSelect(it._id)}
                    className={`group relative rounded-lg border p-3 cursor-pointer transition-all ${active ? "bg-primary/5 border-primary/30 shadow-sm" : "hover:bg-muted/50"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate pr-6">{it.role}</p>
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                          <FileText className="w-3 h-3 shrink-0" />
                          {it.fileName || "resume.pdf"}
                        </p>
                        {it.topFix && (
                          <p className="text-[11px] text-muted-foreground truncate mt-1">{it.topFix}</p>
                        )}
                      </div>
                      <span className={`w-9 h-9 rounded-xl grid place-items-center text-xs font-bold shrink-0 ${scoreColor(it.atsScore)}`}>
                        {it.atsScore ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(it.createdAt).toLocaleDateString()} • {new Date(it.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(it._id);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
