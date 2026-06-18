import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const validSteps = new Set([
  "situation",
  "problem",
  "domain",
  "facilitation",
  "proposal",
  "action",
  "acceptance",
  "review"
]);

type WorkflowRouteContext = {
  params: Promise<{ id: string }>;
};

async function ensureWorkflowState(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true }
  });

  if (!project) {
    return null;
  }

  return prisma.workflowState.upsert({
    where: { projectId },
    update: {},
    create: {
      projectId,
      currentStep: "situation"
    }
  });
}

export async function GET(_request: Request, context: WorkflowRouteContext) {
  const { id } = await context.params;
  const workflowState = await ensureWorkflowState(id);

  if (!workflowState) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ workflowState });
}

export async function PATCH(request: Request, context: WorkflowRouteContext) {
  const { id } = await context.params;
  const existing = await ensureWorkflowState(id);

  if (!existing) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const body = (await request.json()) as {
    currentStep?: string;
    situationOutput?: string;
    problemOutput?: string;
    primaryDomain?: string;
    alternativeDomain?: string;
    evidence?: string;
    counterEvidence?: string;
    confidence?: number;
    keyQuestion?: string;
    observations?: string;
    insights?: string;
    facilitationNotes?: string;
    proposalDraft?: string;
    actionItems?: string;
    acceptanceFindings?: string;
    acceptanceDecision?: string;
    acceptancePriority?: string;
    alignmentNotes?: string;
    decisionOwner?: string;
    decisionDate?: string;
  };

  if (body.currentStep && !validSteps.has(body.currentStep)) {
    return NextResponse.json({ error: "Invalid workflow step." }, { status: 400 });
  }

  if (
    typeof body.confidence === "number" &&
    (!Number.isInteger(body.confidence) || body.confidence < 0 || body.confidence > 100)
  ) {
    return NextResponse.json({ error: "Confidence must be an integer from 0 to 100." }, { status: 400 });
  }

  const workflowState = await prisma.workflowState.update({
    where: { projectId: id },
    data: {
      currentStep: body.currentStep,
      situationOutput:
        typeof body.situationOutput === "string" ? body.situationOutput.trim() || null : undefined,
      problemOutput:
        typeof body.problemOutput === "string" ? body.problemOutput.trim() || null : undefined,
      primaryDomain:
        typeof body.primaryDomain === "string" ? body.primaryDomain.trim() || null : undefined,
      alternativeDomain:
        typeof body.alternativeDomain === "string" ? body.alternativeDomain.trim() || null : undefined,
      evidence: typeof body.evidence === "string" ? body.evidence.trim() || null : undefined,
      counterEvidence:
        typeof body.counterEvidence === "string" ? body.counterEvidence.trim() || null : undefined,
      confidence: typeof body.confidence === "number" ? body.confidence : undefined,
      keyQuestion: typeof body.keyQuestion === "string" ? body.keyQuestion.trim() || null : undefined,
      observations: typeof body.observations === "string" ? body.observations.trim() || null : undefined,
      insights: typeof body.insights === "string" ? body.insights.trim() || null : undefined,
      facilitationNotes:
        typeof body.facilitationNotes === "string" ? body.facilitationNotes.trim() || null : undefined,
      proposalDraft: typeof body.proposalDraft === "string" ? body.proposalDraft.trim() || null : undefined,
      actionItems: typeof body.actionItems === "string" ? body.actionItems.trim() || null : undefined,
      acceptanceFindings:
        typeof body.acceptanceFindings === "string" ? body.acceptanceFindings.trim() || null : undefined,
      acceptanceDecision:
        typeof body.acceptanceDecision === "string" ? body.acceptanceDecision.trim() || null : undefined,
      acceptancePriority:
        typeof body.acceptancePriority === "string" ? body.acceptancePriority.trim() || null : undefined,
      alignmentNotes: typeof body.alignmentNotes === "string" ? body.alignmentNotes.trim() || null : undefined,
      decisionOwner: typeof body.decisionOwner === "string" ? body.decisionOwner.trim() || null : undefined,
      decisionDate: typeof body.decisionDate === "string" ? body.decisionDate.trim() || null : undefined
    }
  });

  return NextResponse.json({ workflowState });
}
