"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ProjectWithWorkflow, WorkflowState, workflowSteps } from "@/lib/workflow";

type ProposalWorkspaceProps = {
  projectId: string;
};

function displayValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "비어 있음";
  }

  return String(value);
}

function buildInitialDraft(workflowState: WorkflowState | null) {
  if (!workflowState) {
    return "";
  }

  return [
    "# 제안서 초안",
    "",
    "## Situation Summary",
    displayValue(workflowState.situationOutput),
    "",
    "## Problem Statement",
    displayValue(workflowState.problemOutput),
    "",
    "## Domain Diagnosis",
    `주요 도메인: ${displayValue(workflowState.primaryDomain)}`,
    `대안 도메인: ${displayValue(workflowState.alternativeDomain)}`,
    `신뢰도: ${displayValue(workflowState.confidence)}`,
    "",
    "근거:",
    displayValue(workflowState.evidence),
    "",
    "반증:",
    displayValue(workflowState.counterEvidence),
    "",
    "## Facilitation Findings",
    `핵심 질문: ${displayValue(workflowState.keyQuestion)}`,
    "",
    "관찰 내용:",
    displayValue(workflowState.observations),
    "",
    "인사이트:",
    displayValue(workflowState.insights),
    "",
    "퍼실리테이션 노트:",
    displayValue(workflowState.facilitationNotes),
    "",
    "## Proposal Draft",
    "여기에 사람이 직접 최종 제안 내용을 작성하세요."
  ].join("\n");
}

export default function ProposalWorkspace({ projectId }: ProposalWorkspaceProps) {
  const [project, setProject] = useState<ProjectWithWorkflow | null>(null);
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
  const [proposalDraft, setProposalDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    async function loadProposal() {
      const [projectResponse, workflowResponse] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/projects/${projectId}/workflow`)
      ]);

      const projectData = projectResponse.ok
        ? ((await projectResponse.json()) as { project: ProjectWithWorkflow })
        : null;
      const workflowData = workflowResponse.ok
        ? ((await workflowResponse.json()) as { workflowState: WorkflowState })
        : null;
      const loadedState = workflowData?.workflowState ?? null;

      setProject(projectData?.project ?? null);
      setWorkflowState(loadedState);
      setProposalDraft(loadedState?.proposalDraft ?? buildInitialDraft(loadedState));
      setIsLoading(false);
    }

    loadProposal();
  }, [projectId]);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentStep: "proposal" })
    })
      .then((response) => response.json())
      .then((data: { workflowState: WorkflowState }) => {
        setWorkflowState(data.workflowState);
      });
  }, [projectId]);

  async function saveProposal(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setIsSaving(true);
    setSavedMessage("");

    const response = await fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentStep: "proposal",
        proposalDraft
      })
    });

    setIsSaving(false);

    if (!response.ok) {
      setSavedMessage("저장에 실패했습니다.");
      return null;
    }

    const data = (await response.json()) as { workflowState: WorkflowState };
    setWorkflowState(data.workflowState);
    setSavedMessage("저장되었습니다.");
    return data.workflowState;
  }

  async function goAction() {
    const savedState = await saveProposal();

    if (!savedState) {
      return;
    }

    const response = await fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentStep: "action" })
    });

    if (!response.ok) {
      setSavedMessage("실행 계획 단계로 이동하지 못했습니다.");
      return;
    }

    window.location.href = `/projects/${projectId}/action`;
  }

  return (
    <main className="grid min-h-screen grid-cols-[240px_1fr_320px] bg-white">
      <aside className="border-r border-[var(--line)] bg-[#f7f8fa] p-5">
        <Link className="text-sm text-[var(--muted)] hover:text-[#1f2328]" href={`/projects/${projectId}`}>
          워크스페이스
        </Link>
        <h1 className="mt-6 text-xl font-semibold">
          {isLoading ? "불러오는 중..." : project?.name ?? "프로젝트를 찾을 수 없음"}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{project?.description || "설명 없음"}</p>

        <nav className="mt-8 grid gap-2">
          {workflowSteps.map((step, index) => {
            const isCurrent = step.key === "proposal" || workflowState?.currentStep === step.key;
            const content = (
              <>
                <span className="mr-2 text-xs text-[var(--muted)]">{index + 1}</span>
                {step.label}
              </>
            );

            if (step.href) {
              return (
                <Link
                  className={`rounded-md border px-3 py-2 text-sm ${
                    isCurrent
                      ? "border-[#3a6ea5] bg-[#eef4ff] text-[#244f7a]"
                      : "border-[var(--line)] bg-white"
                  }`}
                  href={`/projects/${projectId}/${step.href}`}
                  key={step.key}
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--muted)]"
                key={step.key}
              >
                {content}
              </div>
            );
          })}
        </nav>
      </aside>

      <section className="p-6">
        <div className="border-b border-[var(--line)] pb-4">
          <p className="text-sm font-medium text-[var(--muted)]">Human Proposal</p>
          <h2 className="mt-1 text-2xl font-semibold">제안서 워크스페이스</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            이전 단계의 저장 데이터를 참고해 사람이 직접 제안서 초안을 작성합니다.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <section className="rounded-md border border-[var(--line)] p-4">
            <h3 className="font-semibold">Situation Summary</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">
              {displayValue(workflowState?.situationOutput)}
            </p>
          </section>

          <section className="rounded-md border border-[var(--line)] p-4">
            <h3 className="font-semibold">Problem Statement</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">
              {displayValue(workflowState?.problemOutput)}
            </p>
          </section>

          <section className="rounded-md border border-[var(--line)] p-4">
            <h3 className="font-semibold">Domain Diagnosis</h3>
            <div className="mt-2 grid gap-1 text-sm leading-6 text-[var(--muted)]">
              <p>주요 도메인: {displayValue(workflowState?.primaryDomain)}</p>
              <p>대안 도메인: {displayValue(workflowState?.alternativeDomain)}</p>
              <p>신뢰도: {displayValue(workflowState?.confidence)}</p>
              <p className="mt-2 whitespace-pre-wrap">근거: {displayValue(workflowState?.evidence)}</p>
              <p className="whitespace-pre-wrap">반증: {displayValue(workflowState?.counterEvidence)}</p>
            </div>
          </section>

          <section className="rounded-md border border-[var(--line)] p-4">
            <h3 className="font-semibold">Facilitation Findings</h3>
            <div className="mt-2 grid gap-1 text-sm leading-6 text-[var(--muted)]">
              <p className="whitespace-pre-wrap">핵심 질문: {displayValue(workflowState?.keyQuestion)}</p>
              <p className="whitespace-pre-wrap">관찰 내용: {displayValue(workflowState?.observations)}</p>
              <p className="whitespace-pre-wrap">인사이트: {displayValue(workflowState?.insights)}</p>
              <p className="whitespace-pre-wrap">
                퍼실리테이션 노트: {displayValue(workflowState?.facilitationNotes)}
              </p>
            </div>
          </section>
        </div>

        <form className="mt-6" onSubmit={saveProposal}>
          <label className="block text-sm font-medium" htmlFor="proposalDraft">
            Proposal Draft
            <textarea
              className="mt-2 min-h-[520px] w-full resize-y rounded-md border border-[var(--line)] px-4 py-3 font-mono text-sm leading-6 outline-none focus:border-[#3a6ea5]"
              id="proposalDraft"
              onChange={(event) => setProposalDraft(event.target.value)}
              placeholder="사람이 직접 제안서 초안을 작성하세요."
              value={proposalDraft}
            />
          </label>

          <div className="mt-4 flex items-center gap-3">
            <button
              className="rounded-md bg-[#1f2328] px-4 py-2 text-sm font-medium text-white hover:bg-[#39414d] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
            >
              {isSaving ? "저장 중..." : "제안서 저장"}
            </button>
            <button
              className="rounded-md border border-[var(--line)] px-4 py-2 text-sm font-medium hover:border-[#3a6ea5] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={goAction}
              type="button"
            >
              실행 계획으로 이동
            </button>
            {savedMessage ? <span className="text-sm text-[#2f6f4e]">{savedMessage}</span> : null}
          </div>
        </form>
      </section>

      <aside className="border-l border-[var(--line)] bg-[#fbfcfd] p-5">
        <p className="text-sm font-medium text-[var(--muted)]">제안서 상태</p>
        <div className="mt-4 rounded-md border border-[var(--line)] bg-white p-4 text-sm leading-6 text-[var(--muted)]">
          <p>현재 단계: {workflowState?.currentStep ?? "proposal"}</p>
          <p className="mt-2">상황 요약: {workflowState?.situationOutput ? "저장됨" : "비어 있음"}</p>
          <p>문제 정의: {workflowState?.problemOutput ? "저장됨" : "비어 있음"}</p>
          <p>도메인 진단: {workflowState?.primaryDomain ? "저장됨" : "비어 있음"}</p>
          <p>퍼실리테이션: {workflowState?.keyQuestion ? "저장됨" : "비어 있음"}</p>
          <p>제안서 초안: {workflowState?.proposalDraft ? "저장됨" : "비어 있음"}</p>
        </div>
      </aside>
    </main>
  );
}
