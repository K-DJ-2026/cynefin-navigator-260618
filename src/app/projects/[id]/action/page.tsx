import ActionPlanningWorkspace from "@/components/action-planning-workspace";

type ActionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ActionPage({ params }: ActionPageProps) {
  const { id } = await params;

  return <ActionPlanningWorkspace projectId={id} />;
}
