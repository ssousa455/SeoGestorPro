import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Projetos
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar projetos" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProjectById(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar projeto" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const project = await storage.createProject(req.body);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar projeto" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const updated = await storage.updateProject(parseInt(req.params.id), req.body);
      if (!updated) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar projeto" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProject(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar projeto" });
    }
  });

  // Keywords
  app.get("/api/keywords", async (req, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const keywords = projectId 
        ? await storage.getKeywordsByProjectId(projectId) 
        : await storage.getAllKeywords();
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar keywords" });
    }
  });

  app.post("/api/keywords", async (req, res) => {
    try {
      const keyword = await storage.createKeyword(req.body);
      res.status(201).json(keyword);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar keyword" });
    }
  });

  app.post("/api/keywords/batch", async (req, res) => {
    try {
      if (!Array.isArray(req.body)) {
        return res.status(400).json({ message: "Formato inválido. Esperado um array de keywords." });
      }
      const keywords = await storage.createKeywordBatch(req.body);
      res.status(201).json(keywords);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar keywords em lote" });
    }
  });

  app.put("/api/keywords/:id", async (req, res) => {
    try {
      const updated = await storage.updateKeyword(parseInt(req.params.id), req.body);
      if (!updated) {
        return res.status(404).json({ message: "Keyword não encontrada" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar keyword" });
    }
  });

  app.delete("/api/keywords/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteKeyword(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Keyword não encontrada" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar keyword" });
    }
  });

  // Clusters
  app.get("/api/clusters", async (req, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const clusters = projectId 
        ? await storage.getClustersByProjectId(projectId) 
        : await storage.getAllClusters();
      res.json(clusters);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar clusters" });
    }
  });

  app.get("/api/clusters/:id", async (req, res) => {
    try {
      const cluster = await storage.getClusterById(parseInt(req.params.id));
      if (!cluster) {
        return res.status(404).json({ message: "Cluster não encontrado" });
      }
      res.json(cluster);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar cluster" });
    }
  });

  app.post("/api/clusters", async (req, res) => {
    try {
      const cluster = await storage.createCluster(req.body);
      res.status(201).json(cluster);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar cluster" });
    }
  });

  app.put("/api/clusters/:id", async (req, res) => {
    try {
      const updated = await storage.updateCluster(parseInt(req.params.id), req.body);
      if (!updated) {
        return res.status(404).json({ message: "Cluster não encontrado" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar cluster" });
    }
  });

  app.delete("/api/clusters/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCluster(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Cluster não encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar cluster" });
    }
  });

  // Melhorias
  app.get("/api/improvements", async (req, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const impact = req.query.impact as string | undefined;
      
      let improvements;
      
      if (projectId && impact) {
        improvements = await storage.getImprovementsByProjectIdAndImpact(projectId, impact);
      } else if (projectId) {
        improvements = await storage.getImprovementsByProjectId(projectId);
      } else {
        improvements = await storage.getAllImprovements();
      }
      
      res.json(improvements);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar melhorias" });
    }
  });

  app.post("/api/improvements", async (req, res) => {
    try {
      const improvement = await storage.createImprovement(req.body);
      res.status(201).json(improvement);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar melhoria" });
    }
  });

  app.put("/api/improvements/:id", async (req, res) => {
    try {
      const updated = await storage.updateImprovement(parseInt(req.params.id), req.body);
      if (!updated) {
        return res.status(404).json({ message: "Melhoria não encontrada" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar melhoria" });
    }
  });

  // Relatórios
  app.get("/api/reports", async (req, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const reports = projectId 
        ? await storage.getReportsByProjectId(projectId) 
        : await storage.getAllReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar relatórios" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const report = await storage.createReport(req.body);
      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar relatório" });
    }
  });

  // Dados resumidos para o dashboard
  app.get("/api/dashboard", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      const keywords = await storage.getAllKeywords();
      const improvements = await storage.getAllImprovements();
      
      // Contando projetos próprios e de clientes
      const ownProjects = projects.filter(p => !p.isClient).length;
      const clientProjects = projects.filter(p => p.isClient).length;
      
      // Contando keywords com tendência de crescimento
      const growingKeywords = keywords.filter(k => k.trend === "up").length;
      
      // Contando melhorias por status e impacto
      const pendingImprovements = improvements.filter(i => i.status === "pending").length;
      const highPriorityImprovements = improvements.filter(i => i.impact === "high" && i.status === "pending").length;
      const implementedImprovements = improvements.filter(i => i.status === "completed").length;
      
      // Pegando projetos recentes
      const recentProjects = projects.slice(0, 4);
      
      // Pegando melhorias recentes
      const recentImprovements = improvements.slice(0, 3);
      
      res.json({
        activeProjects: projects.length,
        ownProjects,
        clientProjects,
        trackedKeywords: keywords.length,
        growingKeywords,
        pendingImprovements,
        highPriorityImprovements,
        implementedImprovements,
        recentProjects,
        recentImprovements
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar dados do dashboard" });
    }
  });

  return httpServer;
}
