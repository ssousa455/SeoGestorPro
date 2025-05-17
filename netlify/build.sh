#!/bin/bash

# Script para executar o build no ambiente Netlify (Linux)

# Configurar ambiente
echo "Configurando ambiente para build..."
export NODE_ENV=production

# Construir o frontend
echo "Construindo o frontend..."
npm run build:client

# Preparar diretório de funções
echo "Preparando funções serverless..."
mkdir -p netlify/functions

# Verificar se os diretórios existem antes de copiar
if [ -d "server" ]; then
  echo "Copiando diretório server..."
  cp -r server netlify/functions/server
else
  echo "ERRO: Diretório server não encontrado!"
  exit 1
fi

if [ -d "shared" ]; then
  echo "Copiando diretório shared..."
  cp -r shared netlify/functions/shared
else
  echo "ERRO: Diretório shared não encontrado!"
  exit 1
fi

# Copiar arquivos de configuração específicos do Netlify
echo "Copiando arquivos de configuração..."
if [ -f "netlify/functions/drizzle-config.js" ]; then
  cp netlify/functions/drizzle-config.js netlify/functions/
else
  echo "AVISO: Arquivo drizzle-config.js não encontrado. Verificando em outros locais..."
  if [ -f "netlify/drizzle-config.js" ]; then
    cp netlify/drizzle-config.js netlify/functions/
    echo "Arquivo copiado de netlify/drizzle-config.js"
  fi
fi

# Verificar se os arquivos foram copiados corretamente
echo "Verificando arquivos copiados:"
ls -la netlify/functions/

echo "Build concluído com sucesso!"