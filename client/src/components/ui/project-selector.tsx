import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

interface ProjectSelectorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  label?: string;
  includeAllOption?: boolean;
}

export function ProjectSelector({
  value,
  onChange,
  label = "Selecione o Projeto",
  includeAllOption = false,
}: ProjectSelectorProps) {
  const { allProjects, isLoading, isError } = useProjects();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <Skeleton className="w-full h-10" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="text-sm text-destructive">
          Erro ao carregar projetos
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="project-selector">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="project-selector" className="w-full">
          <SelectValue placeholder="Selecione um projeto" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {includeAllOption && (
              <SelectItem value="all">Todos os projetos</SelectItem>
            )}
            <SelectLabel>Meus Projetos</SelectLabel>
            {allProjects
              .filter(p => !p.isClient)
              .map(project => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            <SelectLabel>Projetos de Clientes</SelectLabel>
            {allProjects
              .filter(p => p.isClient)
              .map(project => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
