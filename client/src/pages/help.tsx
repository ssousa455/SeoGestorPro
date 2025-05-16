import { useState } from "react";
import { TabsFilter } from "@/components/ui/tabs-filter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export default function Help() {
  const [activeTab, setActiveTab] = useState("guia-usuario");

  const tabOptions = [
    { id: "guia-usuario", label: "Guia do Usuário" },
    { id: "perguntas-frequentes", label: "Perguntas Frequentes" },
    { id: "tutoriais-videos", label: "Tutoriais em Vídeo" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Ajuda</h2>

      <Card>
        <CardContent className="p-1">
          <TabsFilter
            options={tabOptions}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {/* Guia do Usuário */}
          {activeTab === "guia-usuario" && (
            <div className="p-4">
              <h3 className="text-lg font-medium mb-4">Guia do Usuário</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Introdução</h4>
                  <p className="mb-3">Bem-vindo ao SEO Project Manager, um sistema completo para gerenciar seus projetos SEO de forma organizada e eficiente. Este guia irá ajudá-lo a aproveitar todas as funcionalidades disponíveis.</p>
                  <p>O sistema permite importar keywords, criar projetos, analisar posições, identificar oportunidades, organizar keywords em clusters, identificar melhorias necessárias e gerando relatórios.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Começando</h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>No Dashboard, clique em "Novo Projeto" para criar um novo projeto.</li>
                    <li>Preencha os detalhes no formulário "Novo Projeto", como o nome do projeto, URL, nicho e descrição.</li>
                    <li>Adicione keywords ao projeto na guia "Análise de Keywords".</li>
                    <li>Após criar o projeto, você o verá no Dashboard e poderá começar a gerenciá-lo.</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Projetos</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Projetos Próprios:</strong> Seus sites pessoais, blogs, sites de afiliados, etc.
                    </li>
                    <li>
                      <strong>Projetos de Clientes:</strong> Sites de clientes para os quais você oferece serviços de SEO.
                    </li>
                  </ul>
                  <p className="mt-2">Para cada projeto, você pode:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Importar keywords</li>
                    <li>Organizar keywords em clusters</li>
                    <li>Identificar melhorias necessárias</li>
                    <li>Gerar relatórios de desempenho</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Análise de Keywords</h4>
                  <p>A página de Análise de Keywords permite:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Importar keywords para um projeto (manualmente ou via arquivo)</li>
                    <li>Visualizar métricas importantes (volume, dificuldade, posição atual)</li>
                    <li>Identificar tendências de crescimento ou queda</li>
                    <li>Descobrir novas oportunidades de keywords</li>
                  </ul>
                  <p className="mt-2">Para importar keywords, clique em "Importar Keywords" na página de Análise de Keywords e siga as instruções.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Clusters</h4>
                  <p>Clusters são agrupamentos de keywords relacionadas que podem ser usadas para criar uma estrutura de silos para seu site.</p>
                  <p>Na página de Clusters, você pode:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Analisar grupos de keywords relacionadas</li>
                    <li>Identificar temas principais</li>
                    <li>Organizar conteúdo de forma mais eficiente</li>
                  </ul>
                  <p className="mt-2">Para criar um novo cluster, clique em "Adicionar Novo Cluster" e selecione as keywords a serem agrupadas.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Melhorias SEO</h4>
                  <p>A página de Melhorias SEO ajuda a identificar problemas e oportunidades de otimização. Aqui você pode:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Executar auditorias SEO nos seus projetos</li>
                    <li>Ver recomendações organizadas por impacto (Alto, Médio, Baixo)</li>
                    <li>Acompanhar o progresso das implementações</li>
                    <li>Verificar melhorias de posição resultantes das ações</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Relatórios</h4>
                  <p>A página de Relatórios permite gerar relatórios detalhados sobre o desempenho SEO dos projetos.</p>
                  <p>Você pode gerar relatórios de:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Desempenho geral</li>
                    <li>Análise de Keywords</li>
                    <li>Implementação de Melhorias</li>
                    <li>Comparativo entre projetos</li>
                  </ul>
                  <p className="mt-2">Os relatórios podem ser exportados e compartilhados facilmente.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Configurações</h4>
                  <p>Na página de Configurações, você pode:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Personalizar a aparência do sistema</li>
                    <li>Configurar notificações</li>
                    <li>Importar e exportar dados</li>
                    <li>Gerenciar integrações com outras ferramentas</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Perguntas Frequentes */}
          {activeTab === "perguntas-frequentes" && (
            <div className="p-4">
              <h3 className="text-lg font-medium mb-4">Perguntas Frequentes</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Como importar keywords de uma planilha?</h4>
                  <p>Acesse a página "Análise de Keywords", clique em "Importar Keywords" e selecione a opção "Importar CSV". O formato do arquivo deve ter uma keyword por linha, com colunas para volume e dificuldade (opcionais).</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Como criar um cluster automaticamente?</h4>
                  <p>Na página "Clusters", clique em "Adicionar Novo Cluster" e depois em "Gerar Clusters Automáticos". O sistema analisará suas keywords e sugerirá agrupamentos baseados em similaridade semântica.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Os dados são armazenados localmente ou na nuvem?</h4>
                  <p>Por padrão, os dados são armazenados localmente no seu navegador. Você pode exportá-los a qualquer momento para backup. Também é possível configurar o armazenamento em nuvem através das integrações disponíveis.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Como posso verificar o progresso de um projeto?</h4>
                  <p>No Dashboard, você pode ver o progresso de cada projeto através das barras de porcentagem. Para detalhes mais específicos, acesse o projeto e vá para a guia "Relatórios".</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">É possível integrar com o Google Search Console ou Analytics?</h4>
                  <p>Sim. Vá para "Configurações", encontre a seção "Integrações" e clique em "Conectar" ao lado da integração desejada. Você precisará fornecer as credenciais necessárias.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Como exportar um relatório para apresentar a um cliente?</h4>
                  <p>Na página "Relatórios", gere um relatório para o projeto desejado e clique em "Exportar PDF". Você também pode usar o botão "Compartilhar" para enviar um link direto para o cliente.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Posso usar o sistema em mais de um computador?</h4>
                  <p>Sim. Vá para "Configurações", exporte seus dados em um computador e importe-os no outro. Se preferir, configure o armazenamento em nuvem para sincronização automática.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tutoriais em Vídeo */}
          {activeTab === "tutoriais-videos" && (
            <div className="p-4">
              <h3 className="text-lg font-medium mb-4">Tutoriais em Vídeo</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <VideoTutorialCard 
                  title="Introdução ao SEO Project Manager"
                  duration="5:23"
                  date="15/03/2023"
                />
                
                <VideoTutorialCard 
                  title="Como Criar e Gerenciar Projetos"
                  duration="8:47"
                  date="18/03/2023"
                />
                
                <VideoTutorialCard 
                  title="Análise de Keywords e Oportunidades"
                  duration="12:10"
                  date="22/03/2023"
                />
                
                <VideoTutorialCard 
                  title="Criando Clusters Eficientes"
                  duration="9:32"
                  date="28/03/2023"
                />
                
                <VideoTutorialCard 
                  title="Implementando Melhorias SEO"
                  duration="14:25"
                  date="05/04/2023"
                />
                
                <VideoTutorialCard 
                  title="Gerando e Interpretando Relatórios"
                  duration="10:18"
                  date="12/04/2023"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para cartão de tutorial em vídeo
interface VideoTutorialCardProps {
  title: string;
  duration: string;
  date: string;
}

function VideoTutorialCard({ title, duration, date }: VideoTutorialCardProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="bg-muted h-40 flex items-center justify-center relative group">
        <PlayCircle className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Assistir
        </Button>
      </div>
      <div className="p-3">
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground">Duração: {duration} - Publicado em {date}</p>
      </div>
    </div>
  );
}
