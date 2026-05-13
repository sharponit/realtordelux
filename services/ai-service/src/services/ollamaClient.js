import { config } from '../config.js';

export class OllamaClient {
  constructor({ baseUrl = config.ollamaBaseUrl, model = config.ollamaModel, timeoutMs = config.requestTimeoutMs } = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.model = model;
    this.timeoutMs = timeoutMs;
  }

  async request(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.error || `Ollama request failed with ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`Ollama request timed out after ${this.timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async isReachable() {
    try {
      await this.request('/api/tags', { method: 'GET' });
      return true;
    } catch {
      return false;
    }
  }

  async listModels() {
    const data = await this.request('/api/tags', { method: 'GET' });
    return data.models || [];
  }

  async hasModel(model = this.model) {
    const models = await this.listModels();
    return models.some((item) => item.name === model || item.model === model);
  }

  async pullModel(model = this.model) {
    return this.request('/api/pull', {
      method: 'POST',
      body: JSON.stringify({ name: model, stream: false })
    });
  }

  async generate({ prompt, system, model = this.model, format }) {
    return this.request('/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        model,
        prompt,
        system,
        stream: false,
        format,
        options: {
          temperature: 0.2,
          num_ctx: 4096
        }
      })
    });
  }
}

export const ollama = new OllamaClient();
