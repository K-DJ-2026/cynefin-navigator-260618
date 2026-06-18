"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProjectWithWorkflow, workflowSteps } from "@/lib/workflow";

type ProjectWorkspaceClientProps = {
  projectId: string;
};

export default function ProjectWorkspaceClient({ projectId }: ProjectWorkspaceClientProps) {
  const [project, setProject] = useState<ProjectWithWorkflow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((response) => {
        if (!response.ok) {
          return null;
        }

        return response.json();
      })
      .then((data: { project: ProjectWithWorkflow } | null) => {
        setProject(data?.project ?? null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [projectId]);

  return (
    <main className="grid min-h-screen grid-cols-[240px_1fr_320px] bg-white">
      <aside className="border-r border-[var(--line)] bg-[#f7f8fa] p-5">
        <Link className="text-sm text-[var(--muted)] hover:text-[#1f2328]" href="/">
          대시보드로 돌아가기
        </Link>
        <h1 className="mt-6 text-xl font-semibold">
          {isLoading ? "불러오는 중..." : project?.name ?? "프로젝트를 찾을 수 없음"}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{project?.description || "설명 없음"}</p>

        <nav className="mt-8 grid gap-2">
          {workflowSteps.map((step, index) => {
            const isCurrent = project?.workflowState?.currentStep === step.key;
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
          <p className="text-sm font-medium text-[var(--muted)]">Thinking Canvas</p>
          <h2 className="mt-1 text-2xl font-semibold">프로젝트 워크스페이스</h2>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="rounded-md border border-[var(--line)] p-5">
            <h3 className="font-semibold">Sprint 3 Workflow Runtime</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              현재 단계는 DB에 저장됩니다. 상황, 문제, 도메인 진단 출력도 프로젝트별
              워크플로우 상태로 유지됩니다.
            </p>
          </div>

          <div className="rounded-md border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--muted)]">
            왼쪽에서 상황, 문제, 도메인 단계를 선택해 워크플로우를 진행하세요.
          </div>
        </div>
      </section>

      <aside className="border-l border-[var(--line)] bg-[#fbfcfd] p-5">
        <p className="text-sm font-medium text-[var(--muted)]">진행 메모</p>
        <div className="mt-4 rounded-md border border-[var(--line)] bg-white p-4 text-sm leading-6 text-[var(--muted)]">
          Sprint 2에서는 AI 없이 사용자가 작성한 워크플로우 출력만 저장합니다.
        </div>
      </aside>
    </main>
  );
}
