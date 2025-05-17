// Script de inicialização para o Netlify

module.exports = {
  onPreBuild: ({ utils }) => {
    console.log('🚀 Iniciando configuração para deploy no Netlify...');
    
    // Verificar ambiente Node.js
    console.log(`Versão do Node.js: ${process.version}`);
    
    // Instalar dependências críticas explicitamente
    console.log('📦 Instalando dependências críticas...');
    
    const criticalDeps = [
      'drizzle-orm@0.39.1',
      'drizzle-zod@0.7.0',
      '@neondatabase/serverless@0.10.4',
      'serverless-http@3.2.0',
      'ws@8.18.0'
    ];
    
    criticalDeps.forEach(dep => {
      console.log(`Instalando ${dep}...`);
      utils.run.command(`npm install ${dep} --no-save`);
    });
    
    // Verificar se o diretório de funções existe
    if (!utils.fs.existsSync('netlify/functions')) {
      console.log('Criando diretório de funções...');
      utils.run.command('mkdir -p netlify/functions');
    }
    
    // Copiar arquivos necessários para o diretório de funções
    console.log('Copiando arquivos para o diretório de funções...');
    if (utils.fs.existsSync('server') && utils.fs.existsSync('shared')) {
      utils.run.command('cp -r server netlify/functions/server');
      utils.run.command('cp -r shared netlify/functions/shared');
    }
    
    console.log('✅ Configuração concluída com sucesso!');
  }
};