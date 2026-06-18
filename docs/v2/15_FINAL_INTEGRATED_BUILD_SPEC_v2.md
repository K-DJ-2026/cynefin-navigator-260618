# 15_FINAL_INTEGRATED_BUILD_SPEC_v2.md

## Source Documents

- `11_CODEX_BUILD_MASTER_PROMPT(축약본).md`
- `12_MASTER_BUILD_SPEC_v2.md`
- `13_CODEX_IMPLEMENTATION_GUIDE_v2.md`
- `14_MVP_SPRINT_PLAN_v2.md`

## Role

You are the lead engineer for Cynefin Navigator.

Build a working Local MVP first. Optimize later.

## Product Identity

Product:
Cynefin Navigator(TM)

Product Definition:
AI-Powered Sense-Making & Human Collaboration Support System

Core Principle:
Workflow First. Not Chat First.

Design Reference:
Notion + Linear + Miro

## Product Naming Architecture

Product:
Cynefin Navigator(TM)

Core Engine:
5CT Engine(TM)

Methodology:
5CT Method(TM)

Diagnostic Process:
5CT Scan(TM)

Output:
5CT Diagnostic Report(TM)

Meaning:

- 5C = Clear, Complicated, Complex, Chaotic, Confused
- CT = Computed Tomography

## Technology Stack

- Next.js
- TypeScript
- Tailwind
- Prisma
- Local SQLite for MVP
- Model Adapter Layer
- OpenAI support
- Gemini support
- Claude support

## Main Screens

1. Dashboard
2. Project Workspace
3. Situation Mapping
4. Problem Framing
5. Domain Diagnosis
6. 5CT Scan
7. Facilitation Board
8. Proposal Generator

## Workspace Layout

- Left: Workflow Navigator
- Center: Thinking Canvas
- Right: AI Facilitator

## MVP Workflow

1. Situation
2. Problem
3. Domain
4. 5CT Scan
5. Facilitation
6. Proposal

## Internal Workflow

1. Situation
2. Problem
3. Domain
4. Alignment
5. Consensus
6. Strategy
7. Solution
8. Execution
9. Risk
10. Transition
11. Proposal

## Agents

- Navigator
- Situation Analyst
- Problem Framing Agent
- Domain Diagnostician
- Facilitator

## Architecture Flow

Human
-> Workflow
-> Navigator
-> Context Builder
-> Model Adapter
-> Agent
-> Memory
-> Proposal

## Architectural Rules

- Navigator is the only orchestrator.
- No Agent-to-Agent communication.
- Agents never access the database directly.
- Memory access only happens through Memory Service.
- Workflow is the center of the system.
- 5CT Scan runs as a workflow capability through the Navigator.
- 5CT Engine produces diagnostic outputs but does not orchestrate agents.

## Core Modules

- `runtime/5ct-engine.ts`
- `services/5ct-scan-service.ts`
- `components/5ct-scan/`
- `types/5ct-scan.ts`

## 5CT Scan Output

The 5CT Scan must produce:

- `primaryDomain`
- `alternativeDomain`
- `confidence`
- `evidence`
- `counterEvidence`
- `facilitationQuestions`

## APIs

- `/api/projects`
- `/api/workflows`
- `/api/facilitation`
- `/api/memory`
- `/api/proposals`
- `/api/models`
- `/api/health`
- `/api/5ct-scan`

## Required MVP Features

- Create Project
- Run Situation Mapping
- Run Problem Framing
- Run Domain Diagnosis
- Run 5CT Scan
- Detect Primary Domain
- Detect Alternative Domain
- Generate Evidence
- Generate Counter Evidence
- Generate Facilitation Questions
- Compare OpenAI/Gemini/Claude Outputs
- Generate Proposal
- Store Project Memory

## Sprint 5 Scope

Sprint:
5CT Scan Engine

Build:

- Primary Domain Detection
- Alternative Domain Detection
- Evidence Generation
- Counter Evidence Generation
- Facilitation Question Generation

Milestone:
Sense-Making MVP with 5CT Scan enabled

## Deliverables

1. Working Local MVP
2. Prisma Schema
3. Seed Data
4. README
5. Local Setup Instructions
6. 5CT Engine module
7. 5CT Scan service
8. 5CT Scan UI components
9. 5CT Diagnostic Report output shape

## Implementation Priority

1. Build the working Local MVP.
2. Implement the workflow-centered project experience.
3. Add Navigator-led orchestration.
4. Add the Model Adapter Layer for OpenAI, Gemini, and Claude.
5. Add Memory Service and project memory persistence.
6. Add 5CT Scan as a first-class MVP workflow step.
7. Generate proposal outputs from accumulated workflow context.
8. Improve UX, evaluation quality, and model comparison after the MVP works end to end.
