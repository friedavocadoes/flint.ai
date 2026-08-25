export interface Task {
  id: string;
  label: string;
  type?: "practice" | "project" | "learn" | "network" | "habit";
}
export interface Resource {
  label: string;
  url: string;
  type?:
    "leetcode" | "course" | "article" | "video" | "book" | "tool" | "other";
}
export interface Stage {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  type?:
    "skill" | "project" | "habit" | "networking" | "interview" | "milestone";
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  estimatedDuration?: string;
  estimatedHours?: number;
  xp?: number;
  whyItMatters?: string;
  deliverable?: string;
  order?: number;
  tasks?: Task[];
  resources?: Resource[];
}

export interface MyConnection {
  from: string;
  to: string;
}

export interface PathwayData {
  stages: Stage[];
  connections: MyConnection[];
}

export interface ChatProgress {
  completedStageIds?: string[];
  completedTaskIds?: string[];
  xpEarned?: number;
  startedAt?: string;
  lastActiveAt?: string;
}

export interface ChatMeta {
  chances?: number;
  verdict?: string;
  timeline?: string;
  level?: string;
  commitmentFit?: string;
}

export interface ChatMotivation {
  streakTip?: string;
  nextWin?: string;
}

export interface Chat {
  _id: string;
  title?: string;
  summary?: string;
  textual?: string;
  overview?: string;
  meta?: ChatMeta;
  motivation?: ChatMotivation;
  progress?: ChatProgress;
  flowjson?: {
    pathwayData?: PathwayData;
    structData?: {
      nodes: any[];
      edges: any[];
    };
  };
  promptData: {
    // Step 1
    targetCountry?: string;
    hasTargetCountry?: string;
    // Step 2
    currentResidenceCountry?: string;
    currentStatus?: string;
    fieldOfStudy?: string;
    educationLevel?: string;
    graduationTimeline?: string;
    currentRole?: string;
    yearsInTargetDomain?: string;
    // Step 3
    role: string;
    roleSpecificity?: string;
    desiredField?: string;
    targetCompanies?: string;
    hasTargetCompany?: string;
    companyTypePreference?: string;
    targetSalary?: string;
    salaryCurrency?: string;
    salaryPeriod?: string;
    opportunityType?: string;
    workModePreference?: string;
    // Core
    expertise: string;
    weakAreas: string;
    timeCommitment: string;
    skillLevel: string;
    extraRemarks?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
