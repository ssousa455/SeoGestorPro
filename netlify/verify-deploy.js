// Script para verificar se o ambiente está corretamente configurado para deploy no Netlify

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração para deploy no Netlify...');

// Verificar se os arquivos necessários existem
const requiredFiles = [
  'netlify.toml',
  'netlify/build.sh',
  'netlify/plugins/drizzle-fix.js'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`❌ Arquivo não encontrado: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Arquivo encontrado: ${file}`);
  }
});

// Verificar se os diretórios necessários existem
const requiredDirs = ['server', 'shared'];

requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Diretório não encontrado: ${dir}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Diretório encontrado: ${dir}`);
  }
});

// Verificar se o package.json tem o script de build correto
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (!packageJson.scripts.build.includes('netlify/build.sh')) {
  console.error('❌ Script de build no package.json não está configurado corretamente');
  allFilesExist = false;
} else {
  console.log('✅ Script de build no package.json está configurado corretamente');
}

// Resultado final
if (allFilesExist) {
  console.log('\n✅ Tudo pronto para deploy no Netlify!');
} else {
  console.error('\n❌ Existem problemas na configuração que precisam ser corrigidos antes do deploy.');
}