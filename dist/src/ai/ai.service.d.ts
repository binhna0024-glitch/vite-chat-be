export declare class AiService {
    private ollama;
    constructor();
    getChatModel(model?: string): any;
    getModelsEndpoint(): string;
    getApiKey(): string | undefined;
}
