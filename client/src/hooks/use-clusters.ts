import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Cluster, Keyword } from '@/lib/types';

// Hook para gerenciar clusters
export const useClusters = (projectId?: number) => {
  const queryClient = useQueryClient();
  const queryKey = projectId 
    ? ['/api/clusters', { projectId }] 
    : ['/api/clusters'];

  // Obter todos os clusters ou clusters de um projeto específico
  const clustersQuery = useQuery<Cluster[]>({
    queryKey,
  });

  // Obter um cluster específico
  const useCluster = (id?: number) => {
    return useQuery<Cluster>({
      queryKey: ['/api/clusters', id],
      enabled: !!id,
    });
  };

  // Obter as keywords de um cluster
  const useClusterKeywords = (clusterId?: number) => {
    return useQuery<Keyword[]>({
      queryKey: ['/api/keywords'],
      select: (data) => data.filter(keyword => keyword.clusterId === clusterId),
      enabled: !!clusterId,
    });
  };

  // Criar um cluster
  const createMutation = useMutation({
    mutationFn: async (newCluster: Omit<Cluster, 'id' | 'createdAt'>) => {
      const res = await apiRequest('POST', '/api/clusters', newCluster);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clusters'] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['/api/clusters', { projectId }] });
      }
    },
  });

  // Atualizar um cluster
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Cluster>) => {
      const res = await apiRequest('PUT', `/api/clusters/${id}`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/clusters'] });
      queryClient.invalidateQueries({ queryKey: ['/api/clusters', variables.id] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['/api/clusters', { projectId }] });
      }
    },
  });

  // Deletar um cluster
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/clusters/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clusters'] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['/api/clusters', { projectId }] });
      }
      // Também invalidar consultas de keywords já que os clusterId serão removidos
      queryClient.invalidateQueries({ queryKey: ['/api/keywords'] });
    },
  });

  // Adicionar keywords a um cluster
  const addKeywordsToCluster = useMutation({
    mutationFn: async ({ clusterId, keywordIds }: { clusterId: number, keywordIds: number[] }) => {
      const promises = keywordIds.map(id => 
        apiRequest('PUT', `/api/keywords/${id}`, { clusterId })
      );
      await Promise.all(promises);
      return { clusterId, keywordIds };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/keywords'] });
    },
  });

  // Remover keywords de um cluster
  const removeKeywordsFromCluster = useMutation({
    mutationFn: async (keywordIds: number[]) => {
      const promises = keywordIds.map(id => 
        apiRequest('PUT', `/api/keywords/${id}`, { clusterId: null })
      );
      await Promise.all(promises);
      return keywordIds;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/keywords'] });
    },
  });

  return {
    clusters: clustersQuery.data || [],
    isLoading: clustersQuery.isLoading,
    isError: clustersQuery.isError,
    error: clustersQuery.error,
    useCluster,
    useClusterKeywords,
    createCluster: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateCluster: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteCluster: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    addKeywordsToCluster: addKeywordsToCluster.mutate,
    isAddingKeywords: addKeywordsToCluster.isPending,
    removeKeywordsFromCluster: removeKeywordsFromCluster.mutate,
    isRemovingKeywords: removeKeywordsFromCluster.isPending
  };
};
