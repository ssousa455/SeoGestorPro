# Como Fazer o Deploy no Netlify

## Problema Resolvido

O deploy no Netlify estava falhando devido a problemas com as dependências do servidor, especificamente relacionadas ao Drizzle ORM. Fizemos várias modificações para resolver esses problemas:

1. Configuramos corretamente o ambiente de funções serverless no Netlify
2. Ajustamos o package.json para garantir que todas as dependências necessárias estejam na seção correta
3. Simplificamos o processo de build para que o frontend e o backend sejam construídos separadamente
4. Criamos plugins personalizados para resolver problemas específicos com o Drizzle ORM

## Passo a Passo para Deploy

### 1. Preparação Inicial

- Certifique-se de que todas as alterações foram commitadas para o seu repositório Git
- Verifique se você tem uma conta no Netlify

### 2. Configuração no Netlify

1. Faça login no [Netlify](https://app.netlify.com/)
2. Clique em "New site from Git"
3. Selecione seu provedor Git (GitHub, GitLab, etc.)
4. Selecione o repositório do SeoGestorPro
5. Na tela de configuração de build, os campos já estarão preenchidos corretamente pelo arquivo `netlify.toml`

### 3. Configuração de Variáveis de Ambiente

No painel do Netlify, vá para:
- Site settings > Build & deploy > Environment
- Adicione as seguintes variáveis de ambiente:
  - `DATABASE_URL`: URL de conexão com seu banco de dados Neon ou PostgreSQL
  - `NODE_VERSION`: 20

### 4. Deploy

- Clique em "Deploy site"
- Aguarde o processo de build e deploy ser concluído

## Verificação do Deploy

Após o deploy, verifique se:

1. O frontend está funcionando corretamente
2. As chamadas de API estão funcionando (rotas `/api/*`)
3. A conexão com o banco de dados está estabelecida

## Solução de Problemas

Se o deploy ainda falhar, verifique:

1. **Logs de build**: No painel do Netlify, vá para "Deploys" e clique no deploy mais recente para ver os logs
2. **Variáveis de ambiente**: Certifique-se de que `DATABASE_URL` está configurado corretamente
3. **Funções serverless**: Verifique se as funções estão sendo criadas corretamente em "Functions"

## Estrutura de Arquivos Importantes

- `netlify.toml`: Configuração principal do Netlify
- `netlify/functions/api.js`: Ponto de entrada para a API serverless
- `netlify/plugins/drizzle-fix.js`: Plugin para resolver problemas com o Drizzle ORM
- `netlify/build.sh`: Script de build para o ambiente Netlify

## Modificações Realizadas

1. Criamos uma estrutura de funções serverless para o Netlify
2. Configuramos redirecionamentos para as chamadas de API
3. Adicionamos plugins personalizados para resolver problemas com o Drizzle ORM
4. Ajustamos os scripts de build para funcionar tanto no Windows quanto no Linux

Agora seu projeto deve ser capaz de fazer deploy no Netlify sem problemas com as dependências do Drizzle ORM.