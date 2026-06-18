import DomainDiagnosisWorkspace from "@/components/domain-diagnosis-workspace";

type DomainPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DomainPage({ params }: DomainPageProps) {
  const { id } = await params;

  return <DomainDiagnosisWorkspace projectId={id} />;
}
