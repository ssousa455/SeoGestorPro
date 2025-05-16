import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Improvement, ImpactLevel } from '@/lib/types';

// Hook para gerenciar melhorias
export const useImprovements = (projectId?: number, impact?: ImpactLevel) => {
  const queryClient = useQueryClient();
  let queryKey = ['/api/improvements'];
  
  if (projectId && impact) {
    queryKey = ['/api/improvements', { projectId, impact }];
  } else if (projectId) {
    queryKey = ['/api/improvements', { projectId }];
  }

  // Obter todas as melhorias ou melhorias filtradas
  const improvementsQuery = useQuery<Improvement[]>({
    queryKey,
  });

  // Criar uma melhoria
  const createMutation = useMutation({
    mutationFn: async (newImprovement: Omit<Improvement, 'id' | 'createdAt'>) => {
      const res = await apiRequest('POST', '/api/improvements', newImprovement);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/improvements'] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['/api/improvements', { projectId }] });
        if (impact) {
          queryClient.invalidateQueries({ queryKey: ['/api/improvements', { projectId, impact }] });
        }
      }
    },
  });

  // Atualizar uma melhoria
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Improvement>) => {
      const res = await apiRequest('PUT', `/api/improvements/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/improvements'] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['/api/improvements', { projectId }] });
        if (impact) {
          queryClient.invalidateQueries({ queryKey: ['/api/improvements', { projectId, impact }] });
        }
      }
      // Invalidar também os dados do dashboard
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
    },
  });

  // Contar melhorias por impacto
  const countByImpact = (improvements: Improvement[]) => {
    if (!improvements) return { high: 0, medium: 0, low: 0, total: 0 };
    
    return {
      high: improvements.filter(i => i.impact === 'high').length,
      medium: improvements.filter(i => i.impact === 'medium').length,
      low: improvements.filter(i => i.impact === 'low').length,
      total: improvements.length
    };
  };

  // Contar melhorias por status
  const countByStatus = (improvements: Improvement[]) => {
    if (!improvements) return { pending: 0, in_progress: 0, completed: 0 };
    
    return {
      pending: improvements.filter(i => i.status === 'pending').length,
      in_progress: improvements.filter(i => i.status === 'in_progress').length,
      completed: improvements.filter(i => i.status === 'completed').length
    };
  };

  return {
    improvements: improvementsQuery.data || [],
    isLoading: improvementsQuery.isLoading,
    isError: improvementsQuery.isError,
    error: improvementsQuery.error,
    counts: {
      byImpact: countByImpact(improvementsQuery.data || []),
      byStatus: countByStatus(improvementsQuery.data || [])
    },
    createImprovement: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateImprovement: updateMutation.mutate,
    isUpdating: updateMutation.isPending
  };
};
