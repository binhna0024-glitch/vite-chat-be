import { AiService } from '../ai/ai.service';
export interface ChatOptions {
    model?: string;
    temperature?: number;
    conversationId?: string;
}
export declare class ChatService {
    private readonly aiService;
    private db;
    constructor(aiService: AiService);
    sendMessage(conversationId: string, content: string, history: Array<{
        role: string;
        content: string;
    }>, options?: ChatOptions): Promise<any>;
    getAvailableModels(): Promise<{
        id: string;
        name: string;
        family: string;
        parameterSize: string;
        quantization: string;
        modifiedAt: string;
        size: number;
    }[]>;
    saveAssistantMessage(conversationId: string, content: string): Promise<any>;
}
