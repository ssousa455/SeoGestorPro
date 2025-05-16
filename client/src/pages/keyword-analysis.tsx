import { useState } from "react";
import { useKeywords } from "@/hooks/use-keywords";
import { useClusters } from "@/hooks/use-clusters";
import { KeywordTable } from "@/components/keywords/KeywordTable";
import { KeywordForm } from "@/components/keywords/KeywordForm";
import { KeywordImport } from "@/components/keywords/KeywordImport";
import { ProjectSelector } from "@/components/ui/project-selector";
import { Button } from "@/components/ui/button";
import { Keyword, KeywordOpportunity } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Upload } from "lucide-react";
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

export default function KeywordAnalysis() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [isKeywordDialogOpen, setIsKeywordDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);

  const { keywords, isLoading, deleteKeyword, keywordOpportunities, createKeyword } = useKeywords(
    selectedProjectId ? parseInt(selectedProjectId) : undefined
  );

  const { clusters, isLoading: isClustersLoading } = useClusters(
    selectedProjectId ? parseInt(selectedProjectId) : undefined
  );

  const handleEdit = (keyword: Keyword) => {
    setSelectedKeyword(keyword);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (keyword: Keyword) => {
    setSelectedKeyword(keyword);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedKeyword) {
      deleteKeyword(selectedKeyword.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAddOpportunity = (opportunity: KeywordOpportunity) => {
    if (!selectedProjectId) return;
    
    const keywordData = {
      projectId: parseInt(selectedProjectId),
      text: opportunity.text,
      volume: opportunity.volume,
      difficulty: opportunity.difficulty
    };
    
    createKeyword(keywordData);
  };

  const getOpportunityBadgeClass = (level: string) => {
    switch (level) {
      case "high":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Análise de Keywords</h2>
        <div className="space-x-2">
          <Button 
            onClick={() => setIsImportDialogOpen(true)}
            disabled={!selectedProjectId}
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar Keywords
          </Button>
          <Button 
            onClick={() => setIsKeywordDialogOpen(true)}
            disabled={!selectedProjectId}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Keyword
          </Button>
        </div>
      </div>

      {/* Seletor de Projeto */}
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <ProjectSelector
          value={selectedProjectId}
          onChange={setSelectedProjectId}
        />
      </div>

      {/* Tabela de Keywords */}
      {selectedProjectId ? (
        <div>
          <h3 className="text-lg font-medium mb-4">Keywords</h3>
          <KeywordTable 
            keywords={keywords} 
            isLoading={isLoading || isClustersLoading}
            clusters={clusters}
            onEdit={handleEdit}
            onDelete={(id) => {
              const keyword = keywords.find(k => k.id === id);
              if (keyword) handleDelete(keyword);
            }}
          />
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Selecione um Projeto</h3>
          <p className="text-muted-foreground">
            Selecione um projeto para ver e gerenciar suas keywords.
          </p>
        </div>
      )}

      {/* Oportunidades de Keywords */}
      {selectedProjectId && (
        <div>
          <h3 className="text-lg font-medium mb-4">Oportunidades de Keywords</h3>
          <div className="bg-card rounded-lg shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Dificuldade</TableHead>
                  <TableHead>Oportunidade</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywordOpportunities.map((opportunity, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{opportunity.text}</TableCell>
                    <TableCell>{opportunity.volume || "-"}</TableCell>
                    <TableCell>{opportunity.difficulty ? `${opportunity.difficulty}/100` : "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${getOpportunityBadgeClass(opportunity.opportunity)}`}>
                        {opportunity.opportunity === "high" ? "Alta" : opportunity.opportunity === "medium" ? "Média" : "Baixa"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAddOpportunity(opportunity)}
                      >
                        Adicionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Modal para adicionar keyword */}
      <Dialog open={isKeywordDialogOpen} onOpenChange={setIsKeywordDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Keyword</DialogTitle>
          </DialogHeader>
          <KeywordForm 
            initialValues={selectedProjectId ? { projectId: parseInt(selectedProjectId) } : undefined}
            onComplete={() => setIsKeywordDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Modal para importar keywords */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Importar Keywords</DialogTitle>
          </DialogHeader>
          <KeywordImport onComplete={() => setIsImportDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Modal para editar keyword */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Keyword</DialogTitle>
          </DialogHeader>
          {selectedKeyword && (
            <KeywordForm 
              initialValues={selectedKeyword}
              onComplete={() => setIsEditDialogOpen(false)}
              clusters={clusters} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Keyword</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a keyword "{selectedKeyword?.text}"? Esta ação não pode ser desfeita.
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
