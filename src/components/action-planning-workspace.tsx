"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ProjectWithWorkflow, WorkflowState, workflowSteps } from "@/lib/workflow";

type ActionPlanningWorkspaceProps = {
  projectId: string;
};

type ActionItem = {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  priority: string;
  status: string;
  successCriteria: string;
  notes: string;
};

const blankActionItem = (): ActionItem => ({
  id: crypto.randomUUID(),
  title: "",
  owner: "",
  dueDate: "",
  priority: "medium",
  status: "planned",
  successCriteria: "",
  notes: ""
});

function displayValue(value: string | null | undefined) {
  if (!value) {
    return "비어 있음";
  }

  return value;
}

function parseActionItems(rawItems: string | null | undefined) {
  if (!rawItems) {
    return [blankActionItem()];
  }

  try {
    const parsed = JSON.parse(rawItems) as Partial<ActionItem>[];

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [blankActionItem()];
    }

    return parsed.map((item) => ({
      id: item.id || crypto.randomUUID(),
      title: item.title || "",
      owner: item.owner || "",
      dueDate: item.dueDate || "",
      priority: item.priority || "medium",
      status: item.status || "planned",
      successCriteria: item.successCriteria || "",
      notes: item.notes || ""
    }));
  } catch {
    return [blankActionItem()];
  }
}

export default function ActionPlanningWorkspace({ projectId }: ActionPlanningWorkspaceProps) {
  const [project, setProject] = useState<ProjectWithWorkflow | null>(null);
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
  const [actionItems, setActionItems] = useState<ActionItem[]>([blankActionItem()]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    async function loadActionPlan() {
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
      setActionItems(parseActionItems(loadedState?.actionItems));
      setIsLoading(false);
    }

    loadActionPlan();
  }, [projectId]);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentStep: "action" })
    })
      .then((response) => response.json())
      .then((data: { workflowState: WorkflowState }) => {
        setWorkflowState(data.workflowState);
      });
  }, [projectId]);

  function updateActionItem(id: string, field: keyof Omit<ActionItem, "id">, value: string) {
    setActionItems((items) => items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function addActionItem() {
    setActionItems((items) => [...items, blankActionItem()]);
  }

  function removeActionItem(id: string) {
    setActionItems((items) => (items.length > 1 ? items.filter((item) => item.id !== id) : items));
  }

  async function saveActionPlan(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setIsSaving(true);
    setSavedMessage("");

    const response = await fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentStep: "action",
        actionItems: JSON.stringify(actionItems)
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

  async function goAcceptance() {
    const savedState = await saveActionPlan();

    if (!savedState) {
      return;
    }

    const response = await fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentStep: "acceptance" })
    });

    if (!response.ok) {
      setSavedMessage("수용성 확인 단계로 이동하지 못했습니다.");
      return;
    }

    window.location.href = `/projects/${projectId}/acceptance`;
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
            const isCurrent = step.key === "action" || workflowState?.currentStep === step.key;
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
          <p className="text-sm font-medium text-[var(--muted)]">Human Action Planning</p>
          <h2 className="mt-1 text-2xl font-semibold">실행 계획</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            제안서 초안을 실행 가능한 여러 액션 항목으로 나눠 사람이 직접 계획합니다.
          </p>
        </div>

        <section className="mt-6 rounded-md border border-[var(--line)] p-4">
          <h3 className="font-semibold">제안서 참고</h3>
          <p className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">
            {displayValue(workflowState?.proposalDraft)}
          </p>
        </section>

        <form className="mt-6 grid gap-4" onSubmit={saveActionPlan}>
          {actionItems.map((item, index) => (
            <section className="rounded-md border border-[var(--line)] bg-white p-4" key={item.id}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">액션 항목 {index + 1}</h3>
                <button
                  className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm hover:border-[#b54848] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={actionItems.length === 1}
                  onClick={() => removeActionItem(item.id)}
                  type="button"
                >
                  삭제
                </button>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <label className="block text-sm font-medium" htmlFor={`title-${item.id}`}>
                  제목
                  <input
                    className="mt-2 w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm outline-none focus:border-[#3a6ea5]"
                    id={`title-${item.id}`}
                    onChange={(event) => updateActionItem(item.id, "title", event.target.value)}
                    placeholder="실행할 일을 적어주세요."
                    value={item.title}
                  />
                </label>

                <label className="block text-sm font-medium" htmlFor={`owner-${item.id}`}>
                  담당자
                  <input
                    className="mt-2 w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm outline-none focus:border-[#3a6ea5]"
                    id={`owner-${item.id}`}
                    onChange={(event) => updateActionItem(item.id, "owner", event.target.value)}
                    placeholder="담당자 또는 팀"
                    value={item.owner}
                  />
                </label>

                <label className="block text-sm font-medium" htmlFor={`dueDate-${item.id}`}>
                  기한
                  <input
                    className="mt-2 w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm outline-none focus:border-[#3a6ea5]"
                    id={`dueDate-${item.id}`}
                    onChange={(event) => updateActionItem(item.id, "dueDate", event.target.value)}
                    type="date"
                    value={item.dueDate}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium" htmlFor={`priority-${item.id}`}>
                    우선순위
                    <select
                      className="mt-2 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[#3a6ea5]"
                      id={`priority-${item.id}`}
                      onChange={(event) => updateActionItem(item.id, "priority", event.target.value)}
                      value={item.priority}
                    >
                      <option value="high">높음</option>
                      <option value="medium">보통</option>
                      <option value="low">낮음</option>
                    </select>
                  </label>

                  <label className="block text-sm font-medium" htmlFor={`status-${item.id}`}>
                    상태
                    <select
                      className="mt-2 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[#3a6ea5]"
                      id={`status-${item.id}`}
                      onChange={(event) => updateActionItem(item.id, "status", event.target.value)}
                      value={item.status}
                    >
                      <option value="planned">계획됨</option>
                      <option value="in-progress">진행 중</option>
                      <option value="blocked">막힘</option>
                      <option value="done">완료</option>
                    </select>
                  </label>
                </div>

                <label className="block text-sm font-medium lg:col-span-2" htmlFor={`successCriteria-${item.id}`}>
                  성공 기준
                  <textarea
                    className="mt-2 min-h-24 w-full resize-y rounded-md border border-[var(--line)] px-4 py-3 text-sm leading-6 outline-none focus:border-[#3a6ea5]"
                    id={`successCriteria-${item.id}`}
                    onChange={(event) => updateActionItem(item.id, "successCriteria", event.target.value)}
                    placeholder="이 액션이 성공했다는 것을 어떻게 알 수 있나요?"
                    value={item.successCriteria}
                  />
                </label>

                <label className="block text-sm font-medium lg:col-span-2" htmlFor={`notes-${item.id}`}>
                  노트
                  <textarea
                    className="mt-2 min-h-28 w-full resize-y rounded-md border border-[var(--line)] px-4 py-3 text-sm leading-6 outline-none focus:border-[#3a6ea5]"
                    id={`notes-${item.id}`}
                    onChange={(event) => updateActionItem(item.id, "notes", event.target.value)}
                    placeholder="진행 메모, 리스크, 필요한 지원을 기록하세요."
                    value={item.notes}
                  />
                </label>
              </div>
            </section>
          ))}

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-md border border-[var(--line)] px-4 py-2 text-sm font-medium hover:border-[#3a6ea5]"
              onClick={addActionItem}
              type="button"
            >
              액션 추가
            </button>
            <button
              className="rounded-md bg-[#1f2328] px-4 py-2 text-sm font-medium text-white hover:bg-[#39414d] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
            >
              {isSaving ? "저장 중..." : "실행 계획 저장"}
            </button>
            <button
              className="rounded-md border border-[var(--line)] px-4 py-2 text-sm font-medium hover:border-[#3a6ea5] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={goAcceptance}
              type="button"
            >
              수용성 확인으로 이동
            </button>
            {savedMessage ? <span className="text-sm text-[#2f6f4e]">{savedMessage}</span> : null}
          </div>
        </form>
      </section>

      <aside className="border-l border-[var(--line)] bg-[#fbfcfd] p-5">
        <p className="text-sm font-medium text-[var(--muted)]">실행 계획 상태</p>
        <div className="mt-4 rounded-md border border-[var(--line)] bg-white p-4 text-sm leading-6 text-[var(--muted)]">
          <p>현재 단계: {workflowState?.currentStep ?? "action"}</p>
          <p className="mt-2">제안서 초안: {workflowState?.proposalDraft ? "저장됨" : "비어 있음"}</p>
          <p>액션 항목: {actionItems.length}개</p>
          <p>저장 상태: {workflowState?.actionItems ? "저장됨" : "비어 있음"}</p>
        </div>
      </aside>
    </main>
  );
}
