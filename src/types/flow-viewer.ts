export interface Stage {
  id: string;
  title: string;
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
  _id: string; // for backend chats, or use id: number for local/test data
  title?: string;
  textual?: string;
  flowjson?: {
    pathwayData?: PathwayData;
    structData?: {
      nodes: any[];
      edges: any[];
    };
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