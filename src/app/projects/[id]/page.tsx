import ProjectWorkspaceClient from "./project-workspace-client";

type ProjectWorkspacePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectWorkspacePage({ params }: ProjectWorkspacePageProps) {
  const { id } = await params;

  return <ProjectWorkspaceClient projectId={id} />;
}
