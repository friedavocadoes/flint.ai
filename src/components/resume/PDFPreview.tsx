"use client";
import { FileText, ExternalLink, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PDFPreview({
  file,
  url,
}: {
  file: File | null;
  url: string | null;
}) {
  if (!file || !url) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-10 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-muted grid place-items-center mb-3">
            <Eye className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No PDF selected</p>
          <p className="text-xs text-muted-foreground">Upload a resume to see a live preview</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="py-3 px-4 flex-row items-center justify-between space-y-0 border-b bg-muted/30">
        <CardTitle className="text-sm flex items-center gap-2 truncate">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate">{file.name}</span>
          <span className="text-xs font-normal text-muted-foreground hidden sm:inline">
            {(file.size / 1024).toFixed(0)} KB • {file.type || "PDF"}
          </span>
        </CardTitle>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
            <a href={url} target="_blank" rel="noreferrer" title="Open in new tab">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
            <a href={url} download={file.name} title="Download">
              <Download className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 bg-[#f5f5f4] dark:bg-neutral-950 min-h-[320px] md:min-h-[520px]">
        <object data={url} type="application/pdf" className="w-full h-[380px] md:h-[560px]">
          <div className="p-6 text-center">
            <p className="text-sm">PDF preview not available in this browser.</p>
            <a href={url} target="_blank" rel="noreferrer" className="text-primary underline text-sm">
              Open PDF
            </a>
          </div>
        </object>
      </CardContent>
      <div className="px-3 py-2 text-[11px] text-muted-foreground border-t bg-muted/20 flex items-center justify-between">
        <span>Page 1 preview • highlights are listed in the analysis →</span>
        <span className="hidden sm:inline">Pinch to zoom in new tab</span>
      </div>
    </Card>
  );
}
