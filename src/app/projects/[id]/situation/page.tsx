import WorkflowStepForm from "@/components/workflow-step-form";

type SituationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SituationPage({ params }: SituationPageProps) {
  const { id } = await params;

  return <WorkflowStepForm projectId={id} stepKey="situation" />;
}
