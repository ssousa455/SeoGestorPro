import { Project } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [_, setLocation] = useLocation();

  const getCardHeaderColor = () => {
    return project.isClient ? "bg-secondary" : "bg-primary";
  };

  return (
    <Card className="overflow-hidden">
      <div className={`px-4 py-3 ${getCardHeaderColor()} text-white`}>
        <h4 className="font-medium">{project.name}</h4>
      </div>
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
        
        <div className="flex items-center space-x-2 text-sm mb-1">
          <span className="font-medium">Keywords:</span>
          <span>{project.id * 2 - 1}</span> {/* Mockup - substituir por dados reais */}
        </div>
        
        <div className="flex items-center space-x-2 text-sm mb-2">
          <span className="font-medium">Clusters:</span>
          <span>{Math.max(1, Math.floor(project.id / 2))}</span> {/* Mockup - substituir por dados reais */}
        </div>
        
        <div className="mb-3">
          <Progress value={project.progress} className="h-2" />
          <div className="flex justify-between text-xs mt-1">
            <span>{project.progress}% de otimização concluída</span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="default" 
            size="sm"
            onClick={() => {
              const route = `/projeto/${project.id}`;
              console.log(`Navegando para: ${route}`);
              setLocation(route);
            }}
          >
            Detalhes
          </Button>
          <span className="text-xs text-muted-foreground self-center">
            {project.isClient ? "Cliente" : "Próprio"}
          </span>
        </div>
      </div>
    </Card>
  );
}
