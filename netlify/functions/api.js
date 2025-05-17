import serverless from 'serverless-http';
import express from 'express';
import { registerRoutes } from './server/routes.js';
import * as schema from './shared/schema.js';
import { initDrizzle } from './drizzle-config.js';

// Inicializar o app Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configurar o Drizzle ORM para o ambiente Netlify
try {
  const db = initDrizzle(schema);

  // Adicionar o db ao objeto de request para que as rotas possam acessá-lo
  app.use((req, res, next) => {
    req.db = db;
    next();
  });

  // Configurar rotas da API
  registerRoutes(app);
} catch (error) {
  console.error('Erro ao inicializar o Drizzle:', error);
  
  // Rota de fallback para diagnóstico
  app.use('/api', (req, res) => {
    res.status(500).json({
      error: 'Erro na configuração do servidor',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  });
}

// Exportar o handler para Netlify Functions
export const handler = serverless(app);