# 06_DATABASE_SCHEMA.md

# Cynefin Navigator Database Schema

## Philosophy

Cynefin Navigator is not a project database.

It is a Sense-Making Memory System and Organizational Learning Platform.

Core principles:

- Workflow-Centric Database
- Thinking Process Traceability
- Memory Pyramid
- Knowledge → Wisdom Evolution
- Retrieval First Architecture
- Human + AI Collaboration History

---

# Memory Pyramid

1. Session Memory
2. Project Memory
3. Organization Memory
4. Knowledge Memory
5. Wisdom Memory

---

# Technology Stack

- PostgreSQL
- Supabase
- Prisma ORM
- pgvector
- Supabase Storage

---

# Core Architecture

Organization
→ Projects
→ Step Runs
→ Meaning Data
→ Memory
→ Knowledge
→ Wisdom

---

# Identity Layer

organizations

users

organization_members

---

# Project Layer

projects

project_participants

project_files

project_events

---

# Workflow Layer

workflow_steps

step_runs

step_outputs

workflow_state

---

# Agent Layer

agents

agent_runs

agent_outputs

agent_prompts

---

# Sense-Making Layer

situations

facts

interpretations

unknowns

stakeholders

---

# Problem Framing Layer

problem_statements

problem_frames

framing_conflicts

---

# Domain Diagnosis Layer

domain_diagnoses

domain_evidence

domain_counter_evidence

Supported Domains:

- Clear
- Complicated
- Complex
- Chaotic
- Confused

---

# Human Collaboration Layer

individual_analyses

shared_comparisons

agreement_maps

difference_maps

consensus_notes

---

# Decision & Action Layer

strategies

solutions

decisions

action_plans

action_items

---

# Risk & Learning Layer

risks

blind_spots

premortems

learning_notes

transition_paths

---

# Memory Layer

session_memories

project_memories

organization_memories

knowledge_items

wisdom_items

---

# Relationship Architecture

Organization
→ Project
→ Step Run
→ Meaning Data
→ Memory
→ Knowledge
→ Wisdom

All major entities include:

- project_id
- step_run_id (where applicable)

Decision Traceability:

Decision
→ Solution
→ Strategy
→ Domain
→ Problem
→ Situation

---

# Physical Design Rules

## IDs

UUID v7

## Audit

created_at

updated_at

created_by

updated_by

## Soft Delete

deleted_at

## Versioning

version_no

current_version

## Status

draft

reviewed

accepted

rejected

archived

---

# Retrieval Architecture

Priority:

1. Current Context
2. Project Memory
3. Organization Memory
4. Knowledge Library
5. Wisdom Library

Hybrid Retrieval:

SQL + Vector Search

---

# RAG Strategy

RAG Sources:

- organization_memories
- knowledge_items
- wisdom_items

Non-RAG:

- users
- projects
- workflow_state

---

# Embedding Strategy

Embedding Tables:

- project_memories
- organization_memories
- knowledge_items
- wisdom_items

Vector Index:

HNSW

---

# Security

Multi-Tenant Architecture

organization_id based isolation

Row Level Security enabled

---

# Event History

project_events

Tracks:

- who
- when
- what
- why

Examples:

- Domain changes
- Problem reframing
- Decision updates

---

# Strategic Conclusion

Cynefin Navigator Database is not a project repository.

It is an Organizational Thinking Database supporting:

- Sense-Making
- Decision-Making
- Human Collaboration
- Organizational Learning
- Knowledge Accumulation
- Wisdom Generation
