# AI Assessment Creator — Architecture

## 1. Folder Structure

```
assignment/
├── README.md
├── ARCHITECTURE.md
├── docker-compose.yml
├── .env.example
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── index.ts                 # HTTP + Socket.IO bootstrap
│       ├── config/
│       │   ├── env.ts
│       │   ├── database.ts
│       │   └── redis.ts
│       ├── types/
│       │   ├── assignment.ts
│       │   ├── examPaper.ts
│       │   └── api.ts
│       ├── models/
│       │   ├── Assignment.ts
│       │   └── GeneratedPaper.ts
│       ├── validators/
│       │   └── assignment.validator.ts
│       ├── middleware/
│       │   ├── errorHandler.ts
│       │   └── upload.ts
│       ├── routes/
│       │   ├── index.ts
│       │   ├── assignment.routes.ts
│       │   └── paper.routes.ts
│       ├── controllers/
│       │   ├── assignment.controller.ts
│       │   └── paper.controller.ts
│       ├── services/
│       │   ├── assignment.service.ts
│       │   ├── paper.service.ts
│       │   ├── ai.service.ts
│       │   └── prompt.service.ts
│       ├── queue/
│       │   ├── connection.ts
│       │   ├── generation.queue.ts
│       │   └── generation.events.ts
│       ├── workers/
│       │   └── generation.worker.ts
│       ├── socket/
│       │   └── index.ts
│       └── utils/
│           └── logger.ts
│
└── frontend/
    ├── package.json
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── postcss.config.mjs
    ├── .env.example
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── globals.css
        │   ├── assignments/
        │   │   ├── new/page.tsx
        │   │   └── [id]/page.tsx
        │   └── papers/
        │       └── [id]/page.tsx
        ├── components/
        │   ├── layout/
        │   │   ├── Header.tsx
        │   │   └── Footer.tsx
        │   ├── ui/
        │   │   ├── Button.tsx
        │   │   ├── Input.tsx
        │   │   ├── Select.tsx
        │   │   ├── Textarea.tsx
        │   │   ├── Badge.tsx
        │   │   ├── Card.tsx
        │   │   ├── Skeleton.tsx
        │   │   └── Toast.tsx
        │   ├── assignment/
        │   │   ├── AssignmentForm.tsx
        │   │   ├── FileUpload.tsx
        │   │   └── GenerationStatus.tsx
        │   └── paper/
        │       ├── ExamPaperView.tsx
        │       ├── SectionBlock.tsx
        │       └── StudentInfoHeader.tsx
        ├── hooks/
        │   ├── useSocket.ts
        │   └── useToast.ts
        ├── lib/
        │   ├── api.ts
        │   ├── socket.ts
        │   └── validation.ts
        ├── store/
        │   ├── assignmentStore.ts
        │   └── generationStore.ts
        └── types/
            ├── assignment.ts
            └── examPaper.ts
```

## 2. Backend Architecture

```
┌─────────────┐     REST      ┌──────────────────┐
│   Client    │──────────────▶│  Express API     │
│  (Next.js)  │               │  + Multer upload │
└──────┬──────┘               └────────┬─────────┘
       │                               │
       │ WebSocket                     │ Mongoose
       ▼                               ▼
┌─────────────┐               ┌──────────────────┐
│  Socket.IO  │◀── pub/sub ──│     MongoDB      │
│   Server    │   (events)   │ Assignments/Papers│
└──────▲──────┘               └──────────────────┘
       │                               ▲
       │ job progress                  │ persist
       │                               │
┌──────┴──────┐     consume    ┌───────┴──────────┐
│   BullMQ    │◀───────────────│ Generation Worker │
│   Queue     │                │  + AI Service     │
└──────┬──────┘                └───────────────────┘
       │
       ▼
┌─────────────┐
│    Redis    │
└─────────────┘
```

**Layers:**
- **Routes** → HTTP mapping, validation entry
- **Controllers** → request/response shaping
- **Services** → business logic, DB, queue enqueue
- **Workers** → async AI generation, validated JSON persistence
- **Socket** → room-based emits per `assignmentId`

## 3. API Flow

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/assignments` | Create assignment (+ optional file) |
| `GET` | `/api/assignments` | List assignments |
| `GET` | `/api/assignments/:id` | Get assignment + status |
| `POST` | `/api/assignments/:id/generate` | Enqueue AI generation job |
| `POST` | `/api/assignments/:id/regenerate` | Re-enqueue (new paper version) |
| `GET` | `/api/papers/:id` | Get formatted generated paper |
| `GET` | `/api/papers/assignment/:assignmentId` | Latest paper for assignment |
| `GET` | `/health` | Health check |

**Create + Generate sequence:**
1. Client `POST /api/assignments` with form fields (+ optional PDF/text file).
2. Server validates, stores file path/metadata, saves `Assignment` with `status: draft`.
3. Client `POST /api/assignments/:id/generate`.
4. Service sets `status: queued`, adds BullMQ job `{ assignmentId }`.
5. Worker processes → `processing` → AI → validate JSON → save `GeneratedPaper` → `completed` | `failed`.
6. Client polls or listens on Socket.IO `generation:update`.

## 4. BullMQ Flow

```
POST /generate
      │
      ▼
generationQueue.add('generate-paper', { assignmentId })
      │
      ▼
┌─────────────────────────────────────────┐
│ Worker: generation.worker.ts            │
│  1. Load assignment from MongoDB         │
│  2. Emit socket: status = processing    │
│  3. Build prompt (prompt.service)       │
│  4. Call ai.service → structured JSON   │
│  5. Zod/JSON schema validate            │
│  6. Create GeneratedPaper document        │
│  7. Update assignment.status = completed  │
│  8. Emit socket: status = completed     │
│  On error: status = failed, emit error    │
└─────────────────────────────────────────┘
```

**Queue config:** Redis connection, `attempts: 3`, exponential backoff, `removeOnComplete: 100`.

**Job states mirrored on Assignment:** `draft` → `queued` → `processing` → `completed` | `failed`.

## 5. WebSocket Flow

**Namespace:** default `/`  
**Rooms:** `assignment:{assignmentId}` — client joins after starting generation.

| Event (client → server) | Payload | Action |
|-------------------------|---------|--------|
| `join` | `{ assignmentId }` | Join room |

| Event (server → client) | Payload |
|-------------------------|---------|
| `generation:update` | `{ assignmentId, status, progress?, paperId?, error? }` |

**Emit points:**
- Queue job active → `processing`, progress 10%
- AI call start → progress 40%
- Paper saved → `completed`, `paperId`, progress 100%
- Failure → `failed`, `error` message

Frontend `useSocket` subscribes on assignment detail / form after generate click.

## 6. Database Schemas

### Assignment

```typescript
{
  title: string;              // required
  subject?: string;
  dueDate: Date;              // required
  questionTypes: string[];    // e.g. ['mcq','short','long']
  numberOfQuestions: number;  // min 1
  totalMarks: number;
  additionalInstructions?: string;
  sourceFile?: {
    filename: string;
    mimetype: string;
    path: string;
    extractedText?: string;
  };
  status: 'draft' | 'queued' | 'processing' | 'completed' | 'failed';
  generationError?: string;
  latestPaperId?: ObjectId;
  createdAt, updatedAt
}
```

### GeneratedPaper

```typescript
{
  assignmentId: ObjectId;     // ref Assignment
  version: number;            // increment on regenerate
  content: {
    sections: [{
      title: string;
      instruction: string;
      questions: [{
        question: string;
        difficulty: 'easy' | 'medium' | 'hard';
        marks: number;
        type?: string;
      }];
    }];
  };
  promptSnapshot?: string;    // audit/debug
  createdAt, updatedAt
}
```

**Indexes:** `Assignment.createdAt`, `GeneratedPaper.assignmentId + version`.

---

Implementation follows this document; see root `README.md` for setup and deployment.
