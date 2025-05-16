import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProjectSelector } from "@/components/ui/project-selector";
import { useClusters } from "@/hooks/use-clusters";
import { useToast } from "@/hooks/use-toast";
import { Keyword, Cluster } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const clusterFormSchema = z.object({
  projectId: z.string({
    required_error: "Selecione um projeto",
  }),
  name: z.string().min(3, {
    message: "O nome do cluster deve ter pelo menos 3 caracteres",
  }),
  mainUrl: z.string().optional().or(z.literal("")),
  keywords: z.array(z.string()).optional(),
});

type ClusterFormValues = z.infer<typeof clusterFormSchema>;

interface ClusterFormProps {
  onComplete: () => void;
  initialValues?: Partial<Cluster & { keywords?: string[] }>;
  clusterId?: number;
  availableKeywords?: Keyword[];
  isLoadingKeywords?: boolean;
}

export function ClusterForm({ 
  onComplete, 
  initialValues, 
  clusterId,
  availableKeywords = [],
  isLoadingKeywords = false
}: ClusterFormProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(
    initialValues?.projectId ? initialValues.projectId.toString() : undefined
  );

  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(
    initialValues?.keywords || []
  );

  const { createCluster, updateCluster, addKeywordsToCluster } = useClusters();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const defaultValues: Partial<ClusterFormValues> = {
    projectId: initialValues?.projectId?.toString() || "",
    name: initialValues?.name || "",
    mainUrl: initialValues?.mainUrl || "",
    keywords: initialValues?.keywords || [],
  };

  const form = useForm<ClusterFormValues>({
    resolver: zodResolver(clusterFormSchema),
    defaultValues,
  });

  // Filtrar keywords do projeto que não estão em nenhum cluster ou estão neste cluster
  const availableProjectKeywords = availableKeywords.filter(
    (keyword) => 
      !keyword.clusterId || 
      (clusterId && keyword.clusterId === clusterId)
  );

  const toggleKeyword = (keywordId: string) => {
    setSelectedKeywords((prev) => {
      if (prev.includes(keywordId)) {
        return prev.filter((id) => id !== keywordId);
      } else {
        return [...prev, keywordId];
      }
    });
  };

  function onSubmit(values: ClusterFormValues) {
    setIsPending(true);
    
    try {
      const clusterData = {
        projectId: parseInt(values.projectId),
        name: values.name,
        mainUrl: values.mainUrl || `/${values.name.toLowerCase()}/`,
      };

      if (clusterId) {
        // Atualizar cluster existente
        updateCluster({ id: clusterId, ...clusterData }, {
          onSuccess: (updatedCluster) => {
            // Adicionar keywords selecionadas ao cluster
            if (selectedKeywords.length > 0) {
              const keywordIds = selectedKeywords.map(id => parseInt(id));
              addKeywordsToCluster({ clusterId: updatedCluster.id, keywordIds });
            }
            
            toast({
              title: "Cluster atualizado",
              description: "O cluster foi atualizado com sucesso.",
            });
            onComplete();
          },
          onError: (error) => {
            toast({
              title: "Erro ao atualizar cluster",
              description: String(error),
              variant: "destructive",
            });
          },
          onSettled: () => setIsPending(false),
        });
      } else {
        // Criar novo cluster
        createCluster(clusterData, {
          onSuccess: (newCluster) => {
            // Adicionar keywords selecionadas ao cluster
            if (selectedKeywords.length > 0) {
              const keywordIds = selectedKeywords.map(id => parseInt(id));
              addKeywordsToCluster({ clusterId: newCluster.id, keywordIds });
            }
            
            toast({
              title: "Cluster criado",
              description: "O cluster foi criado com sucesso.",
            });
            onComplete();
          },
          onError: (error) => {
            toast({
              title: "Erro ao criar cluster",
              description: String(error),
              variant: "destructive",
            });
          },
          onSettled: () => setIsPending(false),
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Projeto</FormLabel>
              <ProjectSelector
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setSelectedProjectId(value);
                  setSelectedKeywords([]);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Cluster</FormLabel>
              <FormControl>
                <Input placeholder="Nome do cluster (ex: smartphone)" {...field} />
              </FormControl>
              <FormDescription>
                O nome do cluster deve representar o tema principal das keywords agrupadas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mainUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Principal (opcional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="/tema-principal/" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                URL da página principal deste cluster. Se não for preenchido, será gerado automaticamente.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Keywords</FormLabel>
          <FormDescription className="mb-2">
            Selecione as keywords que farão parte deste cluster.
          </FormDescription>
          
          {isLoadingKeywords ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : selectedProjectId ? (
            availableProjectKeywords.length > 0 ? (
              <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                <div className="space-y-2">
                  {availableProjectKeywords.map((keyword) => (
                    <div key={keyword.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`keyword-${keyword.id}`}
                        checked={selectedKeywords.includes(keyword.id.toString())}
                        onCheckedChange={() => toggleKeyword(keyword.id.toString())}
                      />
                      <label
                        htmlFor={`keyword-${keyword.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {keyword.text}
                        {keyword.volume && (
                          <Badge variant="outline" className="ml-2">
                            {keyword.volume} vol
                          </Badge>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border rounded-md p-4 text-center text-muted-foreground">
                Nenhuma keyword disponível para este projeto.
                <p className="text-xs mt-1">
                  Adicione keywords na página de Análise de Keywords.
                </p>
              </div>
            )
          ) : (
            <div className="border rounded-md p-4 text-center text-muted-foreground">
              Selecione um projeto para ver as keywords disponíveis.
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onComplete}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isPending || !selectedProjectId}
          >
            {clusterId ? "Atualizar Cluster" : "Criar Cluster"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
