// Configuração do Drizzle ORM para funções serverless do Netlify

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

// Configurar o WebSocket para o Neon Database
neonConfig.webSocketConstructor = ws;

// Função para inicializar o Drizzle ORM
export function initDrizzle(schema) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL deve ser configurado. Verifique as variáveis de ambiente no Netlify."
    );
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return drizzle(pool, { schema });
}