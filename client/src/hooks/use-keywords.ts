import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Keyword, KeywordOpportunity } from '@/lib/types';

// Hook para gerenciar keywords
export const useKeywords = (projectId?: number) => {
  const queryClient = useQueryClient();
  const queryKey = projectId 
    ? ['/api/keywords', { projectId }] 
    : ['/api/keywords'];

  // Obter todas as keywords ou keywords de um projeto específico
  const keywordsQuery = useQuery<Keyword[]>({
    queryKey,
  });

  // Obter uma keyword específica
  const useKeyword = (id?: number) => {
    return useQuery<Keyword>({
      queryKey: ['/api/keywords', id],
      enabled: !!id,
    });
  };

  // Criar uma keyword
  const createMutation = useMutation({
    mutationFn: async (newKeyword: Omit<Keyword, 'id' | 'createdAt' | 'clusterId' | 'trend'>) => {
      const res = await apiRequest('POST', '/api/keywords', newKeyword);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/keywords'] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['/api/keywords', { projectId }] });
      }
    },
  });

  // Importar keywords em lote
  const importMutation = useMutation({
    mutationFn: async (keywords: Omit<Keyword, 'id' | 'createdAt' | 'clusterId' | 'trend'>[]) => {
      const res = await apiRequest('POST', '/api/keywords/batch', keywords);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/keywords'] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['/api/keywords', { projectId }] });
      }
    },
  });

  // Atualizar uma keyword
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Keyword>) => {
      const res = await apiRequest('PUT', `/api/keywords/${id}`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/keywords'] });
      queryClient.invalidateQueries({ queryKey: ['/api/keywords', variables.id] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['/api/keywords', { projectId }] });
      }
    },
  });

  // Deletar uma keyword
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/keywords/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/keywords'] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['/api/keywords', { projectId }] });
      }
    },
  });

  // Keywords de oportunidade para um projeto
  const keywordOpportunities: KeywordOpportunity[] = [
    {
      text: "notebook para home office",
      volume: 7400,
      difficulty: 28,
      opportunity: "high"
    },
    {
      text: "smartphone com boa câmera",
      volume: 6800,
      difficulty: 32,
      opportunity: "high"
    },
    {
      text: "fone para academia",
      volume: 5200,
      difficulty: 25,
      opportunity: "high"
    },
    {
      text: "monitor para design",
      volume: 3800,
      difficulty: 30,
      opportunity: "medium"
    },
    {
      text: "smartphone dobrável",
      volume: 4200,
      difficulty: 45,
      opportunity: "medium"
    },
    {
      text: "suplementos veganos",
      volume: 3600,
      difficulty: 27,
      opportunity: "high"
    }
  ];

  return {
    keywords: keywordsQuery.data || [],
    isLoading: keywordsQuery.isLoading,
    isError: keywordsQuery.isError,
    error: keywordsQuery.error,
    useKeyword,
    createKeyword: createMutation.mutate,
    isCreating: createMutation.isPending,
    importKeywords: importMutation.mutate,
    isImporting: importMutation.isPending,
    updateKeyword: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteKeyword: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    keywordOpportunities
  };
};
