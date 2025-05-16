import { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import { useClusters } from "@/hooks/use-clusters";
import { useKeywords } from "@/hooks/use-keywords";
import { ClusterCard } from "@/components/clusters/ClusterCard";
import { ClusterForm } from "@/components/clusters/ClusterForm";
import { ProjectSelector } from "@/components/ui/project-selector";
import { Button } from "@/components/ui/button";
import { Cluster } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Clusters() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [isClusterDialogOpen, setIsClusterDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStructureDialogOpen, setIsStructureDialogOpen] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);

  const projectId = selectedProjectId ? parseInt(selectedProjectId) : undefined;
  
  const { clusters, isLoading, deleteCluster } = useClusters(projectId);
  const { keywords, isLoading: isKeywordsLoading } = useKeywords(projectId);

  const handleEdit = (cluster: Cluster) => {
    setSelectedCluster(cluster);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (cluster: Cluster) => {
    setSelectedCluster(cluster);
    setIsDeleteDialogOpen(true);
  };

  const handleViewStructure = (cluster: Cluster) => {
    setSelectedCluster(cluster);
    setIsStructureDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCluster) {
      deleteCluster(selectedCluster.id);
      setIsDeleteDialogOpen(false);
    }
  };

  // Obter keywords para um cluster
  const getClusterKeywords = (clusterId: number) => {
    return keywords.filter(k => k.clusterId === clusterId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Clusters de Keywords</h2>
        <Button 
          onClick={() => setIsClusterDialogOpen(true)}
          disabled={!selectedProjectId}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Novo Cluster
        </Button>
      </div>

      {/* Seletor de Projeto */}
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <ProjectSelector
          value={selectedProjectId}
          onChange={setSelectedProjectId}
        />
      </div>

      {/* Lista de Clusters */}
      {selectedProjectId ? (
        isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : clusters.length > 0 ? (
          <div className="space-y-4">
            {clusters.map((cluster) => (
              <div key={cluster.id} className="relative group">
                <ClusterCard 
                  cluster={cluster} 
                  onViewStructure={handleViewStructure}
                />
                <div className="absolute top-4 right-4 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleEdit(cluster)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(cluster)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Nenhum cluster encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Crie clusters para organizar suas keywords em grupos temáticos.
            </p>
            <Button onClick={() => setIsClusterDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Cluster
            </Button>
          </div>
        )
      ) : (
        <div className="bg-card rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Selecione um Projeto</h3>
          <p className="text-muted-foreground">
            Selecione um projeto para ver e gerenciar seus clusters de keywords.
          </p>
        </div>
      )}

      {/* Estrutura de Silos Recomendada */}
      {selectedProjectId && clusters.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Estrutura de Silos Recomendada</h3>
          <div className="bg-card rounded-lg shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cluster</TableHead>
                  <TableHead>Página Principal</TableHead>
                  <TableHead>Subpáginas Recomendadas</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clusters.map((cluster) => {
                  const clusterKeywords = getClusterKeywords(cluster.id);
                  const recommendedSubpages = Math.min(
                    Math.ceil(clusterKeywords.length / 3),
                    3
                  );
                  
                  return (
                    <TableRow key={cluster.id}>
                      <TableCell className="font-medium">{cluster.name}</TableCell>
                      <TableCell>{cluster.mainUrl || `/${cluster.name}/`}</TableCell>
                      <TableCell>{recommendedSubpages} subpáginas</TableCell>
                      <TableCell>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleViewStructure(cluster)}
                        >
                          Ver Estrutura
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Modal para adicionar cluster */}
      <Dialog open={isClusterDialogOpen} onOpenChange={setIsClusterDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cluster</DialogTitle>
          </DialogHeader>
          <ClusterForm 
            initialValues={selectedProjectId ? { projectId: parseInt(selectedProjectId) } : undefined}
            onComplete={() => setIsClusterDialogOpen(false)} 
            availableKeywords={keywords}
            isLoadingKeywords={isKeywordsLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Modal para editar cluster */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Cluster</DialogTitle>
          </DialogHeader>
          {selectedCluster && (
            <ClusterForm 
              initialValues={selectedCluster}
              clusterId={selectedCluster.id}
              onComplete={() => setIsEditDialogOpen(false)}
              availableKeywords={keywords}
              isLoadingKeywords={isKeywordsLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de estrutura de silos */}
      <Dialog open={isStructureDialogOpen} onOpenChange={setIsStructureDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Estrutura Recomendada: {selectedCluster?.name}</DialogTitle>
          </DialogHeader>
          {selectedCluster && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Página Principal</h3>
                <div className="p-3 bg-muted rounded-md">
                  <p className="font-mono">{selectedCluster.mainUrl || `/${selectedCluster.name}/`}</p>
                  <p className="text-sm mt-1">Keyword principal: <span className="font-medium">{selectedCluster.name}</span></p>
                </div>
              </div>
              
              {selectedCluster && !isKeywordsLoading && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Subpáginas Sugeridas</h3>
                  {getClusterKeywords(selectedCluster.id).length > 0 ? (
                    <div className="space-y-2">
                      {getClusterKeywords(selectedCluster.id)
                        .slice(0, 3)
                        .map((keyword, idx) => (
                          <div key={keyword.id} className="p-3 bg-muted rounded-md">
                            <p className="font-mono">{selectedCluster.mainUrl || `/${selectedCluster.name}/`}{keyword.text.replace(/\s+/g, '-').toLowerCase()}/</p>
                            <p className="text-sm mt-1">Keyword principal: <span className="font-medium">{keyword.text}</span></p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Nenhuma keyword associada a este cluster. Adicione keywords para obter sugestões de subpáginas.
                    </p>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Recomendações</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Mantenha a estrutura de URLs consistente para melhor organização semântica</li>
                  <li>Use a keyword principal no título, H1 e meta description de cada página</li>
                  <li>Crie links internos entre as páginas do mesmo cluster</li>
                  <li>Adicione breadcrumbs para melhorar a navegação e indexação</li>
                </ul>
              </div>
              
              <div className="flex justify-end pt-2">
                <Button onClick={() => setIsStructureDialogOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Cluster</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cluster "{selectedCluster?.name}"? Esta ação não pode ser desfeita.
              As keywords associadas a este cluster serão desvinculadas, mas não excluídas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
