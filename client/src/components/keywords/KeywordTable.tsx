import { useState } from "react";
import { Keyword } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface KeywordTableProps {
  keywords: Keyword[];
  isLoading?: boolean;
  clusters?: { id: number; name: string }[];
  onEdit?: (keyword: Keyword) => void;
  onDelete?: (id: number) => void;
}

export function KeywordTable({
  keywords,
  isLoading = false,
  clusters = [],
  onEdit,
  onDelete,
}: KeywordTableProps) {
  const [sortField, setSortField] = useState<keyof Keyword | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Keyword) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === "up") return <ArrowUpIcon className="h-4 w-4 text-secondary" />;
    if (trend === "down") return <ArrowDownIcon className="h-4 w-4 text-destructive" />;
    return <MinusIcon className="h-4 w-4 text-muted-foreground" />;
  };

  const sortedKeywords = [...keywords].sort((a, b) => {
    if (!sortField) return 0;

    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (fieldA === null || fieldA === undefined) return 1;
    if (fieldB === null || fieldB === undefined) return -1;

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }

    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
    }

    return 0;
  });

  const getClusterName = (clusterId?: number | null) => {
    if (!clusterId) return "-";
    const cluster = clusters.find((c) => c.id === clusterId);
    return cluster ? cluster.name : "-";
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("text")}
            >
              Keyword
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("volume")}
            >
              Volume
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("difficulty")}
            >
              Dificuldade
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("position")}
            >
              Posição
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("trend")}
            >
              Tendência
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("clusterId")}
            >
              Cluster
            </TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedKeywords.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Nenhuma keyword encontrada
              </TableCell>
            </TableRow>
          ) : (
            sortedKeywords.map((keyword) => (
              <TableRow key={keyword.id}>
                <TableCell className="font-medium">{keyword.text}</TableCell>
                <TableCell>{keyword.volume || "-"}</TableCell>
                <TableCell>
                  {keyword.difficulty ? `${keyword.difficulty}/100` : "-"}
                </TableCell>
                <TableCell>
                  {keyword.position ? `#${keyword.position}` : "-"}
                </TableCell>
                <TableCell>{getTrendIcon(keyword.trend)}</TableCell>
                <TableCell>{getClusterName(keyword.clusterId)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(keyword)}
                      >
                        Editar
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(keyword.id)}
                      >
                        Excluir
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
