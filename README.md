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

### Método Simples (Recomendado)
1. Navegue até a pasta onde você extraiu os arquivos
2. Dê um duplo clique no arquivo `iniciar.bat` 
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

## Implantação no Netlify (Para uso online)

Se você desejar disponibilizar o sistema na nuvem para uso em múltiplos dispositivos, o Netlify é uma opção simples e gratuita para hospedagem. Este guia foi criado especificamente para pessoas sem conhecimento técnico.

### Passo 1: Preparar o Projeto para Implantação (No seu computador)

1. Abra o prompt de comando como administrador (clique com o botão direito no menu Iniciar e selecione "Prompt de Comando (Admin)")
2. Digite o comando abaixo e pressione Enter para ir até a pasta do projeto:
   ```
   cd C:\GestorSEOPro
   ```
   (ou substitua pelo caminho onde você extraiu os arquivos)

3. Digite o comando abaixo e pressione Enter para criar a versão de produção:
   ```
   npm run build
   ```
   Aguarde alguns segundos até a mensagem de conclusão. Isso criará uma pasta chamada `dist` com os arquivos do sistema prontos para publicação.

### Passo 2: Criando uma Conta no Netlify

1. Acesse o site [Netlify](https://www.netlify.com/) pelo seu navegador
2. Clique no botão "Sign up" (ou "Cadastrar") no canto superior direito
3. Escolha a opção "Sign up with Google" (ou "Cadastrar com Google") para maior facilidade
4. Conclua o processo de registro seguindo as instruções na tela
5. Após o registro, você verá a tela de boas-vindas do Netlify

### Passo 3: Publicando seu Site (Com Imagens)

1. No painel do Netlify, clique no grande botão azul "Import from Git" (ou "Add new site" e depois "Deploy manually")
   
   ![Tela do Netlify com botão Import from Git](https://i.imgur.com/zPYlJFf.png)

2. Na tela que aparece, escolha a opção "Deploy manually" na parte inferior:

   ![Opção Deploy Manually](https://i.imgur.com/KvPXt7L.png)

3. Agora vem a parte mais importante:
   - Abra o Windows Explorer e navegue até a pasta do projeto (exemplo: C:\GestorSEOPro)
   - Entre na pasta `dist` que foi criada no Passo 1
   - Selecione TODOS os arquivos e pastas dentro da pasta `dist` (não a pasta dist em si)
   - Arraste esses arquivos e solte na área indicada no site do Netlify onde está escrito "Drag and drop your site output folder here"

   ![Área para soltar arquivos](https://i.imgur.com/HZk9WPD.png)

4. Aguarde enquanto o Netlify faz o upload dos arquivos (pode levar alguns minutos dependendo de sua conexão)

5. Quando a publicação for concluída, você verá uma mensagem de sucesso e receberá um endereço único para seu site, semelhante a: https://random-name-123456.netlify.app

   ![Site publicado](https://i.imgur.com/Ld8LJYr.png)

6. Clique nesse link para acessar seu site publicado

### Passo 4: Configurando Banco de Dados (Apenas se precisar salvar dados online)

1. Crie uma conta gratuita no [Neon](https://neon.tech/) seguindo o processo de registro
2. Após o registro, clique em "Create a Project"
3. Dê um nome ao projeto (ex: "gestor-seo") e clique em "Create Project"
4. Após a criação, você verá uma tela com informações de conexão. Procure a linha "Connection String" e clique em "Copy"
5. Volte ao painel do Netlify, e:
   - Clique no seu site recém-publicado
   - No menu lateral esquerdo, clique em "Site settings"
   - Procure e clique na opção "Environment variables"
   - Clique no botão "Add a variable"
   - Em "Key" digite: DATABASE_URL
   - Em "Value" cole a string de conexão que você copiou do Neon
   - Clique em "Save"

6. Após salvar, é necessário republicar o site:
   - No menu lateral, clique em "Deploys"
   - Clique no botão "Trigger deploy" e selecione "Deploy site"

### Passo 5: Personalizando o Endereço (Opcional)

1. No painel do seu site no Netlify, clique em "Domain settings" no menu lateral
2. Você pode:
   - Editar a primeira parte do endereço fornecido pelo Netlify (gratuito)
   - Ou conectar seu próprio domínio se você tiver um

### Dicas e Solução de Problemas

- **Atualizando seu site:** Se fizer alterações no projeto local e quiser atualizar o site online, repita os Passos 1 e 3
- **Problemas de conexão:** Se o site online não conectar ao banco de dados, verifique se a variável DATABASE_URL está correta
- **Arquivos que faltam:** Certifique-se de arrastar TODOS os arquivos de dentro da pasta `dist`, não a pasta em si
- **Suporte do Netlify:** O Netlify oferece suporte gratuito através de seu site caso você encontre problemas

### Vantagens do Seu Site no Netlify
- Disponível 24 horas por dia, 7 dias por semana
- Acessível de qualquer dispositivo (computador, tablet, celular)
- Possibilidade de compartilhar com clientes e equipe
- Alta segurança e velocidade

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