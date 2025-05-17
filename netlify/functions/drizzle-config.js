// Configuração do Drizzle ORM para funções serverless do Netlify

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

// Configurar o WebSocket para o Neon Database
neonConfig.webSocketConstructor = ws;

// Função para inicializar o Drizzle ORM
export function initDrizzle(schema) {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL não encontrado. Verificando variáveis de ambiente...");
    console.log("Variáveis disponíveis:", Object.keys(process.env).filter(key => !key.includes('SECRET')));
    throw new Error(
      "DATABASE_URL deve ser configurado. Verifique as variáveis de ambiente no Netlify."
    );
  }

  try {
    console.log("Conectando ao banco de dados...");
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool, { schema });
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
    return db;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    throw error;
  }
}