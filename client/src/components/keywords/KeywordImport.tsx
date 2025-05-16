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
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useKeywords } from "@/hooks/use-keywords";
import { useToast } from "@/hooks/use-toast";
import { ProjectSelector } from "@/components/ui/project-selector";

const importFormSchema = z.object({
  projectId: z.string({
    required_error: "Selecione um projeto",
  }),
  keywordsText: z.string().min(3, {
    message: "Digite pelo menos uma keyword",
  }),
});

type ImportFormValues = z.infer<typeof importFormSchema>;

interface KeywordImportProps {
  onComplete: () => void;
}

export function KeywordImport({ onComplete }: KeywordImportProps) {
  const { importKeywords } = useKeywords();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ImportFormValues>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      projectId: "",
      keywordsText: "",
    },
  });

  function onSubmit(values: ImportFormValues) {
    setIsPending(true);
    
    try {
      // Processar texto de keywords (uma por linha)
      const keywordTexts = values.keywordsText
        .split("\n")
        .map(k => k.trim())
        .filter(k => k.length > 0);
      
      // Converter para o formato de keyword
      const keywordsToImport = keywordTexts.map(text => ({
        projectId: parseInt(values.projectId),
        text
      }));
      
      if (keywordsToImport.length === 0) {
        toast({
          title: "Nenhuma keyword válida",
          description: "Digite pelo menos uma keyword válida.",
          variant: "destructive",
        });
        setIsPending(false);
        return;
      }

      // Importar keywords
      importKeywords(keywordsToImport, {
        onSuccess: () => {
          toast({
            title: "Keywords importadas",
            description: `Foram importadas ${keywordsToImport.length} keywords.`,
          });
          onComplete();
        },
        onError: (error) => {
          toast({
            title: "Erro ao importar keywords",
            description: String(error),
            variant: "destructive",
          });
        },
        onSettled: () => setIsPending(false),
      });
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
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keywordsText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords (uma por linha)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite as keywords, uma por linha"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Você pode colar keywords de uma planilha ou arquivo CSV. Uma keyword por linha.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onComplete}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            Importar Keywords
          </Button>
        </div>
      </form>
    </Form>
  );
}
