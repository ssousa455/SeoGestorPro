import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKeywords } from "@/hooks/use-keywords";
import { useClusters } from "@/hooks/use-clusters";
import { Cluster, Keyword } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ProjectSelector } from "@/components/ui/project-selector";

const keywordFormSchema = z.object({
  projectId: z.string({
    required_error: "Selecione um projeto",
  }),
  text: z.string().min(3, {
    message: "A keyword deve ter pelo menos 3 caracteres",
  }),
  volume: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
  difficulty: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined)
    .refine(val => !val || (val >= 0 && val <= 100), {
      message: "A dificuldade deve estar entre 0 e 100",
    }),
  position: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined)
    .refine(val => !val || val > 0, {
      message: "A posição deve ser maior que 0",
    }),
  clusterId: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
});

type KeywordFormValues = z.infer<typeof keywordFormSchema>;

interface KeywordFormProps {
  onComplete: () => void;
  initialValues?: Partial<Keyword>;
  clusters?: Cluster[];
}

export function KeywordForm({ onComplete, initialValues, clusters = [] }: KeywordFormProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(
    initialValues?.projectId 
      ? initialValues.projectId.toString() 
      : ""
  );
  
  const { createKeyword, updateKeyword } = useKeywords();
  const { clusters: projectClusters, isLoading: isLoadingClusters } = useClusters(
    selectedProjectId ? parseInt(selectedProjectId) : undefined
  );
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const defaultValues: Partial<KeywordFormValues> = {
    projectId: initialValues?.projectId?.toString() || "",
    text: initialValues?.text || "",
    volume: initialValues?.volume?.toString() || "",
    difficulty: initialValues?.difficulty?.toString() || "",
    position: initialValues?.position?.toString() || "",
    clusterId: initialValues?.clusterId?.toString() || "",
  };

  const form = useForm<KeywordFormValues>({
    resolver: zodResolver(keywordFormSchema),
    defaultValues,
  });

  function onSubmit(values: KeywordFormValues) {
    setIsPending(true);
    
    try {
      const keywordData = {
        projectId: parseInt(values.projectId),
        text: values.text,
        volume: values.volume,
        difficulty: values.difficulty,
        position: values.position,
        clusterId: values.clusterId,
      };

      if (initialValues?.id) {
        // Atualizar keyword existente
        updateKeyword({ id: initialValues.id, ...keywordData }, {
          onSuccess: () => {
            toast({
              title: "Keyword atualizada",
              description: "A keyword foi atualizada com sucesso.",
            });
            onComplete();
          },
          onError: (error) => {
            toast({
              title: "Erro ao atualizar keyword",
              description: String(error),
              variant: "destructive",
            });
          },
          onSettled: () => setIsPending(false),
        });
      } else {
        // Criar nova keyword
        createKeyword(keywordData, {
          onSuccess: () => {
            toast({
              title: "Keyword criada",
              description: "A keyword foi criada com sucesso.",
            });
            onComplete();
          },
          onError: (error) => {
            toast({
              title: "Erro ao criar keyword",
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
                  form.setValue("clusterId", "");
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keyword</FormLabel>
              <FormControl>
                <Input placeholder="Digite a keyword" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="volume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume Mensal</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Volume de buscas"
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
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dificuldade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0-100"
                    min="0"
                    max="100"
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
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posição Atual</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Posição no Google"
                    min="1"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="clusterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cluster</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value?.toString() || ""}
                disabled={!selectedProjectId || isLoadingClusters}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cluster (opcional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Nenhum cluster</SelectItem>
                  {projectClusters.map((cluster) => (
                    <SelectItem key={cluster.id} value={cluster.id.toString()}>
                      {cluster.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onComplete}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {initialValues?.id ? "Atualizar Keyword" : "Adicionar Keyword"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
