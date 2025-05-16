import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProjects } from "@/hooks/use-projects";
import { useImprovements } from "@/hooks/use-improvements";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardData } from "@/lib/types";
import { useState } from "react";
import { ProjectForm } from "@/components/projects/ProjectForm";
import {
  LayoutDashboard,
  Search,
  AlertTriangle,
  TrendingUp,
  Plus,
} from "lucide-react";

export default function Dashboard() {
  const [_, setLocation] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { isUpdating: isUpdatingImprovement } = useImprovements();

  // Buscar dados do dashboard
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
  });

  // Resolver melhoria
  const handleResolveImprovement = (id: number, projectId: number) => {
    setLocation(`/melhorias-seo?projectId=${projectId}&improvementId=${id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Projetos Recentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Projetos Ativos"
          value={dashboardData?.activeProjects || 0}
          subtitle={`${dashboardData?.ownProjects || 0} próprios, ${dashboardData?.clientProjects || 0} clientes`}
          icon={LayoutDashboard}
        />
        <MetricCard
          title="Keywords Rastreadas"
          value={dashboardData?.trackedKeywords || 0}
          subtitle={`${dashboardData?.growingKeywords || 0} em crescimento`}
          icon={Search}
        />
        <MetricCard
          title="Tarefas Pendentes"
          value={dashboardData?.pendingImprovements || 0}
          subtitle={`${dashboardData?.highPriorityImprovements || 0} de alta prioridade`}
          icon={AlertTriangle}
          iconColor="text-warning"
        />
        <MetricCard
          title="Melhorias Sugeridas"
          value={dashboardData?.pendingImprovements || 0}
          subtitle={`${dashboardData?.implementedImprovements || 0} implementadas`}
          icon={TrendingUp}
          iconColor="text-secondary"
        />
      </div>

      {/* Projetos Recentes */}
      <div>
        <h3 className="text-lg font-medium mb-4">Projetos Recentes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardData?.recentProjects && dashboardData.recentProjects.length > 0 ? (
            dashboardData.recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <p className="text-muted-foreground col-span-2 text-center py-4">
              Nenhum projeto encontrado. Comece criando um novo projeto.
            </p>
          )}
        </div>
      </div>

      {/* Melhorias Recomendadas */}
      <div>
        <h3 className="text-lg font-medium mb-4">Melhorias Recomendadas</h3>
        <div className="bg-card rounded-lg shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Problema</TableHead>
                <TableHead>Impacto</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData?.recentImprovements && dashboardData.recentImprovements.length > 0 ? (
                dashboardData.recentImprovements.map((improvement) => (
                  <TableRow key={improvement.id}>
                    <TableCell className="font-medium">
                      {dashboardData.recentProjects.find(p => p.id === improvement.projectId)?.name || "Projeto"}
                    </TableCell>
                    <TableCell>{improvement.problem}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        improvement.impact === "high" 
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : improvement.impact === "medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}>
                        {improvement.impact === "high" ? "Alto" 
                          : improvement.impact === "medium" ? "Médio" 
                          : "Baixo"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="default" 
                        size="sm"
                        disabled={isUpdatingImprovement}
                        onClick={() => handleResolveImprovement(improvement.id, improvement.projectId)}
                      >
                        Resolver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhuma melhoria pendente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal de criação de projeto */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Projeto</DialogTitle>
          </DialogHeader>
          <ProjectForm onComplete={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
