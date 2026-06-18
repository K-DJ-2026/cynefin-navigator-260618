# 05_AI_AGENT_ARCHITECTURE.md

# Cynefin Navigator AI Agent Architecture

## Product Positioning
AI-Powered Sense-Making & Human Collaboration Support System

## Core Architecture
Centralized Orchestration Model

User
→ Navigator Agent
→ Workflow Orchestrator
→ Specialist Agent Layer
→ Prompt Layer
→ Memory Layer
→ Output / Proposal Generator

---

# 1. Agent Philosophy

Cynefin Navigator is not an answer engine.

It is a structured sense-making, decision-making, facilitation, action, and learning system.

Core principles:
- Sense-Making before Decision-Making
- Alignment before Commitment
- Human Collaboration before AI Autonomy
- Facilitation as Meta Layer
- AI augments, not replaces
- Explainable Judgment
- Memory as Organizational Thinking Record

---

# 2. Navigator Agent

The Navigator Agent is the central brain and orchestration layer.

Responsibilities:
- Identify current workflow step
- Judge step readiness
- Call specialist agents
- Detect facilitation triggers
- Integrate outputs
- Suggest next action
- Write to memory

Navigator Agent does not:
- Make final decisions for humans
- Skip consensus
- Hide uncertainty
- Present assumptions as facts

---

# 3. Agent Tiers

## Tier 1: Sense-Making Core Brain
- Situation Analyst Agent
- Problem Framing Agent
- Domain Diagnostician Agent
- Interpretation Alignment Agent

## Tier 2: Human Collaboration Engine
- Facilitator Agent
- Consensus Builder Agent
- Strategy Agent
- Solution Architect Agent

## Tier 3: Action & Learning Engine
- Execution Planner Agent
- Risk Challenger Agent
- Transition Designer Agent

---

# 4. Tier 1: Sense-Making Core Brain

## Situation Analyst Agent
Purpose:
Understand the situation without jumping to causes or solutions.

Outputs:
- Situation Summary
- Facts
- Interpretations
- Unknowns
- Stakeholders
- Emerging Questions

## Problem Framing Agent
Purpose:
Define the real problem and distinguish symptoms from problems.

Outputs:
- Problem Statement
- Alternative Problem Statements
- Symptom vs Problem
- Framing Conflict Map

## Domain Diagnostician Agent
Purpose:
Diagnose Cynefin Domain.

Domains:
- Clear
- Complicated
- Complex
- Chaotic
- Confused

Outputs:
- Primary Domain
- Alternative Domain
- Confidence Level
- Evidence
- Counter Evidence
- Diagnostic Questions

## Interpretation Alignment Agent
Purpose:
Reveal differences in interpretation among stakeholders.

Outputs:
- Perspective Map
- Assumption Map
- Agreement Areas
- Disagreement Areas
- Consensus Candidates

---

# 5. Tier 2: Human Collaboration Engine

## Facilitator Agent
Purpose:
Generate better conversations, not forced conclusions.

Outputs:
- Facilitation Questions
- Discussion Guide
- Workshop Guide
- Conversation Structure

## Consensus Builder Agent
Purpose:
Identify sufficient consensus for proceeding.

Outputs:
- Agreement Areas
- Disagreement Areas
- Consensus Candidates
- Proceed / Revisit Recommendation

## Strategy Agent
Purpose:
Recommend domain-aligned response strategies.

Domain Response Logic:
- Clear: Sense → Categorize → Respond
- Complicated: Sense → Analyze → Respond
- Complex: Probe → Sense → Respond
- Chaotic: Act → Sense → Respond
- Confused: Break Down → Re-Diagnose

## Solution Architect Agent
Purpose:
Turn response strategy into solution options.

Outputs:
- Option Set
- Pros / Cons
- Trade-offs
- Recommendation

---

# 6. Tier 3: Action & Learning Engine

## Execution Planner Agent
Purpose:
Convert decisions into executable actions.

Outputs:
- Action Plan
- Owner
- Timeline
- Milestones
- Success Metrics
- Review Schedule

## Risk Challenger Agent
Purpose:
Challenge optimism and reveal blind spots.

Outputs:
- Risk Register
- Blind Spots
- Counter Scenarios
- Premortem Analysis
- Early Warning Signals

## Transition Designer Agent
Purpose:
Design movement from current domain to target domain.

Outputs:
- Transition Map
- Transition Strategy
- Learning Agenda
- Capability Gaps
- Review Points

Example transitions:
- Chaotic → Complex
- Complex → Complicated
- Complicated → Clear
- Clear → Complex

---

# 7. Memory Architecture

Memory is not chat history.

Memory is organizational thinking record.

## Memory Pyramid
1. Session Memory
2. Project Memory
3. Organization Memory
4. Knowledge Memory
5. Wisdom Memory

## Session Memory
Stores current step, recent questions, recent responses, current judgment.

## Project Memory
Stores situation history, problem history, domain history, consensus notes, action plans, risk reviews.

## Organization Memory
Stores recurring patterns, repeated conflicts, repeated failures, repeated successes.

## Knowledge Memory
Stores case library, domain patterns, facilitation patterns, transition patterns.

## Wisdom Memory
Stores lessons learned, best questions, failed assumptions, decision patterns, leadership insights.

---

# 8. Prompt Architecture

## Layer 0: Navigator System Prompt
Maintains overall philosophy.

## Layer 1: Workflow Prompt
Controls current workflow step.

## Layer 2: Agent Prompt
Defines specialist agent role.

## Layer 3: Facilitation Prompt
Supports conflict, alignment, and consensus.

## Layer 4: Output Prompt
Standardizes result format.

---

# 9. Communication Protocol

Architecture:
Navigator Hub Model

All communication flows through Navigator Agent.

Specialist Agent → Navigator → Specialist Agent

No direct Agent-to-Agent debate in early versions.

Reason:
- Explainability
- Auditability
- State management
- Simplicity
- Human collaboration first

---

# 10. Context Engineering

Agents must consider:
- Current Step
- Project Context
- Previous Step Outputs
- Project Memory
- Organization Memory
- Knowledge Library
- Facilitation Notes

Rule:
Agents can read memory.
Only Navigator Agent can write to memory.

---

# 11. Failure Prevention Architecture

## Failure 1: Solution Jumping
Prevention:
No solution before Problem Framing.

## Failure 2: Domain Misdiagnosis
Prevention:
Alternative Domain and Counter Evidence required.

## Failure 3: Action Without Consensus
Prevention:
Consensus Gate required.

## Failure 4: Lost Learning
Prevention:
Wisdom Memory required.

---

# 12. AI Agent Maturity Roadmap

## Stage 1: Leadership Companion
AI as Thinking Partner.

## Stage 2: Facilitation Companion
AI as Co-Facilitator.

## Stage 3: AI Facilitator
AI as Facilitation Lead.

## Stage 4: Organizational Sense-Making System
AI as Organizational Learning Guide.

## Stage 5: Organizational Wisdom System
AI as Wisdom Partner.

---

# Final Cognitive Architecture

Navigator Agent
→ Tier 1 Sense-Making Core
→ Tier 2 Human Collaboration Engine
→ Tier 3 Action & Learning Engine
→ Memory Pyramid
→ Organizational Wisdom System
