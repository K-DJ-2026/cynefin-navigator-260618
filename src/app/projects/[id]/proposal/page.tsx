import ProposalWorkspace from "@/components/proposal-workspace";

type ProposalPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { id } = await params;

  return <ProposalWorkspace projectId={id} />;
}
