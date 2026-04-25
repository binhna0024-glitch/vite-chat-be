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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const pg_1 = require("pg");
let MessagesService = class MessagesService {
    constructor() {
        const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
        this.db = (0, node_postgres_1.drizzle)(pool, { schema: { messages: schema_1.messages } });
    }
    async findByConversation(conversationId) {
        return await this.db.select().from(schema_1.messages)
            .where((0, drizzle_orm_1.eq)(schema_1.messages.conversationId, conversationId))
            .orderBy(schema_1.messages.timestamp);
    }
    async create(conversationId, dto) {
        const result = await this.db.insert(schema_1.messages).values({
            conversationId,
            role: dto.role,
            content: dto.content,
        }).returning();
        return result[0];
    }
    async delete(id) {
        const result = await this.db.delete(schema_1.messages).where((0, drizzle_orm_1.eq)(schema_1.messages.id, id)).returning();
        if (!result.length) {
            throw new common_1.NotFoundException(`Message ${id} not found`);
        }
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MessagesService);
//# sourceMappingURL=messages.service.js.map