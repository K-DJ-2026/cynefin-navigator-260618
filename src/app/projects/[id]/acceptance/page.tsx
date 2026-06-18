import AcceptanceFindingWorkspace from "@/components/acceptance-finding-workspace";

type AcceptancePageProps = {
  params: Promise<{ id: string }>;
};

export default async function AcceptancePage({ params }: AcceptancePageProps) {
  const { id } = await params;

  return <AcceptanceFindingWorkspace projectId={id} />;
}
