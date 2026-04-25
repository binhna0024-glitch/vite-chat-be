import { Controller, Get, Post, Param } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  list() {
    return this.historyService.listConversations();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.historyService.loadConversation(id);
  }

  @Post(':id/save')
  save(@Param('id') id: string) {
    return this.historyService.saveConversation(id);
  }

  @Post('export')
  exportAll() {
    return this.historyService.exportAll();
  }
}
