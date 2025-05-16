import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Improvement, ImprovementStatus } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ImprovementTableProps {
  improvements: Improvement[];
  onEdit?: (improvement: Improvement) => void;
  onStatusChange?: (id: number, status: ImprovementStatus) => void;
}

export function ImprovementTable({
  improvements,
  onEdit,
  onStatusChange,
}: ImprovementTableProps) {
  // Funções para formatação
  const getImpactBadgeClass = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in_progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case "high":
        return "Alto";
      case "medium":
        return "Médio";
      case "low":
        return "Baixo";
      default:
        return impact;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído";
      case "in_progress":
        return "Em Progresso";
      case "pending":
        return "Pendente";
      default:
        return status;
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Problema</TableHead>
            <TableHead>Impacto</TableHead>
            <TableHead>Página(s)</TableHead>
            <TableHead>Recomendação</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {improvements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Nenhuma melhoria encontrada
              </TableCell>
            </TableRow>
          ) : (
            improvements.map((improvement) => (
              <TableRow key={improvement.id}>
                <TableCell className="font-medium">{improvement.problem}</TableCell>
                <TableCell>
                  <Badge className={getImpactBadgeClass(improvement.impact)}>
                    {getImpactLabel(improvement.impact)}
                  </Badge>
                </TableCell>
                <TableCell>{improvement.pages || "-"}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {improvement.recommendation}
                </TableCell>
                <TableCell>
                  {onStatusChange ? (
                    <Select
                      defaultValue={improvement.status}
                      onValueChange={(value) => 
                        onStatusChange(improvement.id, value as ImprovementStatus)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="in_progress">Em Progresso</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusBadgeClass(improvement.status)}>
                      {getStatusLabel(improvement.status)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(improvement)}
                    >
                      Editar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
