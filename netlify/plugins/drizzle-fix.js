// Plugin para resolver problemas com o Drizzle ORM no Netlify

module.exports = {
  onPreBuild: ({ utils }) => {
    console.log('🔧 Configurando ambiente para Drizzle ORM no Netlify...');
    
    // Mover dependências de desenvolvimento para dependências de produção
    const packageJson = JSON.parse(utils.readFileSync('package.json'));
    
    // Garantir que drizzle-kit esteja nas dependências de produção
    if (!packageJson.dependencies['drizzle-kit'] && packageJson.devDependencies?.['drizzle-kit']) {
      packageJson.dependencies['drizzle-kit'] = packageJson.devDependencies['drizzle-kit'];
      console.log('✅ Movido drizzle-kit para dependências de produção');
    }
    
    // Garantir que todas as dependências do Drizzle estejam na versão correta
    packageJson.dependencies['drizzle-orm'] = '^0.39.1';
    packageJson.dependencies['drizzle-zod'] = '^0.7.0';
    
    // Atualizar package.json
    utils.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    
    // Instalar dependências atualizadas
    console.log('📦 Instalando dependências atualizadas...');
    utils.run.command('npm install');
    
    console.log('✨ Ambiente configurado com sucesso para Drizzle ORM!');
  }
};