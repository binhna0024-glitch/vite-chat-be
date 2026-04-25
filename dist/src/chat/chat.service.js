"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const pg_1 = require("pg");
const ai_service_1 = require("../ai/ai.service");
let ChatService = class ChatService {
    constructor(aiService) {
        this.aiService = aiService;
        const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
        this.db = (0, node_postgres_1.drizzle)(pool, { schema: { messages: schema_1.messages, conversations: schema_1.conversations } });
    }
    async sendMessage(conversationId, content, history, options = {}) {
        const model = this.aiService.getChatModel(options.model || process.env.OLLAMA_DEFAULT_MODEL || 'llama3.1:8b');
        await this.db.insert(schema_1.messages).values({
            conversationId,
            role: 'user',
            content,
        });
        await this.db
            .update(schema_1.conversations)
            .set({ lastUpdated: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.conversations.id, conversationId));
        const toPromptContent = (text) => [{ type: 'text', text }];
        const prompt = [
            ...history.map((m) => ({
                role: m.role,
                content: toPromptContent(m.content),
            })),
            { role: 'user', content: toPromptContent(content) },
        ];
        const result = await model.doStream({
            prompt,
            temperature: options.temperature || 0.7,
        });
        return result.stream;
    }
    async getAvailableModels() {
        const endpoint = this.aiService.getModelsEndpoint();
        const headers = {};
        const apiKey = this.aiService.getApiKey();
        if (apiKey) {
            headers.Authorization = `Bearer ${apiKey}`;
        }
        const response = await fetch(endpoint, { headers });
        if (!response.ok) {
            throw new Error(`Failed to fetch Ollama models: ${response.status}`);
        }
        const data = (await response.json());
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
    async saveAssistantMessage(conversationId, content) {
        return await this.db
            .insert(schema_1.messages)
            .values({
            conversationId,
            role: 'assistant',
            content,
        })
            .returning();
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], ChatService);
//# sourceMappingURL=chat.service.js.map