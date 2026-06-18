import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ProjectRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: ProjectRouteContext) {
  const { id } = await context.params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { workflowState: true }
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ project });
}
