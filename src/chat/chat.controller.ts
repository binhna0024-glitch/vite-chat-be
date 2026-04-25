import { Controller, Post, Body, Res, HttpStatus, Get } from '@nestjs/common';
import { Response } from 'express';
import { ChatService, ChatOptions } from './chat.service';

interface ChatRequest {
  conversationId: string;
  content: string;
  history?: Array<{ role: string; content: string }>;
  model?: string;
  temperature?: number;
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('models')
  async getModels() {
    try {
      return await this.chatService.getAvailableModels();
    } catch (error) {
      console.error('Model list error:', error);
      return [];
    }
  }

  @Post()
  async sendMessage(@Body() body: ChatRequest, @Res() res: Response) {
    const options: ChatOptions = {
      model: body.model,
      temperature: body.temperature,
      conversationId: body.conversationId,
    };

    try {
      const stream = await this.chatService.sendMessage(
        body.conversationId,
        body.content,
        body.history || [],
        options,
      );

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = stream.getReader();
      let assistantContent = '';

      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const part = value as any;
            if (part.type === 'text-delta' && part.delta) {
              assistantContent += part.delta;
              res.write(part.delta);
            }
          }

          if (assistantContent) {
            await this.chatService.saveAssistantMessage(body.conversationId, assistantContent);
          }

          res.end();
        } catch (error) {
          console.error('Stream error:', error);
          res.end();
        }
      };

      processStream();
    } catch (error) {
      console.error('Chat error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to get response from AI',
      });
    }
  }
}
