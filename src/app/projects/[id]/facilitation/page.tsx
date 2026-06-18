import FacilitationWorkspace from "@/components/facilitation-workspace";

type FacilitationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function FacilitationPage({ params }: FacilitationPageProps) {
  const { id } = await params;

  return <FacilitationWorkspace projectId={id} />;
}
