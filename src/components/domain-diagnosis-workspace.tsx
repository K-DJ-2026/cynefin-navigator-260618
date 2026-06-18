"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ProjectWithWorkflow, WorkflowState, workflowSteps } from "@/lib/workflow";

const domains = [
  {
    key: "clear",
    name: "Clear",
    label: "명확",
    description: "원인과 결과가 분명하고, 검증된 모범 사례를 적용할 수 있는 상황입니다."
  },
  {
    key: "complicated",
    name: "Complicated",
    label: "전문적",
    description: "분석과 전문 지식이 필요하며, 여러 좋은 해법 중 선택해야 하는 상황입니다."
  },
  {
    key: "complex",
    name: "Complex",
    label: "복잡",
    description: "패턴이 사후적으로 드러나며, 탐색과 실험을 통해 학습해야 하는 상황입니다."
  },
  {
    key: "chaotic",
    name: "Chaotic",
    label: "혼돈",
    description: "즉각적인 안정화 행동이 필요하고, 질서를 먼저 회복해야 하는 상황입니다."
  },
  {
    key: "confused",
    name: "Confused",
    label: "혼란",
    description: "도메인 판단이 섞여 있거나 충분한 정보가 없어 먼저 구분이 필요한 상황입니다."
  }
] as const;

type DomainKey = (typeof domains)[number]["key"];

type DomainDiagnosisWorkspaceProps = {
  projectId: string;
};

export default function DomainDiagnosisWorkspace({ projectId }: DomainDiagnosisWorkspaceProps) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectWithWorkflow | null>(null);
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
  const [primaryDomain, setPrimaryDomain] = useState<DomainKey | "">("");
  const [alternativeDomain, setAlternativeDomain] = useState<DomainKey | "">("");
  const [evidence, setEvidence] = useState("");
  const [counterEvidence, setCounterEvidence] = useState("");
  const [confidence, setConfidence] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    async function loadDiagnosis() {
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
      setPrimaryDomain((loadedState?.primaryDomain as DomainKey | null) ?? "");
      setAlternativeDomain((loadedState?.alternativeDomain as DomainKey | null) ?? "");
      setEvidence(loadedState?.evidence ?? "");
      setCounterEvidence(loadedState?.counterEvidence ?? "");
      setConfidence(loadedState?.confidence ?? 50);
      setIsLoading(false);
    }

    loadDiagnosis();
  }, [projectId]);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentStep: "domain" })
    })
      .then((response) => response.json())
      .then((data: { workflowState: WorkflowState }) => {
        setWorkflowState(data.workflowState);
      });
  }, [projectId]);

  async function saveDiagnosis(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await persistDiagnosis();
  }

  async function persistDiagnosis() {
    setIsSaving(true);
    setSavedMessage("");

    const response = await fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentStep: "domain",
        primaryDomain,
        alternativeDomain,
        evidence,
        counterEvidence,
        confidence
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

  async function goFacilitation() {
    const savedState = await persistDiagnosis();

    if (!savedState) {
      return;
    }

    await fetch(`/api/projects/${projectId}/workflow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentStep: "facilitation" })
    });

    router.push(`/projects/${projectId}/facilitation`);
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
            const isCurrent = step.key === "domain" || workflowState?.currentStep === step.key;
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
          <p className="text-sm font-medium text-[var(--muted)]">Human-first Diagnosis</p>
          <h2 className="mt-1 text-2xl font-semibold">도메인 진단</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            퍼실리테이터가 직접 근거와 반증을 검토해 주요 도메인과 대안 도메인을 선택합니다.
          </p>
        </div>

        <form className="mt-6" onSubmit={saveDiagnosis}>
          <div className="grid gap-3 xl:grid-cols-5">
            {domains.map((domain) => {
              const isPrimary = primaryDomain === domain.key;
              const isAlternative = alternativeDomain === domain.key;

              return (
                <div
                  className={`rounded-md border bg-white p-4 ${
                    isPrimary
                      ? "border-[#2f6f4e]"
                      : isAlternative
                        ? "border-[#8a6f2a]"
                        : "border-[var(--line)]"
                  }`}
                  key={domain.key}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{domain.name}</h3>
                      <p className="text-xs font-medium text-[var(--muted)]">{domain.label}</p>
                    </div>
                    <div className="grid gap-1 text-right text-xs">
                      {isPrimary ? <span className="whitespace-nowrap text-[#2f6f4e]">주요</span> : null}
                      {isAlternative ? <span className="whitespace-nowrap text-[#8a6f2a]">대안</span> : null}
                    </div>
                  </div>
                  <p className="mt-3 min-h-20 text-sm leading-5 text-[var(--muted)]">{domain.description}</p>
                  <div className="mt-4 grid gap-2">
                    <button
                      className="rounded-md border border-[var(--line)] px-3 py-2 text-sm hover:border-[#2f6f4e]"
                      onClick={() => setPrimaryDomain(domain.key)}
                      type="button"
                    >
                      주요로 선택
                    </button>
                    <button
                      className="rounded-md border border-[var(--line)] px-3 py-2 text-sm hover:border-[#8a6f2a]"
                      onClick={() => setAlternativeDomain(domain.key)}
                      type="button"
                    >
                      대안으로 선택
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <label className="block text-sm font-medium" htmlFor="evidence">
              근거
              <textarea
                className="mt-2 min-h-48 w-full resize-y rounded-md border border-[var(--line)] px-4 py-3 text-sm leading-6 outline-none focus:border-[#3a6ea5]"
                id="evidence"
                onChange={(event) => setEvidence(event.target.value)}
                placeholder="선택한 주요 도메인을 지지하는 관찰, 데이터, 발언을 적어주세요."
                value={evidence}
              />
            </label>

            <label className="block text-sm font-medium" htmlFor="counterEvidence">
              반증
              <textarea
                className="mt-2 min-h-48 w-full resize-y rounded-md border border-[var(--line)] px-4 py-3 text-sm leading-6 outline-none focus:border-[#3a6ea5]"
                id="counterEvidence"
                onChange={(event) => setCounterEvidence(event.target.value)}
                placeholder="다른 도메인일 가능성, 모순되는 신호, 아직 불확실한 점을 적어주세요."
                value={counterEvidence}
              />
            </label>
          </div>

          <div className="mt-6 rounded-md border border-[var(--line)] bg-[#fbfcfd] p-4">
            <label className="block text-sm font-medium" htmlFor="confidence">
              신뢰도: {confidence}
            </label>
            <input
              className="mt-3 w-full accent-[#3a6ea5]"
              id="confidence"
              max="100"
              min="0"
              onChange={(event) => setConfidence(Number(event.target.value))}
              type="range"
              value={confidence}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              className="rounded-md bg-[#1f2328] px-4 py-2 text-sm font-medium text-white hover:bg-[#39414d] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
            >
              {isSaving ? "저장 중..." : "진단 저장"}
            </button>
            <button
              className="rounded-md border border-[var(--line)] px-4 py-2 text-sm font-medium hover:border-[#3a6ea5] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={goFacilitation}
              type="button"
            >
              퍼실리테이션으로 이동
            </button>
            {savedMessage ? <span className="text-sm text-[#2f6f4e]">{savedMessage}</span> : null}
          </div>
        </form>
      </section>

      <aside className="border-l border-[var(--line)] bg-[#fbfcfd] p-5">
        <p className="text-sm font-medium text-[var(--muted)]">진단 요약</p>
        <div className="mt-4 rounded-md border border-[var(--line)] bg-white p-4 text-sm leading-6 text-[var(--muted)]">
          <p>현재 단계: {workflowState?.currentStep ?? "domain"}</p>
          <p className="mt-2">주요 도메인: {primaryDomain || "미선택"}</p>
          <p>대안 도메인: {alternativeDomain || "미선택"}</p>
          <p>신뢰도: {confidence}</p>
        </div>
      </aside>
    </main>
  );
}
