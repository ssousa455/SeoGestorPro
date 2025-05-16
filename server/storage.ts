import { 
  Project, InsertProject,
  Keyword, InsertKeyword,
  Cluster, InsertCluster, 
  Improvement, InsertImprovement,
  Report, InsertReport
} from "@shared/schema";

export interface IStorage {
  // Projetos
  getAllProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | undefined>;
  getClientProjects(): Promise<Project[]>;
  getOwnProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Keywords
  getAllKeywords(): Promise<Keyword[]>;
  getKeywordById(id: number): Promise<Keyword | undefined>;
  getKeywordsByProjectId(projectId: number): Promise<Keyword[]>;
  createKeyword(keyword: InsertKeyword): Promise<Keyword>;
  createKeywordBatch(keywords: InsertKeyword[]): Promise<Keyword[]>;
  updateKeyword(id: number, keyword: Partial<Keyword>): Promise<Keyword | undefined>;
  deleteKeyword(id: number): Promise<boolean>;

  // Clusters
  getAllClusters(): Promise<Cluster[]>;
  getClusterById(id: number): Promise<Cluster | undefined>;
  getClustersByProjectId(projectId: number): Promise<Cluster[]>;
  getKeywordsByClusterId(clusterId: number): Promise<Keyword[]>;
  createCluster(cluster: InsertCluster): Promise<Cluster>;
  updateCluster(id: number, cluster: Partial<Cluster>): Promise<Cluster | undefined>;
  deleteCluster(id: number): Promise<boolean>;

  // Melhorias
  getAllImprovements(): Promise<Improvement[]>;
  getImprovementsByProjectId(projectId: number): Promise<Improvement[]>;
  getImprovementsByProjectIdAndImpact(projectId: number, impact: string): Promise<Improvement[]>;
  createImprovement(improvement: InsertImprovement): Promise<Improvement>;
  updateImprovement(id: number, improvement: Partial<Improvement>): Promise<Improvement | undefined>;

  // Relatórios
  getAllReports(): Promise<Report[]>;
  getReportsByProjectId(projectId: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private keywords: Map<number, Keyword>;
  private clusters: Map<number, Cluster>;
  private improvements: Map<number, Improvement>;
  private reports: Map<number, Report>;

  private projectId: number;
  private keywordId: number;
  private clusterId: number;
  private improvementId: number;
  private reportId: number;

  constructor() {
    this.projects = new Map();
    this.keywords = new Map();
    this.clusters = new Map();
    this.improvements = new Map();
    this.reports = new Map();

    this.projectId = 1;
    this.keywordId = 1;
    this.clusterId = 1;
    this.improvementId = 1;
    this.reportId = 1;

    // Populando com alguns dados de exemplo
    this.initializeData();
  }

  private initializeData() {
    // Projetos exemplo
    const amazonAffiliate = this.createProject({
      name: "AmazonAffiliate.com.br",
      description: "Site de afiliados Amazon com foco em eletrônicos.",
      url: "https://amazonaffiliate.com.br",
      isClient: false,
      type: "affiliate",
    });

    const reviewGadgets = this.createProject({
      name: "ReviewGadgets",
      description: "Site de reviews de gadgets com programa de afiliados.",
      url: "https://reviewgadgets.com.br",
      isClient: false,
      type: "review",
    });
    
    const techStore = this.createProject({
      name: "TechStore",
      description: "E-commerce de produtos de tecnologia.",
      url: "https://techstore.com.br",
      isClient: true,
      type: "ecommerce",
    });
    
    const fitnessStore = this.createProject({
      name: "FitnessStore",
      description: "Loja online de suplementos e equipamentos fitness.",
      url: "https://fitnessstore.com.br",
      isClient: true,
      type: "ecommerce",
    });

    // Atualizando o progresso dos projetos
    this.updateProject(amazonAffiliate.id, { progress: 75 });
    this.updateProject(reviewGadgets.id, { progress: 40 });
    this.updateProject(techStore.id, { progress: 60 });
    this.updateProject(fitnessStore.id, { progress: 85 });

    // Keywords para os projetos
    const keywords = [
      { projectId: amazonAffiliate.id, text: "smartphone samsung", volume: 18600, difficulty: 62, position: 15, trend: "up" },
      { projectId: amazonAffiliate.id, text: "smartphone apple", volume: 25100, difficulty: 72, position: 22, trend: "stable" },
      { projectId: amazonAffiliate.id, text: "smartphone xiaomi", volume: 12400, difficulty: 42, position: 8, trend: "up" },
      { projectId: amazonAffiliate.id, text: "notebook gamer", volume: 15300, difficulty: 51, position: 7, trend: "up" },
      { projectId: amazonAffiliate.id, text: "notebook para estudante", volume: 8200, difficulty: 35, position: 11, trend: "stable" },
      { projectId: amazonAffiliate.id, text: "notebook ssd", volume: 6100, difficulty: 25, position: 9, trend: "stable" },
      { projectId: amazonAffiliate.id, text: "fone de ouvido bluetooth", volume: 22100, difficulty: 58, position: 12, trend: "stable" },
      
      { projectId: reviewGadgets.id, text: "smartphone samsung review", volume: 5600, difficulty: 42, position: 4, trend: "up" },
      { projectId: reviewGadgets.id, text: "melhores smartphones 2023", volume: 12000, difficulty: 68, position: 9, trend: "up" },
      { projectId: reviewGadgets.id, text: "review iphone 15", volume: 18000, difficulty: 75, position: 16, trend: "stable" },
      { projectId: reviewGadgets.id, text: "notebook ou desktop", volume: 7500, difficulty: 48, position: 6, trend: "up" },
      { projectId: reviewGadgets.id, text: "melhor notebook custo benefício", volume: 9900, difficulty: 52, position: 10, trend: "stable" },
      
      { projectId: techStore.id, text: "comprar smartphone", volume: 16500, difficulty: 76, position: 18, trend: "up" },
      { projectId: techStore.id, text: "notebook em promoção", volume: 13200, difficulty: 65, position: 14, trend: "stable" },
      { projectId: techStore.id, text: "monitor gamer", volume: 14800, difficulty: 47, position: 3, trend: "up" },
      { projectId: techStore.id, text: "placa de vídeo rtx", volume: 8700, difficulty: 53, position: 9, trend: "stable" },
      { projectId: techStore.id, text: "ssd 1tb preço", volume: 7600, difficulty: 39, position: 5, trend: "up" },
      { projectId: techStore.id, text: "melhor placa mãe para ryzen", volume: 4300, difficulty: 32, position: 2, trend: "up" },
      
      { projectId: fitnessStore.id, text: "whey protein", volume: 27800, difficulty: 68, position: 14, trend: "stable" },
      { projectId: fitnessStore.id, text: "creatina monohidratada", volume: 16400, difficulty: 51, position: 7, trend: "up" },
      { projectId: fitnessStore.id, text: "suplementos para ganho de massa", volume: 11200, difficulty: 51, position: 8, trend: "up" },
      { projectId: fitnessStore.id, text: "halteres", volume: 9600, difficulty: 32, position: 5, trend: "up" },
    ];

    keywords.forEach(keyword => {
      this.createKeyword(keyword);
    });

    // Criando clusters
    const smartphoneCluster = this.createCluster({
      projectId: amazonAffiliate.id,
      name: "smartphone",
      mainUrl: "/smartphone/",
    });

    const notebookCluster = this.createCluster({
      projectId: amazonAffiliate.id,
      name: "notebook",
      mainUrl: "/notebook/",
    });

    const foneCluster = this.createCluster({
      projectId: amazonAffiliate.id,
      name: "fone",
      mainUrl: "/fone/",
    });

    // Associando keywords a clusters
    this.updateKeyword(1, { clusterId: smartphoneCluster.id });
    this.updateKeyword(2, { clusterId: smartphoneCluster.id });
    this.updateKeyword(3, { clusterId: smartphoneCluster.id });
    this.updateKeyword(4, { clusterId: notebookCluster.id });
    this.updateKeyword(5, { clusterId: notebookCluster.id });
    this.updateKeyword(6, { clusterId: notebookCluster.id });
    this.updateKeyword(7, { clusterId: foneCluster.id });
    
    // Criando clusters para outros projetos
    const smartphoneReviewCluster = this.createCluster({
      projectId: reviewGadgets.id,
      name: "smartphone",
      mainUrl: "/reviews/smartphone/",
    });
    
    const notebookReviewCluster = this.createCluster({
      projectId: reviewGadgets.id,
      name: "notebook",
      mainUrl: "/reviews/notebook/",
    });
    
    const hardwareCluster = this.createCluster({
      projectId: techStore.id,
      name: "hardware",
      mainUrl: "/hardware/",
    });
    
    const smartphoneTechCluster = this.createCluster({
      projectId: techStore.id,
      name: "smartphone",
      mainUrl: "/smartphone/",
    });
    
    const notebookTechCluster = this.createCluster({
      projectId: techStore.id,
      name: "notebook",
      mainUrl: "/notebook/",
    });
    
    const suplementosCluster = this.createCluster({
      projectId: fitnessStore.id,
      name: "suplementos",
      mainUrl: "/suplementos/",
    });
    
    const equipamentosCluster = this.createCluster({
      projectId: fitnessStore.id,
      name: "equipamentos",
      mainUrl: "/equipamentos/",
    });

    // Associando às keywords
    this.updateKeyword(8, { clusterId: smartphoneReviewCluster.id });
    this.updateKeyword(9, { clusterId: smartphoneReviewCluster.id });
    this.updateKeyword(10, { clusterId: smartphoneReviewCluster.id });
    this.updateKeyword(11, { clusterId: notebookReviewCluster.id });
    this.updateKeyword(12, { clusterId: notebookReviewCluster.id });
    
    this.updateKeyword(13, { clusterId: smartphoneTechCluster.id });
    this.updateKeyword(14, { clusterId: notebookTechCluster.id });
    this.updateKeyword(15, { clusterId: hardwareCluster.id });
    this.updateKeyword(16, { clusterId: hardwareCluster.id });
    this.updateKeyword(17, { clusterId: hardwareCluster.id });
    this.updateKeyword(18, { clusterId: hardwareCluster.id });
    
    this.updateKeyword(19, { clusterId: suplementosCluster.id });
    this.updateKeyword(20, { clusterId: suplementosCluster.id });
    this.updateKeyword(21, { clusterId: suplementosCluster.id });
    this.updateKeyword(22, { clusterId: equipamentosCluster.id });

    // Melhorias para o AmazonAffiliate
    this.createImprovement({
      projectId: amazonAffiliate.id,
      problem: "Meta descriptions ausentes",
      impact: "medium",
      pages: "6 páginas",
      recommendation: "Adicionar meta descriptions únicas a todas as páginas",
      status: "pending"
    });

    this.createImprovement({
      projectId: amazonAffiliate.id,
      problem: "Conteúdo duplicado",
      impact: "high",
      pages: "Páginas de categoria",
      recommendation: "Criar conteúdo único para cada página",
      status: "pending"
    });

    // Melhorias para o TechStore
    this.createImprovement({
      projectId: techStore.id,
      problem: "Tempo de carregamento alto (4.2s)",
      impact: "high",
      pages: "Todas",
      recommendation: "Otimizar imagens e implementar lazy loading",
      status: "pending"
    });

    this.createImprovement({
      projectId: techStore.id,
      problem: "URLs não otimizadas",
      impact: "medium",
      pages: "Várias",
      recommendation: "Reorganizar URLs para estrutura semântica",
      status: "pending"
    });

    this.createImprovement({
      projectId: reviewGadgets.id,
      problem: "Conteúdo duplicado em categorias",
      impact: "high",
      pages: "Páginas de categoria",
      recommendation: "Criar conteúdo único para cada página e implementar canonical tags",
      status: "pending"
    });

    this.createImprovement({
      projectId: fitnessStore.id,
      problem: "Cabeçalhos H1 duplicados",
      impact: "low",
      pages: "3 páginas",
      recommendation: "Usar apenas um H1 por página",
      status: "completed"
    });

    this.createImprovement({
      projectId: fitnessStore.id,
      problem: "Falta canonical tags",
      impact: "medium",
      pages: "12 páginas",
      recommendation: "Implementar canonical tags em páginas",
      status: "pending"
    });

    this.createImprovement({
      projectId: amazonAffiliate.id,
      problem: "Imagens sem alt text",
      impact: "low",
      pages: "18 imagens",
      recommendation: "Adicionar texto alt descritivo a todas as imagens",
      status: "pending"
    });

    this.createImprovement({
      projectId: techStore.id,
      problem: "Problemas de mobile-friendliness",
      impact: "high",
      pages: "Várias",
      recommendation: "Ajustar layout responsivo",
      status: "pending"
    });
  }

  // Métodos para projetos
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => b.id - a.id);
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getClientProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.isClient)
      .sort((a, b) => b.id - a.id);
  }

  async getOwnProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => !project.isClient)
      .sort((a, b) => b.id - a.id);
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const id = this.projectId++;
    const now = new Date();
    const project: Project = {
      id,
      ...projectData,
      progress: 0,
      createdAt: now
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectData: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject = { ...project, ...projectData };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    // Apagar o projeto e todas as entidades relacionadas
    const hasProject = this.projects.has(id);
    if (hasProject) {
      this.projects.delete(id);

      // Remover keywords do projeto
      for (const [keywordId, keyword] of this.keywords.entries()) {
        if (keyword.projectId === id) {
          this.keywords.delete(keywordId);
        }
      }

      // Remover clusters do projeto
      for (const [clusterId, cluster] of this.clusters.entries()) {
        if (cluster.projectId === id) {
          this.clusters.delete(clusterId);
        }
      }

      // Remover melhorias do projeto
      for (const [improvementId, improvement] of this.improvements.entries()) {
        if (improvement.projectId === id) {
          this.improvements.delete(improvementId);
        }
      }

      // Remover relatórios do projeto
      for (const [reportId, report] of this.reports.entries()) {
        if (report.projectId === id) {
          this.reports.delete(reportId);
        }
      }
    }
    return hasProject;
  }

  // Métodos para keywords
  async getAllKeywords(): Promise<Keyword[]> {
    return Array.from(this.keywords.values());
  }

  async getKeywordById(id: number): Promise<Keyword | undefined> {
    return this.keywords.get(id);
  }

  async getKeywordsByProjectId(projectId: number): Promise<Keyword[]> {
    return Array.from(this.keywords.values())
      .filter(keyword => keyword.projectId === projectId);
  }

  async createKeyword(keywordData: InsertKeyword): Promise<Keyword> {
    const id = this.keywordId++;
    const now = new Date();
    const keyword: Keyword = {
      id,
      ...keywordData,
      clusterId: null,
      trend: "stable",
      createdAt: now
    };
    this.keywords.set(id, keyword);
    return keyword;
  }

  async createKeywordBatch(keywordsData: InsertKeyword[]): Promise<Keyword[]> {
    const createdKeywords: Keyword[] = [];
    for (const keywordData of keywordsData) {
      const keyword = await this.createKeyword(keywordData);
      createdKeywords.push(keyword);
    }
    return createdKeywords;
  }

  async updateKeyword(id: number, keywordData: Partial<Keyword>): Promise<Keyword | undefined> {
    const keyword = this.keywords.get(id);
    if (!keyword) return undefined;

    const updatedKeyword = { ...keyword, ...keywordData };
    this.keywords.set(id, updatedKeyword);
    return updatedKeyword;
  }

  async deleteKeyword(id: number): Promise<boolean> {
    return this.keywords.delete(id);
  }

  // Métodos para clusters
  async getAllClusters(): Promise<Cluster[]> {
    return Array.from(this.clusters.values());
  }

  async getClusterById(id: number): Promise<Cluster | undefined> {
    return this.clusters.get(id);
  }

  async getClustersByProjectId(projectId: number): Promise<Cluster[]> {
    return Array.from(this.clusters.values())
      .filter(cluster => cluster.projectId === projectId);
  }

  async getKeywordsByClusterId(clusterId: number): Promise<Keyword[]> {
    return Array.from(this.keywords.values())
      .filter(keyword => keyword.clusterId === clusterId);
  }

  async createCluster(clusterData: InsertCluster): Promise<Cluster> {
    const id = this.clusterId++;
    const now = new Date();
    const cluster: Cluster = {
      id,
      ...clusterData,
      createdAt: now
    };
    this.clusters.set(id, cluster);
    return cluster;
  }

  async updateCluster(id: number, clusterData: Partial<Cluster>): Promise<Cluster | undefined> {
    const cluster = this.clusters.get(id);
    if (!cluster) return undefined;

    const updatedCluster = { ...cluster, ...clusterData };
    this.clusters.set(id, updatedCluster);
    return updatedCluster;
  }

  async deleteCluster(id: number): Promise<boolean> {
    // Remover o cluster e desassociar keywords
    const hasCluster = this.clusters.has(id);
    if (hasCluster) {
      this.clusters.delete(id);

      // Desassociar keywords deste cluster
      for (const [keywordId, keyword] of this.keywords.entries()) {
        if (keyword.clusterId === id) {
          this.keywords.set(keywordId, { ...keyword, clusterId: null });
        }
      }
    }
    return hasCluster;
  }

  // Métodos para melhorias
  async getAllImprovements(): Promise<Improvement[]> {
    return Array.from(this.improvements.values());
  }

  async getImprovementsByProjectId(projectId: number): Promise<Improvement[]> {
    return Array.from(this.improvements.values())
      .filter(improvement => improvement.projectId === projectId);
  }

  async getImprovementsByProjectIdAndImpact(projectId: number, impact: string): Promise<Improvement[]> {
    return Array.from(this.improvements.values())
      .filter(improvement => improvement.projectId === projectId && improvement.impact === impact);
  }

  async createImprovement(improvementData: InsertImprovement): Promise<Improvement> {
    const id = this.improvementId++;
    const now = new Date();
    const improvement: Improvement = {
      id,
      ...improvementData,
      createdAt: now
    };
    this.improvements.set(id, improvement);
    return improvement;
  }

  async updateImprovement(id: number, improvementData: Partial<Improvement>): Promise<Improvement | undefined> {
    const improvement = this.improvements.get(id);
    if (!improvement) return undefined;

    const updatedImprovement = { ...improvement, ...improvementData };
    this.improvements.set(id, updatedImprovement);
    return updatedImprovement;
  }

  // Métodos para relatórios
  async getAllReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }

  async getReportsByProjectId(projectId: number): Promise<Report[]> {
    return Array.from(this.reports.values())
      .filter(report => report.projectId === projectId);
  }

  async createReport(reportData: InsertReport): Promise<Report> {
    const id = this.reportId++;
    const now = new Date();
    const report: Report = {
      id,
      ...reportData,
      createdAt: now
    };
    this.reports.set(id, report);
    return report;
  }
}

// Usamos o MemStorage para armazenamento em memória
export const storage = new MemStorage();
