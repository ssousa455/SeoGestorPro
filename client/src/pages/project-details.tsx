import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useProjects } from "@/hooks/use-projects";
import { useKeywords } from "@/hooks/use-keywords";
import { useClusters } from "@/hooks/use-clusters";
import { useImprovements } from "@/hooks/use-improvements";
import { Badge } from "@/components/ui/badge";
import type { Project, Keyword, Cluster, Improvement } from "@/lib/types";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const projectId = parseInt(id);
  const { toast } = useToast();
  
  console.log("ID do projeto:", id);
  
  // Obter dados do projeto
  const { allProjects: projects, isLoading: isLoadingProjects } = useProjects();
  const { keywords, isLoading: isLoadingKeywords } = useKeywords(projectId);
  const { clusters, isLoading: isLoadingClusters } = useClusters(projectId);
  const { improvements, isLoading: isLoadingImprovements } = useImprovements(projectId);
  
  const [project, setProject] = useState<Project | null>(null);
  
  useEffect(() => {
    console.log('Buscando projeto com ID:', projectId, 'a partir de', projects?.length, 'projetos');
    if (projects && projectId) {
      const foundProject = projects.find(p => p.id === projectId);
      console.log('Resultado da busca:', foundProject);
      if (foundProject) {
        setProject(foundProject);
      } else {
        toast({
          title: "Projeto não encontrado",
          description: "Não foi possível encontrar o projeto solicitado.",
          variant: "destructive"
        });
        navigate("/meus-projetos");
      }
    }
  }, [projects, projectId, navigate, toast]);
  
  if (isLoadingProjects || !project) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">{project.description || "Sem descrição"}</p>
        </div>
        <Button onClick={() => navigate("/meus-projetos")}>Voltar</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">URL:</span>
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {project.url}
                  </a>
                ) : "Não definido"}
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tipo:</span>
                <span>{project.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Cliente:</span>
                <Badge variant={project.isClient ? "default" : "outline"}>
                  {project.isClient ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Progresso:</span>
                <span>{project.progress}%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Criado em:</span>
                <span>{new Date(project.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingKeywords ? (
              <Skeleton className="h-[100px] w-full" />
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span>{keywords?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Em clusters:</span>
                  <span>{keywords?.filter(k => k.clusterId).length || 0}</span>
                </div>
                <div className="mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => navigate("/analise-keywords")}
                  >
                    Ver keywords
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingClusters ? (
              <Skeleton className="h-[100px] w-full" />
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span>{clusters?.length || 0}</span>
                </div>
                <div className="mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => navigate("/clusters")}
                  >
                    Ver clusters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="improvements">
        <TabsList>
          <TabsTrigger value="improvements">Melhorias SEO</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="improvements" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Melhorias SEO Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingImprovements ? (
                <Skeleton className="h-[150px] w-full" />
              ) : improvements && improvements.length > 0 ? (
                <div className="space-y-4">
                  {improvements.slice(0, 5).map(improvement => (
                    <div key={improvement.id} className="border-b pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{improvement.problem}</h4>
                          <p className="text-sm text-gray-500">{improvement.recommendation}</p>
                        </div>
                        <Badge variant={
                          improvement.impact === "high" ? "destructive" :
                          improvement.impact === "medium" ? "default" : 
                          "outline"
                        }>
                          {improvement.impact === "high" ? "Alto" :
                           improvement.impact === "medium" ? "Médio" : "Baixo"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/melhorias-seo")}
                  >
                    Ver todas as melhorias
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500">Não há melhorias SEO registradas para este projeto.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Keywords Rastreadas</h4>
                    <p className="text-2xl font-bold">{keywords?.length || 0}</p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Clusters Criados</h4>
                    <p className="text-2xl font-bold">{clusters?.length || 0}</p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Melhorias Pendentes</h4>
                    <p className="text-2xl font-bold">
                      {improvements?.filter(i => i.status === "pending").length || 0}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button onClick={() => navigate(`/relatorios?projectId=${project.id}`)}>
                    Ver relatório completo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}