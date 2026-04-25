import { Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { messages, conversations } from '../db/schema';
import { Pool } from 'pg';
import { AiService } from '../ai/ai.service';

export interface ChatOptions {
  model?: string;
  temperature?: number;
  conversationId?: string;
}

interface OllamaTagModel {
  name: string;
  model?: string;
  modified_at?: string;
  size?: number;
  details?: {
    family?: string;
    parameter_size?: string;
    quantization_level?: string;
  };
}

@Injectable()
export class ChatService {
  private db;

  constructor(private readonly aiService: AiService) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool, { schema: { messages, conversations } });
  }

  async sendMessage(
    conversationId: string,
    content: string,
    history: Array<{ role: string; content: string }>,
    options: ChatOptions = {},
  ) {
    const model = this.aiService.getChatModel(
      options.model || process.env.OLLAMA_DEFAULT_MODEL || 'llama3.1:8b',
    );

    await this.db.insert(messages).values({
      conversationId,
      role: 'user',
      content,
    });

    await this.db
      .update(conversations)
      .set({ lastUpdated: new Date() })
      .where(eq(conversations.id, conversationId));

    const toPromptContent = (text: string) => [{ type: 'text' as const, text }];

    const prompt = [
      ...history.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: toPromptContent(m.content),
      })),
      { role: 'user' as const, content: toPromptContent(content) },
    ];

    const result = await model.doStream({
      prompt,
      temperature: options.temperature || 0.7,
    });

    return result.stream;
  }

  async getAvailableModels() {
    const endpoint = this.aiService.getModelsEndpoint();
    const headers: Record<string, string> = {};
    const apiKey = this.aiService.getApiKey();

    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    const response = await fetch(endpoint, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch Ollama models: ${response.status}`);
    }

    const data = (await response.json()) as { models?: OllamaTagModel[] };
    const models = data.models || [];

    return models
      .filter((m) => !!m.name)
      .map((m) => ({
        id: m.name,
        name: m.name,
        family: m.details?.family || 'unknown',
        parameterSize: m.details?.parameter_size || 'unknown',
        quantization: m.details?.quantization_level || 'unknown',
        modifiedAt: m.modified_at || null,
        size: m.size || null,
      }));
  }

  async saveAssistantMessage(conversationId: string, content: string) {
    return await this.db
      .insert(messages)
      .values({
        conversationId,
        role: 'assistant',
        content,
      })
      .returning();
  }
}
