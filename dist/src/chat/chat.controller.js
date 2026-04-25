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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const express_1 = require("express");
const chat_service_1 = require("./chat.service");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async getModels() {
        try {
            return await this.chatService.getAvailableModels();
        }
        catch (error) {
            console.error('Model list error:', error);
            return [];
        }
    }
    async sendMessage(body, res) {
        const options = {
            model: body.model,
            temperature: body.temperature,
            conversationId: body.conversationId,
        };
        try {
            const stream = await this.chatService.sendMessage(body.conversationId, body.content, body.history || [], options);
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            const reader = stream.getReader();
            let assistantContent = '';
            const processStream = async () => {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done)
                            break;
                        const part = value;
                        if (part.type === 'text-delta' && part.delta) {
                            assistantContent += part.delta;
                            res.write(part.delta);
                        }
                    }
                    if (assistantContent) {
                        await this.chatService.saveAssistantMessage(body.conversationId, assistantContent);
                    }
                    res.end();
                }
                catch (error) {
                    console.error('Stream error:', error);
                    res.end();
                }
            };
            processStream();
        }
        catch (error) {
            console.error('Chat error:', error);
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: 'Failed to get response from AI',
            });
        }
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('models'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getModels", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map