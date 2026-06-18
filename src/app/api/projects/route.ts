import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { workflowState: true },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    description?: string;
  };

  const name = body.name?.trim();

  if (!name) {
    return NextResponse.json({ error: "Project name is required." }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      description: body.description?.trim() || null,
      workflowState: {
        create: {
          currentStep: "situation"
        }
      }
    },
    include: { workflowState: true }
  });

  return NextResponse.json({ project }, { status: 201 });
}
