import { 
  Project, InsertProject,
  Keyword, InsertKeyword,
  Cluster, InsertCluster, 
  Improvement, InsertImprovement,
  Report, InsertReport,
  projects, keywords, clusters, improvements, reports
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Projetos
  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(projects.createdAt);
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }

  async getClientProjects(): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.isClient, true));
  }

  async getOwnProjects(): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.isClient, false));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async updateProject(id: number, project: Partial<Project>): Promise<Project | undefined> {
    const result = await db.update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result !== null && (result.rowCount || 0) > 0;
  }

  // Keywords
  async getAllKeywords(): Promise<Keyword[]> {
    return await db.select().from(keywords);
  }

  async getKeywordById(id: number): Promise<Keyword | undefined> {
    const result = await db.select().from(keywords).where(eq(keywords.id, id));
    return result[0];
  }

  async getKeywordsByProjectId(projectId: number): Promise<Keyword[]> {
    return await db.select().from(keywords).where(eq(keywords.projectId, projectId));
  }

  async createKeyword(keyword: InsertKeyword): Promise<Keyword> {
    const result = await db.insert(keywords).values(keyword).returning();
    return result[0];
  }

  async createKeywordBatch(keywordsData: InsertKeyword[]): Promise<Keyword[]> {
    if (keywordsData.length === 0) return [];
    const result = await db.insert(keywords).values(keywordsData).returning();
    return result;
  }

  async updateKeyword(id: number, keyword: Partial<Keyword>): Promise<Keyword | undefined> {
    const result = await db.update(keywords)
      .set(keyword)
      .where(eq(keywords.id, id))
      .returning();
    return result[0];
  }

  async deleteKeyword(id: number): Promise<boolean> {
    const result = await db.delete(keywords).where(eq(keywords.id, id));
    return result.rowCount > 0;
  }

  // Clusters
  async getAllClusters(): Promise<Cluster[]> {
    return await db.select().from(clusters);
  }

  async getClusterById(id: number): Promise<Cluster | undefined> {
    const result = await db.select().from(clusters).where(eq(clusters.id, id));
    return result[0];
  }

  async getClustersByProjectId(projectId: number): Promise<Cluster[]> {
    return await db.select().from(clusters).where(eq(clusters.projectId, projectId));
  }

  async getKeywordsByClusterId(clusterId: number): Promise<Keyword[]> {
    return await db.select().from(keywords).where(eq(keywords.clusterId, clusterId));
  }

  async createCluster(cluster: InsertCluster): Promise<Cluster> {
    const result = await db.insert(clusters).values(cluster).returning();
    return result[0];
  }

  async updateCluster(id: number, cluster: Partial<Cluster>): Promise<Cluster | undefined> {
    const result = await db.update(clusters)
      .set(cluster)
      .where(eq(clusters.id, id))
      .returning();
    return result[0];
  }

  async deleteCluster(id: number): Promise<boolean> {
    const result = await db.delete(clusters).where(eq(clusters.id, id));
    return result.rowCount > 0;
  }

  // Melhorias
  async getAllImprovements(): Promise<Improvement[]> {
    return await db.select().from(improvements);
  }

  async getImprovementsByProjectId(projectId: number): Promise<Improvement[]> {
    return await db.select().from(improvements).where(eq(improvements.projectId, projectId));
  }

  async getImprovementsByProjectIdAndImpact(projectId: number, impact: string): Promise<Improvement[]> {
    return await db.select()
      .from(improvements)
      .where(and(
        eq(improvements.projectId, projectId),
        eq(improvements.impact, impact)
      ));
  }

  async createImprovement(improvement: InsertImprovement): Promise<Improvement> {
    const result = await db.insert(improvements).values(improvement).returning();
    return result[0];
  }

  async updateImprovement(id: number, improvement: Partial<Improvement>): Promise<Improvement | undefined> {
    const result = await db.update(improvements)
      .set(improvement)
      .where(eq(improvements.id, id))
      .returning();
    return result[0];
  }

  // Relatórios
  async getAllReports(): Promise<Report[]> {
    return await db.select().from(reports);
  }

  async getReportsByProjectId(projectId: number): Promise<Report[]> {
    return await db.select().from(reports).where(eq(reports.projectId, projectId));
  }

  async createReport(report: InsertReport): Promise<Report> {
    const result = await db.insert(reports).values(report).returning();
    return result[0];
  }
}