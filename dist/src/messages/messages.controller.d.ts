import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    findByConversation(conversationId: string): Promise<{
        content: string;
        id: string;
        conversationId: string;
        role: string;
        timestamp: Date;
    }[]>;
    create(conversationId: string, dto: CreateMessageDto): Promise<{
        content: string;
        id: string;
        conversationId: string;
        role: string;
        timestamp: Date;
    }>;
    delete(id: string): Promise<void>;
}
