# 07_GITHUB_STRUCTURE.md

# Cynefin Navigator GitHub Structure

## Architecture Style
Modular Monolith

## Repository
cynefin-navigator

## Top Level

- apps/
- packages/
- database/
- agents/
- prompts/
- memory/
- knowledge/
- docs/
- scripts/
- infrastructure/
- tests/

## Apps

apps/web

Future:
- admin
- facilitator-console

## Agents

Tier 1
- situation-analyst
- problem-framing
- domain-diagnostician
- interpretation-alignment

Tier 2
- facilitator
- consensus-builder
- strategy
- solution-architect

Tier 3
- execution-planner
- risk-challenger
- transition-designer

## Memory

- session
- project
- organization
- knowledge
- wisdom

## Dependency Rules

Navigator is the only orchestrator.

Agents never call other agents directly.

Agents never access DB directly.

Agents access Memory through Memory Services.

## MVP Scope

Navigator
Situation Analyst
Problem Framing
Domain Diagnostician
Facilitator

## Roadmap

Phase 1
Sense-Making

Phase 2
Collaboration

Phase 3
Decision

Phase 4
Learning

Phase 5
Wisdom
