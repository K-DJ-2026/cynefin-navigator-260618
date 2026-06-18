export const workflowSteps = [
  {
    key: "situation",
    label: "상황",
    href: "situation"
  },
  {
    key: "problem",
    label: "문제",
    href: "problem"
  },
  {
    key: "domain",
    label: "도메인",
    href: "domain"
  },
  {
    key: "facilitation",
    label: "퍼실리테이션",
    href: "facilitation"
  },
  {
    key: "proposal",
    label: "제안서",
    href: "proposal"
  },
  {
    key: "action",
    label: "실행 계획",
    href: "action"
  },
  {
    key: "acceptance",
    label: "수용성 확인",
    href: "acceptance"
  },
  {
    key: "review",
    label: "검토",
    href: null
  }
] as const;

export type WorkflowStepKey = (typeof workflowSteps)[number]["key"];

export type WorkflowState = {
  id: string;
  projectId: string;
  currentStep: WorkflowStepKey;
  situationOutput: string | null;
  problemOutput: string | null;
  primaryDomain: string | null;
  alternativeDomain: string | null;
  evidence: string | null;
  counterEvidence: string | null;
  confidence: number;
  keyQuestion: string | null;
  observations: string | null;
  insights: string | null;
  facilitationNotes: string | null;
  proposalDraft: string | null;
  actionItems: string | null;
  acceptanceFindings: string | null;
  acceptanceDecision: string | null;
  acceptancePriority: string | null;
  alignmentNotes: string | null;
  decisionOwner: string | null;
  decisionDate: string | null;
};

export type ProjectWithWorkflow = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  workflowState: WorkflowState | null;
};
