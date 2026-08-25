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
  const rows: { name: string; inf?: string }[] = [
    {
      name: "Target Country",
      inf:
        (data as any).targetCountry ||
        ((data as any).hasTargetCountry === "no" ? "Open / Any" : undefined),
    },
    { name: "Residence", inf: (data as any).currentResidenceCountry },
    { name: "Status", inf: (data as any).currentStatus },
    { name: "Field of Study", inf: (data as any).fieldOfStudy },
    { name: "Education", inf: (data as any).educationLevel },
    { name: "Graduation", inf: (data as any).graduationTimeline },
    { name: "Current Role", inf: (data as any).currentRole },
    { name: "Years in Domain", inf: (data as any).yearsInTargetDomain },
    { name: "Role", inf: data.role },
    { name: "Desired Field", inf: (data as any).desiredField },
    {
      name: "Target Companies",
      inf: data.targetCompanies || (data as any).companyTypePreference,
    },
    { name: "Company Type", inf: (data as any).companyTypePreference },
    {
      name: "Target Salary",
      inf: (data as any).targetSalary
        ? `${(data as any).targetSalary} ${(data as any).salaryCurrency || ""} ${(data as any).salaryPeriod || ""}`.trim()
        : undefined,
    },
    { name: "Opportunity", inf: (data as any).opportunityType },
    { name: "Work Mode", inf: (data as any).workModePreference },
    { name: "Expertise", inf: data.expertise },
    { name: "Weak Areas", inf: data.weakAreas },
    { name: "Skill Level", inf: data.skillLevel },
    { name: "Time Commitment", inf: data.timeCommitment },
  ].filter((r) => r.inf && String(r.inf).trim());

  return (
    <HoverCard>
      <HoverCardTrigger asChild className="ml-1 mt-2">
        <Button variant="link">
          <Info />
          info
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 max-h-[70vh] overflow-y-auto">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1 w-full">
            <h4 className="text-lg font-bold mb-3">About this Pathway</h4>
            {rows.map((pd) => (
              <p className="text-sm break-words" key={pd.name}>
                <span className="font-semibold">{pd.name}: </span> {pd.inf}
              </p>
            ))}
            {data.extraRemarks && (
              <div className="flex items-start pt-2 gap-2">
                <ListPlus className="mr-1 h-4 w-4 opacity-70 mt-0.5 shrink-0" />
                <span className="text-xs text-muted-foreground break-words">
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
