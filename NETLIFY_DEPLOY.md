# Instruções para Deploy no Netlify

## Configuração do Projeto

Este projeto foi configurado para ser implantado no Netlify com suporte a funções serverless para o backend. Foram feitas várias modificações para garantir que o Drizzle ORM e outras dependências funcionem corretamente no ambiente do Netlify.

## Passos para Deploy

1. **Conecte seu repositório ao Netlify**
   - Faça login no Netlify
   - Clique em "New site from Git"
   - Selecione seu repositório

2. **Configure as variáveis de ambiente**
   - No painel do Netlify, vá para Site settings > Build & deploy > Environment
   - Adicione as seguintes variáveis de ambiente:
     - `DATABASE_URL`: URL de conexão com seu banco de dados Neon ou PostgreSQL
     - `NODE_VERSION`: 20

3. **Configurações de build**
   - As configurações de build já estão definidas no arquivo `netlify.toml`
   - O comando de build é: `npm run build`
   - O diretório de publicação é: `dist`
   - O diretório de funções é: `netlify/functions`

## Solução de Problemas

Se o deploy falhar, verifique os seguintes pontos:

1. **Problemas com o Drizzle ORM**
   - Foi adicionado um plugin personalizado em `netlify/plugins/drizzle-fix.js` para resolver problemas com o Drizzle ORM
   - Este plugin move as dependências necessárias para a seção de dependências de produção

2. **Problemas com o comando de build**
   - O script de build foi modificado para usar um script shell no ambiente Netlify
   - Isso resolve problemas de compatibilidade entre Windows e Linux

3. **Problemas com as funções serverless**
   - As funções serverless estão configuradas para usar o esbuild como bundler
   - O módulo `pg-native` foi adicionado à lista de módulos externos
   - Os arquivos do servidor e do schema compartilhado são incluídos nas funções

## Estrutura de Arquivos Importantes

- `netlify.toml`: Configuração principal do Netlify
- `netlify/functions/api.js`: Ponto de entrada para a API serverless
- `netlify/plugins/drizzle-fix.js`: Plugin para resolver problemas com o Drizzle ORM
- `netlify/build.sh`: Script de build para o ambiente Netlify

## Redirecionamentos

Os seguintes redirecionamentos foram configurados:

- `/api/*` -> `/.netlify/functions/api/:splat`: Redireciona as chamadas de API para as funções serverless
- `/*` -> `/index.html`: Redireciona todas as outras rotas para o aplicativo React (SPA)