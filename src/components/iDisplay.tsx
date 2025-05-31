import { Info, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Chat } from "@/types/flow-viewer";

// the i display for info about a chat
export function PromptDisplay({ data }: { data: Chat["promptData"] }) {
  const pData = [
    { name: "Role", inf: data.role },
    { name: "Target Companies", inf: data.targetCompanies },
    { name: "Expertise", inf: data.expertise },
    { name: "Skill Level", inf: data.skillLevel },
    { name: "Weak Areas", inf: data.weakAreas },
    { name: "Time Commitment", inf: data.timeCommitment },
  ];
  return (
    <HoverCard>
      <HoverCardTrigger asChild className="ml-1 mt-2">
        <Button variant="link">
          <Info />
          info
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-lg font-bold mb-3">About this Pathway</h4>

            {pData.map((pd) => (
              <p className="text-sm" key={pd.name}>
                <span className="font-semibold">{pd.name}: </span> {pd.inf}
              </p>
            ))}
            {data.extraRemarks && (
              <div className="flex items-center pt-2">
                <ListPlus className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground">
                  {data.extraRemarks}
                </span>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
