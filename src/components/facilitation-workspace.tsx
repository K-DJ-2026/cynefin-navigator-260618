"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ProjectWithWorkflow, WorkflowState, workflowSteps } from "@/lib/workflow";

type FacilitationWorkspaceProps = {
  projectId: string;
};

export default function FacilitationWorkspace({ projectId }: FacilitationWorkspaceProps) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectWithWorkflow | null>(null);
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
  const [keyQuestion, setKeyQuestion] = useState("");
  const [observations, setObservations] = useState("");
  const [insights, setInsights] = useState("");
  const [facilitationNotes, setFacilitationNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    async function loadFacilitation() {
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
      setKeyQuestion(loadedState?.keyQuestion ?? "");
      setObservations(loadedState?.observations ?? "");
      setInsights(loadedState?.insights ?? "");
      setFacilitationNotes(loadedState?.facilitationNotes ?? "");
      setIsLoading(false);
    }

    loadFacilitation();
  }, [projectId]);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentStep: "facilitation" })
    })
      .then((response) => response.json())
      .then((data: { workflowState: WorkflowState }) => {
        setWorkflowState(data.workflowState);
      });
  }, [projectId]);

  async function saveFacilitation(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setIsSaving(true);
    setSavedMessage("");

    const response = await fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentStep: "facilitation",
        keyQuestion,
        observations,
        insights,
        facilitationNotes
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

  async function goProposal() {
    const savedState = await saveFacilitation();

    if (!savedState) {
      return;
    }

    await fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentStep: "proposal" })
    });

    router.push(`/projects/${projectId}/proposal`);
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
            const isCurrent = step.key === "facilitation" || workflowState?.currentStep === step.key;
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
          <p className="text-sm font-medium text-[var(--muted)]">Human Facilitation</p>
          <h2 className="mt-1 text-2xl font-semibold">퍼실리테이션</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            워크숍에서 사람이 직접 확인한 질문, 관찰, 인사이트, 진행 메모를 기록합니다.
          </p>
        </div>

        <form className="mt-6 grid gap-5" onSubmit={saveFacilitation}>
          <label className="block text-sm font-medium" htmlFor="keyQuestion">
            핵심 질문
            <textarea
              className="mt-2 min-h-28 w-full resize-y rounded-md border border-[var(--line)] px-4 py-3 text-sm leading-6 outline-none focus:border-[#3a6ea5]"
              id="keyQuestion"
              onChange={(event) => setKeyQuestion(event.target.value)}
              placeholder="지금 팀이 함께 답해야 하는 핵심 질문을 적어주세요."
              value={keyQuestion}
            />
          </label>

          <div className="grid gap-5 lg:grid-cols-2">
            <label className="block text-sm font-medium" htmlFor="observations">
              관찰 내용
              <textarea
                className="mt-2 min-h-56 w-full resize-y rounded-md border border-[var(--line)] px-4 py-3 text-sm leading-6 outline-none focus:border-[#3a6ea5]"
                id="observations"
                onChange={(event) => setObservations(event.target.value)}
                placeholder="참여자 발언, 행동, 데이터, 반복해서 보인 신호를 기록하세요."
                value={observations}
              />
            </label>

            <label className="block text-sm font-medium" htmlFor="insights">
              인사이트
              <textarea
                className="mt-2 min-h-56 w-full resize-y rounded-md border border-[var(--line)] px-4 py-3 text-sm leading-6 outline-none focus:border-[#3a6ea5]"
                id="insights"
                onChange={(event) => setInsights(event.target.value)}
                placeholder="관찰에서 도출한 해석, 패턴, 합의된 배움을 정리하세요."
                value={insights}
              />
            </label>
          </div>

          <label className="block text-sm font-medium" htmlFor="facilitationNotes">
            퍼실리테이션 노트
            <textarea
              className="mt-2 min-h-40 w-full resize-y rounded-md border border-[var(--line)] px-4 py-3 text-sm leading-6 outline-none focus:border-[#3a6ea5]"
              id="facilitationNotes"
              onChange={(event) => setFacilitationNotes(event.target.value)}
              placeholder="다음 세션에서 확인할 점, 보류된 쟁점, 진행자가 기억해야 할 메모를 남기세요."
              value={facilitationNotes}
            />
          </label>

          <div className="flex items-center gap-3">
            <button
              className="rounded-md bg-[#1f2328] px-4 py-2 text-sm font-medium text-white hover:bg-[#39414d] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
            >
              {isSaving ? "저장 중..." : "퍼실리테이션 저장"}
            </button>
            <button
              className="rounded-md border border-[var(--line)] px-4 py-2 text-sm font-medium hover:border-[#3a6ea5] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={goProposal}
              type="button"
            >
              제안서로 이동
            </button>
            {savedMessage ? <span className="text-sm text-[#2f6f4e]">{savedMessage}</span> : null}
          </div>
        </form>
      </section>

      <aside className="border-l border-[var(--line)] bg-[#fbfcfd] p-5">
        <p className="text-sm font-medium text-[var(--muted)]">기록 상태</p>
        <div className="mt-4 rounded-md border border-[var(--line)] bg-white p-4 text-sm leading-6 text-[var(--muted)]">
          <p>현재 단계: {workflowState?.currentStep ?? "facilitation"}</p>
          <p className="mt-2">핵심 질문: {workflowState?.keyQuestion ? "저장됨" : "비어 있음"}</p>
          <p>관찰 내용: {workflowState?.observations ? "저장됨" : "비어 있음"}</p>
          <p>인사이트: {workflowState?.insights ? "저장됨" : "비어 있음"}</p>
          <p>퍼실리테이션 노트: {workflowState?.facilitationNotes ? "저장됨" : "비어 있음"}</p>
        </div>
      </aside>
    </main>
  );
}
