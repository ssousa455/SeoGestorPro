import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Project } from '@/lib/types';

// Hook para gerenciar projetos
export const useProjects = () => {
  const queryClient = useQueryClient();

  // Obter todos os projetos
  const allProjectsQuery = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Obter um projeto específico
  const useProject = (id?: number) => {
    return useQuery<Project>({
      queryKey: ['/api/projects', id],
      enabled: !!id,
    });
  };

  // Obter projetos próprios
  const ownProjectsQuery = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    select: (data) => data.filter(project => !project.isClient),
  });

  // Obter projetos de clientes
  const clientProjectsQuery = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    select: (data) => data.filter(project => project.isClient),
  });

  // Criar um projeto
  const createMutation = useMutation({
    mutationFn: async (newProject: Omit<Project, 'id' | 'createdAt' | 'progress'>) => {
      const res = await apiRequest('POST', '/api/projects', newProject);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });

  // Atualizar um projeto
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Project>) => {
      const res = await apiRequest('PUT', `/api/projects/${id}`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', variables.id] });
    },
  });

  // Deletar um projeto
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/projects/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });

  return {
    allProjects: allProjectsQuery.data || [],
    ownProjects: ownProjectsQuery.data || [],
    clientProjects: clientProjectsQuery.data || [],
    isLoading: allProjectsQuery.isLoading,
    isError: allProjectsQuery.isError,
    error: allProjectsQuery.error,
    useProject,
    createProject: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateProject: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteProject: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
