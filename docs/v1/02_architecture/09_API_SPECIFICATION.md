# 09_API_SPECIFICATION.md

## API Philosophy

- Workflow First
- Project Centric
- Agent Hidden
- Memory as Service

## API Domains

- projects
- workflows
- facilitation
- memory
- proposals
- models
- health

## Core Endpoint

POST /api/workflows/{projectId}/steps/{stepKey}/run

## Workflow Steps

- situation_mapping
- problem_framing
- domain_diagnosis
- interpretation_alignment
- consensus_gate
- response_strategy
- solution_architecture
- execution_design
- risk_review
- transition_planning

## Model Providers

- OpenAI
- Gemini
- Claude

## Services

- Project Service
- Workflow Service
- Navigator Service
- Facilitation Service
- Memory Service
- Proposal Service
- Model Service

## Response Standard

Success:
{
  "success": true,
  "data": {}
}

Error:
{
  "success": false,
  "error": {}
}

## MVP Priority

1. Projects
2. Workflows
3. Facilitation
4. Proposal
5. Memory
6. Model Comparison
