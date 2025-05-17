# Configuração de Deploy no Netlify

## Estrutura de Arquivos

Esta pasta contém os arquivos necessários para o deploy no Netlify:

- `build.sh`: Script de build para ambiente Linux (Netlify)
- `functions/`: Diretório onde as funções serverless são armazenadas
  - `api.js`: Ponto de entrada para a API serverless
  - `drizzle-config.js`: Configuração do Drizzle ORM para o ambiente serverless
- `plugins/`: Plugins personalizados para o Netlify
  - `drizzle-fix.js`: Plugin para resolver problemas com o Drizzle ORM

## Processo de Build

O processo de build no Netlify segue estas etapas:

1. O plugin `drizzle-fix.js` é executado para garantir que todas as dependências do Drizzle ORM estejam corretamente configuradas
2. O script `build.sh` é executado para:
   - Construir o frontend (React)
   - Preparar o diretório de funções serverless
   - Copiar os arquivos necessários para o diretório de funções

## Solução de Problemas

Se o deploy falhar, verifique:

1. Se as variáveis de ambiente estão configuradas corretamente no Netlify
2. Se o script `build.sh` está sendo executado corretamente
3. Se os diretórios `server` e `shared` existem e estão sendo copiados para o diretório de funções
4. Se o arquivo `drizzle-config.js` está sendo copiado corretamente

## Comandos Úteis

Para testar o build localmente (em ambiente Windows):
```
npm run build:client && npm run build:functions
```

Para testar o build localmente (em ambiente Linux/WSL):
```
bash netlify/build.sh
```