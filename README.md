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

### Iniciar o Gestor SEO Pro
1. Abra o Prompt de Comando como administrador
2. Navegue até a pasta do projeto
3. Execute o comando:
   ```
   npm run start
   ```
4. O sistema iniciará automaticamente em seu navegador padrão no endereço http://localhost:5000

### Configurar para Iniciar Automaticamente com o Windows (Opcional)
1. Crie um arquivo batch (.bat) com o seguinte conteúdo:
   ```
   @echo off
   cd C:\caminho\para\gestor-seo-pro
   npm run start
   ```
2. Salve o arquivo como `IniciarGestorSEO.bat`
3. Pressione `Win + R`, digite `shell:startup` e pressione Enter
4. Copie ou crie um atalho para o arquivo .bat nesta pasta de inicialização

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
O sistema utiliza um banco de dados PostgreSQL para armazenar seus dados de forma segura e persistente. Para garantir que não perca informações:

1. **Backup Automático**: Configure backups automáticos do PostgreSQL seguindo estas etapas:
   - Abra o "SQL Shell (psql)"
   - Conecte-se ao banco de dados
   - Execute o comando para criar um agendamento de backup:
   ```sql
   SELECT cron.schedule('0 0 * * *', 'pg_dump -d gestor_seo_pro > C:\backups\gestor_seo_backup_$(date +%Y%m%d).sql');
   ```

2. **Backup Manual**:
   - Abra o Prompt de Comando como administrador
   - Execute:
   ```
   pg_dump -U postgres -d gestor_seo_pro > C:\caminho\para\backup\backup_gestor_seo.sql
   ```

### Encerramento Seguro
Para fechar o sistema corretamente e evitar perda de dados:

1. Salve todas as alterações em andamento
2. Feche a janela do navegador
3. No Prompt de Comando onde o sistema está rodando, pressione `Ctrl + C`
4. Confirme o encerramento digitando `S` ou `Y`

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