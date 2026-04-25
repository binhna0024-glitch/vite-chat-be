import { Injectable } from '@nestjs/common';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

@Injectable()
export class AiService {
  private ollama;

  constructor() {
    this.ollama = createOpenAICompatible({
      name: 'ollama',
      baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
      apiKey: process.env.OLLAMA_API_KEY || 'ollama',
    });
  }

  getChatModel(model: string = process.env.OLLAMA_DEFAULT_MODEL || 'llama3.1:8b') {
    return this.ollama.chatModel(model);
  }

  getModelsEndpoint(): string {
    const base = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1';
    return base.replace(/\/v1\/?$/, '/api/tags');
  }

  getApiKey(): string | undefined {
    return process.env.OLLAMA_API_KEY;
  }
}
