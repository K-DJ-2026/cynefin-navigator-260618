"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  workflowState?: {
    currentStep: string;
  } | null;
};

export default function DashboardClient() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((response) => response.json())
      .then((data: { projects: Project[] }) => {
        setProjects(data.projects);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCreating(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(formData.get("name") ?? ""),
        description: String(formData.get("description") ?? "")
      })
    });

    setIsCreating(false);

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as { project: Project };
    router.push(`/projects/${data.project.id}`);
  }

  return (
    <main className="min-h-screen">
      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-medium text-[var(--muted)]">로컬 MVP</p>
            <h1 className="text-2xl font-semibold">Cynefin Navigator</h1>
          </div>
          <div className="rounded-md border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)]">
            Workflow First
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[360px_1fr]">
        <form onSubmit={createProject} className="h-fit rounded-md border border-[var(--line)] bg-white p-5">
          <h2 className="text-lg font-semibold">프로젝트 생성</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            상황 정리와 문제 정의를 위한 로컬 워크스페이스를 시작합니다.
          </p>

          <label className="mt-5 block text-sm font-medium" htmlFor="name">
            프로젝트 이름
          </label>
          <input
            className="mt-2 w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm outline-none focus:border-[#3a6ea5]"
            id="name"
            name="name"
            placeholder="예: 신규 시장 진입 판단"
            required
          />

          <label className="mt-4 block text-sm font-medium" htmlFor="description">
            설명
          </label>
          <textarea
            className="mt-2 min-h-28 w-full resize-y rounded-md border border-[var(--line)] px-3 py-2 text-sm outline-none focus:border-[#3a6ea5]"
            id="description"
            name="description"
            placeholder="팀이 함께 이해해야 할 상황을 적어주세요."
          />

          <button
            className="mt-5 w-full rounded-md bg-[#1f2328] px-4 py-2 text-sm font-medium text-white hover:bg-[#39414d] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isCreating}
          >
            {isCreating ? "생성 중..." : "워크스페이스 생성"}
          </button>
        </form>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">프로젝트</h2>
            <span className="text-sm text-[var(--muted)]">총 {projects.length}개</span>
          </div>

          <div className="grid gap-3">
            {isLoading ? (
              <div className="rounded-md border border-[var(--line)] bg-white p-8 text-center text-sm text-[var(--muted)]">
                프로젝트를 불러오는 중...
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-md border border-dashed border-[var(--line)] bg-white p-8 text-center text-sm text-[var(--muted)]">
                아직 프로젝트가 없습니다. 프로젝트를 만들면 워크스페이스가 열립니다.
              </div>
            ) : (
              projects.map((project) => (
                <Link
                  className="rounded-md border border-[var(--line)] bg-white p-4 transition hover:border-[#3a6ea5]"
                  href={`/projects/${project.id}`}
                  key={project.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {project.description || "설명 없음"}
                      </p>
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        현재 단계: {project.workflowState?.currentStep ?? "situation"}
                      </p>
                    </div>
                    <span className="rounded-md bg-[#eef4ff] px-2 py-1 text-xs font-medium text-[#315f8d]">
                      {project.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
