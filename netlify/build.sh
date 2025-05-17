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
cp -r server netlify/functions/server
cp -r shared netlify/functions/shared

echo "Build concluído com sucesso!"