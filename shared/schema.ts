import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Projetos
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  url: text("url"),
  isClient: boolean("is_client").default(false),
  type: text("type").notNull(), // tipo de site (e-commerce, blog, etc)
  createdAt: timestamp("created_at").defaultNow(),
  progress: integer("progress").default(0),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ 
  id: true,
  createdAt: true,
  progress: true
});

// Keywords
export const keywords = pgTable("keywords", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  text: text("text").notNull(),
  volume: integer("volume"),
  difficulty: integer("difficulty"),
  position: integer("position"),
  clusterId: integer("cluster_id"),
  trend: text("trend"), // "up", "down", "stable"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertKeywordSchema = createInsertSchema(keywords).omit({ 
  id: true,
  createdAt: true,
  clusterId: true,
  trend: true,
});

// Clusters
export const clusters = pgTable("clusters", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
  mainUrl: text("main_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertClusterSchema = createInsertSchema(clusters).omit({ 
  id: true,
  createdAt: true
});

// Melhorias SEO
export const improvements = pgTable("improvements", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  problem: text("problem").notNull(),
  impact: text("impact").notNull(), // "high", "medium", "low"
  pages: text("pages"), // Descrição das páginas afetadas
  recommendation: text("recommendation").notNull(),
  status: text("status").notNull().default("pending"), // "pending", "in_progress", "completed"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertImprovementSchema = createInsertSchema(improvements).omit({ 
  id: true,
  createdAt: true
});

// Relatórios
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id"),
  title: text("title").notNull(),
  description: text("description"),
  data: json("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReportSchema = createInsertSchema(reports).omit({ 
  id: true,
  createdAt: true
});

// Tipos de dados
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Keyword = typeof keywords.$inferSelect;
export type InsertKeyword = z.infer<typeof insertKeywordSchema>;

export type Cluster = typeof clusters.$inferSelect;
export type InsertCluster = z.infer<typeof insertClusterSchema>;

export type Improvement = typeof improvements.$inferSelect;
export type InsertImprovement = z.infer<typeof insertImprovementSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
