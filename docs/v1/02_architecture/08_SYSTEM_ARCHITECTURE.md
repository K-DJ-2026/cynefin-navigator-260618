# 08_SYSTEM_ARCHITECTURE.md

# Cynefin Navigator System Architecture

## Product Identity

Cynefin Navigator is an AI-Powered Sense-Making Operating System.

It supports:

- Sense-Making
- Decision-Making
- Human Collaboration
- Facilitation
- Organizational Learning

---

# 1. Architectural Principles

## 1.1 Sense-Making First

Cynefin Navigator does not jump from problem to solution.

It follows:

Situation
→ Meaning
→ Problem
→ Domain
→ Response
→ Action
→ Learning

## 1.2 Human-Centered Decision

AI supports judgment.

Humans make final decisions.

## 1.3 Facilitation Everywhere

Facilitation is available across all workflow steps.

## 1.4 Memory Before Intelligence

LLM providers can change.

Memory, workflow, and sense-making records are the core assets.

## 1.5 Explainability

Every AI judgment should include:

- Evidence
- Assumptions
- Counter Evidence
- Confidence
- Open Questions

---

# 2. System Layers

Presentation Layer
→ Application Layer
→ Workflow Layer
→ Agent Layer
→ Memory Layer
→ Knowledge Layer
→ Data Layer

---

# 3. Presentation Layer

Technology:

- Next.js

Core Screens:

- Dashboard
- Project Workspace
- Workflow Navigator
- Step Detail View
- Facilitation Board
- Proposal Generator

---

# 4. Application Layer

Responsibilities:

- Project Management
- Workflow Control
- Permission Handling
- API Routing
- User Interaction Logic

---

# 5. Workflow Layer

Core workflow:

1. Situation Mapping
2. Problem Framing
3. Domain Diagnosis
4. Interpretation Alignment
5. Consensus Gate
6. Response Strategy
7. Solution Architecture
8. Execution Design
9. Risk Review
10. Transition Planning

The workflow is the system center.

The core runtime entity is:

Project + Step Run

---

# 6. Agent Layer

Architecture:

Navigator-centered orchestration.

Navigator Agent is the only orchestrator.

Specialist Agents:

Tier 1:
- Situation Analyst
- Problem Framing
- Domain Diagnostician
- Interpretation Alignment

Tier 2:
- Facilitator
- Consensus Builder
- Strategy
- Solution Architect

Tier 3:
- Execution Planner
- Risk Challenger
- Transition Designer

No direct Agent-to-Agent communication in MVP.

---

# 7. Runtime Architecture

Human
→ Workflow Runtime
→ Navigator Agent
→ Context Builder
→ Retrieval Service
→ Specialist Agent
→ Output
→ Memory Update
→ Next Step

---

# 8. Retrieval Architecture

Agents do not access the database directly.

Agents use:

Retrieval Service
→ Memory Service
→ Database

Retrieval priority:

1. Current Project
2. Current Step
3. Project Memory
4. Organization Memory
5. Knowledge Library
6. Wisdom Library

---

# 9. Memory Architecture

Memory Pyramid:

1. Session Memory
2. Project Memory
3. Organization Memory
4. Knowledge Memory
5. Wisdom Memory

Local MVP uses:

- Project Memory
- Step Outputs
- Basic Agent Execution Logs

Organization Memory and Wisdom Memory are roadmap items.

---

# 10. Deployment Architecture

MVP Strategy:

Local MVP first.

Later deployment:

- Vercel for Next.js
- Supabase for PostgreSQL, Auth, Storage, pgvector
- Prisma as ORM

Local MVP should be deployable later with minimal code changes.

---

# 11. AI Model Strategy

## 11.1 Multi-Model Test Mode

Unlike a single-provider MVP, Cynefin Navigator should support testing multiple LLM providers early.

Test providers:

- OpenAI
- Google Gemini
- Anthropic Claude

Reason:

Cynefin Navigator depends on reasoning quality, facilitation quality, and domain diagnosis quality.

Different models may perform differently on:

- Situation Mapping
- Problem Framing
- Domain Diagnosis
- Facilitation Question Generation
- Proposal Writing

Therefore, the architecture must support provider comparison.

---

## 11.2 Model Adapter Layer

All model calls must go through a Model Adapter.

Agent
→ Model Adapter
→ Provider

Providers:

- OpenAI Adapter
- Gemini Adapter
- Claude Adapter

Agents must not call provider SDKs directly.

---

## 11.3 Model Selection Strategy

Local MVP should support model selection at runtime.

Possible options:

- Global default model
- Per-agent model selection
- Manual test mode
- Side-by-side output comparison

Recommended MVP behavior:

- Start with a default provider
- Allow switching providers in settings
- Allow running the same step with different providers for comparison

---

## 11.4 Agent-to-Model Mapping

Initial testing candidates:

Navigator Agent:
- OpenAI / Claude comparison

Situation Analyst:
- OpenAI / Gemini / Claude comparison

Problem Framing:
- Claude / OpenAI comparison

Domain Diagnostician:
- Claude / OpenAI / Gemini comparison

Facilitator:
- Claude / OpenAI comparison

Proposal Generator:
- OpenAI / Claude comparison

---

# 12. Prompt Lifecycle

Prompts must not be hardcoded inside agent logic.

Prompt directory:

prompts/
├── system/
├── workflow/
├── agents/
├── facilitation/
└── output/

Prompt versioning should be supported later.

---

# 13. Context Engineering

Every agent receives:

- Current Project
- Current Step
- User Input
- Previous Step Outputs
- Project Memory
- Relevant Knowledge
- Facilitation Notes

Context Builder prepares the final context before model execution.

---

# 14. Local MVP Scope

Include:

- Project creation
- Workflow state
- Situation Mapping
- Problem Framing
- Domain Diagnosis
- Facilitation Questions
- Proposal Generation
- Project Memory
- Multi-model test mode

Exclude initially:

- Real-time collaboration
- Enterprise Auth
- Organization Memory
- Wisdom Engine
- Advanced RAG
- Full Knowledge Graph

---

# 15. Monitoring & Logging

Track:

- Agent Runs
- Model Provider Used
- Prompt Version
- Input Context Summary
- Output Summary
- User Acceptance
- Regeneration Count

This will help compare model quality.

---

# 16. System Summary

Cynefin Navigator is not a chatbot.

It is a workflow-centered, memory-aware, model-flexible AI system.

Core system logic:

Human
→ Workflow
→ Navigator
→ Context Builder
→ Model Adapter
→ Specialist Agent Output
→ Memory
→ Learning

---

# CTO Decision

Local MVP should support OpenAI, Gemini, and Claude testing through a Model Adapter Layer.

This allows model comparison without rewriting agent logic.

The system should remain model-flexible from the beginning.
