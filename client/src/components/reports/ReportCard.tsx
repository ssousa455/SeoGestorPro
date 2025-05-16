import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Share2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  month: string;
  position: number;
}

interface MetricsData {
  trackedKeywords: number;
  firstPageKeywords: number;
  firstPagePercentage: number;
  implementedImprovements: number;
  totalImprovements: number;
  positionChange: string;
}

interface ReportCardProps {
  title: string;
  description: string;
  date: string;
  chartData: ChartData[];
  metrics: MetricsData;
  recommendations: string[];
  onExport?: () => void;
  onShare?: () => void;
}

export function ReportCard({
  title,
  description,
  date,
  chartData,
  metrics,
  recommendations,
  onExport,
  onShare,
}: ReportCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Transformar os dados do gráfico para visualização
  // Inverter as posições para que sejam mais intuitivas (menor número = melhor posição)
  const transformedChartData = chartData.map(item => ({
    ...item,
    // Usando 30 como posição máxima para visualização
    // Isso cria uma escala onde valores menores (melhores posições) aparecem mais altos no gráfico
    visualPosition: 30 - item.position
  }));

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-medium mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Gerado em: {date}
          </div>
        </div>

        {/* Gráfico */}
        <div className="h-64 mb-6 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={transformedChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                reversed 
                domain={[0, 30]} 
                ticks={[1, 5, 10, 20, 30]} 
                label={{ value: 'Posição', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip 
                formatter={(value: any, name: string) => {
                  // Converter de volta para a posição real
                  if (name === "visualPosition") {
                    return [30 - Number(value), "Posição"];
                  }
                  return [value, name];
                }}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="visualPosition"
                stroke="var(--chart-1)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Posição"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Métricas Principais</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total de Keywords Rastreadas:</span>
                <span className="font-semibold">{metrics.trackedKeywords}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Keywords na Primeira Página:</span>
                <span className="font-semibold">
                  {metrics.firstPageKeywords} ({metrics.firstPagePercentage}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Melhorias Implementadas:</span>
                <span className="font-semibold">
                  {metrics.implementedImprovements} de {metrics.totalImprovements} ({Math.round((metrics.implementedImprovements / metrics.totalImprovements) * 100)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Mudanças em Posições:</span>
                <span className={`font-semibold ${metrics.positionChange.startsWith('+') ? 'text-secondary' : 'text-destructive'}`}>
                  {metrics.positionChange} {metrics.positionChange.startsWith('+') ? '(melhora)' : '(piora)'}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Recomendações</h4>
            <ul className="space-y-2 text-sm list-disc pl-5">
              {recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex space-x-3">
          <Button onClick={onExport}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Exportar PDF</span>
          </Button>
          <Button variant="outline" onClick={onShare}>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Compartilhar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
