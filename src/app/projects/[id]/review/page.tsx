import ReviewWorkspace from "@/components/review-workspace";

type ReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id } = await params;

  return <ReviewWorkspace projectId={id} />;
}
