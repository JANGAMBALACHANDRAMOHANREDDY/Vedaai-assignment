# Assignment Submission — Vedaai Assessment Creator

## Deployment links

| Type | URL |
|------|-----|
| **Live app (submit this)** | https://wide-areas-return.loca.lt |
| **Demo exam paper** | https://wide-areas-return.loca.lt/papers/5a556fde-e51b-47e9-94bc-173f3e8a2f9b |
| **GitHub source** | https://github.com/JANGAMBALACHANDRAMOHANREDDY/Vedaai-assignment |
| **Permanent deploy** | https://vercel.com/new/clone?repository-url=https://github.com/JANGAMBALACHANDRAMOHANREDDY/Vedaai-assignment |

> LocalTunnel: first visit may ask you to click **Continue** on a reminder page.

---

## Sample AI output (structured JSON)

```json
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions. Marks are shown in brackets.",
      "questions": [
        {
          "question": "Physics Mid-Term Assessment — Question 1: Explain a core concept from this subject with a clear example.",
          "difficulty": "easy",
          "marks": 10
        },
        {
          "question": "Physics Mid-Term Assessment — Question 2: Explain a core concept from this subject with a clear example.",
          "difficulty": "medium",
          "marks": 10
        },
        {
          "question": "Physics Mid-Term Assessment — Question 3: Explain a core concept from this subject with a clear example.",
          "difficulty": "hard",
          "marks": 10
        },
        {
          "question": "Physics Mid-Term Assessment — Question 4: Explain a core concept from this subject with a clear example.",
          "difficulty": "easy",
          "marks": 10
        },
        {
          "question": "Physics Mid-Term Assessment — Question 5: Explain a core concept from this subject with a clear example.",
          "difficulty": "medium",
          "marks": 10
        }
      ]
    }
  ]
}
```

---

## Exam paper UI output

```
┌─────────────────────────────────────────────────────────────┐
│              PHYSICS MID-TERM ASSESSMENT                      │
│                      PHYSICS                                │
├─────────────────────────────────────────────────────────────┤
│  Student Name: _______________    Due Date: Jun 15, 2026     │
│  Roll No: ____________________    Total Marks: 50           │
│  Class/Section: ______________    Questions: 5              │
├─────────────────────────────────────────────────────────────┤
│  Section A                                                  │
│  Attempt all questions. Marks are shown in brackets.        │
│                                                             │
│  Q1. Physics Mid-Term Assessment — Question 1...            │
│      [easy]  [10 marks]                                     │
│  Q2. Physics Mid-Term Assessment — Question 2...            │
│      [medium]  [10 marks]                                   │
│  ...                                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Features demonstrated

- Assignment form (title, subject, due date, question types, marks)
- AI question paper generation (structured JSON, never raw LLM text)
- Professional exam layout with difficulty badges
- PDF export
- Regenerate paper
- Real-time generation status

## Tech stack

Next.js 15 · TypeScript · Tailwind · Zustand · Express · MongoDB · Redis · BullMQ · Socket.IO
