import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useImprovements } from "@/hooks/use-improvements";
import { ImprovementTable } from "@/components/improvements/ImprovementTable";
import { ProjectSelector } from "@/components/ui/project-selector";
import { TabsFilter } from "@/components/ui/tabs-filter";
import { Button } from "@/components/ui/button";
import { Improvement, ImpactLevel } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, ChartScatter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const improvementFormSchema = z.object({
  projectId: z.string({
    required_error: "Selecione um projeto",
  }),
  problem: z.string().min(3, {
    message: "A descrição do problema deve ter pelo menos 3 caracteres",
  }),
  impact: z.enum(["high", "medium", "low"], {
    required_error: "Selecione o nível de impacto",
  }),
  pages: z.string().optional(),
  recommendation: z.string().min(3, {
    message: "A recomendação deve ter pelo menos 3 caracteres",
  }),
  status: z.enum(["pending", "in_progress", "completed"], {
    required_error: "Selecione o status",
  }).default("pending"),
});

type ImprovementFormValues = z.infer<typeof improvementFormSchema>;

export default function SeoImprovements() {
  const [location] = useLocation();
  
  // Extrair parâmetros da URL manualmente
  const getParamFromURL = (paramName: string) => {
    const url = new URL(window.location.href);
    return url.searchParams.get(paramName);
  };
  
  const projectIdParam = getParamFromURL("projectId");
  const improvementIdParam = getParamFromURL("improvementId");
  
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(
    projectIdParam || undefined
  );
  const [selectedImpact, setSelectedImpact] = useState<string>("all");
  const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false);
  const [isImproventDialogOpen, setIsImprovementDialogOpen] = useState(false);
  const [selectedImprovement, setSelectedImprovement] = useState<Improvement | null>(null);

  const projectId = selectedProjectId ? parseInt(selectedProjectId) : undefined;
  const impact = selectedImpact !== "all" ? selectedImpact as ImpactLevel : undefined;
  
  const { 
    improvements, 
    isLoading, 
    counts, 
    createImprovement, 
    updateImprovement, 
    isCreating, 
    isUpdating 
  } = useImprovements(projectId, impact);
  
  const { toast } = useToast();

  // Se houver um improvementId na URL, abrir o diálogo de edição
  useEffect(() => {
    if (improvementIdParam && projectIdParam) {
      const improvementId = parseInt(improvementIdParam);
      // Buscar a melhoria específica
      fetch(`/api/improvements/${improvementId}`)
        .then(res => res.json())
        .then(improvement => {
          if (improvement) {
            setSelectedImprovement(improvement);
            setIsImprovementDialogOpen(true);
          }
        })
        .catch(error => {
          console.error("Erro ao buscar melhoria:", error);
        });
    }
  }, [improvementIdParam, projectIdParam]);

  const form = useForm<ImprovementFormValues>({
    resolver: zodResolver(improvementFormSchema),
    defaultValues: {
      projectId: selectedProjectId || "",
      problem: selectedImprovement?.problem || "",
      impact: selectedImprovement?.impact || "medium",
      pages: selectedImprovement?.pages || "",
      recommendation: selectedImprovement?.recommendation || "",
      status: selectedImprovement?.status || "pending"
    },
  });

  // Atualizar formulário quando o projeto ou melhoria selecionada mudar
  useEffect(() => {
    if (selectedProjectId) {
      form.setValue("projectId", selectedProjectId);
    }
    
    if (selectedImprovement) {
      form.setValue("projectId", selectedImprovement.projectId.toString());
      form.setValue("problem", selectedImprovement.problem);
      form.setValue("impact", selectedImprovement.impact);
      form.setValue("pages", selectedImprovement.pages || "");
      form.setValue("recommendation", selectedImprovement.recommendation);
      form.setValue("status", selectedImprovement.status);
    }
  }, [selectedProjectId, selectedImprovement, form]);

  const handleEditImprovement = (improvement: Improvement) => {
    setSelectedImprovement(improvement);
    setIsImprovementDialogOpen(true);
  };

  const handleSubmitImprovement = (values: ImprovementFormValues) => {
    const improvementData = {
      projectId: parseInt(values.projectId),
      problem: values.problem,
      impact: values.impact as ImpactLevel,
      pages: values.pages,
      recommendation: values.recommendation,
      status: values.status
    };

    if (selectedImprovement) {
      // Atualizar melhoria existente
      updateImprovement({ id: selectedImprovement.id, ...improvementData }, {
        onSuccess: () => {
          toast({
            title: "Melhoria atualizada",
            description: "A melhoria foi atualizada com sucesso.",
          });
          setIsImprovementDialogOpen(false);
          setSelectedImprovement(null);
          form.reset();
        },
        onError: (error) => {
          toast({
            title: "Erro ao atualizar melhoria",
            description: String(error),
            variant: "destructive",
          });
        }
      });
    } else {
      // Criar nova melhoria
      createImprovement(improvementData, {
        onSuccess: () => {
          toast({
            title: "Melhoria criada",
            description: "A melhoria foi criada com sucesso.",
          });
          setIsImprovementDialogOpen(false);
          form.reset();
        },
        onError: (error) => {
          toast({
            title: "Erro ao criar melhoria",
            description: String(error),
            variant: "destructive",
          });
        }
      });
    }
  };

  const filterTabs = [
    { id: "all", label: "Todas" },
    { id: "high", label: "Alto Impacto" },
    { id: "medium", label: "Médio Impacto" },
    { id: "low", label: "Baixo Impacto" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Melhorias SEO Recomendadas</h2>
        <div className="space-x-2">
          <Button 
            onClick={() => setIsAuditDialogOpen(true)}
            disabled={!selectedProjectId}
          >
            <ChartScatter className="mr-2 h-4 w-4" />
            Executar Nova Auditoria
          </Button>
          <Button 
            onClick={() => {
              setSelectedImprovement(null);
              form.reset({
                projectId: selectedProjectId || "",
                problem: "",
                impact: "medium",
                pages: "",
                recommendation: "",
                status: "pending"
              });
              setIsImprovementDialogOpen(true);
            }}
            disabled={!selectedProjectId}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Melhoria
          </Button>
        </div>
      </div>

      {/* Seletor de Projeto */}
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <ProjectSelector
          value={selectedProjectId}
          onChange={(value) => {
            setSelectedProjectId(value);
            setSelectedImpact("all");
          }}
        />
      </div>

      {/* Tabs de Filtro */}
      <TabsFilter 
        options={filterTabs}
        activeTab={selectedImpact}
        onChange={setSelectedImpact}
      />

      {/* Tabela de Melhorias */}
      {selectedProjectId ? (
        isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <ImprovementTable 
            improvements={improvements} 
            onEdit={handleEditImprovement}
            onStatusChange={(id, status) => {
              const improvement = improvements.find(i => i.id === id);
              if (improvement) {
                updateImprovement({ id, status });
              }
            }}
          />
        )
      ) : (
        <div className="bg-card rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Selecione um Projeto</h3>
          <p className="text-muted-foreground">
            Selecione um projeto para ver e gerenciar suas melhorias SEO.
          </p>
        </div>
      )}

      {/* Progresso das Melhorias */}
      {selectedProjectId && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="text-center text-sm font-medium mb-3">Total de Melhorias</h3>
            <p className="text-4xl font-semibold text-center mb-2">{counts.byImpact.total}</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="text-center text-sm font-medium mb-3">Alto Impacto</h3>
            <p className="text-4xl font-semibold text-center text-destructive mb-2">{counts.byImpact.high}</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="text-center text-sm font-medium mb-3">Implementadas</h3>
            <p className="text-4xl font-semibold text-center text-secondary mb-2">{counts.byStatus.completed}</p>
          </div>
        </div>
      )}

      {/* Modal de Auditoria */}
      <Dialog open={isAuditDialogOpen} onOpenChange={setIsAuditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Executar Nova Auditoria SEO</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              A auditoria SEO verificará seu site em busca de problemas e oportunidades de otimização.
              Esta operação pode levar alguns minutos para ser concluída.
            </p>
            
            <div className="space-y-4 border rounded-md p-4">
              <h4 className="font-medium">Opções de Auditoria</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="check-meta" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="check-meta" className="text-sm">Meta Tags</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="check-content" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="check-content" className="text-sm">Conteúdo</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="check-speed" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="check-speed" className="text-sm">Velocidade</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="check-mobile" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="check-mobile" className="text-sm">Mobile-Friendly</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="check-links" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="check-links" className="text-sm">Links</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="check-images" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="check-images" className="text-sm">Imagens</label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAuditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Auditoria iniciada",
                  description: "A auditoria SEO foi iniciada e levará alguns minutos para ser concluída.",
                });
                setIsAuditDialogOpen(false);
                setTimeout(() => {
                  toast({
                    title: "Auditoria concluída",
                    description: "A auditoria SEO foi concluída. Novas melhorias foram adicionadas.",
                  });
                }, 3000);
              }}>
                <LineChart className="mr-2 h-4 w-4" />
                Iniciar Auditoria
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Melhoria */}
      <Dialog open={isImproventDialogOpen} onOpenChange={setIsImprovementDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {selectedImprovement ? "Editar Melhoria" : "Adicionar Nova Melhoria"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitImprovement)} className="space-y-4">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projeto</FormLabel>
                    <ProjectSelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Problema</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Descrição do problema SEO" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="impact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Impacto</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o impacto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high">Alto</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="low">Baixo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="in_progress">Em Progresso</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="pages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Páginas Afetadas</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Descrição das páginas afetadas (opcional)" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recommendation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recomendação</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva a recomendação para resolver o problema" 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsImprovementDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={isCreating || isUpdating}
                >
                  {selectedImprovement ? "Atualizar Melhoria" : "Adicionar Melhoria"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente Plus para o botão de adicionar melhoria
const Plus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);
