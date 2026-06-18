import WorkflowStepForm from "@/components/workflow-step-form";

type ProblemPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { id } = await params;

  return <WorkflowStepForm projectId={id} stepKey="problem" />;
}
