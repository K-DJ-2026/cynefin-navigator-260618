"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ProjectWithWorkflow, WorkflowStepKey, WorkflowState, workflowSteps } from "@/lib/workflow";

type WorkflowStepFormProps = {
  projectId: string;
  stepKey: Extract<WorkflowStepKey, "situation" | "problem">;
};

const stepContent = {
  situation: {
    title: "상황 정리",
    subtitle: "현재 벌어지고 있는 일, 관련 이해관계자, 관찰된 신호를 적습니다.",
    fieldLabel: "상황 출력",
    placeholder: "무슨 일이 일어나고 있나요? 어떤 맥락과 신호가 보이나요?",
    outputKey: "situationOutput",
    nextHref: "problem",
    nextLabel: "문제 정의로 이동"
  },
  problem: {
    title: "문제 정의",
    subtitle: "상황에서 드러난 핵심 긴장, 결정해야 할 질문, 해결 기준을 정리합니다.",
    fieldLabel: "문제 출력",
    placeholder: "진짜 문제는 무엇인가요? 어떤 질문에 답해야 하나요?",
    outputKey: "problemOutput",
    nextHref: "domain",
    nextLabel: "도메인 진단으로 이동"
  }
} as const;

export default function WorkflowStepForm({ projectId, stepKey }: WorkflowStepFormProps) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectWithWorkflow | null>(null);
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const content = stepContent[stepKey];

  useEffect(() => {
    async function loadStep() {
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

      setProject(projectData?.project ?? null);
      setWorkflowState(workflowData?.workflowState ?? null);
      setOutput((workflowData?.workflowState?.[content.outputKey] as string | null) ?? "");
      setIsLoading(false);
    }

    loadStep();
  }, [content.outputKey, projectId]);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentStep: stepKey })
    })
      .then((response) => response.json())
      .then((data: { workflowState: WorkflowState }) => {
        setWorkflowState(data.workflowState);
      });
  }, [projectId, stepKey]);

  async function saveOutput(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setSavedMessage("");

    const response = await fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentStep: stepKey,
        [content.outputKey]: output
      })
    });

    setIsSaving(false);

    if (!response.ok) {
      setSavedMessage("저장에 실패했습니다.");
      return;
    }

    const data = (await response.json()) as { workflowState: WorkflowState };
    setWorkflowState(data.workflowState);
    setSavedMessage("저장되었습니다.");
  }

  async function goNext() {
    if (!content.nextHref) {
      return;
    }

    await fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentStep: content.nextHref })
    });

    router.push(`/projects/${projectId}/${content.nextHref}`);
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
            const isCurrent = workflowState?.currentStep === step.key || step.key === stepKey;
            const contentNode = (
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
                  {contentNode}
                </Link>
              );
            }

            return (
              <div
                className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--muted)]"
                key={step.key}
              >
                {contentNode}
              </div>
            );
          })}
        </nav>
      </aside>

      <section className="p-6">
        <div className="border-b border-[var(--line)] pb-4">
          <p className="text-sm font-medium text-[var(--muted)]">Workflow Runtime</p>
          <h2 className="mt-1 text-2xl font-semibold">{content.title}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{content.subtitle}</p>
        </div>

        <form className="mt-6" onSubmit={saveOutput}>
          <label className="block text-sm font-medium" htmlFor="output">
            {content.fieldLabel}
          </label>
          <textarea
            className="mt-2 min-h-72 w-full resize-y rounded-md border border-[var(--line)] px-4 py-3 text-sm leading-6 outline-none focus:border-[#3a6ea5]"
            id="output"
            onChange={(event) => setOutput(event.target.value)}
            placeholder={content.placeholder}
            value={output}
          />

          <div className="mt-4 flex items-center gap-3">
            <button
              className="rounded-md bg-[#1f2328] px-4 py-2 text-sm font-medium text-white hover:bg-[#39414d] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
            >
              {isSaving ? "저장 중..." : "출력 저장"}
            </button>
            <button
              className="rounded-md border border-[var(--line)] px-4 py-2 text-sm font-medium hover:border-[#3a6ea5]"
              onClick={goNext}
              type="button"
            >
              {content.nextLabel}
            </button>
            {savedMessage ? <span className="text-sm text-[#2f6f4e]">{savedMessage}</span> : null}
          </div>
        </form>
      </section>

      <aside className="border-l border-[var(--line)] bg-[#fbfcfd] p-5">
        <p className="text-sm font-medium text-[var(--muted)]">저장 상태</p>
        <div className="mt-4 rounded-md border border-[var(--line)] bg-white p-4 text-sm leading-6 text-[var(--muted)]">
          <p>현재 단계: {workflowState?.currentStep ?? stepKey}</p>
          <p className="mt-2">상황 출력: {workflowState?.situationOutput ? "저장됨" : "비어 있음"}</p>
          <p>문제 출력: {workflowState?.problemOutput ? "저장됨" : "비어 있음"}</p>
        </div>
      </aside>
    </main>
  );
}
