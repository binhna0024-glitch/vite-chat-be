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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const openai_compatible_1 = require("@ai-sdk/openai-compatible");
let AiService = class AiService {
    constructor() {
        this.ollama = (0, openai_compatible_1.createOpenAICompatible)({
            name: 'ollama',
            baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
            apiKey: process.env.OLLAMA_API_KEY || 'ollama',
        });
    }
    getChatModel(model = process.env.OLLAMA_DEFAULT_MODEL || 'llama3.1:8b') {
        return this.ollama.chatModel(model);
    }
    getModelsEndpoint() {
        const base = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1';
        return base.replace(/\/v1\/?$/, '/api/tags');
    }
    getApiKey() {
        return process.env.OLLAMA_API_KEY;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AiService);
//# sourceMappingURL=ai.service.js.map