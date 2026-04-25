import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { conversations, messages, type Conversation, type NewConversation } from '../db/schema';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Pool } from 'pg';

@Injectable()
export class ConversationsService {
  private db;

  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool, { schema: { conversations, messages } });
  }

  async findAll(): Promise<Conversation[]> {
    return await this.db.select().from(conversations).orderBy(conversations.lastUpdated);
  }

  async findOne(id: string): Promise<Conversation & { messageList?: any[] }> {
    const result = await this.db.select().from(conversations).where(eq(conversations.id, id));
    if (!result.length) {
      throw new NotFoundException(`Conversation ${id} not found`);
    }
    const messageList = await this.db.select().from(messages).where(eq(messages.conversationId, id));
    return { ...result[0], messageList };
  }

  async create(dto: CreateConversationDto): Promise<Conversation> {
    const result = await this.db.insert(conversations).values({
      title: dto.title || 'New Chat',
      model: dto.model || process.env.OLLAMA_DEFAULT_MODEL || 'llama3.1:8b',
      speed: dto.speed || 'fast',
      temperature: dto.temperature?.toString() || '0.7',
    }).returning();
    return result[0];
  }

  async update(id: string, dto: UpdateConversationDto): Promise<Conversation> {
    const result = await this.db.update(conversations)
      .set({
        ...dto,
        temperature: dto.temperature?.toString(),
        lastUpdated: new Date(),
      })
      .where(eq(conversations.id, id))
      .returning();
    if (!result.length) {
      throw new NotFoundException(`Conversation ${id} not found`);
    }
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(messages).where(eq(messages.conversationId, id));
    await this.db.delete(conversations).where(eq(conversations.id, id));
  }
}
