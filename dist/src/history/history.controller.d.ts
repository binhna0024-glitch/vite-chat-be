import { HistoryService } from './history.service';
export declare class HistoryController {
    private readonly historyService;
    constructor(historyService: HistoryService);
    list(): Promise<import("./history.service").ConversationSummary[]>;
    get(id: string): Promise<any>;
    save(id: string): Promise<void>;
    exportAll(): Promise<void>;
}
