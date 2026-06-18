# 14_MVP_SPRINT_PLAN.md

# Cynefin Navigator MVP Sprint Plan

## MVP Goal

Build a Local MVP that allows a user to complete:

Situation
→ Problem
→ Domain
→ Facilitation
→ Proposal

The MVP should validate whether Cynefin Navigator helps users understand complex situations, frame problems, diagnose Cynefin domains, generate facilitation questions, and produce an executive proposal.

---

# Delivery Strategy

Do not build everything at once.

Recommended sequence:

Foundation
→ Workflow
→ UI
→ Agent
→ Memory
→ Proposal
→ Pilot

---

# Sprint 0: Environment Setup

## Goal

Prepare local development environment.

## Build

- Git repository
- Next.js
- TypeScript
- Tailwind
- Prisma
- SQLite

## Done When

- App runs on localhost
- Basic homepage loads
- Prisma setup works

---

# Sprint 1: Foundation

## Goal

Create basic project structure and core entities.

## Build

- Project model
- WorkflowState model
- StepOutput model
- ProjectMemory model
- Dashboard
- Workspace shell

## APIs

- GET /api/projects
- POST /api/projects

## Done When

- User can create a project
- User can open a project workspace

---

# Sprint 2: Workflow Runtime

## Goal

Implement workflow engine.

## Build

- Workflow step definitions
- Current step state
- Step navigation
- Step output storage

## Done When

- User can move through steps
- Step output is saved

---

# Sprint 3: Situation Engine

## Goal

Implement Situation Mapping.

## Build

- Situation input
- Facts
- Interpretations
- Unknowns
- Stakeholders

## Done When

- User can enter a situation
- System can generate or mock Situation Mapping output

---

# Sprint 4: Problem Engine

## Goal

Implement Problem Framing.

## Build

- Problem statements
- Alternative frames
- Hidden assumptions

## Done When

- User can generate candidate problem statements
- User can select or edit problem framing

---

# Sprint 5: Domain Diagnosis

## Goal

Implement Cynefin Domain Diagnosis.

## Build

- Domain Map
- Primary Domain
- Alternative Domain
- Confidence
- Evidence
- Counter Evidence

## Domains

- Clear
- Complicated
- Complex
- Chaotic
- Confused

## Done When

- User can diagnose a situation into a Cynefin domain
- Evidence and counter evidence are shown

---

# Sprint 6: Agent Runtime

## Goal

Implement AI runtime.

## Build

- Navigator Agent
- Agent Registry
- Context Builder
- Model Adapter Layer
- OpenAI Adapter
- Gemini Adapter
- Claude Adapter

## Done When

- User can run at least one model provider
- Model provider can be switched
- Model comparison is possible

---

# Sprint 7: Facilitation Board

## Goal

Implement AI-assisted facilitation.

## Build

- Agreement Map
- Difference Map
- Facilitation Questions
- Workshop Guide

## Done When

- User can generate facilitation questions from current project context

---

# Sprint 8: Proposal Generator

## Goal

Generate executive proposal.

## Build

- Executive Summary
- Situation
- Problem
- Domain
- Evidence
- Strategy
- Risks
- Blind Spots
- Next Actions

## Output

- Markdown first

## Done When

- User can generate a complete Markdown proposal

---

# Sprint 9: Memory Layer

## Goal

Implement Project Memory.

## Build

- Save memory
- Recall memory
- Search memory
- Summarize memory

## Done When

- Project outputs are stored as project memory
- User can recall prior project context

---

# Sprint 10: Pilot Readiness

## Goal

Prepare for real-world test.

## Build

- UX refinements
- Bug fixes
- Logging
- Prompt improvements
- Demo data

## Done When

- Local MVP can be used in a small test session
- Founder can run a validation workshop using the tool

---

# Milestones

## M1 Foundation

Sprint 0–2

## M2 Sense-Making MVP

Sprint 3–5

## M3 AI Facilitator MVP

Sprint 6–8

## M4 Pilot MVP

Sprint 9–10

---

# MVP Success Criteria

The MVP succeeds if a user can:

1. Create a project
2. Enter a complex situation
3. Generate Situation Mapping
4. Generate Problem Framing
5. Diagnose Cynefin Domain
6. Generate Facilitation Questions
7. Generate Executive Proposal
8. Store Project Memory

---

# Codex Instruction

Build incrementally.

Do not implement all future features.

Do not start with Enterprise Auth, Supabase, real-time collaboration, knowledge graph, or wisdom engine.

Start local.

Use SQLite first.

Prepare the architecture so that deployment to Vercel + Supabase is possible later.
