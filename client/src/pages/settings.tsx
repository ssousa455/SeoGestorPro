import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { Save, Trash2, Download, Upload, Link, LockKeyhole } from "lucide-react";

export default function Settings() {
  const { setTheme, isDark } = useTheme();
  const { toast } = useToast();
  const [autoSave, setAutoSave] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [email, setEmail] = useState("");
  const [analyticsId, setAnalyticsId] = useState("");
  const [username, setUsername] = useState("Usuário");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveChanges = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram salvas com sucesso.",
    });
  };

  const handleClearData = () => {
    toast({
      title: "Dados limpos",
      description: "Todos os dados armazenados localmente foram removidos.",
    });
  };

  const handleExportData = () => {
    // Simulação de exportação de dados
    const appData = {
      settings: {
        theme: isDark ? "dark" : "light",
        autoSave,
        emailNotifications,
        email,
      },
      // Outros dados do aplicativo...
    };
    
    const dataStr = JSON.stringify(appData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = "seo-project-manager-data.json";
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Dados exportados",
      description: "Seus dados foram exportados com sucesso.",
    });
  };

  const handleImportData = () => {
    // Na implementação real, aqui teria um seletor de arquivo
    toast({
      title: "Dados importados",
      description: "Seus dados foram importados com sucesso.",
    });
  };

  const handleConnectGSC = () => {
    toast({
      title: "Conexão solicitada",
      description: "Redirecionando para a autenticação do Google Search Console...",
    });
  };

  const handleVerifyAnalytics = () => {
    if (!analyticsId) {
      toast({
        title: "ID obrigatório",
        description: "Por favor, informe o ID do Google Analytics.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "ID verificado",
      description: "O ID do Google Analytics foi verificado com sucesso.",
    });
  };

  const handleUpdatePassword = () => {
    if (!currentPassword) {
      toast({
        title: "Senha atual obrigatória",
        description: "Por favor, informe sua senha atual.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A nova senha e a confirmação não são iguais.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Senha atualizada",
      description: "Sua senha foi atualizada com sucesso.",
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Configurações</h2>
        <Button onClick={handleSaveChanges}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Geral</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium">Modo Escuro</h4>
                  <p className="text-xs text-muted-foreground">Ativa o tema escuro para melhor visualização à noite</p>
                </div>
                <Switch 
                  checked={isDark} 
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium">Salvar Automaticamente</h4>
                  <p className="text-xs text-muted-foreground">Salva alterações automaticamente sem precisar confirmar</p>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>
            </div>
          </div>

          <hr className="border-border" />

          <div>
            <h3 className="text-lg font-medium mb-4">Armazenamento</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Armazenamento Local</h4>
                <p className="text-xs text-muted-foreground mb-2">Gerencia dados armazenados no navegador</p>
                <Button onClick={handleClearData} variant="secondary">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpar Dados
                </Button>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Exportar Dados</h4>
                <p className="text-xs text-muted-foreground mb-2">Exporta todos os dados para um arquivo</p>
                <Button onClick={handleExportData} variant="secondary">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Importar Dados</h4>
                <p className="text-xs text-muted-foreground mb-2">Importa dados de um arquivo</p>
                <Button onClick={handleImportData} variant="secondary">
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </Button>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          <div>
            <h3 className="text-lg font-medium mb-4">Notificações</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium">Notificações por E-mail</h4>
                  <p className="text-xs text-muted-foreground">Receber notificações por e-mail sobre atualizações importantes</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div>
                <Label htmlFor="emailNotifs" className="text-sm font-medium">E-mail para notificações</Label>
                <Input 
                  id="emailNotifs" 
                  type="email" 
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <hr className="border-border" />

          <div>
            <h3 className="text-lg font-medium mb-4">Integrações</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium">Google Search Console</h4>
                  <p className="text-xs text-muted-foreground">Integração com Google Search Console para importação de dados</p>
                </div>
                <Button onClick={handleConnectGSC} variant="outline">
                  <Link className="mr-2 h-4 w-4" />
                  Conectar
                </Button>
              </div>
              <div>
                <Label htmlFor="googleAnalytics" className="text-sm font-medium">ID do Analytics</Label>
                <div className="flex space-x-2 mt-2">
                  <Input 
                    id="googleAnalytics" 
                    placeholder="UA-XXXXXXXXX" 
                    value={analyticsId}
                    onChange={(e) => setAnalyticsId(e.target.value)}
                  />
                  <Button onClick={handleVerifyAnalytics} variant="secondary">Verificar</Button>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          <div>
            <h3 className="text-lg font-medium mb-4">Conta e Segurança</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="username" className="text-sm font-medium">Nome do Usuário</Label>
                <Input 
                  id="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="currentPassword" className="text-sm font-medium">Senha Atual</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  placeholder="Sua senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-sm font-medium">Nova Senha</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  placeholder="Nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Nova Senha</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Confirme a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleUpdatePassword} className="mt-2">
                <LockKeyhole className="mr-2 h-4 w-4" />
                Atualizar Senha
              </Button>
            </div>
          </div>

          <hr className="border-border" />

          <div>
            <h3 className="text-lg font-medium mb-4">Sobre</h3>
            <p className="text-sm text-muted-foreground mb-2">SEO Project Manager v1.0.0</p>
            <p className="text-sm text-muted-foreground mb-4">
              Um sistema para gerenciar seus projetos SEO de forma organizada e eficiente.<br />
              © 2023 SEO Project Manager. Todos os direitos reservados.
            </p>
            <div className="flex space-x-3">
              <Button onClick={() => {
                toast({
                  title: "Obrigado!",
                  description: "Agradecemos sua avaliação.",
                });
              }} className="bg-green-500 hover:bg-green-600 text-white">
                Deixar Avaliação
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Relatório enviado",
                  description: "Seu relatório foi enviado para o suporte.",
                });
              }} variant="outline">
                Relatório para Suporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
