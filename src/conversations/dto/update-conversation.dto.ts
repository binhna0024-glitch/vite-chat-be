export class UpdateConversationDto {
  title?: string;
  model?: string;
  speed?: 'fast' | 'thinking';
  temperature?: number;
}
