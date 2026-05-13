import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { healthRouter } from './routes/health.js';
import { aiRouter } from './routes/aiRoutes.js';
import { ollama } from './services/ollamaClient.js';

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin(origin, callback) {
    if (!origin || config.allowedOrigins.length === 0 || config.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin not allowed by CORS.'));
  }
}));

app.use(express.json({ limit: '2mb' }));
app.use(healthRouter);
app.use(aiRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((error, _req, res, _next) => {
  res.status(500).json({
    error: 'Internal AI service error.',
    detail: error instanceof Error ? error.message : String(error)
  });
});

app.listen(config.port, async () => {
  console.log(`viyra-ai listening on port ${config.port}`);
  console.log(`Ollama base URL: ${config.ollamaBaseUrl}`);
  console.log(`Default model: ${config.ollamaModel}`);

  const reachable = await ollama.isReachable();
  console.log(`Ollama status: ${reachable ? 'reachable' : 'unreachable'}`);

  if (reachable && config.pullModelOnStart) {
    try {
      const hasModel = await ollama.hasModel();
      if (!hasModel) {
        console.log(`Pulling Ollama model ${config.ollamaModel}. This can take several minutes on first deploy.`);
        await ollama.pullModel();
        console.log(`Model ${config.ollamaModel} is ready.`);
      }
    } catch (error) {
      console.warn(`Model pull skipped or failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
});
