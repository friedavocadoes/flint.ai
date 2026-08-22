export interface Task {
  id: string;
  label: string;
  type?: string;
}
export interface Resource {
  label: string;
  url: string;
  type?: string;
}
export interface Stage {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  type?: string;
  difficulty?: string;
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

export interface Chat {
  _id: string;
  title?: string;
  summary?: string;
  textual?: string;
  overview?: string;
  meta?: { chances?: number; verdict?: string; timeline?: string; level?: string; commitmentFit?: string };
  motivation?: { streakTip?: string; nextWin?: string };
  progress?: { completedStageIds?: string[]; completedTaskIds?: string[]; xpEarned?: number; startedAt?: string; lastActiveAt?: string };
  flowjson?: {
    pathwayData?: PathwayData;
    structData?: { nodes: any[]; edges: any[] };
  };
  promptData: {
    role: string;
    targetCompanies: string;
    expertise?: string;
    weakAreas?: string;
    timeCommitment?: string;
    skillLevel?: string;
    extraRemarks?: string;
  };
}