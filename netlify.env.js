// Este arquivo configura variáveis de ambiente para o Netlify

export default function() {
  // Verificar se estamos no ambiente Netlify
  if (process.env.NETLIFY) {
    console.log('Configurando variáveis de ambiente para o Netlify...');
    
    // Garantir que o NODE_ENV esteja configurado para produção
    process.env.NODE_ENV = 'production';
    
    // Verificar se DATABASE_URL está definido
    if (!process.env.DATABASE_URL) {
      console.warn('AVISO: DATABASE_URL não está definido no ambiente Netlify!');
      console.warn('Certifique-se de configurar esta variável nas configurações do Netlify.');
    }
    
    console.log('Variáveis de ambiente configuradas com sucesso!');
  }
}