# Vibe Chat Backend

NestJS backend service với Drizzle ORM + PostgreSQL để lưu trữ chat history.

## Overview

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│  Next.js    │────▶│  NestJS API  │────▶│ PostgreSQL │
│  Frontend   │◀────│  Backend     │◀────│  Database  │
└─────────────┘     └──────────────┘     └────────────┘
                          │
                          ▼
                    ┌────────────┐
                    │ Ollama API │
                    │ (Local/Cloud)
                    └────────────┘
```

## Tech Stack

- **NestJS** - Node.js backend framework
- **Drizzle ORM** - Type-safe database query builder
- **PostgreSQL** - Relational database
- **TypeScript** - Type-safe development
- **Vercel AI SDK (OpenAI-compatible)** - Kết nối Ollama để stream chat

## API Endpoints

### Conversations

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/conversations` | List all conversations |
| GET | `/conversations/:id` | Get single conversation with messages |
| POST | `/conversations` | Create new conversation |
| PATCH | `/conversations/:id` | Update conversation settings |
| DELETE | `/conversations/:id` | Delete conversation |

### Messages

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/conversations/:id/messages` | Get all messages in conversation |
| POST | `/conversations/:id/messages` | Add message to conversation |
| DELETE | `/messages/:id` | Delete single message |

### AI Chat

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/chat` | Send message and stream AI response |
| GET | `/chat/models` | Fetch danh sách model Ollama khả dụng để chat |

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/vibe_chat

# Ollama API (local or cloud endpoint)
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_API_KEY=
OLLAMA_DEFAULT_MODEL=llama3.1:8b

# App
PORT=3001
```

## Notes

- `OLLAMA_BASE_URL` mặc định local Ollama (`http://localhost:11434/v1`).
- API `/chat/models` sẽ gọi endpoint tags của Ollama (`/api/tags`) để lấy model list.
- Có thể dùng Ollama cloud bằng cách đổi `OLLAMA_BASE_URL` và `OLLAMA_API_KEY` tương ứng.

## Migration Commands

```bash
# Generate migration
npx drizzle-kit generate

# Run migration
npx drizzle-kit migrate

# Push schema (dev only)
npx drizzle-kit push
```

## Testing

```bash
# Build/type check
npm run build

# Run backend
npm run start:dev

# List models
curl http://localhost:3001/chat/models

# Stream chat
curl -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"<id>","content":"Hello","model":"llama3.1:8b","temperature":0.7}'
```
