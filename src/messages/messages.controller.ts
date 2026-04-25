import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations/:conversationId/messages')
  findByConversation(@Param('conversationId') conversationId: string) {
    return this.messagesService.findByConversation(conversationId);
  }

  @Post('conversations/:conversationId/messages')
  create(
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateMessageDto
  ) {
    return this.messagesService.create(conversationId, dto);
  }

  @Delete('messages/:id')
  delete(@Param('id') id: string) {
    return this.messagesService.delete(id);
  }
}
