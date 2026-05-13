import { Router } from 'express';
import { config } from '../config.js';
import { ollama } from '../services/ollamaClient.js';

export const healthRouter = Router();

healthRouter.get('/health', async (_req, res) => {
  const reachable = await ollama.isReachable();

  res.json({
    status: 'ok',
    service: 'viyra-ai',
    model: config.ollamaModel,
    ollama: reachable ? 'reachable' : 'unreachable'
  });
});
