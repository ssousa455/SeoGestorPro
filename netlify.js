// Este arquivo é usado para configurar o ambiente Netlify
// e garantir que as dependências do Drizzle ORM sejam tratadas corretamente

export default {
  onPreBuild: ({ utils }) => {
    console.log('Preparando ambiente para build no Netlify...');
    
    // Verificar se as dependências estão instaladas corretamente
    if (utils.run.command('npm list drizzle-orm').code !== 0) {
      console.log('Reinstalando drizzle-orm...');
      utils.run.command('npm install drizzle-orm@0.39.1');
    }
    
    if (utils.run.command('npm list @neondatabase/serverless').code !== 0) {
      console.log('Reinstalando @neondatabase/serverless...');
      utils.run.command('npm install @neondatabase/serverless@0.10.4');
    }
    
    console.log('Ambiente preparado com sucesso!');
  }
};