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