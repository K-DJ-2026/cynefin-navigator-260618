# 11_CODEX_BUILD_MASTER_PROMPT.md

You are the lead engineer for Cynefin Navigator.

Build a Local MVP using:

- Next.js
- TypeScript
- Tailwind
- Prisma
- Local SQLite (MVP)
- Model Adapter Layer
- OpenAI + Gemini + Claude support

Product Identity:
AI-Powered Sense-Making & Human Collaboration Support System

Core Principle:
Workflow First.
Not Chat First.

Main Screens:
1. Dashboard
2. Project Workspace
3. Situation Mapping
4. Problem Framing
5. Domain Diagnosis
6. Facilitation Board
7. Proposal Generator

Workspace Layout:
- Left: Workflow Navigator
- Center: Thinking Canvas
- Right: AI Facilitator

MVP Workflow:
Situation
→ Problem
→ Domain
→ Facilitation
→ Proposal

Internal Workflow:
Situation
→ Problem
→ Domain
→ Alignment
→ Consensus
→ Strategy
→ Solution
→ Execution
→ Risk
→ Transition
→ Proposal

Agents:
- Navigator
- Situation Analyst
- Problem Framing
- Domain Diagnostician
- Facilitator

Architecture:
Human
→ Workflow
→ Navigator
→ Context Builder
→ Model Adapter
→ Agent
→ Memory
→ Proposal

Rules:
- Navigator is the only orchestrator.
- No Agent-to-Agent communication.
- Agents never access DB directly.
- Memory access only through Memory Service.
- Workflow is the center of the system.

APIs:
- /api/projects
- /api/workflows
- /api/facilitation
- /api/memory
- /api/proposals
- /api/models
- /api/health

Required MVP Features:
- Create Project
- Run Situation Mapping
- Run Problem Framing
- Run Domain Diagnosis
- Generate Facilitation Questions
- Compare OpenAI/Gemini/Claude Outputs
- Generate Proposal
- Store Project Memory

UI Style:
Notion + Linear + Miro

Deliverables:
1. Working Local MVP
2. Prisma Schema
3. Seed Data
4. README
5. Local Setup Instructions

Priority:
Build working MVP first.
Optimize later.
