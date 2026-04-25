import { Response } from 'express';
import { ChatService } from './chat.service';
interface ChatRequest {
    conversationId: string;
    content: string;
    history?: Array<{
        role: string;
        content: string;
    }>;
    model?: string;
    temperature?: number;
}
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getModels(): Promise<{
        id: string;
        name: string;
        family: string;
        parameterSize: string;
        quantization: string;
        modifiedAt: string;
        size: number;
    }[]>;
    sendMessage(body: ChatRequest, res: Response): Promise<void>;
}
export {};
