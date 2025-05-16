import { Cluster } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useKeywords } from "@/hooks/use-keywords";
import { Skeleton } from "@/components/ui/skeleton";

interface ClusterCardProps {
  cluster: Cluster;
  onViewStructure?: (cluster: Cluster) => void;
}

export function ClusterCard({ cluster, onViewStructure }: ClusterCardProps) {
  const { keywords, isLoading } = useKeywords(cluster.projectId);
  
  // Filtrar keywords pelo clusterId
  const clusterKeywords = keywords.filter(k => k.clusterId === cluster.id);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Cluster: {cluster.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">Total de keywords: {clusterKeywords.length}</p>
        
        {isLoading ? (
          <div className="space-y-2 mb-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mb-3">
            {clusterKeywords.map(keyword => (
              <Badge 
                key={keyword.id} 
                variant="secondary"
                className="px-3 py-1 text-xs rounded-full"
              >
                {keyword.text}
              </Badge>
            ))}
            {clusterKeywords.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma keyword neste cluster</p>
            )}
          </div>
        )}
        
        {onViewStructure && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewStructure(cluster)}
          >
            Ver Estrutura
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
