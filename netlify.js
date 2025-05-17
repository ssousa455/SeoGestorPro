// Este arquivo é usado para configurar o ambiente Netlify
// Script para garantir que as dependências do Drizzle ORM e outras dependências críticas sejam tratadas corretamente no Netlify

export default {
  onPreBuild: ({ utils }) => {
    console.log('🚀 Preparando ambiente para build no Netlify...');
    
    // Lista de dependências críticas que precisam ser verificadas
    const criticalDeps = [
      { name: 'drizzle-orm', version: '0.39.1' },
      { name: 'drizzle-zod', version: '0.7.0' },
      { name: '@neondatabase/serverless', version: '0.10.4' },
      { name: 'serverless-http', version: '3.2.0' },
      { name: 'ws', version: '8.18.0' },
      { name: 'express', version: '4.21.2' }
    ];
    
    // Verificar e instalar dependências críticas
    criticalDeps.forEach(dep => {
      console.log(`Verificando ${dep.name}...`);
      if (utils.run.command(`npm list ${dep.name}`).code !== 0) {
        console.log(`📦 Instalando ${dep.name}@${dep.version}...`);
        utils.run.command(`npm install ${dep.name}@${dep.version}`);
      } else {
        console.log(`✅ ${dep.name} já está instalado.`);
      }
    });
    
    // Verificar variáveis de ambiente críticas
    if (!process.env.DATABASE_URL) {
      console.warn('⚠️ AVISO: DATABASE_URL não está definido no ambiente Netlify!');
      console.warn('Certifique-se de configurar esta variável nas configurações do Netlify.');
    } else {
      console.log('✅ DATABASE_URL está configurado.');
    }
    
    console.log('✨ Ambiente preparado com sucesso!');
  }
};