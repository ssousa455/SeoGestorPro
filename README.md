# Gestor SEO Pro - Manual de Instalação e Uso

## Sobre o Sistema
O Gestor SEO Pro é um sistema completo para gerenciamento de projetos SEO, desenvolvido especialmente para Windows 11. Com ele, você pode administrar tanto projetos pessoais (sites de afiliados Amazon) quanto projetos de clientes (SEO para websites empresariais).

## Requisitos de Sistema
- Windows 11
- Node.js 20.x ou superior

## Guia de Instalação

### 1. Instalar Node.js
1. Acesse [nodejs.org](https://nodejs.org)
2. Baixe e instale a versão LTS mais recente para Windows
3. Verifique a instalação abrindo o Prompt de Comando e digitando:
   ```
   node -v
   npm -v
   ```

### 2. Baixar e Instalar o Gestor SEO Pro
1. Baixe este repositório como ZIP 
2. Extraia o arquivo ZIP para uma pasta em seu computador (recomendamos "C:\GestorSEOPro")
3. Abra o Prompt de Comando como administrador
4. Navegue até a pasta do projeto:
   ```
   cd C:\GestorSEOPro
   ```
   (ou a pasta onde você extraiu os arquivos)
5. Instale as dependências:
   ```
   npm install
   ```
   
## Iniciando o Sistema

### Método Rápido (Recomendado)
1. Navegue até a pasta onde você extraiu os arquivos
2. Dê um duplo clique no arquivo `iniciar-windows.bat` 
3. O sistema abrirá automaticamente em seu navegador padrão no endereço http://localhost:3000
4. Para fechar o sistema, pressione CTRL+C na janela de comando e feche o navegador

### Método Alternativo (via Prompt de Comando)
1. Abra o Prompt de Comando como administrador
2. Navegue até a pasta do projeto:
   ```
   cd C:\GestorSEOPro
   ```
   (ou a pasta onde você extraiu os arquivos)
3. Execute o comando:
   ```
   npx tsx server/index.ts
   ```
4. Abra seu navegador e acesse http://localhost:3000

### Configurar para Iniciar Automaticamente com o Windows (Opcional)
1. Crie um arquivo batch (.bat) seguindo as instruções acima
2. Pressione `Win + R`, digite `shell:startup` e pressione Enter
3. Copie ou crie um atalho para o arquivo .bat nesta pasta de inicialização

## Utilizando o Sistema no Dia a Dia

### Navegação
- **Dashboard**: Visão geral de projetos, keywords e melhorias pendentes
- **Meus Projetos**: Gerencie seus projetos pessoais
- **Projetos de Clientes**: Gerencie projetos para clientes
- **Análise de Keywords**: Adicione, importe e analise palavras-chave
- **Clusters**: Organize suas keywords em grupos temáticos
- **Melhorias SEO**: Registre e acompanhe melhorias necessárias
- **Relatórios**: Gere relatórios de desempenho
- **Configurações**: Personalize o sistema conforme suas necessidades

### Backup dos Dados
O sistema armazena dados em memória durante sua execução. Para garantir que não perca informações importantes:

1. **Exportação de Dados**: O sistema salva automaticamente dados na pasta do projeto.
   - Os dados são armazenados em arquivos JSON na pasta "data" do projeto
   - Estes arquivos são atualizados automaticamente quando você:
     - Cria ou edita projetos
     - Adiciona ou atualiza keywords
     - Organiza clusters
     - Registra melhorias SEO

2. **Backup Manual Recomendado**:
   - Copie regularmente a pasta inteira do projeto para um local seguro
   - Use um pendrive ou armazenamento em nuvem como backup adicional
   - Recomendamos fazer backup semanalmente ou após adicionar muitos dados

### Encerramento Seguro
Para fechar o sistema corretamente e evitar perda de dados:

1. Salve todas as alterações em andamento no sistema
2. Feche a janela do navegador
3. No Prompt de Comando onde o sistema está rodando, pressione `Ctrl + C`
4. Confirme o encerramento digitando `S` ou `Y` 
5. Aguarde a mensagem "Processo finalizado" antes de fechar a janela do Prompt de Comando

### Dicas de Uso Diário
1. **Modo Escuro**: Alterne entre tema claro e escuro através do ícone no canto superior direito
2. **Seleção de Projeto**: Sempre selecione um projeto antes de trabalhar com keywords ou clusters
3. **Organização de Keywords**: Agrupe keywords relacionadas em clusters para melhorar sua estratégia de conteúdo
4. **Backup Regular**: Copie a pasta do projeto regularmente para um local seguro para preservar seus dados
5. **Atalhos de Teclado**: Use Tab para navegar entre campos e Enter para confirmar formulários

## Resolução de Problemas Comuns

1. **Sistema não inicia**:
   - Verifique se o Node.js está instalado corretamente
   - Confira se o PostgreSQL está rodando nos Serviços do Windows
   - Verifique as credenciais do banco de dados no arquivo `.env`

2. **Erro de conexão com banco de dados**:
   - Verifique se o serviço PostgreSQL está iniciado
   - Confirme as credenciais e configurações no arquivo `.env`

3. **Lentidão ao carregar dados**:
   - Considere limpar o cache do navegador
   - Reinicie o sistema e o servidor PostgreSQL

## Suporte Técnico
Para dúvidas ou suporte adicional, entre em contato pelo e-mail:
suporte@gestorseopro.com.br

---

© 2023 Gestor SEO Pro. Todos os direitos reservados.