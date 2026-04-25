export class CreateMessageDto {
  role: 'user' | 'assistant';
  content: string;
}
