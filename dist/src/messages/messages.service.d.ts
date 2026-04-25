import { type Message } from '../db/schema';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesService {
    private db;
    constructor();
    findByConversation(conversationId: string): Promise<Message[]>;
    create(conversationId: string, dto: CreateMessageDto): Promise<Message>;
    delete(id: string): Promise<void>;
}
