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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useProjects } from "@/hooks/use-projects";
import { useToast } from "@/hooks/use-toast";

const projectFormSchema = z.object({
  name: z.string().min(3, {
    message: "O nome do projeto deve ter pelo menos 3 caracteres",
  }),
  description: z.string().optional(),
  url: z.string().url({
    message: "Informe uma URL válida",
  }).optional().or(z.literal("")),
  isClient: z.boolean().default(false),
  type: z.string({
    required_error: "Selecione o tipo de projeto",
  }),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  onComplete: () => void;
  initialValues?: Partial<ProjectFormValues>;
  projectId?: number;
}

export function ProjectForm({ onComplete, initialValues, projectId }: ProjectFormProps) {
  const [isPending, setIsPending] = useState(false);
  const { createProject, updateProject } = useProjects();
  const { toast } = useToast();

  const defaultValues: Partial<ProjectFormValues> = {
    name: "",
    description: "",
    url: "",
    isClient: false,
    type: "affiliate",
    ...initialValues,
  };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });

  function onSubmit(values: ProjectFormValues) {
    setIsPending(true);
    
    try {
      if (projectId) {
        // Atualizar projeto existente
        updateProject({ id: projectId, ...values }, {
          onSuccess: () => {
            toast({
              title: "Projeto atualizado",
              description: "O projeto foi atualizado com sucesso.",
            });
            onComplete();
          },
          onError: (error) => {
            toast({
              title: "Erro ao atualizar projeto",
              description: String(error),
              variant: "destructive",
            });
          },
          onSettled: () => setIsPending(false),
        });
      } else {
        // Criar novo projeto
        createProject(values, {
          onSuccess: () => {
            toast({
              title: "Projeto criado",
              description: "O projeto foi criado com sucesso.",
            });
            onComplete();
          },
          onError: (error) => {
            toast({
              title: "Erro ao criar projeto",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Projeto</FormLabel>
              <FormControl>
                <Input placeholder="Nome do projeto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição do projeto"
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
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do Site</FormLabel>
              <FormControl>
                <Input placeholder="https://exemplo.com.br" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Projeto</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de projeto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="affiliate">Site de Afiliados</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="review">Site de Reviews</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isClient"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Projeto de Cliente</FormLabel>
                <FormDescription>
                  Marque esta opção se este for um projeto de cliente
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onComplete}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {projectId ? "Atualizar Projeto" : "Criar Projeto"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
