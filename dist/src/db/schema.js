"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = exports.conversations = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.conversations = (0, pg_core_1.pgTable)('conversations', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id),
    title: (0, pg_core_1.varchar)('title', { length: 255 }),
    model: (0, pg_core_1.varchar)('model', { length: 50 }).default('llama3.1:8b'),
    speed: (0, pg_core_1.varchar)('speed', { length: 20 }).default('fast'),
    temperature: (0, pg_core_1.decimal)('temperature', { precision: 3, scale: 2 }).default('0.7'),
    lastUpdated: (0, pg_core_1.timestamp)('last_updated').defaultNow(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.messages = (0, pg_core_1.pgTable)('messages', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    conversationId: (0, pg_core_1.uuid)('conversation_id').references(() => exports.conversations.id).notNull(),
    role: (0, pg_core_1.varchar)('role', { length: 20 }).notNull(),
    content: (0, pg_core_1.text)('content').notNull(),
    timestamp: (0, pg_core_1.timestamp)('timestamp').defaultNow(),
});
//# sourceMappingURL=schema.js.map