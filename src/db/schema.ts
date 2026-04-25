import { pgTable, uuid, varchar, text, timestamp, decimal } from 'drizzle-orm/pg-core';

// Users table (for future multi-user support)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Conversations table
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  title: varchar('title', { length: 255 }),
  model: varchar('model', { length: 50 }).default('llama3.1:8b'),
  speed: varchar('speed', { length: 20 }).default('fast'),
  temperature: decimal('temperature', { precision: 3, scale: 2 }).default('0.7'),
  lastUpdated: timestamp('last_updated').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Messages table
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'user' | 'assistant'
  content: text('content').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type NewMessage = typeof messages.$inferInsert;
