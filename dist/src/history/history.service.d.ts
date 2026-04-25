export interface ConversationSummary {
    id: string;
    title: string;
    model: string;
    lastUpdated: Date;
    messageCount: number;
}
export declare class HistoryService {
    private db;
    private historyDir;
    constructor();
    private ensureDir;
    private getFilePath;
    saveConversation(conversationId: string): Promise<void>;
    loadConversation(conversationId: string): Promise<any | null>;
    listConversations(): Promise<ConversationSummary[]>;
    exportAll(): Promise<void>;
}
