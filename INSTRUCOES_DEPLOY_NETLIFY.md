# Instruções para Deploy no Netlify

## Preparação

Antes de fazer o deploy no Netlify, verifique se o ambiente está corretamente configurado executando:

```
npm run verify-deploy
```

Este comando verificará se todos os arquivos e diretórios necessários existem e se o script de build está configurado corretamente.

## Processo de Deploy

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

## Estrutura de Arquivos do Netlify

- `netlify.toml`: Configuração principal do Netlify
- `netlify/build.sh`: Script de build para ambiente Linux (Netlify)
- `netlify/functions/`: Diretório onde as funções serverless são armazenadas
- `netlify/plugins/drizzle-fix.js`: Plugin para resolver problemas com o Drizzle ORM

## Logs de Deploy

Se o deploy falhar, verifique os logs no painel do Netlify para identificar o problema específico. Os erros mais comuns estão relacionados a:

- Falha na instalação de dependências
- Falha no processo de build
- Problemas com as variáveis de ambiente
- Problemas com o banco de dados

## Testando Localmente

Para testar o build localmente (em ambiente Windows):
```
npm run build:client && npm run build:functions
```

Para testar o build localmente (em ambiente Linux/WSL):
```
bash netlify/build.sh
```