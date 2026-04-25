import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { messages, conversations } from '../db/schema';
import { Pool } from 'pg';

export interface ConversationSummary {
  id: string;
  title: string;
  model: string;
  lastUpdated: Date;
  messageCount: number;
}

@Injectable()
export class HistoryService {
  private db;
  private historyDir: string;

  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool, { schema: { messages, conversations } });
    // Save to .claude/history/ folder
    this.historyDir = path.join(process.cwd(), '.claude', 'history');
    this.ensureDir();
  }

  private ensureDir() {
    if (!fs.existsSync(this.historyDir)) {
      fs.mkdirSync(this.historyDir, { recursive: true });
    }
  }

  private getFilePath(conversationId: string): string {
    return path.join(this.historyDir, `${conversationId}.json`);
  }

  async saveConversation(conversationId: string): Promise<void> {
    // Get conversation details
    const conv = await this.db.select().from(conversations).where(eq(conversations.id, conversationId));
    if (!conv.length) return;

    // Get all messages
    const msgs = await this.db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.timestamp);

    const data = {
      conversation: conv[0],
      messages: msgs,
      savedAt: new Date().toISOString(),
    };

    fs.writeFileSync(this.getFilePath(conversationId), JSON.stringify(data, null, 2));
  }

  async loadConversation(conversationId: string): Promise<any | null> {
    const filePath = this.getFilePath(conversationId);
    if (!fs.existsSync(filePath)) return null;

    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  async listConversations(): Promise<ConversationSummary[]> {
    const all = await this.db.select().from(conversations).orderBy(conversations.lastUpdated);

    const summaries: ConversationSummary[] = [];
    for (const conv of all) {
      const msgs = await this.db.select().from(messages)
        .where(eq(messages.conversationId, conv.id));
      summaries.push({
        id: conv.id,
        title: conv.title,
        model: conv.model,
        lastUpdated: conv.lastUpdated,
        messageCount: msgs.length,
      });
    }
    return summaries;
  }

  async exportAll(): Promise<void> {
    const all = await this.listConversations();

    for (const conv of all) {
      await this.saveConversation(conv.id);
    }

    // Save index
    fs.writeFileSync(
      path.join(this.historyDir, 'index.json'),
      JSON.stringify({ conversations: all, exportedAt: new Date().toISOString() }, null, 2)
    );
  }
}
