// Definição de tipos para uso no frontend

export type ProjectType = "affiliate" | "blog" | "ecommerce" | "review" | "other";

export interface Project {
  id: number;
  name: string;
  description?: string;
  url?: string;
  isClient: boolean;
  type: ProjectType;
  progress: number;
  createdAt: Date;
}

export type KeywordTrend = "up" | "down" | "stable";

export interface Keyword {
  id: number;
  projectId: number;
  text: string;
  volume?: number;
  difficulty?: number;
  position?: number;
  clusterId?: number | null;
  trend?: KeywordTrend;
  createdAt: Date;
}

export interface Cluster {
  id: number;
  projectId: number;
  name: string;
  mainUrl?: string;
  createdAt: Date;
}

export type ImpactLevel = "high" | "medium" | "low";
export type ImprovementStatus = "pending" | "in_progress" | "completed";

export interface Improvement {
  id: number;
  projectId: number;
  problem: string;
  impact: ImpactLevel;
  pages?: string;
  recommendation: string;
  status: ImprovementStatus;
  createdAt: Date;
}

export interface Report {
  id: number;
  projectId?: number;
  title: string;
  description?: string;
  data: any;
  createdAt: Date;
}

export interface KeywordOpportunity {
  text: string;
  volume?: number;
  difficulty?: number;
  opportunity: ImpactLevel;
}

export interface DashboardData {
  activeProjects: number;
  ownProjects: number;
  clientProjects: number;
  trackedKeywords: number;
  growingKeywords: number;
  pendingImprovements: number;
  highPriorityImprovements: number;
  implementedImprovements: number;
  recentProjects: Project[];
  recentImprovements: Improvement[];
}
