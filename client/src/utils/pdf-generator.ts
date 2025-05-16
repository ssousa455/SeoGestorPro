import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
// Remover a dependência do locale que pode estar causando problemas
// import { pt } from 'date-fns/locale';

// Tipos necessários para o relatório
interface ReportMetrics {
  trackedKeywords: number;
  firstPageKeywords: number;
  firstPagePercentage: number;
  implementedImprovements: number;
  totalImprovements: number;
  positionChange: string;
}

interface ChartDataPoint {
  month: string;
  position: number;
}

interface ReportData {
  id: number;
  title: string;
  description: string;
  date: string;
  projectName?: string;
  chart: {
    data: ChartDataPoint[];
  };
  metrics: ReportMetrics;
  recommendations: string[];
}

// Função para gerar o PDF do relatório
export const generateReportPDF = (report: ReportData, projectName?: string): void => {
  // Criar um novo documento PDF
  const doc = new jsPDF();
  
  // Definir fontes e tamanhos
  const titleFont = 'helvetica';
  const titleFontSize = 20;
  const subtitleFontSize = 14;
  const normalFontSize = 12;
  const smallFontSize = 10;
  
  // Configurar data formatada (simplificada)
  const currentDate = format(new Date(), "dd/MM/yyyy");
  
  // Adicionar logo e cabeçalho
  doc.setFontSize(titleFontSize);
  doc.setFont(titleFont, 'bold');
  doc.setTextColor(0, 51, 102); // Azul escuro profissional
  doc.text('Relatório SEO Profissional', 105, 20, { align: 'center' });
  
  // Adicionar título do relatório
  doc.setFontSize(subtitleFontSize);
  doc.setTextColor(0, 0, 0);
  doc.text(report.title, 105, 30, { align: 'center' });
  
  // Adicionar informações do projeto
  doc.setFontSize(normalFontSize);
  doc.setFont(titleFont, 'normal');
  const reportProject = projectName || 'Todos os projetos';
  doc.text(`Projeto: ${reportProject}`, 14, 45);
  doc.text(`Data de Geração: ${currentDate}`, 14, 52);
  doc.text(`Período: ${report.date}`, 14, 59);
  
  // Adicionar descrição do relatório
  doc.setFontSize(normalFontSize);
  doc.setFont(titleFont, 'italic');
  const splitDescription = doc.splitTextToSize(report.description, 180);
  doc.text(splitDescription, 14, 70);
  
  // Seção de Métricas Principais
  doc.setFontSize(subtitleFontSize);
  doc.setFont(titleFont, 'bold');
  doc.text('Métricas Principais', 14, 90);
  
  // Tabela de métricas
  const metricsTableData = [
    ['Métrica', 'Valor'],
    ['Keywords Rastreadas', report.metrics.trackedKeywords.toString()],
    ['Keywords na Primeira Página', `${report.metrics.firstPageKeywords} (${report.metrics.firstPagePercentage}%)`],
    ['Melhorias Implementadas', `${report.metrics.implementedImprovements} de ${report.metrics.totalImprovements}`],
    ['Variação de Posições', report.metrics.positionChange]
  ];
  
  (doc as any).autoTable({
    startY: 95,
    head: [metricsTableData[0]],
    body: metricsTableData.slice(1),
    theme: 'grid',
    headStyles: {
      fillColor: [0, 51, 102],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    },
    styles: {
      fontSize: smallFontSize
    }
  });
  
  // Seção de Recomendações
  const tableEndY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(subtitleFontSize);
  doc.setFont(titleFont, 'bold');
  doc.text('Recomendações', 14, tableEndY);
  
  // Lista de recomendações
  doc.setFontSize(normalFontSize);
  doc.setFont(titleFont, 'normal');
  let yPosition = tableEndY + 10;
  
  report.recommendations.forEach((recommendation, index) => {
    const bulletPoint = `${index + 1}. `;
    const splitRecommendation = doc.splitTextToSize(recommendation, 170);
    
    doc.text(bulletPoint, 14, yPosition);
    doc.text(splitRecommendation, 22, yPosition);
    
    // Calcular a próxima posição Y com base no número de linhas
    yPosition += 7 * splitRecommendation.length;
  });
  
  // Adicionar gráfico de posições (representação visual simplificada)
  const chartStartY = Math.max(yPosition + 10, 200);
  doc.setFontSize(subtitleFontSize);
  doc.setFont(titleFont, 'bold');
  doc.text('Evolução de Posições', 105, chartStartY, { align: 'center' });
  
  // Configuração do gráfico
  const chartWidth = 160;
  const chartHeight = 60;
  const chartStartX = 25;
  const chartEndY = chartStartY + 10;
  
  // Desenhar os eixos
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(chartStartX, chartEndY, chartStartX, chartEndY + chartHeight); // Eixo Y
  doc.line(chartStartX, chartEndY + chartHeight, chartStartX + chartWidth, chartEndY + chartHeight); // Eixo X
  
  // Encontrar posição mínima e máxima para escala
  const positions = report.chart.data.map(item => item.position);
  const minPosition = Math.min(...positions);
  const maxPosition = Math.max(...positions);
  const range = maxPosition - minPosition;
  
  // Desenhar pontos e linhas do gráfico
  doc.setDrawColor(0, 102, 204); // Azul
  doc.setFillColor(0, 102, 204);
  
  const monthWidth = chartWidth / (report.chart.data.length - 1);
  
  // Adicionar meses no eixo X
  doc.setFontSize(8);
  doc.setFont(titleFont, 'normal');
  report.chart.data.forEach((dataPoint, index) => {
    const x = chartStartX + (index * monthWidth);
    doc.text(dataPoint.month, x, chartEndY + chartHeight + 10, { align: 'center' });
  });
  
  // Adicionar posições no eixo Y (invertido para o gráfico)
  for (let i = 0; i <= 5; i++) {
    const position = Math.round(minPosition + (range / 5) * i);
    const y = chartEndY + chartHeight - (chartHeight / 5) * i;
    doc.text(position.toString(), chartStartX - 5, y, { align: 'right' });
    
    // Linhas de grade horizontais
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.line(chartStartX, y, chartStartX + chartWidth, y);
  }
  
  // Desenhar os pontos e linhas do gráfico
  doc.setDrawColor(0, 102, 204);
  doc.setLineWidth(1.5);
  doc.setFillColor(0, 102, 204);
  
  let prevX: number, prevY: number;
  
  report.chart.data.forEach((dataPoint, index) => {
    const x = chartStartX + (index * monthWidth);
    // Calcular posição Y invertida (posição alta = valor Y baixo)
    const normalizedPosition = (dataPoint.position - minPosition) / (range || 1);
    const y = chartEndY + chartHeight - (normalizedPosition * chartHeight);
    
    // Desenhar círculo para cada ponto
    doc.circle(x, y, 1.5, 'F');
    
    // Desenhar linha entre pontos
    if (index > 0) {
      doc.line(prevX, prevY, x, y);
    }
    
    prevX = x;
    prevY = y;
  });
  
  // Adicionar rodapé
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Relatório gerado por SEO Project Manager © 2024', 105, pageHeight - 10, { align: 'center' });
  
  // Salvar o PDF
  doc.save(`Relatorio_SEO_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};