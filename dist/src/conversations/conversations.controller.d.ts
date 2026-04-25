import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
export declare class ConversationsController {
    private readonly conversationsService;
    constructor(conversationsService: ConversationsService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        model: string;
        speed: string;
        temperature: string;
        lastUpdated: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        model: string;
        speed: string;
        temperature: string;
        lastUpdated: Date;
    } & {
        messageList?: any[];
    }>;
    create(dto: CreateConversationDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        model: string;
        speed: string;
        temperature: string;
        lastUpdated: Date;
    }>;
    update(id: string, dto: UpdateConversationDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        model: string;
        speed: string;
        temperature: string;
        lastUpdated: Date;
    }>;
    delete(id: string): Promise<void>;
}
