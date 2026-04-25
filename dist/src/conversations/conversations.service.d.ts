import { type Conversation } from '../db/schema';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
export declare class ConversationsService {
    private db;
    constructor();
    findAll(): Promise<Conversation[]>;
    findOne(id: string): Promise<Conversation & {
        messageList?: any[];
    }>;
    create(dto: CreateConversationDto): Promise<Conversation>;
    update(id: string, dto: UpdateConversationDto): Promise<Conversation>;
    delete(id: string): Promise<void>;
}
