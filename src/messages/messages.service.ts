import { Injectable, NotFoundException } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { messages, type Message } from '../db/schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { Pool } from 'pg';

@Injectable()
export class MessagesService {
  private db;

  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool, { schema: { messages } });
  }

  async findByConversation(conversationId: string): Promise<Message[]> {
    return await this.db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.timestamp);
  }

  async create(conversationId: string, dto: CreateMessageDto): Promise<Message> {
    const result = await this.db.insert(messages).values({
      conversationId,
      role: dto.role,
      content: dto.content,
    }).returning();
    return result[0];
  }

  async delete(id: string): Promise<void> {
    const result = await this.db.delete(messages).where(eq(messages.id, id)).returning();
    if (!result.length) {
      throw new NotFoundException(`Message ${id} not found`);
    }
  }
}
