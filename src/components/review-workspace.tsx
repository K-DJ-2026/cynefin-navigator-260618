"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ProjectWithWorkflow, WorkflowState, workflowSteps } from "@/lib/workflow";

type ReviewWorkspaceProps = {
  projectId: string;
};

type ActionItem = {
  id?: string;
  title?: string;
  owner?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
  successCriteria?: string;
  notes?: string;
};

function displayValue(value: string | null | undefined) {
  if (!value) {
    return "비어 있음";
  }

  return value;
}

function displayNumber(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "비어 있음";
  }

  return String(value);
}

function parseActionItems(rawItems: string | null | undefined) {
  if (!rawItems) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawItems) as ActionItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ReviewWorkspace({ projectId }: ReviewWorkspaceProps) {
  const [project, setProject] = useState<ProjectWithWorkflow | null>(null);
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
  const [reviewDecision, setReviewDecision] = useState("pending");
  const [reviewedBy, setReviewedBy] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    async function loadReview() {
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
      setReviewDecision(loadedState?.reviewDecision ?? "pending");
      setReviewedBy(loadedState?.reviewedBy ?? "");
      setReviewDate(loadedState?.reviewDate ?? "");
      setReviewNotes(loadedState?.reviewNotes ?? "");
      setIsLoading(false);
    }

    loadReview();
  }, [projectId]);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentStep: "review" })
    })
      .then((response) => response.json())
      .then((data: { workflowState: WorkflowState }) => {
        setWorkflowState(data.workflowState);
      });
  }, [projectId]);

  async function saveReview(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setIsSaving(true);
    setSavedMessage("");

    const response = await fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentStep: "review",
        reviewDecision,
        reviewedBy,
        reviewDate,
        reviewNotes
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

  const actionItems = parseActionItems(workflowState?.actionItems);

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
            const isCurrent = step.key === "review" || workflowState?.currentStep === step.key;
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
          <p className="text-sm font-medium text-[var(--muted)]">Final Review</p>
          <h2 className="mt-1 text-2xl font-semibold">최종 검토</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            전체 워크플로우 산출물을 읽기 전용으로 확인하고 최종 검토 결정을 기록합니다.
          </p>
        </div>

        <section className="mt-6">
          <div className="border-b border-[var(--line)] pb-3">
            <h3 className="text-lg font-semibold">전체 워크플로우 요약</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              모든 이전 단계의 결과를 최종 검토용으로 모아 보여줍니다.
            </p>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <section className="rounded-md border border-[var(--line)] p-4">
              <h4 className="font-semibold">상황 요약</h4>
              <p className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">
                {displayValue(workflowState?.situationOutput)}
              </p>
            </section>

            <section className="rounded-md border border-[var(--line)] p-4">
              <h4 className="font-semibold">문제 정의</h4>
              <p className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">
                {displayValue(workflowState?.problemOutput)}
              </p>
            </section>

            <section className="rounded-md border border-[var(--line)] p-4">
              <h4 className="font-semibold">도메인 진단</h4>
              <div className="mt-2 grid gap-1 text-sm leading-6 text-[var(--muted)]">
                <p>주요 도메인: {displayValue(workflowState?.primaryDomain)}</p>
                <p>대안 도메인: {displayValue(workflowState?.alternativeDomain)}</p>
                <p>신뢰도: {displayNumber(workflowState?.confidence)}</p>
                <p className="mt-2 max-h-28 overflow-auto whitespace-pre-wrap">
                  근거: {displayValue(workflowState?.evidence)}
                </p>
                <p className="max-h-28 overflow-auto whitespace-pre-wrap">
                  반증: {displayValue(workflowState?.counterEvidence)}
                </p>
              </div>
            </section>

            <section className="rounded-md border border-[var(--line)] p-4">
              <h4 className="font-semibold">퍼실리테이션 발견</h4>
              <div className="mt-2 grid gap-1 text-sm leading-6 text-[var(--muted)]">
                <p className="max-h-20 overflow-auto whitespace-pre-wrap">
                  핵심 질문: {displayValue(workflowState?.keyQuestion)}
                </p>
                <p className="max-h-20 overflow-auto whitespace-pre-wrap">
                  관찰 내용: {displayValue(workflowState?.observations)}
                </p>
                <p className="max-h-20 overflow-auto whitespace-pre-wrap">
                  인사이트: {displayValue(workflowState?.insights)}
                </p>
                <p className="max-h-20 overflow-auto whitespace-pre-wrap">
                  퍼실리테이션 노트: {displayValue(workflowState?.facilitationNotes)}
                </p>
              </div>
            </section>

            <section className="rounded-md border border-[var(--line)] p-4 lg:col-span-2">
              <h4 className="font-semibold">제안서 초안</h4>
              <p className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">
                {displayValue(workflowState?.proposalDraft)}
              </p>
            </section>

            <section className="rounded-md border border-[var(--line)] p-4 lg:col-span-2">
              <h4 className="font-semibold">실행 계획</h4>
              <div className="mt-3 grid max-h-72 gap-3 overflow-auto text-sm text-[var(--muted)] lg:grid-cols-2">
                {actionItems.length > 0 ? (
                  actionItems.map((item, index) => (
                    <div className="rounded-md border border-[var(--line)] p-3" key={item.id ?? index}>
                      <p className="font-medium text-[#1f2328]">{item.title || `액션 항목 ${index + 1}`}</p>
                      <p className="mt-1">담당자: {item.owner || "미정"}</p>
                      <p>기한: {item.dueDate || "미정"}</p>
                      <p>우선순위: {item.priority || "미정"}</p>
                      <p>상태: {item.status || "미정"}</p>
                      <p className="mt-1 max-h-24 overflow-auto whitespace-pre-wrap">
                        성공 기준: {item.successCriteria || "비어 있음"}
                      </p>
                      <p className="mt-1 max-h-24 overflow-auto whitespace-pre-wrap">
                        노트: {item.notes || "비어 있음"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>액션 항목을 불러올 수 없음.</p>
                )}
              </div>
            </section>

            <section className="rounded-md border border-[var(--line)] p-4 lg:col-span-2">
              <h4 className="font-semibold">수용성 확인</h4>
              <div className="mt-2 grid gap-1 text-sm leading-6 text-[var(--muted)]">
                <p>결정: {displayValue(workflowState?.acceptanceDecision)}</p>
                <p>우선순위: {displayValue(workflowState?.acceptancePriority)}</p>
                <p>결정 책임자: {displayValue(workflowState?.decisionOwner)}</p>
                <p>결정일: {displayValue(workflowState?.decisionDate)}</p>
                <p className="mt-2 max-h-28 overflow-auto whitespace-pre-wrap">
                  수용성 발견: {displayValue(workflowState?.acceptanceFindings)}
                </p>
                <p className="max-h-28 overflow-auto whitespace-pre-wrap">
                  합의 노트: {displayValue(workflowState?.alignmentNotes)}
                </p>
              </div>
            </section>
          </div>
        </section>

        <form className="mt-6 grid gap-5" onSubmit={saveReview}>
          <div className="border-b border-[var(--line)] pb-3">
            <h3 className="text-lg font-semibold">최종 검토 입력</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              최종 판단, 검토자, 검토일, 검토 메모만 이 단계에서 저장합니다.
            </p>
          </div>

          <div className="grid gap-4 rounded-md border border-[var(--line)] bg-[#fbfcfd] p-4 lg:grid-cols-3">
            <label className="block text-sm font-medium" htmlFor="reviewDecision">
              최종 결정
              <select
                className="mt-2 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[#3a6ea5]"
                id="reviewDecision"
                onChange={(event) => setReviewDecision(event.target.value)}
                value={reviewDecision}
              >
                <option value="pending">대기</option>
                <option value="approved">승인</option>
                <option value="needs_revision">수정 필요</option>
                <option value="closed">종료</option>
              </select>
            </label>

            <label className="block text-sm font-medium" htmlFor="reviewedBy">
              검토자
              <input
                className="mt-2 w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm outline-none focus:border-[#3a6ea5]"
                id="reviewedBy"
                onChange={(event) => setReviewedBy(event.target.value)}
                placeholder="검토자 이름 또는 그룹"
                value={reviewedBy}
              />
            </label>

            <label className="block text-sm font-medium" htmlFor="reviewDate">
              검토일
              <input
                className="mt-2 w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm outline-none focus:border-[#3a6ea5]"
                id="reviewDate"
                onChange={(event) => setReviewDate(event.target.value)}
                type="date"
                value={reviewDate}
              />
            </label>
          </div>

          <label className="block text-sm font-medium" htmlFor="reviewNotes">
            검토 메모
            <textarea
              className="mt-2 min-h-56 w-full resize-y rounded-md border border-[var(--line)] px-4 py-3 text-sm leading-6 outline-none focus:border-[#3a6ea5]"
              id="reviewNotes"
              onChange={(event) => setReviewNotes(event.target.value)}
              placeholder="최종 검토 의견, 수정 요청, 승인 조건, 종료 사유를 기록하세요."
              value={reviewNotes}
            />
          </label>

          <div className="flex items-center gap-3">
            <button
              className="rounded-md bg-[#1f2328] px-4 py-2 text-sm font-medium text-white hover:bg-[#39414d] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
            >
              {isSaving ? "저장 중..." : "최종 검토 저장"}
            </button>
            <Link
              className="rounded-md border border-[var(--line)] px-4 py-2 text-sm font-medium hover:border-[#3a6ea5]"
              href={`/projects/${projectId}`}
            >
              워크스페이스로 돌아가기
            </Link>
            {savedMessage ? <span className="text-sm text-[#2f6f4e]">{savedMessage}</span> : null}
          </div>
        </form>
      </section>

      <aside className="border-l border-[var(--line)] bg-[#fbfcfd] p-5">
        <p className="text-sm font-medium text-[var(--muted)]">최종 검토 상태</p>
        <div className="mt-4 rounded-md border border-[var(--line)] bg-white p-4 text-sm leading-6 text-[var(--muted)]">
          <p>현재 단계: {workflowState?.currentStep ?? "review"}</p>
          <p className="mt-2">최종 결정: {reviewDecision}</p>
          <p>검토자: {reviewedBy || "미정"}</p>
          <p>검토일: {reviewDate || "미정"}</p>
          <p className="mt-2">검토 메모: {workflowState?.reviewNotes ? "저장됨" : "비어 있음"}</p>
        </div>
      </aside>
    </main>
  );
}
