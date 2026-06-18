# Cynefin Navigator

Local MVP foundation for Cynefin Navigator, a workflow-first sense-making and collaboration support system.

This repository currently implements Sprint 0, Sprint 1, Sprint 2, and Sprint 3.

## Included

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- Local SQLite database
- Basic `Project` model
- Dashboard
- Project creation
- Project Workspace shell
- `/api/projects` endpoint
- WorkflowState runtime
- Current workflow step persistence
- Situation page
- Problem page
- Step output persistence
- Domain Diagnosis page
- Five Cynefin domain cards
- Primary and alternative domain persistence
- Evidence and counter-evidence persistence
- Confidence score persistence

## Not Included Yet

- AI agents
- OpenAI, Gemini, or Claude integrations
- Model Adapter Layer
- 5CT Scan
- Proposal Generator

## Local Setup

Install dependencies:

```bash
npm install
```

Create the local SQLite database:

```bash
npm run db:init
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

If your local Prisma schema engine supports migrations normally, you can also run:

```bash
npm run prisma:migrate -- --name init
```

Optional seed data:

```bash
npm run db:seed
```

Run the app locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Development Notes

The SQLite database is configured in `.env`:

```text
DATABASE_URL="file:./dev.db"
```

The database file is created under `prisma/dev.db` and is ignored by git.

## Sprint 2 Direction

Implemented:

- WorkflowState entity
- Current step tracking
- Step navigation persistence
- Situation page
- Problem page
- Situation and problem output persistence

## Sprint 3 Direction

Implemented:

- Human-first Domain Diagnosis page
- Clear, Complicated, Complex, Chaotic, and Confused cards
- Primary Domain selection
- Alternative Domain selection
- Evidence input
- Counter Evidence input
- Confidence score from 0 to 100
- Save and restore through WorkflowState

## Sprint 4 Direction

- Facilitation Board shell
- Stronger workflow progress indicators
- Workflow output review summary
- Keep AI/model/5CT work deferred until later sprints
